import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
import { defineFormConfig } from '@lm_fe/service'
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import React, { useEffect } from "react"
import { Follow_up_btn_两癌 } from '../../gynecological-diseases/two-cancers/.两癌随访'
export default function BreastCancerDataReport(prop: any) {
    const { Wrap, config } = BF_Wrap2({
        default_conf: {
            title: '两癌筛查-乳腺癌异常统计',
            name: "/api/statistics/breast/cancer/exception/findAll",
            tableColumns: [
                { title: '门诊号', dataIndex: 'outpatientNO' },
                { title: '姓名', dataIndex: 'name' },
                { title: '年龄', dataIndex: 'age' },
                { title: '电话', dataIndex: 'telephone' },
                { title: '证件号码', dataIndex: 'idNO' },
                { title: '身份证地址', dataIndex: 'residenceAddress' },
                { title: '建档日期', dataIndex: 'registerDate', },
                { title: '结果', dataIndex: 'xresult', },
            ],
            searchConfig: defineFormConfig(
                [
                    { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
                    { label: '姓名', name: 'name', inputType: 'Input' },
                    { label: '证件号码', name: 'idNO', inputType: 'Input' },
                    { label: '建档日期', name: 'registerDate', inputType: 'rangeDate' },
                    { label: '身份证地址', name: 'residenceAddress', inputType: 'MyAddress', inputProps: {} },
                    { label: '分类', name: 'type', inputType: 'MS', inputProps: { uniqueKey: 'cancer.pathologyResultErrorType', type: 'tags', width: 360 } },
                ]
            )
        }
    })
    useEffect(() => {

        return () => {

        }
    }, [])

    return <Wrap>

        <MyBaseList

            // apiPrefix="/fb/api"
            name={config?.name}
            searchParams={{
                // 'visitType.equals': 1,
            }}
            baseTitle="乳腺癌统计"
            needChecked
            useListSourceCount
            initialSearchValue={{
                validateDate: getMomentRange().近一周.map(formatDate)
            }}
            searchConfig={config?.searchConfig}

            RenderAction={(ctx) => <Follow_up_btn_两癌 rowData={ctx.rowData} handleSearch={ctx.handleSearch} />}

            showAdd={false}
            showExport
            // renderBtns={(ctx) => {
            //     const selectRows = ctx.getCheckRows()
            //     return <Button disabled={!selectRows.length} onClick={async () => {
            //         request.post('/api/dataReport/reportBreastCancerRecord', { ids: selectRows.map(_ => _.id), });
            //         ctx.handleSearch()
            //     }}>上报</Button>
            // }}
            tableColumns={config?.tableColumns}

        />
    </Wrap>
}

