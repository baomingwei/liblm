import { useMyEffectSafe } from '@lm_fe/components';
import { mchcDriver, mchcEvent } from "@lm_fe/env";
import { IdNOButton, mchcModal__, MyBaseListProps, QuickDocButton, safe_navigate } from '@lm_fe/pages';
import { IMchc_Pregnancy } from "@lm_fe/service";
import { downloadFile, request } from "@lm_fe/utils";
import { Button, Form, Popconfirm, Space } from "antd";
import { get } from "lodash";
import React, { useEffect } from "react";
import PrenatalModal from "../components/prenatal-modal/prenatal-modal";


export function useTableConfig(props: any) {
    const { is_modal } = props;

    const [form] = Form.useForm()
    useEffect(() => {
        return mchcEvent.on_rm('my_form', e => {
            if (e.type === 'onSearch' && e.name === "outpatientNO") {
                const pregnancy: IMchc_Pregnancy = e.value?.data
                if (!pregnancy) return
                const isUn = pregnancy.recordstate === '0'
                isUn ? handleCheck(pregnancy) : handleEdit(pregnancy)
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
    function handleCheck(rowData: any) {
        const { id } = rowData;
        // @ts-ignore
        // history.push(`/prenatal-visit/pregnancy/check?id=${id}`);

        safe_navigate(`/prenatal-visit/pregnancy/check?id=${id}`, props, { id })
    }
    function handleView(rowData: any) {
        const { id } = rowData;
        // @ts-ignore
        // history.push(`/prenatal-visit/pregnancy/doctor-end?id=${id}`);
        safe_navigate(`/prenatal-visit/pregnancy/doctor-end?id=${id}`, props, { id });
    };
    function handleEdit(rowData: any) {
        const { id } = rowData;
        // @ts-ignore
        // history.push(`/prenatal-visit/pregnancy/nurse-end?id=${id}`);
        safe_navigate(`/prenatal-visit/pregnancy/nurse-end?id=${id}`, props, { id });

    };
    function handlePrenatal(rowData: any) {
        mchcModal__.open('test', {
            title: null,
            closeIcon: null,
            styles: {
                header: { width: 0, height: 0 },

            },
            modal_data: {
                content: <PrenatalModal
                    selectedRowData={rowData}
                    {...props}
                    onClose={() => mchcModal__.pop()}
                    id={get(rowData, `id`)}
                />
            }
        })
    }
    async function handleExport(params) {
        const res = (
            await request.get('/api/export/pregnancies', {
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
            // history.push(`/prenatal-visit/pregnancy/nurse-end?id=${id}`);
            safe_navigate(`/prenatal-visit/pregnancy/nurse-end?id=${id}`, props, { id });

        }
        if (recordstate === '0') {
            // history.push(`/prenatal-visit/pregnancy/check?id=${id}`);
            safe_navigate(`/prenatal-visit/pregnancy/check?id=${id}`, props, { id });
        }
    };

    function onAdd() {
        // @ts-ignore
        // history.push('/prenatal-visit/pregnancy/add');
        safe_navigate('/prenatal-visit/pregnancy/add', props);
    };
    const config: MyBaseListProps = {
        effect_ctx: props,
        name: '/pregnancies',
        baseTitle: '孕册',

        searchForm: form,
        handleDoubleClickRow,
        RenderSearchBtns({ handleSearch, getSearchParams }) {
            return <>

                {/* <OkButton disabled btn_text='读取身份证' /> */}

            </>
        },
        renderBtns: (({ }) => {
            return <>
                <IdNOButton />
                <QuickDocButton type='default' page_type='非单页' />
            </>
        }),
        // onExport({ getSearchParams }) {
        //     handleExport(getSearchParams())
        // },
        onAdd,
        RenderAction: ({ rowData, handleDelete }) => {
            return (
                <Space>
                    {!!rowData.recordstate && rowData.recordstate !== '0' ? (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handlePrenatal(rowData)}
                        >
                            产检本
                        </Button>
                    ) : (

                        <Button title='审核通过后可查看' type="link" size="small" disabled={true}>
                            产检本
                        </Button>
                    )}

                    {!!rowData.recordstate && rowData.recordstate !== '0' ? (
                        <Button
                            type="link"
                            size="small"
                            // icon={<EyeOutlined className="global-table-action-icon" />}
                            onClick={() => handleView(rowData)}
                        >
                            查看
                        </Button>
                    ) : (
                        <Popconfirm
                            placement="topRight"
                            // getPopupContainer={(triggerNode) => triggerNode?.parentNode?.parentNode?.parentNode}
                            title={`建档信息尚未审核，是否继续接诊?`}
                            onConfirm={() => handleView(rowData)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" size="small" /* icon={<EyeOutlined className="global-table-action-icon" />} */>
                                查看
                            </Button>
                        </Popconfirm>
                    )}

                    <Popconfirm
                        placement="topRight"
                        // getPopupContainer={(triggerNode) => triggerNode?.parentNode?.parentNode?.parentNode}
                        title={`确定要删除吗?`}
                        onConfirm={() => handleDelete(rowData)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" size="small"
                        // icon={<DeleteOutlined className="global-table-action-icon" />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            );
        },

    }
    return [
        config
    ] as const
}