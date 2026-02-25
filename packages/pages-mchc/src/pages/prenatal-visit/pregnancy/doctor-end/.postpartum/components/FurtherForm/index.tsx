import { MyIcon, MyLazyComponent, OkButton, getBMI, handle_form_error, useMyEffectSafe } from '@lm_fe/components_m';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient, IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient_Record, SLocal_Calculator, process_OutpatientDocument_physicalExam_remote } from '@lm_fe/service';
import { getFutureDate } from '@lm_fe/utils';
import { Button, Card, Form, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import FormBlock from './form_config/Form';
import { use_doctor_sign } from '../../../.utils/use_doctor_sign';
// 弹窗枚举
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  formData?: Partial<IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient_Record>,
  diagnosesList: IMchc_Doctor_Diagnoses[]


  onAddBtnClick(): void,

  getLastRecord(): void,



  formChange(b: boolean): void
  handleSubmit(values: any): Promise<void>
  after_save(values: any): Promise<void>


}
function FurtherForm(props: IProps) {
  const [disabled_save, set_disabled_save] = useState(false)
  const { handleSign, 签名方式 } = use_doctor_sign({ type: 'prenatalVisitCH' })

  const { getLastRecord } = props;
  const { formChange } = props;
  const {
    diagnosesList,
    formData,
    after_save,
    headerInfo,
    onAddBtnClick,
    handleSubmit,
  } = props;

  const [form] = Form.useForm()

  const form_id = formData?.id
  const preg_id = mchcUtils.single_id(headerInfo);



  useEffect(() => {
    if (formData) {
      form.resetFields()

      formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)


      form.setFieldsValue(formData)
      set_disabled_save(formData.isBanned!)

      // if (mchcConfig.get('医生端_复诊编辑控制')) {

      //   SMchc_Doctor.getVisitEmrEditable(formData.id!)
      //     .then(set_disabled_save)
      //     .catch(() => set_disabled_save(true))
      // }
    }
  }, [formData])



  useMyEffectSafe(props)(() => {
    const rm = mchcEvent.on_rm('my_form', async e => {
      // mchcEnv.logger.log('event receive', { e, })
      if (e.type === 'onChange') {
        formChange(true);

        const values = e.values;
        const value = e.value;
        const key = e.name
        if (key === 'visitDate') {
          const a = await SLocal_Calculator.calcGesWeek({ date: value, id: preg_id });
          e.setValue?.('gestationalWeek', a.gestationalWeek)
        }

        if (key === 'appointmentCycle') {
          e.setValue?.('appointmentDate', getFutureDate(value))
        }

        if (key === 'physicalExam') {
          const physicalExam = values?.physicalExam
          let bmi = getBMI(physicalExam?.weight, physicalExam?.height)
          form.setFieldsValue({ physicalExam: { bmi } })
        }

      }



      if (e.type === 'onFocus') {

      }
    })
    return rm
  }, [])







  async function sign() {
    const data = await get_form_data()
    data && handleSign(data).then(after_save)
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

  async function on_submit() {

    const data = await get_form_data()
    if (!data) return
    return handleSubmit(data)

  }










  function showpdf() {

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: 'prenatalVisit1',
          id: form_id,
          template: '',
          version: '',
          note: '',

        }
      }
    })
  }


  const saveBtnTxt = disabled_save ? '无权限保存' : `保存${mchcEnv.is('华医') ? '并关闭' : ''}`
  return (
    <Card
      title={form_id ? "编辑记录" : "本次记录"}
      size="small"
      styles={{ body: { padding: 0 } }}
      style={{ overflowY: 'auto' }}
      extra={
        <span id="extra" style={{ display: 'inline-block', minWidth: 75, height: 24, marginLeft: 98 }}>
          {form_id
            ? (
              <>
                <Button icon={<MyIcon value='PlusOutlined' />} type="primary" size="small" onClick={() => {
                  form.resetFields()
                  onAddBtnClick()
                }} style={{ marginRight: 36 }}>
                  新增记录
                </Button>
              </>

            ) : null}
          <Button icon={<MyIcon value='SyncOutlined' />} type="primary" size="small" onClick={getLastRecord} style={{ marginRight: 36 }}>
            同步上一次记录
          </Button>
        </span>
      }
    >
      <MyLazyComponent size='middle'>
        <FormBlock disableAll={disabled_save} form={form} diagnosesList={diagnosesList ?? []} />


        {(



          <Space.Compact style={{ position: 'fixed', bottom: 24, right: 24 }}>
            <OkButton hidden={!form_id} onClick={showpdf}>打印</OkButton>

            <OkButton hidden={(!form_id && 签名方式 === 'CA签名') || !签名方式} primary disabled={disabled_save} onClick={sign}>
              {签名方式}
            </OkButton>

            <OkButton hidden={签名方式 === 'CA签名并保存'} primary disabled={disabled_save} onClick={on_submit}>
              {saveBtnTxt}
            </OkButton>

          </Space.Compact>
        )}




      </MyLazyComponent>
    </Card>
  );
}
export default FurtherForm
