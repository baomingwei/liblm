import { GestationalWeekProjectTree, MyForm, getFormData, getGesWeek, useFormTabs } from '@lm_fe/components_m';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
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
import ChaoSheng from './ChaoSheng'

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
  const [activeKey, set_activeKey] = useState<TabType>('检验检查')


  useEffect(() => {


    return () => {

    }
  }, [])









  async function handleBtnClick() {
    forms[0].submit()
    forms[1].submit()


  };



  function handleTabChange(key: TabType) {


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

  function RenderTab() {
    return <Tabs destroyOnHidden size='small' activeKey={activeKey} onChange={handleTabChange}>
      <Tabs.TabPane className="survey-form label-width6" tab="检验检查" key="检验检查">

        <DoctorEnd_检验检查_History
          on_finish={() => {
            mchcEvent.emit('outpatient', { type: '刷新头部' })
            furtherRefresh();
          }}
          form={forms[0]} pregnancyId={headerInfo?.id} />
      </Tabs.TabPane>

      <Tabs.TabPane className="survey-form label-width6" tab="超声检查" key="超声检查">
        <ChaoSheng
          on_finish={() => {
            mchcEvent.emit('outpatient', { type: '刷新头部' })
            furtherRefresh();
          }}
          form={forms[1]} pid={headerInfo?.id} />
 
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
