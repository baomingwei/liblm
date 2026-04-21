import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { formatDate } from "@lm_fe/utils";
const ctx = rt_ctx
const React = ctx.React


export default defineFormConfig(
    [
        {
            title: '标题',
            dataIndex: 'title',
            width: APP_CONFIG.CELL_WIDTH_LARGE,
            layout: '1/3',
        },
        {
            title: '缩略图',
            hidden: true,
            dataIndex: 'thumbnail',
            "inputType": "image_upload_preview",
            "inputProps": {
                "actionApi": "/api/uploadImage",
                "outputParamType": "new"
            },
            layout: '1/3',
        },
        {
            key: 'content',
            label: '正文',
            hidden: true,
            inputType: 'mobile_editor',
            layout: '1/1',

        },
        {
            title: '类型',
            dataIndex: 'type',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
            layout: '1/3',
            inputType: 'MS',
            inputProps: { uniqueKey: 'Knowledge.knowledgeType' },
        },
        {
            title: '是否置顶',
            dataIndex: 'sticky',
            layout: '1/3',
            inputType: 'Switch',
            inputProps: { uncheckedText: '' },

            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '收藏数',
            dataIndex: 'collect',
            layout: '1/3',
            inputType: 'input_number',

            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '点赞数',
            dataIndex: 'favorite',
            layout: '1/3',
            inputType: 'input_number',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '访问数',
            layout: '1/3',
            dataIndex: 'hits',
            inputType: 'input_number',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '创建者',
            dataIndex: ['createUser', 'name'],
            isActive: 0,
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '发布者',
            dataIndex: ['releaseUser', 'name'],
            isActive: 0,
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            isActive: 0,
            layout: '1/3',
            inputType: 'DatePicker',
            // inputProps: { showTime: true },
            width: APP_CONFIG.CELL_WIDTH_LARGE,
        },
        {
            title: '发布时间',
            layout: '1/3',
            dataIndex: 'releaseTime',
            isActive: 0,
            // inputProps: { format: formatDate.format },
            width: APP_CONFIG.CELL_WIDTH_LARGE,
        },
        {
            dataIndex: 'release',
            title: '发布',
            layout: '1/1',
            width: 50,
            isActive: 0,
            fixed: 'right',

            render: (status: any, rowData: any) => {
                return (
                    <ctx.ui.Switch size="small" checked={status} onChange={() => {
                        ctx.request
                            .put('/api/knowledges', ctx.utils.set(rowData, 'release', !status))
                            .then(() => { ctx.props.table_helper.handleSearch() })
                    }} />

                );
            },
        }
    ]
)