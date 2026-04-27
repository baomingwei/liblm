import { rt_ctx } from "@lm_fe/env"
import { MyBaseList } from '@lm_fe/pages'
const ctx = rt_ctx
const React = ctx.React
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // apiPrefix="/fb/api"

        useListSourceCount




        table_preset={{
            needChecked: 1,
            renderBtns: () => {
                return <>
                    {ctx.ui.render_btn('上报', () => {
                        const selectRows = ctx.props.table_helper.getCheckRows()

                        ctx.request.post('/api/dataReport/reportPregnancy', { ids: selectRows.map(_ => _.id), })
                            .then(() => {
                                ctx.props.table_helper.handleSearch()
                            })
                    })}
                </>
            },


            title: '数据上报-建档上报',
            name: "/api/pregnancies/upload-logs",
            searchParams: {
                'visitType.equals': 1,
            },
            searchConfig: [
                { label: '建档日期', name: 'validateDate', inputType: 'rangeDate' },
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ],
            showAdd: 0,
            showAction: 0,
            tableColumns: [
                { title: '建档日期', dataIndex: 'validateDate' },

                { title: '姓名', dataIndex: 'name' },
                { title: '就诊卡号', dataIndex: 'outpatientNO' },
                { title: '身份证号', dataIndex: 'idNO' },
                { title: '审核人', dataIndex: 'auditorName' },
                { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },

                { title: '上报说明', dataIndex: 'uploadMsg', },
                { title: '上报时间', dataIndex: 'uploadDate', },
            ],
            initialSearchValue() { return { validateDate: ctx.utils.getMomentRange().近一年.map(ctx.utils.formatDate) } },

            // initialSearchValue: {
            //     validateDate: getMomentRange().近一周.map(formatDate)
            // }
        }}
    />
}