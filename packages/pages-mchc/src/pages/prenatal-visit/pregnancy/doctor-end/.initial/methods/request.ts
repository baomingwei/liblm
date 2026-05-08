import { get } from 'lodash';
import { SMchc_Doctor } from '@lm_fe/service';
import { request } from '@lm_fe/utils';

/**获取现病史 */
const getFirstVisitPresentmh = SMchc_Doctor.getFirstVisitPresentmh_out
const updateFirstVisitPresentmh = SMchc_Doctor.updateFirstVisitPresentmh_out


/**既往史 */
async function pastmhOutpatient(id: string) {
  const res = await SMchc_Doctor.getFirstVisitPastmhOutpatient(id);
  return res
}
async function updatePastmhOutpatient(data: any) {
  const res = await SMchc_Doctor.updateFirstVisitPastmhOutpatient(data);
  return res
}
/**其他病史 */
async function othermhOutpatient(id: string) {
  const res = await request.get('/api/doctor/getFirstVisitOthermhOutpatient?id=' + id);
  return res.data
}
async function updateOthermhOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateFirstVisitOthermhOutpatient', data);
  return res.data
}

/**孕产史 */
async function pregnacymhOutpatient(id: string) {
  const res = await request.get('/api/doctor/getFirstVisitPregnacymhOutpatient?id=' + id);
  return res.data
}
async function updatePregnacymhOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateFirstVisitPregnacymhOutpatient', data);
  return res.data
}
/**体格检查 */
async function physicalExamOfOutpatient(id: string) {
  const res = await request.get('/api/doctor/getFirstVisitPhysicalExamOfOutpatient?id=' + id);
  return res.data
}
async function updatePhysicalExamOfOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateFirstVisitPhysicalExamOfOutpatient', data);
  return res.data
}
/**专科检查 */
async function gynecologicalExamOfOutpatient(id: string) {
  const res = await request.get('/api/doctor/getFirstVisitGynecologicalExamOfOutpatient?id=' + id);
  return res.data
}
async function updateGynecologicalExamOfOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateFirstVisitGynecologicalExamOfOutpatient', data);
  return res.data
}

/**检验检查 */
const labExamOfOutpatient = SMchc_Doctor.getLabExamOfOutpatient_out
const updateLabExamOfOutpatient = SMchc_Doctor.updateLabExam_out

/**诊断处理 */
async function diagnosisOutpatient(id: string) {
  const res = await SMchc_Doctor.getFirstVisitDiagnosisOutpatient(id)
  return res
}
async function updateDiagnosisOutpatient(data: any) {
  const res = await request.put('/api/doctor/updateFirstVisitDiagnosisOutpatient', data);
  return res.data
}

/**一次获得全部首检信息 */
const allFirstVisitInfo = SMchc_Doctor.getFirstVisitInfoOfOutpatient;
const updateAllfirstVisitInfo = SMchc_Doctor.updateFirstVisitInfoOfOutpatient;


/**每一个tab对应的请求方法 */
export const getTabMethods = {
  'tab-0': 'getFirstVisitPresentmh',
  'tab-1': 'pastmhOutpatient',
  'tab-2': 'othermhOutpatient',
  'tab-3': 'pregnacymhOutpatient',
  'tab-4': 'physicalExamOfOutpatient',
  'tab-5': 'gynecologicalExamOfOutpatient',
  'tab-6': 'labExamOfOutpatient',
  'tab-7': 'diagnosisOutpatient',
};
/**更新tab的方法 */
export const updateTabMethods = {
  'tab-0': 'updateFirstVisitPresentmh',
  'tab-1': 'updatePastmhOutpatient',
  'tab-2': 'updateOthermhOutpatient',
  'tab-3': 'updatePregnacymhOutpatient',
  'tab-4': 'updatePhysicalExamOfOutpatient',
  'tab-5': 'updateGynecologicalExamOfOutpatient',
  'tab-6': 'updateLabExamOfOutpatient',
  'tab-7': 'updateDiagnosisOutpatient',
};

//#region 复诊记录必查清单
export const getsurveyList = {
  '1': labExamOfOutpatient,
  '2': getFirstVisitPresentmh,
};
export const updateSurveyList = {
  '1': updateLabExamOfOutpatient,
  '2': updateFirstVisitPresentmh,
};
//#endregion
export default {
  getFirstVisitPresentmh,
  updateFirstVisitPresentmh,
  pastmhOutpatient,
  updatePastmhOutpatient,
  othermhOutpatient,
  updateOthermhOutpatient,
  pregnacymhOutpatient,
  updatePregnacymhOutpatient,
  physicalExamOfOutpatient,
  updatePhysicalExamOfOutpatient,
  gynecologicalExamOfOutpatient,
  updateGynecologicalExamOfOutpatient,
  labExamOfOutpatient,
  updateLabExamOfOutpatient,
  diagnosisOutpatient,
  updateDiagnosisOutpatient,
  allFirstVisitInfo,
  updateAllfirstVisitInfo,
};
