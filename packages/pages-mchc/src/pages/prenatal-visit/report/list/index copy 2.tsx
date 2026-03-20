
import { LazyAntd, PDFPreview_View } from '@lm_fe/components_m';
import { mchcModal__, MyBaseList, SnapButton } from '@lm_fe/pages';
import { TIdTypeCompatible } from '@lm_fe/service';
import { Button, Modal, Pagination } from 'antd';
import React, { useState } from 'react';
import { queryFormDescriptions } from './config/form';
import { tableColumns } from './config/table';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown } = LazyAntd


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


export default function Gaopaiyi_List(props: { type?: TIdTypeCompatible, search?: { [x in keyof typeof queryFormDescriptions]?: any } }) {

  const { type, search } = props

  return <MyBaseList
    showAdd={false}
    showRowEditBtn={false}
    initialSearchValue={search}
    searchParams={{
      sort: 'reportDate,DESC',
      'type.in': type || '1,2,3',
    }}
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
    name='/api/outer-reports'
    searchConfig={Object.values(queryFormDescriptions)}
    tableColumns={tableColumns}
  />
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
      <div style={{ marginBottom: 12, maxHeight: '80vh', overflowY: 'auto' }}>{node}</div>
      <Pagination
        current={current}
        total={pathArr.length}
        pageSize={1}
        onChange={(c) => setCurrent(c)}
      />

    </div>


  );
};