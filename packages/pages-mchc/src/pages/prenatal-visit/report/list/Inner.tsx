
import { PDFPreview_View } from '@lm_fe/components_m';
import { APP_CONFIG, rt_ctx } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__, MyBaseList, SnapButton } from '@lm_fe/pages';
import { defineFormConfig } from '@lm_fe/service';
import { Button, Modal, Pagination } from 'antd';
import React, { useState } from 'react';
import './index.less';
import { IProps } from './types';
const ctx = rt_ctx

interface IDataItem {
  "id": 80,
  "reportDate": "2024-08-16T08:00:00+08:00",
  "title": "血常规",
  "stringType": null,
  "type": 1,
  "patientNo": "135689",
  "name": "8520",
  "organization": "中山一院",
  "reportDoctorName": "",
  "recorder": "admin",
  "result": "",
  "diagnosis": "",
  "path": "/outReport/20240816/9669f9f3327a485893148f21247722d0_obdriver.jpg`#/outReport/20240816/d82aef74edbd42dc896a6206177742a4_obdriver.jpg",
  "fileName": "d82aef74edbd42dc896a6206177742a4_obdriver.jpg",
  "fileType": "jpg",
  "outerReportResults": null,
  "reportYmdDate": "2024-08-16"
}
const errorMessage = Modal.error;

let hostUrl = process.env.NODE_ENV === 'production' ? '' : 'http://120.79.170.18:8904';


export default function Inner(props: IProps) {

  const { type, search } = props
  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: '门诊-高拍仪导入',
      name: "/api/outer-reports",
      // initialSearchValue: search,
      searchParams() {
        return {
          sort: 'reportDate,DESC',
          'type.in': ctx.props.type || '1,2,3',
        }
      },
      initialSearchValue() {
        return ctx.utils.assign({}, ctx.props.search)
      },
      showAdd: 1,
      beforeSubmit(v) {
        v.type = v.type || 1
        return v
      },
      tableColumns: () => import('./form_config'),
      searchConfig: defineFormConfig(
        [

          {
            name: 'name',
            label: '孕妇姓名',
            inputType: 'input',
          },
          {
            name: 'patientNo',
            label: '就诊卡号',
            inputType: 'input',
          },
          {
            name: 'reportDate',
            label: '上传日期',
            inputType: 'rangeDate',
          },
          {
            name: 'title',
            label: '报告名称',
            inputType: 'MA',
            inputProps: {
              options: '地中海贫血筛查,血清铁蛋白,戊型肝炎病毒抗体,乙型肝炎病毒抗体,其他',
            }
          },

        ]
      )
    }
  }, { type, search })
  return <Wrap>
    <MyBaseList
      // showRowEditBtn={false}
      addText='上传报告'
      ActionAddonBefore={ctx => {
        return <Button
          size='small'
          onClick={() => {
            mchcModal__.open('test', {
              modal_data: {
                content: <Render_report row={ctx.rowData as IDataItem} />
              }
            })
          }}
        >查看</Button>
      }}
      renderBtns={(ctx) => {
        return <SnapButton />
      }}
      bf_conf={config}
    />
  </Wrap>
}


function Render_report(props: { row: IDataItem }) {
  const { row } = props
  const [current, setCurrent] = useState(1)


  let pathArr = row.path?.split?.('`#') ?? [];


  const path = pathArr.find((_, idx) => idx == current - 1) ?? ''
  const node = path.includes('.pdf')
    ? <PDFPreview_View key={path} file={`${hostUrl}${path}`} />

    : <img
      width="100%"
      key={path}
      alt="out-pic"
      src={`${hostUrl}${path}`}
    />


  return (

    <div>
      <div style={{ marginBottom: 12, height: '80vh', overflowY: 'auto' }}>{node}</div>
      <Pagination
        current={current}
        total={pathArr.length}
        pageSize={1}
        onChange={(c) => setCurrent(c)}
      />

    </div>


  );
};