import { MyBaseList } from "@lm_fe/pages";
import React from "react";


export default function RemindRecord(prop: any) {
    return <MyBaseList
        table_preset={{
            title: '复诊追踪-电话随访记录',
            name: "/api/prenatal-visit-logs",

            searchParams: {
                'remindType.equals': 3,
            },
            needChecked: 1,

            searchConfig:
                [
                    { label: '就诊卡号', name: 'prenatalVisitCriteria.pregnancy.outpatientNO', inputType: 'Input' },
                    { label: '姓名', name: 'prenatalVisitCriteria.pregnancy.name', inputType: 'Input' },
                    { label: '预约时间', name: 'appointmentDate', inputType: 'rangeDate' },
                ],

            showAction: 0,
            showAdd: 0,
            tableColumns: () => import('./form_config')

        }}



    />
}

