import { OkButton } from "@lm_fe/components_m";
import { rt_ctx } from "@lm_fe/env";
import { BF_Wrap2, MyBaseList } from "@lm_fe/pages";
import { downloadFile, formatDate, request } from "@lm_fe/utils";
import React from "react";
const ctx = rt_ctx

export default function Archive(props: any) {
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '统计管理-门诊就诊统计',
            tableColumns: () => import('./table_config'),
            searchConfig: () => import('./serch_config'),
            name: '/api/getPrenatalVisitStatistics',
            initialSearchValue: () => ({ visitDate: ctx.utils.getMomentRange()['年初至今'].map(ctx.utils.formatDate) }),

            showAction: 0,
            showAdd: 0,
        }
    })
    return <Wrap>
        <MyBaseList
            bf_conf={config}
            renderBtns={ctx => {
                return <OkButton
                    onClick={async e => {
                        const res = await request.get('/api/exportPrenatalVisitStatistics', {
                            params: ctx.getSearchParams(),
                            responseType: 'blob',
                        })
                        downloadFile(res.data, `就诊统计表${formatDate()}.xls`, 'application/vnd.ms-excel');
                    }}

                >导出</OkButton>
            }}
        />
    </Wrap>
}