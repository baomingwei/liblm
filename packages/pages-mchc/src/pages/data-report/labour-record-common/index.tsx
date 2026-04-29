import { mchcEnv, rt_ctx } from "@lm_fe/env"
import { MyBaseList } from '@lm_fe/pages'
const ctx = rt_ctx
const React = ctx.React
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // dbg_dataSource={[{
        //     labourDate: '2024-07-06',
        //     admission: {
        //         noenateRecords: 1
        //     }
        // }]}
        table_preset={{
            title: '数据上报-分娩上报',

            name: "/api/prenatal-visits/upload-logs",
            searchParams: {
                'visitType.equals': 0,
            },
            needChecked: 1,

            initialSearchValue() { return { labourDate: ctx.utils.getMomentRange().近一年.map(ctx.utils.formatDate) } },

            searchConfig: [
                { label: '分娩日期', name: 'labourDate', inputType: 'rangeDate' },
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
            ],
            showAction: 0,
            showAdd: 0,


            renderBtns: () => {
                const selectRows = ctx.props.table_helper.getCheckRows()

                return ctx.ui.render_btn('上报', () => {
                    ctx.request.post('/api/dataReport/reportLabourRecord', { ids: selectRows.map(_ => _.id), })
                        .then(() => {
                            ctx.props.table_helper.handleSearch()
                        })
                }, { disabled: !selectRows.length })

            },

            tableColumns: [
                { title: '产妇姓名', dataIndex: 'name' },
                { title: '住院号', dataIndex: 'inpatientNO' },
                { title: '证件号码', dataIndex: 'idNO' },
                { title: '分娩孕周', dataIndex: 'labourWeek' },
                { title: '分娩日期', dataIndex: 'labourDate' },
                { title: '分娩时间', dataIndex: 'labourTime' },
                {
                    title: '第一产程',
                    dataIndex: 'firststage',
                    render: (value: any, record: any) => {
                        if (record.firststageh && record.firststagem)
                            return record.firststageh + `时` + record.firststagem + `分`
                        return ''
                    }

                },
                {
                    title: '第二产程',
                    dataIndex: 'secondstage',
                    render: (value: any, record: any) => {
                        if (record.secondstageh && record.secondstagem)
                            return record.secondstageh + `时` + record.secondstagem + `分`
                        return ''
                    }

                },
                {
                    title: '第三产程',
                    dataIndex: 'thirdstage',

                    render: (value: any, record: any) => {
                        if (record.thirdstageh && record.thirdstagem)
                            return record.thirdstageh + `时` + record.thirdstagem + `分`
                        return ''
                    }

                },
                {
                    title: '胎儿信息',
                    align: 'center',
                    children: [
                        {
                            title: '胎儿性别',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            inputType: 'MS',
                            inputProps: {
                                options: mchcEnv.get_options('性别4')
                            },
                        },
                        {
                            title: '体重(kg)',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'weight')

                            },
                        },
                        {
                            title: '身长(cm)',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'height')
                            },
                        },
                        {
                            title: '阿氏评分1',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'apgar1')

                            },
                        },
                        {
                            title: '阿氏评分2',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'apgar5')

                            },
                        },
                        {
                            title: '阿氏评分3',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'apgar10')

                            },
                        },
                        {
                            title: '出生缺陷',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            render: (text: Array<Object>) => {
                                return ctx.ui.render_arr(text, false, 'birthInjury')

                            },
                        },
                        {
                            title: '分娩方式',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 100,
                            inputType: 'MS',
                            inputProps: {
                                uniqueKey: '分娩方式'
                            },
                        },
                        {
                            title: '胎方位',
                            dataIndex: ['admission', 'noenateRecords'],
                            key: 'noenateRecords',
                            width: 130,
                            inputType: 'MS',
                            inputProps: {
                                options: mchcEnv.get_options('胎方位12')
                            },
                        },
                    ],
                },
                { title: '上报状态', dataIndex: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态', marshal: 0 } },
                // { title: '手册编号', dataIndex: 'ycfbsh', },

                { title: '上报说明', dataIndex: 'uploadMsg', },
                { title: '上报时间', dataIndex: 'uploadDate', },
            ]
        }}
    />
}