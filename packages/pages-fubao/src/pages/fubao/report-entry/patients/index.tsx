import { OkButton } from '@lm_fe/components_m'
import { BF_Wrap2, MyBaseList, safe_navigate } from '@lm_fe/pages'
import { Space } from "antd"
import React from "react"
import { IPatientType } from './types'
export default function Patients(props: {}) {
    const conf_fn = () => import('./form_config')
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '报告录入-患者列表',
            tableColumns: conf_fn,
            searchConfig: [
                { label: '证件号', name: 'idNO', inputType: 'Input' },
                { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
            ]
        }
    })
    function show_report(rowData: IPatientType) {
        const idNO = rowData.idNO
        // mchcModal__.open('modal_page', {
        //     modal_data: {
        //         route_conf: { url: '/fubao/report-entry/reports', params: { idNO: rowData.idNO, } }
        //     }
        // })
        safe_navigate(`/fubao/report-entry/reports?idNO=${idNO}`, props, { idNO, });

    }
    return <Wrap>
        <MyBaseList
            ActionAddonBefore={ctx => {
                return <Space>
                    <OkButton size='small' onClick={() => show_report(ctx.rowData as IPatientType)}>报告</OkButton>
                </Space>
            }}
            // apiPrefix="/fb/api"
            name="/api/patients"

            // needChecked
            useListSourceCount
            initialSearchValue={{
                // validateDate: getMomentRange().近一周.map(formatDate)
            }}
            searchConfig={config?.searchConfig}

            // renderBtns={(ctx) => {
            //     const selectRows = ctx.getCheckRows()
            //     return <Button.Group>
            //         <Button disabled={!selectRows.length} onClick={async () => {
            //             request.post('/api/dataReport/reportBreastCancerRecordFlow', { ids: selectRows.map(_ => _.id), });
            //             ctx.handleSearch()
            //         }}>
            //             结案
            //         </Button>
            //         <Button disabled={!selectRows.length} onClick={async () => {
            //             request.post('/api/dataReport/reportBreastCancerRecord', { ids: selectRows.map(_ => _.id), });
            //             ctx.handleSearch()
            //         }}>
            //             上报
            //         </Button>
            //     </Button.Group>
            // }}
            tableColumns={__DEV__ ? conf_fn : config?.tableColumns}
        />
    </Wrap>
}

