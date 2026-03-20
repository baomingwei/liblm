import { MyIcon, useMyEffectSafe } from '@lm_fe/components';
import { mchcDriver, mchcEvent } from "@lm_fe/env";
import { IdNOButton, MyBaseListProps } from '@lm_fe/pages';
import { downloadFile, request } from "@lm_fe/utils";
import { Button, Divider, Form } from "antd";
import React, { useEffect } from "react";
import { queryFormDescriptions } from "./form";
import { tableColumns } from "./table";

export const baseTableConfig: MyBaseListProps = {
    baseTitle: '孕册',
    name: '/admissions',
    tableColumns,
    searchConfig: queryFormDescriptions(),
}
export function useTableConfig(props: any) {
    const { history } = props;
    const [form] = Form.useForm()
    useEffect(() => {
        return mchcEvent.on_rm('my_form', e => {
            if (e.type === 'onSearch' && e.name === "outpatientNO") {

            }
        })
    }, [])
    useEffect(() => {



    }, [])

    useMyEffectSafe(props)(() => {
        return mchcDriver.on_rm('data', e => {

            if (e.type === 'ReadCard') {
                let res = e.data
                form.setFieldsValue({ idNO: res.idNO, name: res.name })
                form.submit()
            }

        })
    }, [])

    // function handleView(rowData: any) {
    //     const { id } = rowData;
    //     // @ts-ignore
    //     history.push(`/prenatal-visit/pregnancy/doctor-end?id=${id}`);
    // };
    // function handleEdit(rowData: any) {
    //     const { id } = rowData;
    //     // @ts-ignore
    //     history.push(`/prenatal-visit/pregnancy/nurse-end?id=${id}`);
    // };



    function handleView(rowData: any) {
        const { id } = rowData;
        history.push(`/deliver-management-v2/admission/deliver-edit?id=${id}`);
    };

    // 调整页面做编辑操作
    function handleEdit(rowData: any) {
        const { id } = rowData;

        history.push(`/deliver-management-v2/admission/edit?id=${id}`);
    };


    async function handleExport(params) {
        const res = (
            await request.get('/api/export/admissions', {
                responseType: 'blob',
                params,
            })
        ).data
        downloadFile(res.data, '导出数据.xls', 'application/vnd.ms-excel');

    };

    function handleDoubleClickRow(record: any) {
        // console.log(record);
        const { id, recordstate } = record;
        // @ts-ignore
        if (recordstate === '1' || recordstate === '6') {
            history.push(`/prenatal-visit/pregnancy/nurse-end?id=${id}`);
        }
        if (recordstate === '0') {
            history.push(`/prenatal-visit/pregnancy/check?id=${id}`);
        }
    };

    function onAdd() {
        // @ts-ignore
        history.push('/deliver-management-v2/admission/add');
    };
    const config: MyBaseListProps = {
        ...baseTableConfig,
        effect_ctx: props,
        searchForm: form,
        handleDoubleClickRow,
        RenderSearchBtns({ handleSearch, getSearchParams }) {
            return <>
                {/* <OkButton btn_text='导出' primary onClick={() => handleExport(getSearchParams())} /> */}
                {/* <OkButton disabled btn_text='读取身份证' /> */}

            </>
        },
        renderBtns: (({ }) => {
            return <IdNOButton />
        }),
        onExport({ getSearchParams }) {
            handleExport(getSearchParams())
        },
        onAdd,
        genColumns({ handleDelete, tableColumns }) {

            return [
                ...tableColumns,
                {
                    align: 'center',
                    title: '操作',
                    fixed: 'right',
                    width: 198,

                    render: (recordstate: any, rowData: any) => {
                        return <>
                            <Button
                                type="link"
                                size="small"
                                icon={<MyIcon value='EyeOutlined' className="global-table-action-icon" />}
                                onClick={() => handleView(rowData)}
                            >
                                查看
                            </Button>
                            <Divider type="vertical" />

                            <Button
                                type="link"
                                size="small"
                                icon={<MyIcon value='EditOutlined' className="global-table-action-icon" />}
                                onClick={() => handleEdit(rowData)}
                            >
                                编辑
                            </Button>
                            {/* <Divider type="vertical" />
                            <Popconfirm
                                title={`确定要删除吗?`}
                                onConfirm={() => handleDelete(rowData)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="link" size="small" icon={<DeleteOutlined className="global-table-action-icon" />}>
                                    删除
                                </Button>
                            </Popconfirm> */}
                        </>
                    },
                },


            ]
        },
    }
    return [
        config
    ] as const
}