import { HighriskGradeDisplay } from '@lm_fe/components_m'
import { APP_CONFIG, rt_ctx } from "@lm_fe/env"
import { BF_Wrap2, mchcModal__, MyBaseList } from '@lm_fe/pages'
import { SLocal_History } from '@lm_fe/service'
import { downloadFile, request } from "@lm_fe/utils"
import { Button, Space, Tooltip } from "antd"
import { isEmpty } from 'lodash'
import React from "react"
import { search_config } from './search_config'
const ctx = rt_ctx
export default function BreastCancerDataReport(prop: any) {
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '高危孕产妇管理-高危统计',
            tableColumns: () => import('./form_config'),
            searchConfig: search_config,
            initialSearchValue: () => ({ eventDate: ctx.utils.getMomentRange()['近一年'].map(ctx.utils.formatDate) }),
            searchParams: () => ({ 'deleteFlag.equals': 0 }),
        }
    })
    return <Wrap>
        <MyBaseList
            // apiPrefix="/fb/api"
            name="/api/highriskSummaryByPregnancy-query"




            bf_conf={config}
            renderBtns={(ctx) => {
                return <Button.Group>
                    <Button onClick={async () => {
                        let queryData = ctx.getSearchParams()
                        const res = await request.get(`/api/export/highriskSummaryByPregnancyDqe`, { params: queryData });
                        downloadFile(res.data, '高危详情表', 'application/vnd.ms-excel', true);
                    }}>
                        导出
                    </Button>

                </Button.Group>
            }}
            genColumns={cxt => [...(config?.tableColumns ?? []),

            {
                title: '高危等级',
                dataIndex: 'highriskGrade',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

                fixed: 'right',
                render: (value: any) => <HighriskGradeDisplay type="highriskGrade" data={value} />,
            },
            {
                title: '传染病',
                dataIndex: 'infectionNote',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,
                fixed: 'right',
                render: (value: any) => <HighriskGradeDisplay type="contagion" data={value} />,
            },
            {
                title: '操作',
                align: 'center',
                fixed: 'right',
                width: 180,
                render(rowData: any) {
                    return <Space size='small'>
                        <Button
                            size='small'
                            // disabled={isEmpty(rowData.riskRecords)}
                            onClick={
                                () => {
                                    mchcModal__.open('高危因素管理', {
                                        modal_data: { pregnancyId: rowData.id, hide高危标记: true }
                                    })
                                }
                            }>
                            记录
                        </Button>
                        <Button
                            size='small'
                            // disabled={isEmpty(rowData.riskRecords)}
                            onClick={
                                () => {
                                    mchcModal__.open('高危随访', {
                                        modal_data: { pregnancyId: rowData.id, }
                                    })
                                }
                            }>
                            随访
                        </Button>
                        <Button
                            size='small'

                            onClick={() => {
                                SLocal_History.historyPush(`/prenatal-visit/pregnancy/doctor-end?id=${rowData.id}`)
                            }}
                        >
                            看诊
                        </Button>
                    </Space>
                }
            },]}
        />
    </Wrap>
}

