import { rt_ctx } from "@lm_fe/env"
import { MyBaseList } from '@lm_fe/pages'
import { peek_provoke } from '@lm_fe/provoke'
import React from "react"
const ctx = rt_ctx
export default function BreastCancerDataReport(prop: any) {
    return <MyBaseList
        useListSourceCount
        editText='电话随访'
        table_preset={{
            title: '复诊追踪-超时电话随访',
            name: '/api/prenatal-visit-logs/timeoutToPhoneData',
            handleBeforePopup(v: any) {
                return Object.assign(v, { remindType: 3, remindWay: 3, sendTime: ctx.utils.formatDateTime() })
            },
            beforeSubmit(v: any) {

                return v
            },
            showRowDelBtn: 0,
            showAdd: 0,
            tableColumns: () => import('./form_config'),
            searchConfig: [
                { label: '就诊卡号', name: 'outpatientNO', inputType: 'Input' },
                { label: '姓名', name: 'name', inputType: 'Input' },
                { label: '预约时间', name: 'appointmentDate', inputType: 'rangeDate' },
                {
                    label: '高危等级', name: 'highriskGrade', inputType: 'MS',
                    inputProps: {
                        width: 240,
                        type: 'tags',
                        options: peek_provoke(s => s.可选高危等级?.map(_ => ({ label: _.colorText, value: _.levelText })))
                    }
                },
                { label: '随访情况', name: 'phoneStatus', inputType: 'MS', inputProps: { options: '已接通,未接通' } },
            ]
        }}

    />
}

