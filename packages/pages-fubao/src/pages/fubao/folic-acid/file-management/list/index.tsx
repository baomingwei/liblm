import { MyBaseList } from '@lm_fe/pages';

import { ModelService, SLocal_History } from '@lm_fe/service';
import React from 'react';
import { tableColumns } from './config/table';
import { Button } from 'antd';
const s = new ModelService({
  n: 'FolateManagementFile', prePath: '/',

  // apiPrefix: `/fb/api`,
  fuckPage: true
})

export function List(props: {}) {
  return <MyBaseList
    tableColumns={tableColumns as any}
    requestBeforeEdit
    customModelService={s}
    baseTitle='发放叶酸'
    addText='发放叶酸'
    editText='查看'
    fuckPage
    modalFormConfig={{ width: '90vw' }}
    ActionAddonBefore={({ rowData }) => {
      return <Button size='small' onClick={() => SLocal_History.historyPush(`/fubao/folic-acid/file-management/edit?id=${rowData.id}`)}>发放叶酸</Button>
    }}
    renderBtns={({ getSearchParams }) => {


      return null
    }}
    beforeSearch={(v) => {
      return v
    }}
    beforeSubmit={v => {
      return v
    }}
    searchConfig={[
      { inputType: 'MyRangeDate', label: '建档日期', name: 'filingDate', },
      { inputType: 'Input', label: '手机号码', name: 'telephone' },
      { inputType: 'Input', label: '姓名', name: 'name' },

    ]}
    searchParams={{ pageSize: 10 }}
  />
}
export default List
