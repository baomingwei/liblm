import { mchcEnv } from "@lm_fe/env"

import { IMchc_FormDescriptions_Field_Nullable, SLocal_History } from "@lm_fe/service"
import { copyText, genHappyPath } from "@lm_fe/utils"
import { Space } from "antd"
import React from "react"
export const config_table_fd = (props: any): IMchc_FormDescriptions_Field_Nullable[] => [
    {
        title: '字段设置',
        containerType: 'tabs',
        hidden: true,
        children: [
            {
                inputType: 'MyMonaco',
                inputProps: { language: 'javascript', height: '74vh' },
                dataIndex: 'tableColumns',
            }
        ]
    },
    {
        title: '通用',
        containerType: 'tabs',

        children: [
            {
                title: 'id',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'id',
                inputProps: { disabled: true }
            },
            {
                title: '名称',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'title',
                width: 320,
                render(value, record, index) {
                    const text = `${value}(${record.id})`
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '模块',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'type',
            },
            {
                title: '接口路径',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'name',
            },
            {
                title: '接口前缀',
                layout: '1/3',
                inputType: 'MyInput',
                dataIndex: 'apiPrefix',
            },
            {
                title: '历史接口',
                layout: '1/3',
                inputType: 'MyInput',
                dataIndex: 'dept',
            },
            {
                title: '标签宽度',
                layout: '1/3',
                inputType: 'InputNumber',
                inputProps: { min: 2, max: 20 },
                dataIndex: 'targetLabelCol',
            },


            {
                title: '表单回选前钩子',

                hidden: true,
                containerType: 'tabs',

                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'handleBeforePopup',
                    }
                ]
            },

            {
                title: '表单联动设置',

                hidden: true,
                containerType: 'tabs',

                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'watchScript',
                    }
                ]
            },

            {
                title: '表单提交前钩子',

                containerType: 'tabs',
                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'beforeSubmit',
                    }
                ]
            },
        ],
    },

    {
        title: '表格地址',
        isActive: 0,
        dataIndex: 'id',
        render(value, record, index) {
            const p = genHappyPath('/config-table/list', [value])
            return <Space>
                <a target="blank" onClick={() => SLocal_History.safe_history_push(p, props)}>
                    打开
                </a>

                <a onClick={() => copyText(p) && mchcEnv.success('复制成功！')}>
                    复制地址
                </a>
            </Space>
        },
    },
    {
        title: '表单地址',
        isActive: 0,
        dataIndex: 'id',
        render(value, record, index) {
            const p = genHappyPath('/config-table/panel', [value], `?id=1`)
            return <Space>
                <a target="blank" onClick={() => SLocal_History.safe_history_push(p, props)}>
                    打开
                </a>

                <a onClick={() => copyText(p) && mchcEnv.success('复制成功！')}>
                    复制地址
                </a>
            </Space>
        },
    },
    {
        title: "表格",
        containerType: 'tabs',
        hidden: true,
        children: [

            {
                title: '显示默认操作列',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showAction',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示添加按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showAdd',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示行打印按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showRowPrintBtn',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示行导出按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showRowExportBtn',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示行删除按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showRowDelBtn',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示行编辑按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showRowEditBtn',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示导出按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showExport',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '可勾选',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needChecked',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '行内编辑',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needEditInTable',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示打印按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showPrint',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '禁用双击编辑',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'disableDoubleClick',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '行标识',
                inputType: 'MyInput',
                layout: '1/4',
                dataIndex: 'rowKey',
                hidden: true,
            },
            // {
            //     title: '行打印接口后缀',
            //     inputType: 'MyInput',
            //     layout: '1/4',
            //     dataIndex: 'rowPrintUrlSuffix',
            //     hidden: true,
            // },

            {
                title: '查询配置',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'searchConfig',
                    }
                ]
            },
            {
                title: '静态查询参数',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'searchParams',
                    }
                ]

            },
            {
                title: '默认查询参数',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'initialSearchValue',
                    }
                ]
            },
            {
                title: '表格字段设置',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'genColumns',
                    }
                ]
            },
            {
                title: '自定义按钮',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '56vh' },
                        dataIndex: 'renderBtns',
                    }
                ]
            },
        ]
    },
    {
        title: "表单",
        containerType: 'tabs',
        hidden: true,

        children: [

            {
                title: '打印',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needPrint',
                hidden: true,
                layout: '1/3',
            },
            {
                title: '同步',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needSync',
                hidden: true,
                layout: '1/3',
            },
            {
                title: '导入',
                inputType: 'MyCheckbox',
                inputProps: {
                    uniqueKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needImport',
                hidden: true,
                layout: '1/3',
            },
            {
                title: '初始值',
                inputType: 'MyMonaco',
                inputProps: { language: 'javascript', height: '70vh' },
                dataIndex: 'initialValues',
                layout: '1/3',
            },
        ]
    },

]