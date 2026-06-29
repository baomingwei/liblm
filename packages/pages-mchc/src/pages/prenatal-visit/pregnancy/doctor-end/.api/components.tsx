import { TIdTypeCompatible } from "@lm_fe/service";
import { request } from "@lm_fe/utils";
export default {
  /** 获取诊断模糊搜索数据 */
  getDiagnosesTemplate: (value: string, page = 0) => {
    const code = encodeURIComponent(value);
    const code2 = encodeURIComponent(code);
    return request.get(
      `/api/template-trees?type.equals=1&code.contains=${code2}&mnemonic.contains=${code2}&val.contains=${code2}`, { params: { page, size: 99 } },
    ).then(r => r.data);
  },
  /** 获取模板数据 */
  getTemplateTree: (type: number) => request.get(`/api/template-trees?type.equals=${type}&page=0&size=500`).then(r => r.data),
  deleteHighrisk: (data: any) => request.delete(`/api/deleteAlertAssessment`, { params: data }).then(r => r.data),
  /** 添加模板数据 */
  addTemplateTree: (item: any) => request.post(`/api/template-trees`, item).then(r => r.data),

  /** 获取已勾选的模板数据 */
  findAlertAssessment: (type: number, pregnancyId: number) =>
    request.get(`/api/findAlertAssessment?type=${type}&pregnancyId=${pregnancyId}`).then(r => r.data),

  /** 保存已勾选的模板数据 */
  saveAlertAssessment: (data: any) => request.post(`/api/saveAlertAssessment`, data).then(r => r.data),

  /** 获取高危色卡颜色 */
  getHighriskColor: (module: string) => request.get(`/api/dictionaries?module.equals=${module}`).then(r => r.data),

  /** 设置漏诊提示、高危因素标记不再提醒 */
  saveCaseIgnore: (data: any) => request.post(`/api/saveCaseIgnore`, data).then(r => r.data),

  /** 获取检验报告结果 */
  getLabExamImportTree: (pregnancyId: TIdTypeCompatible) => request.get(`/api/getLabExamImportTree?pregnancyId=${pregnancyId}`).then(r => r.data),

  /** 获取超声报告结果 */
  getImageExamImportTree: (pregnancyId: TIdTypeCompatible) =>
    request.get(`/api/getImageExamImportTree?pregnancyId=${pregnancyId}`).then(r => r.data),


  /**获取风险评估表单预处理信息 以前的接口/api/doctor/getPreAssessmentInfo */
  getPreAssessmentInfo: (id: any) => request.get(`/api/doctor/getPreRiskAssessmentInfo?id=${id}`).then(r => r.data),
};
