// import CheckAndCancelButton from '@/components/GeneralComponents/CheckAndCancelButton'; //一键选择&一键取消
import { MyIcon, MyLazyComponent } from '@lm_fe/components_m';
import { Form, FormInstance } from 'antd';
// import { getBMI, getGesWeek, menopauseWeek } from '@/utils/formula';
import { getGesWeek } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { Button, Space, Tabs, message } from 'antd';
import { cloneDeep, forEach, get, set } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { filter_diagnoses } from '../.utils';
import JYJC from './components/JianYanJianCha';
import QTBS from './components/QiTaBingshi';
import TGJC from './components/TiGeJianCha';
import YBBS from './components/YiBanBingShi';
import XBS from './components/XianBingShi';
import YCS from './components/YunChanShi';
import ZDCL from './components/ZhenDuanChuLi';
import ZKJC from './components/ZhuanKeJianCha';
import './index.less';
import requestMethods, { getTabMethods } from './methods/request';
const single_id = mchcUtils.single_id
const tabContents = [XBS, YBBS, QTBS, YCS, TGJC, ZKJC, JYJC, ZDCL];
export interface IDoctorEnd_InitialProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance) => Promise<void>

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo


  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  diagnosesList: IMchc_Doctor_Diagnoses[]

  id?: TIdType

  saveHeaderInfo(v: IMchc_Doctor_OutpatientHeaderInfo): void


}
const allTabs = tabContents.map((tab, i) => ({
  key: `tab-${i}`,
  title: tab.Title,
  className: tab.ClassName,
  Content: tab,
}));
function DoctorEnd_Initial(props: IDoctorEnd_InitialProps) {

  const {
    headerInfo,
    id,
    setDiagnosesList,
    saveHeaderInfo,

    diagnosesList,

  } = props;
  const sys_theme = use_provoke(s => s.sys_theme)


  const pregnancyId = single_id(props);




  const [cur_step, set_cur_step] = useState(allTabs[0].key)
  const [all_tabs, set_tabs] = useState(allTabs)
  const forms = useRef(Array(10).fill(0).map(_ => Form.useForm()[0]))

  const [disabled_save, set_disabled_save] = useState(false)
  const [serialNo, setSerialNo] = useState<string>('')

  useEffect(() => {


    const rm = mchcEvent.on_rm('my_form', async (e) => {


    })
    return () => {
      rm()
    }
  }, [id])








  /**点击每一个tab查询该form的数据 */
  async function requestTabFormData(tab: string,) {

    let res = await requestMethods[getTabMethods[tab]](pregnancyId);

    if (res.serialNo) {
      setSerialNo(res.serialNo)
    }

    if (tab == 'tab-0') {
      reduceTab0(res);



      // if (mchcEnv.is('越秀妇幼') && res.visitId) {
      //   SMchc_Doctor.getVisitEmrEditable(res.visitId)
      //     .then(set_disabled_save)
      //     .catch(() => set_disabled_save(true))
      // }

    }



    if (tab == 'tab-7') {
      const d = res.diagnoses as IMchc_Doctor_Diagnoses[]
      const _diagnoses = filter_diagnoses(d)
      // console.log('setDiagnosesList', _diagnoses)
      setDiagnosesList(_diagnoses);
      // const bool = get(res, `isOpenVTETable`);
    }

  }

  function reduceTab0(res: any) {
    if (!mchcEnv.is('越秀妇幼')) return
    const newNtVal = cloneDeep(get(res, 'ntExams'));
    const newNfVal = cloneDeep(get(res, 'nfExams'));
    const sureEdd = get(res, 'sureEdd');
    forEach(newNtVal, (item, index) => {
      if (item.checkdate && sureEdd) {
        item.menopause = getGesWeek(sureEdd, item.checkdate);
      }
    });
    forEach(newNfVal, (item) => {
      if (item.checkdate && sureEdd) {
        item.menopause = getGesWeek(sureEdd, item.checkdate);
      }
    });
    set(res, 'ntExams', newNtVal);
    set(res, 'nfExams', newNfVal);
  }

  function cal_next_tab(key: string,) {
    const idx = all_tabs.findIndex((item) => item.key === key);
    if (idx === -1 || idx === all_tabs.length) return
    return all_tabs[idx + 1]
  }
  function cal_next_step(key: string,) {
    return cal_next_tab(key)?.key
  }

  async function handleSubmit() {
    if (cur_step == 'tab-7') return
    const tab = all_tabs.filter((item: any) => item.key === cur_step)[0];

    const idx = Number(tab.key.slice(-1))

    if (tab.Content.tmp) {

      try {
        const form = forms.current[idx]
        // console.log('gg', '111')

        if (form) {
          const a = await form.validateFields()
          // console.log('gg', { fieldChange, a })

          form.submit()


        }
      } catch (e) {
        message.destroy();
        message.error('请完善表单项！!');
      }
      return
    }

  }






  function handlePrint(resource = 'prenatalVisit', id?: TIdTypeCompatible) {


    const visitId = id || pregnancyId;

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: resource || 'prenatalVisit',
          template: '',
          version: '',
          note: '',
          id: visitId,
        }
      }
    })
  }



  const saveBtnTxt = disabled_save ? '无权限保存' : `保存`

  return (
    <div className="prenatal-visit-main_initial">
      <Tabs
        style={{ background: sys_theme.bg_color }}
        type="card"
        activeKey={cur_step}
        className="prenatal-visit-main_initial-tabs"
        onChange={(_next) => {
          // handleSubmit(key, true)
          set_cur_step(_next)
          requestTabFormData(_next);
        }}
      >
        {all_tabs.map(({ key, title, Content, className }: any, idx) => {
          const isFunc = Content.tmp

          const optionNode = <Space className="prenatal-visit-main_initial-btns">
            <Button size="large" onClick={() => handlePrint('prenatalVisit', undefined)}>
              <MyIcon value='PrinterOutlined' />    打印档案
            </Button>
            <Button size="large" type="primary" disabled={disabled_save} onClick={() => handleSubmit(key)}>
              <MyIcon value='SaveOutlined' />      {saveBtnTxt}
            </Button>
            {cur_step != 'tab-7' && (
              <Button size="large" type="primary" onClick={() => {
                // handleSubmit('', true)
                const _next = cal_next_step(cur_step)
                if (_next) {
                  set_cur_step(_next)
                  requestTabFormData(_next);

                }
              }}>
                <MyIcon value='ArrowRightOutlined' /> 下一页
              </Button>
            )}
          </Space>

          const node = cur_step == 'tab-7' ? (
            <ZDCL
              diagnosis_before_submit={props.diagnosis_before_submit}
              diagnosis_addon_btns={props.diagnosis_addon_btns}
              disabled_save={disabled_save}
              serialNo={serialNo}
              active={key === cur_step}
              form={forms.current[idx]}
              handlePrint={handlePrint}
              diagnosesList={diagnosesList}
              headerInfo={headerInfo}
              setDiagnosesList={setDiagnosesList}
              saveHeaderInfo={saveHeaderInfo}

            />
          ) : null
          return (
            <Tabs.TabPane
              key={key}
              tab={title}
            >
              <div className={className}>

                <MyLazyComponent size='middle'>
                  {isFunc ? <Content disabled_save={disabled_save} set_disabled_save={set_disabled_save} active={key === cur_step} form={forms.current[idx]} /> : node}
                  {cur_step == 'tab-7' ? null : optionNode}
                </MyLazyComponent>
              </div>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
export default DoctorEnd_Initial
