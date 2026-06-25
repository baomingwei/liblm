import { handle_form_error, LazyAntd, MyIcon, useMyEffectSafe } from '@lm_fe/components';
import { FormSectionForm, OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdType } from '@lm_fe/service';
import { getFutureDate } from '@lm_fe/utils';
import { Col, message, Modal, Row, Space } from 'antd';
import { forEach, get, isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import Diagnoses from '../../../.components/Diagnoses_New';
import ManagementPlan from '../../../.further/components/FurtherSidebar/management-plan';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

import { BF_Wrap2, HighRiskTableEntry } from '@lm_fe/pages';
import { FormInstance } from 'antd/es/form/Form';
import { api } from '../../../.api';
import { IInitial_Tab_props } from '../../types';
import { use_doctor_sign } from '../../../.utils/use_doctor_sign';
interface IProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance) => Promise<void>
  disabled_save: boolean
  serialNo: string

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  // diagnosesList: IMchc_Doctor_Diagnoses[]
  handlePrint?(resource: string, id?: TIdType): void
  // setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  saveHeaderInfo(v: IMchc_Doctor_OutpatientHeaderInfo): void

}

const Title = '诊断处理';
const ClassName = 'zhen-duan-chu-li';
function Index(props: IProps & IInitial_Tab_props) {

  const { serialNo,
    // diagnosesList,
    handlePrint: _handlePrint,
    disabled_save,


    headerInfo,
    // setDiagnosesList,
    saveHeaderInfo,
    active,
    diagnosis_before_submit,
    diagnosis_addon_btns,
    form
  } = props;
  const preg_id = mchcUtils.single_id()

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-诊断处理', tableColumns: () => import('./config') } })

  const [diagnosesList, setDiagnosesList] = useState<IMchc_Doctor_Diagnoses[]>([])

  const [isShowModifyRecord, set_isShowModifyRecord] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)

  const [recordData, set_recordData] = useState([])
  const [visitData, setVisitData] = useState<IMchc_Doctor_FirstVisitDiagnosisOutpatient>()
  const v_id = get(visitData, `advice.id`);

  const { handle_cs_sign, sign_btn_disabled, sign_btn_hidden, sign_btn_text, save_btn_hidden, sign_confirm } = use_doctor_sign('prenatalFVisit', visitData)

  useEffect(() => {

    if (active) {
      initData()
    }


    return () => {

    }
  }, [active])
  useMyEffectSafe(props)(() => {
    const rm = mchcEvent.on_rm('my_form', async e => {
      // mchcEnv.logger.log('event receive', { e, })
      if (e.type === 'onChange' && e.name === 'advice') {

        const values = e.values;
        const value = e.value;
        const key = e.name

        if (!isNil(value.appointmentCycle)) {
          e.setValue?.('advice', { appointmentDate: getFutureDate(value.appointmentCycle) })
        }

      }

    })
    return rm
  }, [])

  function initData() {

    SMchc_Doctor.getFirstVisitDiagnosisOutpatient(preg_id).then(v => {
      setVisitData(v)
      setDiagnosesList(v.diagnoses)
      form.setFieldsValue(v)
    })
  }
  function get_form_data() {


    return form
      .validateFields()
      .catch((error) => {
        const first = handle_form_error(error)
        if (first?.text) mchcEnv.warning(first.text)
        return null
      })
  }
  async function sign() {
    const data = await get_form_data()
    data && handle_cs_sign(data)
  }

  function handleSubmitBefore() {
    if (!sign_confirm())
      return
    if (diagnosis_before_submit) {
      return diagnosis_before_submit(handleSubmit, visitData, form)
    }
    get_form_data().then(handleSubmit)

  }
  async function handleSubmit(values) {
    const re = await SMchc_Doctor.updateFirstVisitDiagnosisOutpatient({
      currentGestationalWeek: get(headerInfo, 'curgesweek')
        ? get(headerInfo, 'curgesweek')
        : get(headerInfo, 'gesweek'),
      diagnoses: diagnosesList,
      serialNo,
      ...values
    })
    HighRiskTableEntry.highRiskTablePopup(re, headerInfo);
    mchcEvent.emit('outpatient', { type: '刷新头部', })

  };


  function closeModal(type: 'isShowModifyRecord' | 'isShowManageModal', items?: any, key?: any) {

    if (type === 'isShowManageModal') {
      set_isShowManageModal(false)

    } else if (type === 'isShowModifyRecord') {
      set_isShowModifyRecord(false)

    }
  };

  function print(type: 'prenatalVisit1' | 'prenatalVisit') {
    if (type == 'prenatalVisit1') {
      if (v_id) {
        _handlePrint?.(type, v_id);
      } else {
        message.warning('请先保存');
      }
    } else {
      _handlePrint?.(type, undefined);
    }
  }

  async function handleRecordBtn() {
    const { headerInfo } = props;
    const pregnancyId = headerInfo?.id
    const recordData = await api.initial.findFirstVisitOperatingRecord(pregnancyId);

    set_recordData(recordData)
    set_isShowModifyRecord(true)
  };

  function renderModifyRecord() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'items',
        key: 'items',
        render: (text: any, record: any, index: any) => index + 1,
        width: 30,
      },
      { title: '时间', dataIndex: 'operateDate', key: 'operateDate', width: 50 },
      { title: '修改人', dataIndex: 'operator', key: 'operator', width: 50 },
      {
        title: '修改字段',
        dataIndex: 'content',
        key: 'content',
        render: (text: any) => {
          let str = '';
          forEach(text, (item) => {
            str += `${get(item, 'operatingDescription')}；`;
          });
          return str;
        },
        width: 200,
      },
    ];

    return (
      <Modal
        open={isShowModifyRecord}
        title="历史首检记录"
        footer={null}
        width="80%"
        onCancel={() => set_isShowModifyRecord(false)}
      >
        <Table className="prenatal-visit-main-table" columns={columns} dataSource={recordData} pagination={false} />
      </Modal>
    );
  }




  return (
    <Row gutter={16} className="zhen-duan label-width5">
      <Col span="8">
        <Diagnoses
          saveHeaderInfo={saveHeaderInfo}
          setDiagnosesList={setDiagnosesList}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          isAllPregnancies={false}
          pv_id_for_diagnose={v_id}

          serialNo={serialNo}

          page={''}
        />
      </Col>
      <Col span="16">
        <div className="form-wrapper">

          <Wrap>
            <FormSectionForm
              disableAll={disabled_save}

              onValuesChange={(changedValues) => {

              }}
              onFinish={(v) => {
                const values = form.getFieldsValue()
                handleSubmit(values)
              }}
              formDescriptions={__DEV__ ? () => import('./config') : config?.tableColumns}

              form={form}
            />
          </Wrap>


          <HighRiskTableEntry headerInfo={headerInfo} data={visitData} />
          <OkButton hidden className="his-btn" type="dashed" icon={<MyIcon value='TableOutlined' />} onClick={handleRecordBtn}>
            首检信息历史修改记录
          </OkButton>
          <OkButton
            hidden={mchcEnv.is('广三')}
            className="his-btn"
            type="dashed"
            icon={<MyIcon value='TableOutlined' />}
            onClick={() => set_isShowManageModal(true)}
          >
            产检计划
          </OkButton>

          <OkButton icon={<MyIcon value='SyncOutlined' />} onClick={initData} style={{ marginLeft: 12 }}>
            刷新
          </OkButton>
        </div>
        <Space className="prenatal-visit-main_initial-btns">
          {
            diagnosis_addon_btns?.(visitData)
          }
          <OkButton size="large" onClick={() => print('prenatalVisit')} icon={<MyIcon value='PrinterOutlined' />}>
            打印档案
          </OkButton>
          <OkButton size="large" onClick={() => print('prenatalVisit1')} icon={<MyIcon value='PrinterOutlined' />}>
            打印病历
          </OkButton>




          <OkButton size="large" hidden={save_btn_hidden} primary disabled={disabled_save} onClick={handleSubmitBefore} icon={<MyIcon value='SaveOutlined' />}>
            保存
          </OkButton>

          <OkButton size="large" hidden={sign_btn_hidden} primary disabled={disabled_save || sign_btn_disabled} onClick={sign}>
            {sign_btn_text}
          </OkButton>
        </Space>
      </Col>

      {isShowManageModal && (
        <ManagementPlan isShowManageModal={isShowManageModal} closeModal={closeModal} headerInfo={headerInfo} />
      )}
      {renderModifyRecord()}
    </Row>
  );
}

Object.assign(Index, { Title, Config: null, ClassName })
export default Index
