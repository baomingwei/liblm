import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
import { defineFormConfig } from '@lm_fe/service'
export default function BreastCancerDataReport(prop: any) {

    const { Wrap, config } = BF_Wrap2({
        default_conf: {
            title: `婚前检查-上报`,

            searchConfig: defineFormConfig([
                { label: '就诊卡号', name: 'womanOutpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'womanName', inputType: 'Input' },
                { label: '上报状态', name: 'womanUploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ]),
            tableColumns: defineFormConfig([
                { title: '就诊卡号', dataIndex: 'womanOutpatientNO' },
                { title: '姓名', dataIndex: 'womanName' },
                { title: '上报时间', dataIndex: 'womanUploadDate', },
                { title: '上报状态', dataIndex: 'womanUploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
                { title: '上报说明', dataIndex: 'womanUploadMsg', },

                { title: '男方就诊卡号', dataIndex: 'manOutpatientNO' },
                { title: '男方姓名', dataIndex: 'manName' },
                { title: '男方上报时间', dataIndex: 'manUploadDate', },
                { title: '男方上报状态', dataIndex: 'manUploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
                { title: '男方上报说明', dataIndex: 'manUploadMsg', },
            ])
        }
    })

    return <Wrap>
        <MyBaseList
            // apiPrefix="/fb/api"
            name="/api/premarital/check/findAllPremaritalCheckReportLog"
            searchParams={{
                // 'visitType.equals': 1,
            }}
            needChecked
            useListSourceCount
            initialSearchValue={{
                validateDate: getMomentRange().近一周.map(formatDate)
            }}
            searchConfig={config?.searchConfig}

            showAction={false}
            showAdd={false}
            renderBtns={(ctx) => {
                const selectRows = ctx.getCheckRows()
                return <Button disabled={!selectRows.length} onClick={async () => {
                    request.post('/api/dataReport/reportPremaritalCheckups', { ids: selectRows.map(_ => _.id), });
                    ctx.handleSearch()
                }}>上报</Button>
            }}



            tableColumns={config?.tableColumns}
        />
    </Wrap>
}

