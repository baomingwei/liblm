import { GestationalWeekProjectTree, MyForm, getFormData, getGesWeek, useFormTabs } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import { Button, Modal, Segmented, Space, Tabs, message } from 'antd';
import { cloneDeep, get, isEmpty, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { api } from '../../../../.api';
import {
  getsurveyList,
  updateSurveyList,
} from '../../../../.initial/methods/request';
import './index.less';
import { DoctorEnd_检验检查_History } from '@lm_fe/pages';

interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  isAllPregnancies: boolean
  isShowListModal: boolean
  // closeModal: (t:  | 'isShowHisModal' | 'isShowManageModal') => void
  closeModal: () => void
  furtherRefresh(): void

}
type TabType = '检验检查' | '超声检查' | '孕期必查项目'
function SurverList(props: IProps) {
  const { isShowListModal, isAllPregnancies, headerInfo, closeModal, furtherRefresh } = props;
  const { forms } = useFormTabs(3)
  const [cloneData, set_cloneData] = useState({})
  const [surveyFormConfig, set_surveyFormConfig] = useState([])
  const [ultrasoundConfig, set_ultrasoundConfig] = useState([])
  const [formHandler, set_formHandler] = useState({} as any)
  const [itemData, set_itemData] = useState([])
  const [activeKey, set_activeKey] = useState<TabType>('检验检查')
  const [formData, set_formData] = useState({
    '1': {},
    '2': {},
  })

  useEffect(() => {

    (async () => {
      const surveyConfig = await api.further.getSurveyFormConfig();
      const ultrasoundConfig = await api.further.getUltrasoundFormConfig();


      const b = get(ultrasoundConfig, 'fields')

      set_surveyFormConfig(get(surveyConfig, 'fields'))
      set_ultrasoundConfig(b)
      get_FormData('检验检查');
    })()

    return () => {

    }
  }, [])





  async function get_FormData(tab: TabType, needRequest = false) {
    if (!isEmpty(formData[tab]) && !needRequest) return false;
    const id = get(props, `headerInfo.id`);
    const res = await getsurveyList[tab === '检验检查' ? 1 : 2](id);
    if (tab == '检验检查') {
      set(res, `hbvdna`, get(res, `hbvdna`)?.replace(/&amp;lt;/, '<'));
    }

    set_formData({
      ...formData,
      [tab]: res,
    })
  }





  async function handleBtnClick() {
    forms[0].submit()
    if (activeKey == '检验检查') {
      furtherRefresh && furtherRefresh();
    }
    if (activeKey === '超声检查') {
      const { res, validCode } = await formHandler.submit();
      if (validCode) {
        const resData = getFormData(res);
        await updateSurveyList[2]({ ...resData, id: get(props, `headerInfo.id`) });

        closeModal();
      } else {

        message.destroy();
        message.error('请完善表单项！');
      }


    }
  };

  function setFormHandler(data: any) {
    set_formHandler(data)
  };

  function handleTabChange(key: TabType) {
    if (key == '检验检查' || key == '超声检查') {
      get_FormData(key);
    }

    set_activeKey(key)
  }



  const buttons = [
    <Space>
      <Button onClick={() => closeModal()}>取消</Button>
      <Button type="primary" onClick={() => handleBtnClick()}>
        确定
      </Button>
      {/* <Button onClick={() => handleBtnClick('print')} type="primary">
          打印
        </Button> */}
    </Space>,
  ];
  function Render_SegContent() {
    switch (activeKey) {
      case '检验检查':
        return <DoctorEnd_检验检查_History form={forms[0]} pregnancyId={headerInfo?.id} />
      case '超声检查':
        return <MyForm
          config={ultrasoundConfig}
          value={formData['2']}
          getFormHandler={(formHandler: any) => setFormHandler(formHandler)}
          submitChange={false}
        />
      case '孕期必查项目':
        return <GestationalWeekProjectTree pregnancyId={mchcUtils.single_id()} />

      default:
        return null
    }


  }
  function RenderTab() {
    return <Tabs destroyOnHidden size='small' activeKey={activeKey} onChange={handleTabChange}>
      <Tabs.TabPane className="survey-form label-width6" tab="检验检查" key="检验检查">

        <DoctorEnd_检验检查_History form={forms[0]} pregnancyId={headerInfo?.id} />
      </Tabs.TabPane>

      <Tabs.TabPane className="survey-form label-width6" tab="超声检查" key="超声检查">
        <MyForm
          config={ultrasoundConfig}
          value={formData['2']}
          getFormHandler={(formHandler: any) => setFormHandler(formHandler)}
          submitChange={false}
        />
      </Tabs.TabPane>

      <Tabs.TabPane className="check-items-wrapper" tab="孕期必查项目" key="孕期必查项目">
        <GestationalWeekProjectTree pregnancyId={mchcUtils.single_id()} />
      </Tabs.TabPane>
    </Tabs>
  }
  return (
    <Modal
      className="survey-list"
      width="96vw"
      // centered
      footer={isAllPregnancies ? null : buttons}
      title={null}
      styles={{
        content: { top: 84, padding: 8 },
        body: { height: '72vh', overflowY: 'auto' }
      }}
      open={isShowListModal}
      onCancel={() => closeModal()}
    >
      {/* <Segmented size='small' value={activeKey} onChange={handleTabChange} options={['检验检查', '超声检查', '孕期必查项目'] as TabType[]} /> */}
      {
        RenderTab()
      }
    </Modal>
  );
}
export default SurverList
