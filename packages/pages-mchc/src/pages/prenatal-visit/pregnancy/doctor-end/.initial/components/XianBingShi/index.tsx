import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, conceive_fuck_edd, nt_fuck_edd } from '@lm_fe/pages';
import { IMchc_Doctor_FirstVisitPresentmhOutpatient, SMchc_Doctor } from '@lm_fe/service';
import { debounce } from '@lm_fe/utils';
import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../../../.api';
import { IInitial_Tab_props } from '../../types';
// import getConfig from './config';

export default function JWS(props: IInitial_Tab_props) {
  const { form, active, set_disabled_save, disabled_save } = props
  const [dont_fuck_nt, set_dont_fuck_nt] = useState(false)
  const pid = mchcUtils.single_id()

  const set_sureEdd = (edd: string) => form.setFieldValue('sureEdd', edd)
  const fuck_sureEdd = debounce({ delay: 1000 }, async function fuck(sureEdd: string) {

    // 接口没有返回体，所以下面的不执行
    const data = await api.initial.updateGesweekAlert(pid, sureEdd);

  })
  function fuck_conceive(conceiveMode__: string) {
    conceive_fuck_edd(conceiveMode__).then(set_sureEdd)
  }
  function check_edd_by_nt(data: IMchc_Doctor_FirstVisitPresentmhOutpatient,) {
    if (dont_fuck_nt) return
    nt_fuck_edd(data.ntExams, data.sureEdd)
      .then(set_sureEdd)
      .catch(() => {
        set_dont_fuck_nt(true)
      })
  };

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-现病史', tableColumns: () => import('./config') } }, { ...props, fuck_sureEdd, fuck_conceive })

  useEffect(() => {
    if (active) {
      SMchc_Doctor.getFirstVisitPresentmh_out(pid).then(v => {
        set_disabled_save?.(v.isBanned)
        check_edd_by_nt(v)
        form.setFieldsValue(v)
      })
    }


    return () => {

    }
  }, [active])

  return <Wrap>
    <FormSectionForm
      disableAll={disabled_save}
      bf_config={config}
      onValuesChange={(changedValues) => { set_dont_fuck_nt(false) }}
      onFinish={(v) => {
        SMchc_Doctor.updateFirstVisitPresentmh_out(v)
          .then((v) => {
            form.setFieldsValue(v)
            mchcEvent.emit('outpatient', { type: '刷新头部' })
          })

        check_edd_by_nt(v)
      }}
      form={form} />
  </Wrap>
}
Object.assign(JWS, {
  Title: '现病史',
  tmp: true
})