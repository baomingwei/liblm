import { OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, SMchc_Doctor } from '@lm_fe/service';
import { get, getSearchParamsAll, request } from '@lm_fe/utils';
import { Empty, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import requestMethods from '../../.further/methods/request';
import DiagnosesItem from './diagnoses-item/diagnoses-item';
import DiagnosesWeek from './diagnoses-week/diagnoses-week';
import './index.less';
import DoctorEnd_Diagnoses_Modal from './diagnoses_modal';
import { IDiagnosesprops } from './types';

function Diagnoses(props: IDiagnosesprops) {
  const [visible, setVisible] = useState(false)



  const {
    pv_id_for_diagnose,
    isAllPregnancies,
    diagnosesList = [],
    headerInfo,
    saveHeaderInfo,
    setDiagnosesList,
    page,
    serialNo,
  } = props;

  useEffect(() => {

    // SMchc_Doctor.getFirstVisitDiagnosisOutpatient(headerInfo?.id).then(l => setList(l.diagnoses))

    return () => {

    }
  }, [])




  async function changeHeaderInfo() {
    const res = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(headerInfo, `id`));
    saveHeaderInfo(res.data);
  }



  const del_diagnose_item = async (item: any, i: number) => {
    const newList = [...diagnosesList];
    const delArr = newList.splice(i, 1);
    await SMchc_Doctor.del_diagnosis(delArr[0]);
    mchcEnv.success('删除成功！');
    setDiagnosesList(newList);
    changeHeaderInfo();
  };







  const handleBtnClick = () => {
    setVisible(true);
  };


  const add_diag = async (diagnosisObj: any) => {
    mchcEnv.success('添加成功！' + pv_id_for_diagnose);
    if (pv_id_for_diagnose) {
      diagnosisObj.prenatalVisitId = pv_id_for_diagnose
    }
    if (serialNo) {
      diagnosisObj.serialNo = serialNo
    }
    const diag = get(diagnosisObj, 'diagnosis');
    if (diagnosesList.filter((item: any) => item.diagnosis === diag).length === 0) {
      /**判断是否打开VTE */
      const res = await SMchc_Doctor.new_Diagnosis(diagnosisObj);
      mchcEnv.success('添加成功！');
      const data = res || diagnosisObj;
      setDiagnosesList([...diagnosesList, data]);
      changeHeaderInfo();
      if (diag.indexOf('梅毒') > -1) {
        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '梅毒管理', })
      }
    } else {
      message.warning('添加诊断重复！');
    }
  };






  const closeTemplate = () => {
    setVisible(false);
  };
  function 诊断管理按钮() {
    return !isAllPregnancies && (
      <div className="diag-btn" style={{ display: 'flex', justifyContent: 'flex-end', padding: 4 }}>
        <Space.Compact size='small' >
          <OkButton
            type='dashed'
            // className="diag-btn"
            // icon={<BookOutlined />} 
            onClick={() => mchcModal__.open('诊断历史', {
              modal_data: {
                pregnancyId: headerInfo?.id
              }
            })}>
            历史
          </OkButton>
          {
            (mchcEnv.in(['建瓯'])) ?
              <OkButton
                type='dashed'
                onClick={() =>
                  request
                    .get<IMchc_Doctor_Diagnoses[]>('/api/syncDiagnosis', { params: { ...getSearchParamsAll(), id: headerInfo?.id }, successText: '同步成功' })
                    .then((res => {
                      const arr = res.data ?? []
                      setDiagnosesList([...diagnosesList, ...arr])

                    }))
                }>
                同步
              </OkButton>
              : null
          }
          <OkButton
            disabled={!pv_id_for_diagnose}
            type='dashed'
            // className="diag-btn"
            // icon={<SettingOutlined />} 
            onClick={handleBtnClick}>
            管理
          </OkButton>
        </Space.Compact>
      </div>
    )
  }
  const renderDiagnoses = () => {

    // 初诊孕周


    return (
      <div className="diagWrapper-new">
        {
          诊断管理按钮()
        }
        <DiagnosesWeek first={page !== 'return'} headerInfo={headerInfo} />
        {diagnosesList?.length
          ? diagnosesList
            .filter(_ => {
              if (!_.prenatalVisitId) return true
              return _.prenatalVisitId === pv_id_for_diagnose
            })
            .map((item: IMchc_Doctor_Diagnoses, index: any) => {
              return (
                <DiagnosesItem
                  edit={false}
                  index={index}
                  diagnose={item}
                  key={`${get(item, 'id')}-false`}
                  do_del_diagnose_item={del_diagnose_item}
                  headerInfo={headerInfo}
                  diagnosesList={diagnosesList}
                  saveHeaderInfo={saveHeaderInfo}
                  setDiagnosesList={setDiagnosesList}
                  isShowDiagnosesTemplate={false}
                />
              )
            })
          : <Empty />
        }
      </div>
    );
  };

  return (
    <div>
      {renderDiagnoses()}
      {visible && (
        <DoctorEnd_Diagnoses_Modal
          del_diagnose_item_inner={del_diagnose_item}
          isShowDiagnosesTemplate={visible}
          closeTemplate={closeTemplate}
          add_diag_inner={add_diag}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          setDiagnosesList={setDiagnosesList}
          saveHeaderInfo={saveHeaderInfo}

        />
      )}
    </div>
  );
}
export default Diagnoses;
