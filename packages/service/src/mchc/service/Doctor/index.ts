import { mchcEnv, MchcTypes } from "@lm_fe/env"
import { AnyObject, request } from "@lm_fe/utils"
import { ModelService } from "src/ModelService"
import { TIdTypeCompatible } from "src/types"

import { IMchc_HusbandBaseInfoOfOutpatient, IMchc_OutpatientDocumentStatus, IMchc_PregnancyBaseInfoOfOutpatient } from "../types"
import { process_husbandBaseInfo_local, process_husbandBaseInfo_remote } from "../types/utils"
import {
    IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_FirstVisitInfoOfOutpatient, IMchc_Doctor_FirstVisitPastmhOutpatient, IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_Doctor_PreRiskAssessmentInfo,
    IMchc_Doctor_RiskRecordsOfOutpatient,
    IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient,
    IMchc_Doctor_RvisitInfoOfOutpatient,
    IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit,
    IMchc_Doctor_VteAssessForm
} from "./types"
import { IMchc_Doctor_BuildExamTimeAxis } from "./types/IMchc_Doctor_BuildExamTimeAxis"
import { processFirstInfoOfOutpatient, processFirstPresent_local, processFirstPresent_remote, processLabExamOfOutpatient_local, processLabExamOfOutpatient_remote, processOther_local, processOther_remote, processPastmh_local, processPastmh_remote, processPhysicalExamOfOutpatient_local, processPhysicalExamOfOutpatient_remote, processRvisitInfoOfOutpatient } from "./utils"

export * from './types'

export class Mchc_Doctor_Service extends ModelService {
    // 越秀妇幼
    async getVisitEmrEditable(id?: number | null) {
        const ret = await request.get<boolean>('/api/doctor/getVisitEmrEditable', { params: { visitId: id || null } })
        return ret.data
    }

    // 越秀妇幼
    async getDiagnoses(pregnancyId: number | string, serialNo?: string) {
        const ret = await request.get<IMchc_Doctor_Diagnoses[]>('/api/diagnoses', { params: { [`pregnancyId.equals`]: pregnancyId, [`serialNo.equals`]: serialNo } })
        return ret.data
    }

    // 越秀妇幼
    async new_diagnosis_list<T extends MchcTypes>(data: Partial<IMchc_Doctor_Diagnoses<T>>[]) {
        const ret = await request.post<IMchc_Doctor_Diagnoses<T>[]>('/api/doctor/newOrSaveDiagnosisOfOutpatientList', data)
        return ret.data
    }
    async updateRvisitInfoOfOutpatient(data: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>) {
        const res = await request.post<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>('/api/doctor/updateRvisitRecordOfOutpatient', data);
        return res.data;
    }
    /**诊断处理 */
    async getFirstVisitDiagnosisOutpatient(id: TIdTypeCompatible) {
        const res = await request.get<IMchc_Doctor_FirstVisitDiagnosisOutpatient>('/api/doctor/getFirstVisitDiagnosisOutpatient', { params: { id } });
        return res.data;
    }
    async updateFirstVisitDiagnosisOutpatient(data: Partial<IMchc_Doctor_FirstVisitDiagnosisOutpatient>) {

        const res = await request.put<IMchc_Doctor_FirstVisitDiagnosisOutpatient>('/api/doctor/updateFirstVisitDiagnosisOutpatient', data, { successText: '操作成功' });
        return res.data;
    }
    async getOutpatientHeaderInfo(id: TIdTypeCompatible) {
        const res = await request.get<IMchc_Doctor_OutpatientHeaderInfo>('/api/doctor/getOutpatientHeaderInfo', { params: { id } });
        const data = res.data
        data.highriskLable = data.highriskLable?.trim()
        return data;
    };
    /**获取产后复诊信息 */
    async getRvisitAfterDeliveryInfoOfOutpatient(id: string) {
        const res = await request.get<IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient>('/api/doctor/getRvisitAfterDeliveryInfoOfOutpatient?id=' + id);
        return res.data;
    }

    /**更新产后复诊记录 */
    async updateRvisitAfterDeliveryInfoOfOutpatient(data: any) {
        const res = await request.post('/api/doctor/updateRvisitAfterDeliveryInfoOfOutpatient', data);
        return res.data;
    }

    /**获取复诊记录数据 */
    async getRvisitInfoOfOutpatient(id: TIdTypeCompatible | { id: TIdTypeCompatible, serialNo?: any }) {
        const params = typeof id === 'object' ? id : { id }
        const { data } = await request.get<IMchc_Doctor_RvisitInfoOfOutpatient>('/api/doctor/getRvisitInfoOfOutpatient', { params });
        return processRvisitInfoOfOutpatient(data)
    }

    async getPreRiskAssessmentInfo(id: any) {
        const { data } = await request.get<IMchc_Doctor_PreRiskAssessmentInfo>(`/api/doctor/getPreRiskAssessmentInfo`, { params: { id } })
        return data
    }

    /**新增修改诊断 新增无id 修改带id*/
    new_Diagnosis(x: Partial<IMchc_Doctor_Diagnoses>) {
        return request.post<any>(`/api/doctor/newOrSaveDiagnosisOfOutpatient`, x).then(res => res.data)
    }
    /** 排序诊断 */
    async sortDiagnosesOfOutpatient(data: any) {
        const res = await request.put('/api/doctor/sortDiagnosesOfOutpatient', data);
        return res.data;
    }
    del_diagnosis(item: IMchc_Doctor_Diagnoses) {
        if (!item) return
        return request.delete(`/api/doctor/deleteDiagnosisOfOutpatient/${item.id}`, { params: { prenatalVisitId: item.prenatalVisitId } }).then(res => res.data)
    }
    /**一次获得全部首检信息 */
    async getFirstVisitInfoOfOutpatient(id: TIdTypeCompatible) {
        const { data } = await request.get<IMchc_Doctor_FirstVisitInfoOfOutpatient>('/api/doctor/getFirstVisitInfoOfOutpatient?id=' + id);
        return processFirstInfoOfOutpatient(data);
    }

    async updateFirstVisitInfoOfOutpatient(requestBody: Partial<IMchc_Doctor_FirstVisitInfoOfOutpatient>) {
        const { data } = await request.put<IMchc_Doctor_FirstVisitInfoOfOutpatient>('/api/doctor/updateFirstVisitInfoOfOutpatient', requestBody);
        return processFirstInfoOfOutpatient(data);
    }

    async getVteAssessForm<T extends MchcTypes>(id: TIdTypeCompatible) {
        const path = mchcEnv.is('广三') ? `VteAssessForm3` : `VteAssessForm3`
        const { data } = await request.get<IMchc_Doctor_VteAssessForm<T>>(`/api/doctor/get${path}`, { params: { id } });
        return data
    }

    async updateVteAssessForm<T extends MchcTypes>(requestBody: Partial<IMchc_Doctor_VteAssessForm<T>>) {
        const path = mchcEnv.is('广三') ? `VteAssessForm3` : `VteAssessForm3`
        const { data } = await request.put<IMchc_Doctor_VteAssessForm<T>>(`/api/doctor/update${path}`, requestBody);
        return data
    }


    /** 检验检查时间轴 增加 type 0:所有 ，1:正常 ，2:异常; mode: 0 所有，1过滤   */
    async buildExamTimeAxisByType(pregnancyId: TIdTypeCompatible, type: 0 | 1 | 2 = 0, mode: 0 | 1 = 0) {
        const { data } = await request.get<IMchc_Doctor_BuildExamTimeAxis[]>(`/api/buildExamTimeAxis`, { params: { pregnancyId, type, mode } })
        return data
    }


    async getRiskRecordsOfOutpatient(id: TIdTypeCompatible) {
        const { data } = await request.get<IMchc_Doctor_RiskRecordsOfOutpatient[]>(`/api/doctor/getRiskRecordsOfOutpatient`, { params: { id, } })
        return data
    }

    /** 获取孕妇信息 */
    async getPregnancyBaseInfoOfOutpatient(id: string) {
        const res = await request.get<IMchc_PregnancyBaseInfoOfOutpatient>('/api/doctor/getPregnancyBaseInfoOfOutpatient?id=' + id);
        return res.data
    }

    /**更新孕妇信息 */
    async updatePregnancyBaseInfoOfOutpatient(data: any) {
        const res = await request.put<IMchc_PregnancyBaseInfoOfOutpatient>('/api/doctor/updatePregnancyBaseInfoOfOutpatient', data);
        return res.data
    }

    /**获取丈夫信息 */
    async getHusbandBaseInfoOfOutpatient(id: string) {
        const res = await request.get<IMchc_HusbandBaseInfoOfOutpatient>('/api/doctor/getHusbandBaseInfoOfOutpatient?id=' + id);
        return process_husbandBaseInfo_remote(res.data)
    }

    /**更新丈夫信息 */
    async updateHusbandBaseInfoOfOutpatient(data: any) {
        const res = await request.put<IMchc_HusbandBaseInfoOfOutpatient>('/api/doctor/updateHusbandBaseInfoOfOutpatient', process_husbandBaseInfo_local(data));
        return process_husbandBaseInfo_remote(res.data)
    }

    /**获取档案状态 */
    async getOutpatientDocumentStatus(id: string) {
        const res = await request.get<IMchc_OutpatientDocumentStatus>('/api/doctor/getOutpatientDocumentStatus?id=' + id);
        return res.data
    }

    /**更新档案状态 */
    async updateOutpatientDocumentStatus(data: any) {
        const res = await request.put<IMchc_OutpatientDocumentStatus>('/api/doctor/updateOutpatientDocumentStatus', data);
        return res.data
    }
    async getFirstVisitPresentmh_out(id: TIdTypeCompatible) {
        const res = await request.get('/api/doctor/getFirstVisitPresentmhOfOutpatient?id=' + id,);
        return processFirstPresent_remote(res.data)
    }
    async updateFirstVisitPresentmh_out(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitPresentmhOfOutpatient', processFirstPresent_local(data), { successText: '操作成功' });
        return processFirstPresent_remote(res.data)
    }
    /**既往史 */
    async getFirstVisitPastmhOutpatient(id: string) {
        const res = await request.get<IMchc_Doctor_FirstVisitPastmhOutpatient>('/api/doctor/getFirstVisitPastmhOutpatient?id=' + id);
        return processPastmh_remote(res.data)
    }
    async updateFirstVisitPastmhOutpatient(data: any) {
        const res = await request.put<IMchc_Doctor_FirstVisitPastmhOutpatient>('/api/doctor/updateFirstVisitPastmhOutpatient', processPastmh_local(data), { successText: '操作成功' });
        return processPastmh_remote(res.data)
    }
    /**其他病史 */
    async othermhOutpatient(id: string) {
        const res = await request.get('/api/doctor/getFirstVisitOthermhOutpatient?id=' + id);
        return processOther_remote(res.data)
    }
    async updateOthermhOutpatient(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitOthermhOutpatient', processOther_local(data), { successText: '操作成功' });
        return processOther_remote(res.data)
    }

    /**专科检查 */
    async getGynecologicalExamOfOutpatient(id: string) {
        const res = await request.get('/api/doctor/getFirstVisitGynecologicalExamOfOutpatient?id=' + id,);
        return res.data
    }
    async updateGynecologicalExamOfOutpatient(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitGynecologicalExamOfOutpatient', data, { successText: '操作成功' });
        return res.data
    }
    /**孕产史 */
    async getPregnacymh(id: string) {
        const res = await request.get('/api/doctor/getFirstVisitPregnacymhOutpatient?id=' + id);
        return res.data
    }
    async updatePregnacymh(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitPregnacymhOutpatient', data, { successText: '操作成功' });
        return res.data
    }
    /**体格检查 */
    async physicalExamOfOutpatient(id: string) {
        const res = await request.get('/api/doctor/getFirstVisitPhysicalExamOfOutpatient?id=' + id);
        return processPhysicalExamOfOutpatient_remote(res.data)

    }
    async updatePhysicalExamOfOutpatient(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitPhysicalExamOfOutpatient', processPhysicalExamOfOutpatient_local(data), { successText: '操作成功' });
        return processPhysicalExamOfOutpatient_remote(res.data)

    }
    /**检验检查 */
    async getLabExamOfOutpatient_out(id: TIdTypeCompatible) {
        const res = await request.get('/api/doctor/getFirstVisitLabExamOfOutpatient?id=' + id);
        return processLabExamOfOutpatient_remote(res.data)
    }
    async updateLabExam_out(data: any) {
        const res = await request.put('/api/doctor/updateFirstVisitLabExamOfOutpatient', processLabExamOfOutpatient_local(data), { successText: '操作成功' });
        return processLabExamOfOutpatient_remote(res.data)
    }
    async syncPatientReport(pregnancyId: TIdTypeCompatible) {
        const res = await request.get(`/api/syncPatientReport?pregnancyId=${pregnancyId}`, { successText: '操作成功' })
        return res.data
    }

}

export const SMchc_Doctor = new Mchc_Doctor_Service


