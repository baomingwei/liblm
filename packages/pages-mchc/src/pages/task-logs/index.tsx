import { rt_ctx } from "@lm_fe/env"
import { MyBaseList, width } from '@lm_fe/pages'
import React from "react"
const ctx = rt_ctx

export default function BreastCancerDataReport(prop: any) {
  return <MyBaseList
    // apiPrefix="/fb/api"
    useListSourceCount

    table_preset={{
      title: '宣教随访-宣教任务记录',
      name: "/api/knowledge-logs",
      searchParams: {
        'visitType.equals': 1,
      },
      searchConfig: [
        { label: '标题', name: 'title', inputType: 'Input' },
        { label: '推送状态', name: 'pushStatus', inputType: 'MS', inputProps: { uniqueKey: '推送状态' } },
      ],
      showAdd: 0,
      showAction: 0,
      tableColumns: [
        {
          title: '就诊卡号',
          dataIndex: ['outpatientNO'],
          width: 100,

        },
        {
          title: '姓名',
          dataIndex: ['name'],
          width: 100,

        },
        {
          title: '任务标题',
          dataIndex: ['title'],
          width: 100,

        },
        {
          title: '内容类型',
          dataIndex: ['contentType'],
          width: 50,
          inputType: 'MS',
          inputProps: {
            uniqueKey: 'Task.contentType'
          }
        },
        {
          title: '推送内容',
          dataIndex: 'content',

        },
        {
          title: '推送时间',
          dataIndex: 'pushTime',
          width: 100,
        },
        {
          title: '推送状态',
          dataIndex: 'pushStatus',
          inputType: 'MS',
          width: 50,
          inputProps: {
            marshal: 0,
            uniqueKey: '推送状态'
          }
        },
        {
          title: '推送情况说明',
          dataIndex: 'pushNote',
        },
      ],


    }}
  />
}