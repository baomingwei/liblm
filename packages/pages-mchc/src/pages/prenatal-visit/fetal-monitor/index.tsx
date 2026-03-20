import { OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import { SLocal_History } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';



export default function List(props: {}) {

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: '胎监-列表',
      tableColumns: () => import('./form_config'),
      name: '/api/fetalMonitorRecord',
      searchParams: {},
      searchConfig: [
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '证件号码',
          dataIndex: 'idNO',
        },
        {
          title: '就诊卡号',
          dataIndex: 'outpatientNO',
        },
        {
          name: 'enterTime',
          label: '确认时间',
          inputType: 'rangeDate',
        },
        {
          name: 'visitDate',
          label: '看诊日期',
          inputType: 'rangeDate',
        },
        {
          name: 'state',
          label: '状态',
          inputType: 'MS',
          props: {
            options: [{ value: false, label: '未确认' }, { value: true, label: '已确认' }]
          }
        },
      ]
    }
  })
  useEffect(() => {
    const rm = mchcEvent.on_rm('custom_msg', e => {
      const rowData = e.data

    })

    return rm
  }, [])


  return <Wrap>
    <MyBaseList
      bf_conf={config}
      // name={config?.name}
      // searchParams={config?.searchParams}
      // searchConfig={config?.searchConfig}
      // handleBeforePopup={config?.handleBeforePopup}
      useListSourceCount
      // initialSearchValue={{}}
      // showRowPrintBtn
      handleDoubleClickRow={(rowData, ctx) => {
        const { enterTime, pregnancyId, id } = rowData
        request.get('/api/enter/fetalMonitorRecord', { params: { id } }).then(() => ctx.handleSearch())

      }}
      renderBtns={(ctx) => {
        return <Count name={config?.name} getSearchParams={ctx.getSearchParams} />
      }}
      ActionAddonBefore={(ctx) => {
        const { enterTime, pregnancyId, id } = ctx.rowData

        // return <OkButton size='small' onClick={() => {
        //   mchcModal__.open('print_modal', {
        //     modal_data: {
        //       requestConfig: { method: 'get', url: '/api/gbsResult/print', params: { id: rowData.id } }
        //     }
        //   })
        // }}  >打印</OkButton>
        return <Space>
          <OkButton size='small' onClick={() => SLocal_History.historyPush(`/prenatal-visit/pregnancy/doctor-end?id=${pregnancyId}`)} >看诊</OkButton>
          <OkButton size='small' onClick={() => request.get('/api/redo/fetalMonitorRecord', { params: { id } }).then(() => ctx.handleSearch())} >重做</OkButton>

        </Space>
      }}
      // tableColumns={__DEV__ ? () => import('./form_config') : config?.tableColumns}
    // tableColumns={() => import('./form_config')}
    />
  </Wrap >
}

function Count(props: { name?: string, getSearchParams: () => any }) {
  const { name, getSearchParams } = props
  const [num, setNum] = useState(0)
  useEffect(() => {

    return mchcEvent.on_rm('BaseList_hook', e => {
      // console.log('serach', { event: e })
      if (e.type === 'search' && e.name === name) {
        request.get<number>('/api/getTotalMonitorSum', { params: getSearchParams() })
          .then(r => { setNum(r.data) })
      }
    })
  }, [name, getSearchParams])

  return <Tag>{num}</Tag>
}

