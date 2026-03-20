import { MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // apiPrefix="/fb/api"
        name="/api/two/cancer/screening/findAllTwoCancerReportedLog"
        searchParams={{
            // 'visitType.equals': 1,
        }}
        needChecked
        useListSourceCount
        initialSearchValue={{
            validateDate: getMomentRange().近一周.map(formatDate)
        }}
        searchConfig={[
           // { label: '检查日期', name: 'visitDate', inputType: 'rangeDate' },
           { label: '登记日期', name: 'registerDate', inputType: 'rangeDate' },
           { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
           { label: '姓名', name: 'name', inputType: 'Input' },
           { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
        ]}

        showAction={false}
        showAdd={false}
        renderBtns={(ctx) => {
            const selectRows = ctx.getCheckRows()
            return <Button disabled={!selectRows.length} onClick={async () => {
                request.post('/api/dataReport/reportBasicInspectionInfo', { ids: selectRows.map(_ => _.id), });
                ctx.handleSearch()
            }}>上报</Button>
        }}
        tableColumns={[
            { title: '就诊卡号', dataIndex: 'outpatientNO' },
            { title: '姓名', dataIndex: 'name' },
            { title: '电话', dataIndex: 'telephone' },
            { title: '登记日期', dataIndex: 'registerDate' },
            { title: '上报时间', dataIndex: 'uploadDate', },
            { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
            { title: '上报说明', dataIndex: 'uploadMsg', },


            // { title: '身份证号', dataIndex: 'idNO' },
            // { title: '看诊医生', dataIndex: 'doctorName' },
            // { title: '审核人', dataIndex: 'auditorName' },
            // { title: '手册编号', dataIndex: 'ycfbsh', },
        ]}
    />
}

