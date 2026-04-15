import { rt_ctx } from "@lm_fe/env"
import { MyBaseList } from '@lm_fe/pages'
import React from "react"
const ctx = rt_ctx
export default function BreastCancerDataReport(prop: any) {
  return <MyBaseList
    // apiPrefix="/fb/api"
    useListSourceCount

    table_preset={{
      title: '产科门诊-挂号列表',
      name: "/api/registrations",
      searchParams: {
        'visitType.equals': 1,
      },
      searchConfig: [
        { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
        { label: '医生工号', name: 'doctorNo', inputType: 'Input' },
        { label: '挂号日期', name: 'registrationDate', inputType: 'rangeDate' },
      ],
      showAdd: 0,
      showAction: 0,
      tableColumns: [
        {
          title: '挂号日期',
          dataIndex: 'registrationDate',
        },
        {
          title: '科室号',
          dataIndex: 'depId',
        },
        {
          title: '科室',
          dataIndex: 'depName',
        },
        {
          title: '门诊号',
          dataIndex: 'outpatientNo',
        },
        {
          title: '病人号',
          dataIndex: 'patientNo',
        },
        {
          title: '病人姓名',
          dataIndex: 'name',
        },
        {
          title: '病人证件号码',
          dataIndex: 'idNO',
        },
        {
          title: '医生工号',
          dataIndex: 'doctorNo',
        },
        {
          title: '医生姓名',
          dataIndex: 'doctorName',
        },
        {
          title: '挂号流水号',
          dataIndex: 'flowId',
        },
      ],


    }}
  />
}