import { mchcEnv } from "@lm_fe/env"

import { IMchc_FormDescriptions_Field_Nullable, SLocal_History } from "@lm_fe/service"
import { copyText, genHappyPath } from "@lm_fe/utils"
import { Space } from "antd"
import React from "react"
const options = {
    uniqueKey: '否是',
    marshal: 0 as const,
}
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
                width: 50,
                inputProps: { disabled: true }
            },
            {
                title: '名称',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'title',
                width: 380,
                // render(value, record, index) {
                //     const text = `${value}(${record.id})`
                //     return <span title={text}>{text}</span>
                // },
            },
            {
                title: '模块',
                inputType: 'MyInput',
                layout: '1/3',
                hidden: true,
                dataIndex: 'type',
            },
            {
                title: '接口路径',
                inputType: 'MyInput',
                layout: '1/3',
                width: 240,

                dataIndex: 'name',
            },
            {
                title: '接口前缀',
                layout: '1/3',
                inputType: 'MyInput',
                hidden: true,
                dataIndex: 'apiPrefix',
            },
            {
                title: '历史接口',
                layout: '1/3',
                inputType: 'MyInput',
                hidden: true,
                dataIndex: 'dept',
            },
            {
                title: '标签宽度',
                layout: '1/3',
                hidden: true,
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
                title: '表格行为',
                containerType: 'segs',
                hidden: true,
                children: [
                    {
                        title: '显示默认操作列',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showAction',
                        layout: '1/4',
                    },
                    {
                        title: '显示添加按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showAdd',
                        layout: '1/4',
                    },
                    {
                        title: '显示行打印按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showRowPrintBtn',
                        layout: '1/4',
                    },
                    {
                        title: '显示行导出按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showRowExportBtn',
                        layout: '1/4',
                    },
                    {
                        title: '显示行删除按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showRowDelBtn',
                        layout: '1/4',
                    },
                    {
                        title: '显示行编辑按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showRowEditBtn',
                        layout: '1/4',
                    },
                    {
                        title: '显示导出按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showExport',
                        layout: '1/4',
                    },
                    {
                        title: '可勾选',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'needChecked',
                        layout: '1/4',
                    },
                    {
                        title: '行内编辑',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'needEditInTable',
                        layout: '1/4',
                    },
                    {
                        title: '显示打印按钮',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'showPrint',
                        layout: '1/4',
                    },
                    {
                        title: '禁用双击编辑',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'disableDoubleClick',
                        layout: '1/4',
                    },
                    {
                        title: '弹窗编辑时请求数据',
                        inputType: 'MyCheckbox',
                        inputProps: options,
                        dataIndex: 'requestBeforeEdit',
                        layout: '1/4',
                    },
                    {
                        title: '行标识',
                        inputType: 'MyInput',
                        layout: '1/4',
                        dataIndex: 'rowKey',
                    },
                    // {
                    //     title: '行打印接口后缀',
                    //     inputType: 'MyInput',
                    //     layout: '1/4',
                    //     dataIndex: 'rowPrintUrlSuffix',
                    //     hidden: true,
                    // },

                ]
            },
            {
                title: '查询配置',
                containerType: 'segs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '66vh' },
                        dataIndex: 'searchConfig',
                    }
                ]
            },
            {
                title: '静态查询参数',
                containerType: 'segs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '66vh' },
                        dataIndex: 'searchParams',
                    }
                ]

            },
            {
                title: '默认查询参数',
                containerType: 'segs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '66vh' },
                        dataIndex: 'initialSearchValue',
                    }
                ]
            },
            // {
            //     title: '表格字段设置',
            //     containerType: 'tabs',

            //     hidden: true,
            //     children: [
            //         {
            //             inputType: 'MyMonaco',
            //             inputProps: { language: 'javascript', height: '66vh' },
            //             dataIndex: 'genColumns',
            //         }
            //     ]
            // },
            {
                title: '自定义按钮',
                containerType: 'segs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '66vh' },
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