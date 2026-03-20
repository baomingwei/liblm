import React from 'react'
import { Button, message } from 'antd';
import { get } from 'lodash';
import { tableColumns } from './config/table';
import { request } from '@lm_fe/utils';
import { MyBaseList } from '@lm_fe/pages';

async function handleRefreshConfig() {
  request.get<{ code: number, msg: string }>('/api/flushConfiguration', { showMsg: true });

};
export default () => {


  return <MyBaseList tableColumns={tableColumns as any}
    name="/getAllConfiguration"
    showRowDelBtn
    baseTitle='配置'
    showAdd={false}
    fuckPage
    renderBtns={({ getSearchParams }) => {


      return <>
        <Button onClick={handleRefreshConfig}>
          刷新
        </Button>
      </>
    }}
    beforeSearch={(v) => {
      const { ...others } = v
      console.log('beforeSearch 9999999999', v)
      return {

        ...others,
      }
    }}
    beforeSubmit={v => {
      const { configurationValue, configurationReplenishExplain, } = v
      let configurationState = v.configurationState
      if (configurationValue && configurationReplenishExplain) {
        configurationState = 1
      }
      if (!configurationValue && !configurationReplenishExplain) {
        configurationState = 0
      }
      v.configurationState = configurationState


      return v
    }}
    searchSchema={[
      { type: 'Input', outerOptions: { name: 'configurationExplain', label: '配置说明' } },
      { type: 'Input', outerOptions: { name: 'configurationKey', label: '配置名' } },
      { type: 'Input', outerOptions: { name: 'configurationType', label: '配置类型' } },
      { type: 'Input', outerOptions: { name: 'configurationValue', label: '配置值' } },
      {
        type: 'Select', outerOptions: { name: 'configurationState', label: '配置状态' }, innerOptions: {
          options: [{ label: '未配置', value: '0' },
          { label: '已配置', value: '1' },]
        }
      },

    ]}
    searchParams={{ pageSize: 10 }}


  />
}

