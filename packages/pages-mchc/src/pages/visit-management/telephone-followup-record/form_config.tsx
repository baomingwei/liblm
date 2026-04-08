import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
const React = ctx.React
export default defineFormConfig(
    [
        {
            title: '姓名',
            dataIndex: ['prenatalVisit', 'pregnancy', 'name'],
            ellipsis: true,
            align: 'center',
        },
        {
            title: '就诊卡号',
            dataIndex: ['prenatalVisit', 'pregnancy', 'outpatientNO'],
            ellipsis: true,
        },
        {
            title: '预产期',
            dataIndex: ['prenatalVisit', 'pregnancy', 'edd'],
        },
        {
            title: '当前孕周',
            dataIndex: ['prenatalVisit', 'pregnancy', 'currentGestationalWeek'],


        },
        {
            title: '上次复诊日期',
            dataIndex: 'lastVisitDate',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '复诊预约日期',
            dataIndex: 'appointmentDate',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '随访时间',
            dataIndex: 'sendTime',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '电话状态',
            dataIndex: 'phoneStatus',
            inputType: 'MC',
            inputProps: {
                options: '接听,未接听,未知',
                marshal: 0
            }

        },
        {
            title: '超时原因',
            dataIndex: 'timeoutReason',
            inputProps: {
                options: '住院,转院,已分娩,终止妊娠,其他',
                marshal: 0
            }
        },
        {
            title: '其他原因',
            dataIndex: 'reasonOther',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
    ]
)