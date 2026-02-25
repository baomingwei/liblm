import { formatTimeToDate, getFormData, use_fuck } from '@lm_fe/components_m';
import { mchcConfig, mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { AnyObject, assign, cloneDeep, expect_array, formatDate, formatDateTime, get, getSearchParamsValue, isString, omit, request, set } from '@lm_fe/utils';
import { Form, FormInstance, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import FurtherForm from './components/FurtherForm';
import FurtherSidebar from './components/FurtherSidebar';
import FurtherTable from './components/FurtherTable';
import './index.less';
import { filter_diagnoses } from '../.utils'
import { HighRiskTableEntry, mchcModal__ } from '@lm_fe/pages';
const single_id = mchcUtils.single_id
export interface IDoctorEnd_FurtherProps {
  addon_btns?: (data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>) => React.ReactNode
  before_submit?: (submit: (values: any) => Promise<void>, data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>, form?: FormInstance) => Promise<void>
  refreshData?(): void
  setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
  id: TIdTypeCompatible

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo


  diagnosesList: IMchc_Doctor_Diagnoses[]
  formChange(b: boolean): void,


  saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void,
}

function DoctorEnd_Further(props: IDoctorEnd_FurtherProps) {

  const {
    saveHeaderInfo,
    setDiagnosesList,
    headerInfo,
    id,

    diagnosesList,
    formChange,
  } = props;

  const serialNo_q = getSearchParamsValue('serialNo')

  const [visitsData, _setVisitsData] = useState<IMchc_Doctor_RvisitInfoOfOutpatient>()

  const [formData, setFormData] = useState<Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>>()

  const visitsData_cache = useRef(visitsData)
  const { fuck, toggle_fuck } = use_fuck('DoctorEnd_FurtherPage')


  function setVisitsData(v: IMchc_Doctor_RvisitInfoOfOutpatient) {
    _setVisitsData(v)
    visitsData_cache.current = v
  }
  const outEmrId = Number(id)

  useEffect(() => {
    if (id) {
      getVisitsData();
    }


    return () => {

    }
  }, [id])
  function get_default_value(): AnyObject {
    return {
      // visitDate: getFutureDate(0),
      gestationalWeek: headerInfo?.gesweek,
      outpatientNO: headerInfo?.outpatientNO,
      pregnancyId: outEmrId,
      outEmrId,
      visitDate: formatDate(),
      visitTime: formatDateTime()
    }
  }


  async function fetchVisitData() {

    const visitInfo = await SMchc_Doctor.getRvisitInfoOfOutpatient({
      id: single_id(props),
      serialNo: mchcEnv.is('广三') ? serialNo_q : undefined
    });

    return visitInfo

  }
  async function getVisitsData() {

    const visitInfo = await fetchVisitData()




    initDiagnoses(visitInfo)

    initVisitData(visitInfo)

    initFormData(visitInfo)



  }
  async function initDiagnoses(v: IMchc_Doctor_RvisitInfoOfOutpatient) {


    const __diagnoses = filter_diagnoses(v.diagnoses)


    setDiagnosesList?.(__diagnoses);

  }
  async function initVisitData(v: IMchc_Doctor_RvisitInfoOfOutpatient) {



    setVisitsData(v)


    changeDoctorRecord(v)

  }

  function get_id_null_data(v?: IMchc_Doctor_RvisitInfoOfOutpatient) {




    const rvisits = v?.rvisits ?? [];
    const idNullRvisit = rvisits.find(_ => _.id === null)


    return cloneDeep(idNullRvisit)


  }

  async function initFormData(vv?: IMchc_Doctor_RvisitInfoOfOutpatient) {

    if (!vv) {
      setFormData(get_default_value())
      return
    }
    const rvisits = vv.rvisits;
    const idNullRvisit = get_id_null_data(vv)
    const first = idNullRvisit ?? rvisits[0] ?? get_default_value()

    // const _formdata_q = mchcEnv.is('广三') ? v.rvisits.find(_ => _.serialNo === serialNo_q) : null
    const _formdata_q = mchcEnv.is('广三') ? rvisits.find(_ => _.today) : null

    const _formdata = _formdata_q ?? first
    setFormData(_formdata)



  }
  async function handleSubmit(newData: AnyObject) {



    const __serialNo = mchcEnv.is('广三') ? serialNo_q : null

    const serialNo = __serialNo ?? formData?.serialNo!

    if (mchcEnv.is('越秀妇幼')) {
      const xxxa = diagnosesList.map(_ => ({
        ..._,
        serialNo,
        outEmrId
      }))

      SMchc_Doctor.newOrSaveDiagnosisOfOutpatientList(xxxa).then(setDiagnosesList)
    }

    var set_data = assign(newData, { outEmrId, serialNo })
    const redata = await SMchc_Doctor.updateRvisitInfoOfOutpatient(set_data);
    after_save(redata);

    // changeVisitsData(redata);


  };
  async function after_save(data: IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit) {

    const v = await fetchVisitData();
    initVisitData(v)
    setFormData(data)

    HighRiskTableEntry.highRiskTablePopup(data, headerInfo)

    mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: outEmrId })
    mchcEnv.success('操作成功');

  }



  function onAddBtnClick() {
    setDiagnosesList((visitsData?.diagnoses as any) || [])
    setFormData(get_default_value())

  }


  function changeDoctorRecord(v: IMchc_Doctor_RvisitInfoOfOutpatient) {

    const u = mchcUtils.getUserData()

  }

  // 同步导入上一次复诊记录的主诉等信息
  async function getLastRecord() {

    const list = expect_array(visitsData_cache.current?.rvisits);
    const newFormData = list.find(item => item.id !== null)!

    const omit_data = omit(newFormData, ['id', 'isBanned',])
    const new_values = Object.assign(omit_data, get_default_value())
    setFormData(new_values)
  };



  // function changeVisitsData(new_one: IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit) {
  //   const visitData_clone = cloneDeep(visitsData)!;

  //   if (isArray(visitData_clone?.rvisits)) {
  //     // visitData_clone.rvisits.splice(0, 1, res);
  //     visitData_clone?.rvisits.forEach((item, index) => {
  //       if (get(item, 'id') == get(new_one, 'id')) {
  //         let data = visitData_clone.rvisits;
  //         data[index] = new_one;
  //       }
  //     });
  //   }


  //   setVisitsData(visitData_clone)
  //   setFormData(new_one)
  // }
  function furtherRefresh() {
    const { refreshData } = props;
    getVisitsData();
    refreshData?.();
  }


  return (
    <div className="further">

      {
        fuck
          ? null
          : <FurtherSidebar
            serialNo={formData?.serialNo!}
            saveHeaderInfo={saveHeaderInfo}
            setDiagnosesList={setDiagnosesList}
            diagnosesList={diagnosesList}

            headerInfo={headerInfo}
            id={id}
            visitsData={visitsData}
            furtherRefresh={furtherRefresh}
          />
      }



      <div className="further-content">
        <FurtherTable
          diagnosesList={diagnosesList}

          fuck={fuck}
          toggle_fuck={toggle_fuck}
          visitsData={visitsData}
          setFormData={setFormData}
          headerInfo={headerInfo}
          formData={formData}
          furtherRefresh={furtherRefresh}
        />
        <FurtherForm
          after_save={after_save}
          addon_btns={props.addon_btns}
          before_submit={props.before_submit}
          handleSubmit={handleSubmit}
          onAddBtnClick={onAddBtnClick}
          visitsData={visitsData}
          formData={formData}
          getVisitsData={getVisitsData}
          getLastRecord={getLastRecord}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          isAllPregnancies={false}
          formChange={formChange}
        />
      </div>
    </div>
  );
}
export default DoctorEnd_Further
