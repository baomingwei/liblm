import { rt_ctx } from "@lm_fe/env"
import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
const ctx = rt_ctx
export default function BreastCancerDataReport(prop: any) {
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '数据上报-首诊上报',
            name: '/api/prenatal-visits/upload-logs',
            tableColumns: [
                // { title: '建档日期', dataIndex: 'validateDate' },
                { title: '检查日期', dataIndex: 'visitDate' },

                { title: '姓名', dataIndex: 'name' },
                { title: '就诊卡号', dataIndex: 'outpatientNO' },
                { title: '身份证号', dataIndex: 'idNO' },
                // { title: '看诊医生', dataIndex: 'doctorName' },
                { title: '审核人', dataIndex: 'auditorName' },
                { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
                // { title: '手册编号', dataIndex: 'ycfbsh', },

                { title: '上报说明', dataIndex: 'uploadMsg', },
                { title: '上报时间', dataIndex: 'uploadDate', },
            ],
            searchConfig: [
                { label: '检查日期', name: 'visitDate', inputType: 'rangeDate' },
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ],
            initialSearchValue: () => (
                {
                    visitDate: ctx.utils.getMomentRange().近一周.map(ctx.utils.formatDate)
                }
            ),
            searchParams: {
                'visitType.equals': 0,
            }
        }
    })

    return <Wrap>
        <MyBaseList
            bf_conf={config}
            needChecked
            useListSourceCount

            showAction={false}
            showAdd={false}
            renderBtns={(ctx) => {
                const selectRows = ctx.getCheckRows()
                return <Button disabled={!selectRows.length} onClick={async () => {
                    request.post('/api/dataReport/reportIvisit', { ids: selectRows.map(_ => _.id), });
                    ctx.handleSearch()
                }}>上报</Button>
            }}
        />
    </Wrap>
}