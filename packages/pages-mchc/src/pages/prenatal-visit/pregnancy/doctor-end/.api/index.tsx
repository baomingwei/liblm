import { get } from 'lodash';
import { default as initial } from './initial';
import { default as further } from './further';
import { default as postpartum } from './postpartum';
import { default as curve } from './curve';
import { default as home } from './home';
import { default as image } from './image';
import { default as survey } from './survey';
import { default as base } from './base';
import { default as components } from './components';
import { getFutureDate } from '@lm_fe/utils';

import { request } from '@lm_fe/utils';
export const api = {
  /** 更新孕册 */
  getAllPregnancies: (idNO: string) => request.get(`/api/pregnancies?idNO.equals=${idNO}`).then(r => r.data),

  /** 更新孕册 */
  updatePregnancy: (data: any) => request.put(`/api/pregnancies`, data).then(r => r.data),

  /** 获取产检记录信息 */
  getPrenatalVisits: async (pregnancyId: any, visitType: number) => {
    const data = (await request.get(
      `/api/prenatal-visits?visitType.equals=${visitType}&pregnancyId.equals=${pregnancyId}`,
    )).data;
    if (visitType === 0) return get(data, 0);
    return data;
  },
  /** 获取产检记录信息 */
  getPrenatalVisitsAll: async (pregnancyId: any) => {
    const data = (await request.get(`/api/prenatal-visits?pregnancyId.equals=${pregnancyId}`)).data;
    return data;
  },

  /** 新增产检记录信息 */
  createPrenatalVisits: (data: any) => request.post('/api/prenatal-visits', data).then(r => r.data),

  /** 更新产检记录信息 */
  updatePrenatalVisits: (data: any) => request.put('/api/prenatal-visits', data).then(r => r.data),

  /** 同步产检记录信息 */
  uploadPrenatalVisits: (data: any) => request.post('/api/prenatal-visits/upload', data).then(r => r.data),

  /** 获取体征数据 */
  getMeasures: (outpatientNO: any, type?: any) =>
    request.get(`/api/measures?outpatientNO.equals=${outpatientNO}&sort=id,asc`).then(r => r.data),

  getNewDataByDate: (pregnancyId: any) =>
    request.get(
      `/api/measures/getNewDataByDate?pregnancyId.equals=${pregnancyId}&createDate.equals=${getFutureDate(0)}`,
    ).then(r => r.data),

  /** 通过门诊号获取产前患者信息 */
  getPatientByOutpatientNO: (outpatientNO: any) =>
    request.get(`/api/prenatal-patients?outpatientNO.equals=${outpatientNO}`).then(r => r.data),

  /** 通过选择日期和预产期-B超计算孕周 */
  calcGesWeek: (data = {}) => request.put(`/api/doctor/getGestationalWeek`, data).then(r => r.data),

  initial,
  further,
  postpartum,
  curve,
  home,
  image,
  survey,
  base,
  components,
};
