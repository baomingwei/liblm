import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { peek_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { AnyObject, formatDate } from '@lm_fe/utils';
import { Col, Row } from 'antd';
import { cloneDeep, find, get, set } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import FurtherForm from './components/FurtherForm';
import FurtherSidebar from './components/FurtherSidebar';
import FurtherTable from './components/FurtherTable';
import './index.less';
const single_id = mchcUtils.single_id
export interface IDoctorEnd_PostpartumProps {
  refreshData?(): void
  id: TIdTypeCompatible

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo


  diagnosesList: IMchc_Doctor_Diagnoses[]
  formChange(b: boolean): void,


}

function DoctorEnd_Postpartum(props: IDoctorEnd_PostpartumProps) {

  const {
    headerInfo,
    id,
    diagnosesList,
    formChange,
  } = props;

  const [visitsData, _setVisitsData] = useState<IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient>()

  const [formData, setFormData] = useState<Partial<IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient>>()
  const outEmrId = headerInfo?.id as any;

  const visitsData_cache = useRef(visitsData)
  function setVisitsData(v: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient) {
    _setVisitsData(v)
    visitsData_cache.current = v
  }
  useEffect(() => {
    if (id) {
      getVisitsData();
    }


    return () => {

    }
  }, [id])
  const get_default_value = () => {
    return {
      // visitDate: getFutureDate(0),
      doctorName: peek_provoke().user_info?.firstName,
      visitDate: formatDate()!
    } as AnyObject
  }


  async function fetchVisitData() {

    const visitInfo = await SMchc_Doctor.getRvisitAfterDeliveryInfoOfOutpatient(single_id(props) as any);

    return visitInfo

  }
  async function getVisitsData() {

    const visitInfo = await fetchVisitData()





    initVisitData(visitInfo)

    initFormData(visitInfo)



  }

  async function initVisitData(v: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient) {



    setVisitsData(v)



  }

  function get_id_null_data(v?: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient) {




    const recordsAfterDelivery = v?.recordsAfterDelivery ?? [];
    const idNullRvisit = recordsAfterDelivery.find(_ => _.id === null)


    return cloneDeep(idNullRvisit)


  }
  function initFormData_toAdd(v?: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient) {



    if (!v) {
      setFormData(get_default_value())
      return
    }

    const idNullRvisit = get_id_null_data(v)
    const first = idNullRvisit ?? get_default_value()

    setFormData(first)


  }
  async function initFormData(v?: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient) {

    if (!v) {
      setFormData(get_default_value())
      return
    }
    const recordsAfterDelivery = v.recordsAfterDelivery;
    const idNullRvisit = get_id_null_data(v)
    const first = idNullRvisit ?? recordsAfterDelivery[0] ?? get_default_value()

    // const _formdata_q = mchcEnv.is('广三') ? v.recordsAfterDelivery.find(_ => _.serialNo === serialNo_q) : null

    const _formdata = first
    setFormData(_formdata)



  }

  async function after_save(data: any) {

    const v = await fetchVisitData();
    initVisitData(v)
    setFormData(data)


    mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: outEmrId })
    mchcEnv.success('操作成功');

  }

  async function handleSubmit(newData: any) {

    const redata = await SMchc_Doctor.updateRvisitAfterDeliveryInfoOfOutpatient(newData);
    after_save(redata)

  };


  function onAddBtnClick() {
    initFormData_toAdd(visitsData_cache.current)

  }




  // 同步导入上一次复诊记录的主诉等信息
  async function getLastRecord() {


    const list = get(visitsData_cache.current, `recordsAfterDelivery`);
    const newFormData: any = cloneDeep(find(list, (item) => item.id != null));
    console.log('newFormData', { newFormData, list, visitsData })
    if (!newFormData) return
    delete newFormData['id'];
    delete newFormData['isBanned'];
    set(newFormData, `visitDate`, formatDate());


    setFormData(newFormData)
  };




  function furtherRefresh() {
    const { refreshData } = props;
    getVisitsData();
    refreshData?.();
  }


  return (
    <div style={{ overflow: 'hidden', height: '100%' }}>
      <Row gutter={8} style={{ height: '100%' }}>
        <Col span={4}>
          <FurtherSidebar visitsData={visitsData} />
        </Col>


        <Col span={20} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <FurtherTable
            visitsData={visitsData}
            setFormData={setFormData}
            headerInfo={headerInfo}
            formData={formData}
            furtherRefresh={furtherRefresh}
          />
          <FurtherForm
            after_save={after_save}
            handleSubmit={handleSubmit}
            onAddBtnClick={onAddBtnClick}
            formData={formData}
            getLastRecord={getLastRecord}
            headerInfo={headerInfo}
            diagnosesList={diagnosesList}
            formChange={formChange}
          />
        </Col>
      </Row>
    </div>
  );
}
export default DoctorEnd_Postpartum
