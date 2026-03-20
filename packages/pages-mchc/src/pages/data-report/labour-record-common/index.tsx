import { MyBaseList } from '@lm_fe/pages'
import { mchcEnv } from "@lm_fe/env"
import { formatDate, getMomentRange, request } from "@lm_fe/utils"
import { Button } from "antd"
import { get, map } from "lodash"
import React from "react"
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        // dbg_dataSource={[{
        //     labourDate: '2024-07-06',
        //     admission: {
        //         noenateRecords: 1
        //     }
        // }]}
        name="/api/prenatal-visits/upload-logs"
        searchParams={{
            'visitType.equals': 0,
        }}
        needChecked
        useListSourceCount
        initialSearchValue={{
            validateDate: getMomentRange().近一周.map(formatDate)
        }}
        searchConfig={[
            { label: '分娩日期', name: 'labourDate', inputType: 'rangeDate' },
            { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
            { label: '姓名', name: 'name', inputType: 'Input' },
            { label: '上报状态', name: 'uploadState', inputType: 'MS', inputProps: { uniqueKey: '上报状态' } },
        ]}
        showAction={false}
        showAdd={false}
        renderBtns={(ctx) => {
            const selectRows = ctx.getCheckRows()
            return <Button disabled={!selectRows.length} onClick={async () => {
                request.post('/api/dataReport/reportLabourRecord', { ids: selectRows.map(_ => _.id), });
                ctx.handleSearch()
            }}>上报</Button>
        }}
        tableColumns={[
            { title: '产妇姓名', dataIndex: 'name' },
            { title: '住院号', dataIndex: 'inpatientNO' },
            { title: '证件号码', dataIndex: 'idNO' },
            { title: '分娩孕周', dataIndex: 'labourWeek' },
            { title: '分娩日期', dataIndex: 'labourDate' },
            { title: '分娩时间', dataIndex: 'labourTime' },
            {
                title: '第一产程',
                dataIndex: 'firststage',
                render: (value: any, record: any) =>
                    `${Number(get(record, 'firststageh'))} 时 ${get(record, 'firststagem') || 0}分`,
            },
            {
                title: '第二产程',
                dataIndex: 'secondstage',
                render: (value: any, record: any) =>
                    `${Number(get(record, 'secondstageh'))} 时 ${get(record, 'secondstagem') || 0}分`,
            },
            {
                title: '第三产程',
                dataIndex: 'thirdstage',
                render: (value: any, record: any) =>
                    `${Number(get(record, 'thirdstageh'))} 时 ${get(record, 'thirdstagem') || 0}分`,
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
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'weight')}</div>);
                        },
                    },
                    {
                        title: '身长(cm)',
                        dataIndex: ['admission', 'noenateRecords'],
                        key: 'noenateRecords',
                        width: 100,
                        render: (text: Array<Object>) => {
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'height')}</div>);
                        },
                    },
                    {
                        title: '阿氏评分1',
                        dataIndex: ['admission', 'noenateRecords'],
                        key: 'noenateRecords',
                        width: 100,
                        render: (text: Array<Object>) => {
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'apgar1')}</div>);
                        },
                    },
                    {
                        title: '阿氏评分2',
                        dataIndex: ['admission', 'noenateRecords'],
                        key: 'noenateRecords',
                        width: 100,
                        render: (text: Array<Object>) => {
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'apgar5')}</div>);
                        },
                    },
                    {
                        title: '阿氏评分3',
                        dataIndex: ['admission', 'noenateRecords'],
                        key: 'noenateRecords',
                        width: 100,
                        render: (text: Array<Object>) => {
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'apgar10')}</div>);
                        },
                    },
                    {
                        title: '出生缺陷',
                        dataIndex: ['admission', 'noenateRecords'],
                        key: 'noenateRecords',
                        width: 100,
                        render: (text: Array<Object>) => {
                            return map(text, (item) => <div key={get(item, 'id')}>{get(item, 'birthInjury')}</div>);
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
        ]}
    />
}