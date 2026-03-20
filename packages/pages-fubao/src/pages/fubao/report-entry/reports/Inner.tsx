import { BF_Wrap2, mchcModal__, MyBaseList } from '@lm_fe/pages'
import { AnyObject, formatDate, getMomentRange, getSearchParamsValue, request } from "@lm_fe/utils"
import { Button, Divider, Form, Space, Tag } from "antd"
import React, { useEffect, useState } from "react"
import { Template } from './Template'
import { IProps, IReportType } from './types'
import { IPatientType } from '../patients/types'
import { LoadingPlaceholder, PanelTitleWrapper } from '@lm_fe/components_m'
import { mchcEnv } from '@lm_fe/env'
export default function ReportEntryInner(props: IProps) {
    const { injected } = props

    const idNO = props.idNO ?? getSearchParamsValue('idNO')

    const conf_fn = () => import('./form_config')

    const [patient, setPatient] = useState<IPatientType>()
    const [form] = Form.useForm()

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '报告录入-报告列表',
            tableColumns: conf_fn,
            searchConfig: [
                // { label: '证件号', name: 'idNO', inputType: 'Input' },
                // { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
            ]
        }
    })
    useEffect(() => {

        request.get<IPatientType[]>('/api/patients', { params: { 'idNO.equals': idNO }, ignore_usr: true })
            .then(res => setPatient(res.data[0]))
        return () => {

        }
    }, [])

    function pop_modal() {
        mchcModal__.pop()
    }
    if (!patient) return <LoadingPlaceholder tip={`正在加载 ${idNO} 的报告...`} />

    function check_row_disabled(rowData?: IReportType) {
        const 已审核 = rowData?.state === 2
        return injected || 已审核
    }
    async function review(rows: IReportType[], cb: () => Promise<void>) {
        // if (confirm(`请确认审核 ${rows.map(_ => `${_.suitName}_${_.examinationDate}`).join('、')}`)) {
        //     await request.put('/api/reports/batch-review', { ids: rows.map(_ => _.id), }, { ignore_usr: true });
        //     cb()
        // }
        await request.put('/api/reports/batch-review', { ids: rows.map(_ => _.id), }, { ignore_usr: true });
        cb()
    }
    async function recycle(rows: IReportType[], cb: () => Promise<void>) {
        // if (confirm(`请确认回收 ${rows.map(_ => `${_.suitName}_${_.examinationDate}`).join('、')}`)) {
        //     await request.put('/api/reports/batch-recycle', { ids: rows.map(_ => _.id), }, { ignore_usr: true });
        //     cb()
        // }
        await request.put('/api/reports/batch-recycle', { ids: rows.map(_ => _.id), }, { ignore_usr: true });
        cb()
    }
    async function print(params: AnyObject) {
        mchcModal__.open('print_modal', { modal_data: { requestData: { url: '/api/printReport', ...patient, ...params } } })
    }
    const node = <Wrap>

        <MyBaseList
            ignore_usr
            // RenderAction={ctx => {
            //     return <Space>
            //         <OkButton onClick={() => show_report(ctx.rowData as IReportType)}>查看</OkButton>
            //     </Space>
            // }}
            name="/api/reports"
            searchParams={idNO ? {
                'patientInformationId.equals': patient.id,
            } : undefined}
            needChecked={!injected}
            useListSourceCount
            initialSearchValue={{
                validateDate: getMomentRange().近一周.map(formatDate)
            }}
            searchConfig={config?.searchConfig}

            showAdd={!injected}
            renderBtns={(ctx) => {
                const selectRows: any[] = ctx.getCheckRows()

                return <Space.Compact>

                    <Button hidden={injected} disabled={!selectRows.length} onClick={() => recycle(selectRows, ctx.handleSearch)}>
                        回收
                    </Button>
                    <Button hidden={injected} disabled={!selectRows.length} onClick={() => review(selectRows, ctx.handleSearch)}>
                        审核
                    </Button>
                    <Button onClick={() => print(ctx.getSearchParams())}>打印</Button>


                </Space.Compact>
            }}
            tableColumns={__DEV__ ? conf_fn : config?.tableColumns}
            RenderAction={ctx => {
                const rowData = ctx.rowData as IReportType
                const row_disabled = check_row_disabled(rowData)
                return <Space>
                    <Button size='small' type='primary' onClick={() => ctx.handleEdit(rowData)} >查看</Button>
                    <Button danger size='small' hidden={row_disabled} onClick={() => ctx.handleDelete(rowData)}>删除</Button>
                </Space>
            }}
            onModalOpen={ctx => {
                const rowData = ctx.rowData as IReportType
                const _id = rowData?.patientInformationId ?? patient.id
                const row_disabled = check_row_disabled(rowData)

                mchcModal__.open('test', {
                    title: '报告查看',
                    width: '66vw',
                    modal_data: { content: <Template disabled={row_disabled} deptLink={patient.deptLink} form={form} data={ctx.rowData as IReportType} /> },
                    centered: false,
                    footer: <Space>
                        <Button onClick={async () => {
                            if (!row_disabled) {
                                await ctx.create_or_update({ ...(ctx.rowData ?? {}), ...form.getFieldsValue(), patientInformationId: _id })
                                await ctx.handleSearch()
                            }
                            pop_modal()
                        }
                        } >确定</Button>
                        <Button onClick={pop_modal}>取消</Button>
                    </Space>
                })
            }}
        />
    </Wrap>
    if (injected) return node
    return <PanelTitleWrapper headerItems={[
        { title: '姓名', value: patient?.name },
        { title: '性别', value: mchcEnv.get_option_label('性别2', patient?.gender) },
        { title: '年龄', value: patient?.age },
        { title: '证件号', value: patient?.idNO },
    ]} >

        {node}
    </PanelTitleWrapper>


}

