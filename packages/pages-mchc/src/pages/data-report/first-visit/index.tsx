import { rt_ctx } from "@lm_fe/env"
import { BF_Wrap2, MyBaseList } from '@lm_fe/pages'
const ctx = rt_ctx
const React = ctx.React
export default function BreastCancerDataReport(prop: any) {

    return <MyBaseList
        table_preset={{
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
            },
            needChecked: 1,
            showAction: 0,
            showAdd: 0,
            renderBtns: () => {
                const selectRows = ctx.props.table_helper.getCheckRows()

                return ctx.ui.render_btn('上报', () => {
                    ctx.request.post('/api/dataReport/reportIvisit', { ids: selectRows.map(_ => _.id), })
                        .then(() => {
                            ctx.props.table_helper.handleSearch()
                        })
                }, { disabled: !selectRows.length })

            }
        }}



    />
}