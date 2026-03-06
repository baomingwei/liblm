import { MyBaseList } from '@lm_fe/pages'
import { mchcLogger, rt_ctx } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
const ctx = rt_ctx

export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // apiPrefix="/fb/api"

        needChecked
        useListSourceCount

        bf_preset={{
            title: '数据上报-复诊上报',
            name: "/api/prenatal-visits/upload-logs",
            searchParams: {
                'visitType.equals': 1,
            },
            searchConfig: [
                { label: '检查日期', name: 'visitDate', inputType: 'rangeDate' },
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ],
            showAdd: 0,
            showAction: 0,
            tableColumns: [
                // { title: '建档日期', dataIndex: 'validateDate' },
                { title: '检查日期', dataIndex: 'visitDate' },

                { title: '姓名', dataIndex: 'name' },
                { title: '就诊卡号', dataIndex: 'outpatientNO' },
                { title: '身份证号', dataIndex: 'idNO' },
                // { title: '看诊医生', dataIndex: 'doctorName' },
                { title: '审核人', dataIndex: 'auditorName' },
                { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
                { title: '手册编号', dataIndex: 'ycfbsh', },
                { title: '上报说明', dataIndex: 'uploadMsg', },
                { title: '上报时间', dataIndex: 'uploadDate', },
            ],
            initialSearchValue() { return { visitDate: ctx.utils.getMomentRange().近一年.map(ctx.utils.formatDate) } },

            // initialSearchValue: {
            //     validateDate: getMomentRange().近一周.map(formatDate)
            // }
        }}


        RenderBtns={(ctx) => {
            const selectRows = ctx.getCheckRows()
            return <Button disabled={!selectRows.length} onClick={async () => {
                request.post('/api/dataReport/reportRvisit', { ids: selectRows.map(_ => _.id), });
                ctx.handleSearch()
            }}>上报</Button>
        }}

    />
}

