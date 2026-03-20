import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { mchcLogger } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import React from "react"
import { form_config } from './form_config'
export default function BreastCancerDataReport(prop: any) {

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '数据上报-乳腺癌上报',
            tableColumns: form_config,
            searchConfig: [
                { label: '登记日期', name: 'registerDate', inputType: 'rangeDate' },
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ]
        }
    })

    return <Wrap>
        <MyBaseList
            // apiPrefix="/fb/api"
            name="/api/two/cancer/screening/findAllBreastCancerReportedDataLog"
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
                return <Button.Group>
                    <Button disabled={!selectRows.length} onClick={async () => {
                        request.post('/api/dataReport/reportBreastCancerRecordFlow', { ids: selectRows.map(_ => _.id), });
                        ctx.handleSearch()
                    }}>
                        结案
                    </Button>
                    <Button disabled={!selectRows.length} onClick={async () => {
                        request.post('/api/dataReport/reportBreastCancerRecord', { ids: selectRows.map(_ => _.id), });
                        ctx.handleSearch()
                    }}>
                        上报
                    </Button>
                </Button.Group>
            }}
            tableColumns={config?.tableColumns}
        />
    </Wrap>
}

