import { MyIcon, MyLazyComponent, OkButton, getBMI, handle_form_error, useMyEffectSafe } from '@lm_fe/components_m'
import {
    IMchc_Doctor_Diagnoses,
    IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_Doctor_RvisitInfoOfOutpatient,
    IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit,
    IMchc_FormDescriptions_Field,
    SLocal_Calculator,
    TIdTypeCompatible,
    process_OutpatientDocument_physicalExam_local,
    process_OutpatientDocument_physicalExam_remote,
} from '@lm_fe/service'
import { copyText, getFutureDate, request } from '@lm_fe/utils'
import { Button, Card, Form, FormInstance, Space, message } from 'antd'
import { size } from 'lodash'
import React, { useEffect, useState } from 'react'
import DiabetesAppointment from '../../../.components/DiabetesAppointment'

import { mchcConfig, mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env'
import { HighRiskTableEntry, mchcModal__ } from '@lm_fe/pages'
import { expect_array } from '@lm_fe/utils'
import classNames from 'classnames'
import FormBlock from './form_config/Form'
import styles from './index.module.less'
import { use_provoke } from '@lm_fe/provoke'
// 弹窗枚举
interface IProps {
    addon_btns?: (data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>) => React.ReactNode
    before_submit?: (
        submit: (values: any) => Promise<void>,
        data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
        form?: FormInstance,
    ) => Promise<void>
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
    formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>
    diagnosesList: IMchc_Doctor_Diagnoses[]
    isAllPregnancies: boolean

    onAddBtnClick(): void

    getLastRecord(): void
    getVisitsData(): Promise<void>

    formChange(b: boolean): void
    handleSubmit(values: any): Promise<void>
}
function FurtherForm(props: IProps) {
    const [disabled_save, set_disabled_save] = useState(false)

    const { getLastRecord } = props
    const { formChange } = props
    const {
        addon_btns,
        before_submit,
        diagnosesList,
        formData,
        visitsData,
        getVisitsData,
        isAllPregnancies,
        headerInfo,
        onAddBtnClick,
        handleSubmit,
    } = props
    const [isShowMenzhen, set_isShowMenzhen] = useState(false)
    const { 签名方式 } = use_provoke(c => c.config)
    const [form] = Form.useForm()

    const form_id = formData?.id
    const preg_id = mchcUtils.single_id(headerInfo)

    // useEffect(() => {
    //   const rm = mchcEvent.on_rm('my_form', e => {
    //     console.log('load', { formData, e })
    //     if (e.type === 'onLoad' && formData) {
    //       formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
    //       form.setFieldsValue(formData)
    //     }
    //   })
    //   return rm
    // }, [formData])
    useEffect(() => {
        if (formData) {
            form.resetFields()
            formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
            let fetusExam = expect_array(formData.fetusExam)
            formData.fetusExam = fetusExam.length ? fetusExam : [{}]

            form.setFieldsValue(formData)
            set_disabled_save(formData.isBanned!)

            // if (mchcConfig.get('医生端_复诊编辑控制')) {

            //   SMchc_Doctor.getVisitEmrEditable(formData.id!)
            //     .then(set_disabled_save)
            //     .catch(() => set_disabled_save(true))
            // }
        }
    }, [formData])

    useMyEffectSafe(props)(() => {
        const rm = mchcEvent.on_rm('my_form', async (e) => {
            // mchcEnv.logger.log('event receive', { e, })
            if (e.type === 'onChange') {
                formChange(true)

                const values = e.values
                const value = e.value
                const key = e.name
                if (key === 'visitDate') {
                    const a = await SLocal_Calculator.calcGesWeek({ date: value, id: preg_id })
                    e.setValue?.('gestationalWeek', a.gestationalWeek)
                }

                if (key === 'appointmentCycle') {
                    e.setValue?.('appointmentDate', getFutureDate(value))
                }

                if (key === 'physicalExam') {
                    const physicalExam = values?.physicalExam
                    let bmi = getBMI(physicalExam?.weight, physicalExam?.height)
                    form.setFieldsValue({ physicalExam: { bmi } })
                }
            }

            if (e.type === 'onFocus') {
                if (e.name === 'gestationalWeek') {
                    mchcModal__.open('modal_form', {
                        width: '20vw',
                        bodyStyle: { height: '20vh' },

                        modal_data: {
                            async onSubmit(v) {
                                const values = form.getFieldsValue()
                                const visitDate = values.visitDate
                                const old_pre = values.prescription ?? ''

                                const params = { sureEdd: v.edd, date: visitDate, id: preg_id }
                                const { gestationalWeek } = await SLocal_Calculator.calcGesWeek(params)
                                mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: preg_id })
                                let prescription = `${old_pre} ${old_pre ? '/' : ''} 预产期B超修订为 ${v.edd}`
                                form.setFieldsValue({ prescription, gestationalWeek })
                                return 1
                            },
                            async getInitialData() {
                                return headerInfo
                            },
                            formDescriptions: [{ label: '预产期-B超', name: 'edd', inputType: 'DatePicker' }],
                        },
                    })
                }
            }
        })
        return rm
    }, [])

    function setItemValue(val: string, key: string) { }

    function get_form_data() {


        return form
            .validateFields()
            .then((values) => {
                values.physicalExam = process_OutpatientDocument_physicalExam_local(values.physicalExam)
                return values as Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>
            })
            .catch((error) => {
                const first = handle_form_error(error)
                if (first?.text) mchcEnv.warning(first.text)
                return null
            })
    }
    async function on_submit() {
        const data = await get_form_data()
        if (!data) return
        if (before_submit) {
            return before_submit(handleSubmit, formData, form)
        }

        return handleSubmit(data)
    }

    function closeModal(type: 'isShowMenzhen' | '', items?: any, key?: any) {
        if (size(items) > 0) setItemValue(items, key)
        if (type === 'isShowMenzhen') {
            set_isShowMenzhen(false)
        }
    }

    function showpdf() {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    url: '/api/pdf-preview',
                    resource: 'prenatalVisit1',
                    id: form_id,
                    template: '',
                    version: '',
                    note: '',
                },
            },
        })
    }
    function initial_preview() {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    url: '/api/pdf-preview',
                    resource: 'prenatalVisit2',
                    id: mchcUtils.single_id(),
                    template: '',
                    version: '',
                    note: '',
                },
            },
        })
    }

    function nfyy_sign() {
        request
            .get('/api/doctor/updateRvisitRecordOfDoctorSign', { params: { id: form_id }, successText: '签名成功' })
            .then(getVisitsData)
    }
    async function sign() {
        const data = await get_form_data()
        const res = await request.post('/api/ca/sign', { type: 'prenatalVisit', data })
    }
    function copy() {
        if (mchcEnv.in(['南医附属'])) {
            request
                .get('/api/doctor/getRvisitRecordCopied', { params: { id: form_id }, successText: '复制成功' })
                .then((r) => {
                    copyText(r.data)
                })
        } else {
            message.warning('暂未开发该功能，敬请期待')
        }
    }

    async function del_visit(id?: TIdTypeCompatible) {
        if (!id) return
        const ok = confirm('确定删除吗？')
        if (ok) {
            await request.delete(`/api/prenatal-visits/${id}`, { successText: '操作成功' })
            getVisitsData()
        }
    }

    const saveBtnTxt = disabled_save ? '无权限保存' : '保存'
    return (
        <Card
            title={form_id ? '编辑产检记录' : '本次产检信息'}
            size="small"
            styles={{ body: { padding: 0, height: 'calc(100% - 37px)', overflowY: 'auto' } }}
            style={{ overflowY: 'auto' }}
            extra={
                <span id="extra" style={{ display: 'inline-block', minWidth: 75, height: 24, marginLeft: 98 }}>
                    {form_id ? (
                        <>
                            <Button
                                icon={<MyIcon value="PlusOutlined" />}
                                type="primary"
                                size="small"
                                onClick={() => {
                                    form.resetFields()
                                    onAddBtnClick()
                                }}
                                style={{ marginRight: 36 }}
                            >
                                新增产检记录
                            </Button>
                        </>
                    ) : null}
                    <Button
                        icon={<MyIcon value="SyncOutlined" />}
                        type="primary"
                        size="small"
                        onClick={getLastRecord}
                        style={{ marginRight: 36 }}
                    >
                        同步上一次记录
                    </Button>
                </span>
            }
        >
            <MyLazyComponent size="middle">
                <FormBlock
                    disableAll={disabled_save}
                    form={form}
                    diagnosesList={diagnosesList ?? []}
                    headerInfo={headerInfo}
                />

                <HighRiskTableEntry headerInfo={headerInfo} data={visitsData} style={{ marginRight: 96 }} />
                {!isAllPregnancies && (
                    <Space.Compact
                        className={classNames(
                            styles['return-btns'],
                            mchcConfig.get('医生端_复诊按钮浮动') ? styles['fixed'] : null,
                        )}
                    >
                        {addon_btns?.(formData)}
                        <OkButton primary danger hidden={!form_id} onClick={() => del_visit(form_id)}>
                            删除
                        </OkButton>
                        <OkButton hidden={!mchcEnv.is('广州市八')} onClick={initial_preview}>
                            首诊预览
                        </OkButton>
                        <OkButton hidden={!form_id} onClick={showpdf}>
                            打印
                        </OkButton>
                        <OkButton hidden={(!form_id && 签名方式 === 'CA签名') || !签名方式} primary disabled={disabled_save} onClick={sign}>
                            {签名方式}
                        </OkButton>
                        <OkButton hidden={!mchcEnv.is('南医附属') || !form_id} onClick={nfyy_sign}>
                            签名
                        </OkButton>
                        <OkButton hidden={!mchcEnv.is('南医附属') || !form_id} onClick={copy}>
                            复制
                        </OkButton>
                        <OkButton hidden={签名方式 === 'CA签名并保存'} primary disabled={disabled_save} onClick={on_submit}>
                            {saveBtnTxt}
                        </OkButton>
                    </Space.Compact>
                )}
                {isShowMenzhen && <DiabetesAppointment isShowMenzhen={isShowMenzhen} closeModal={closeModal} />}
            </MyLazyComponent>
        </Card>
    )
}
export default FurtherForm
