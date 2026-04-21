import { rt_ctx } from "@lm_fe/env";
import { BF_Wrap2, MyBaseList } from "@lm_fe/pages";
import React from "react";
const ctx = rt_ctx

export default function Archive(props: any) {

    return <MyBaseList
        table_preset={{
            title: '统计管理-就诊列表',
            tableColumns: () => import('./table_config'),
            searchConfig: () => import('./serch_config'),
            name: '/api/getPrenatalVisitDetail',
            showAction: 0,
            showAdd: 0,
            initialSearchValue: () => {
                const query_visitDate = ctx.utils.getSearchParamsValue('visitDate')
                if (!query_visitDate) return { visitDate: ctx.utils.getMomentRange()['年初至今'].map(ctx.utils.formatDate) }
                if (query_visitDate.includes('~'))
                    return {
                        visitDate: query_visitDate.split('~')
                    }
                return {
                    visitDate: [query_visitDate, query_visitDate],
                }
            },
            renderBtns: () => {
                return <>
                    {
                        ctx.ui.render_btn('导出', () => {
                            ctx.request.get('/api/exportPrenatalVisitDetail', { params: ctx.props.table_helper.getSearchParams(), responseType: 'blob', })
                                .then(res => {
                                    ctx.utils.downloadFile(res.data, `就诊统计表` + ctx.utils.formatDate() + `.xls`, 'application/vnd.ms-excel');
                                })
                        })
                    }
                </>
            }
        }}

    />
}