import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { request } from '@lm_fe/utils';
import { Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BF_Wrap2 } from './Wrap';
import { IBF_props } from './types';
export * from './utils';
export * from './Wrap';
export * from './types';
interface IHistoryConf {
    url1?: "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
    url2?: "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
}
interface IHistoryItem {
    "columnCode": "nt",
    "columnValue": "20",
    "isNormal": "",
    "isOut": "",
    "reportId": "",
    "history": "/api/prenatalExam/column/history/value?recordId=25&columnCode=nt",
    "report": null
}
export interface IBF_Form_Props extends IBF_props {
    form?: FormInstance
    disabled?: boolean
    fallback_init: () => Promise<any>
    fallback_finish: (v: any) => Promise<void>
    history_args: { relationId: any }
}
export function BF_Form(props: IBF_Form_Props) {
    const { history_args, fallback_finish, fallback_init, disabled } = props
    const [_form] = Form.useForm()
    const history_url = useRef<string>()
    const [_form_first] = Form.useForm()
    const { config, Wrap } = BF_Wrap2(props)

    const [first, setFirst] = useState(false)

    const remote_data = useRef<any>({})
    let form = props.form ?? _form
    async function init() {
        if (!config) return
        const history_conf_url = config?.dept

        if (history_conf_url?.includes('/api')) {

            const history_conf = (await request.get<IHistoryConf>(history_conf_url,)).data ?? {}
            const { url1, url2 } = history_conf
            if (url1?.includes('/api')) {
                history_url.current = url1
                request.get<IHistoryItem[]>(history_url.current, { params: history_args })
                    .then(res => {
                        const data = res.data
                        if (!data) return
                        form.setFieldsValue(data)
                        remote_data.current = data
                    })

            }
            if (url2?.includes('/api')) {
                setFirst(true)
                request.get<IHistoryItem[]>(url2, { params: history_args })
                    .then(res => {
                        const first_data = res.data
                        if (!first_data) return
                        console.log('first', { data: first_data, url2 })
                        _form_first.setFieldsValue(first_data)
                    })
            }


        } else {
            const data = await fallback_init();
            if (!data) return
            remote_data.current = data
            form.setFieldsValue(data)
        }
    }
    async function update(v: any) {
        if (history_url.current) {
            const submitData = { ...remote_data.current, ...v }
            mchcLogger.log('submitData', submitData)
            await request.put(history_url.current, submitData, { successText: '操作成功' })
            // .then(init)
        } else {
            await fallback_finish(v);
        }
        mchcEvent.emit('custom_msg', { type: 'BF_Form', data: config?.title })

    }

    useEffect(() => {

        init()
        return mchcEvent.on_rm('custom_msg', e => {
            if (e.type == 'BF_Form' && e.data === config?.title) {
                init()
            }
        })
    }, [config])

    return (
        <Wrap >
            {
                first ?
                    <Row>
                        <Col span={14}>
                            <FormSectionForm disableAll={disabled} size='small' targetLabelCol={first ? 2 : 2} onFinish={update} form={form} formDescriptions={config?.tableColumns} />
                        </Col>
                        <Col span={10}>
                            <FormSectionForm size='small' targetLabelCol={first ? 2 : 2} disableAll form={_form_first} formDescriptions={config?.tableColumns} />
                        </Col>
                    </Row>
                    : <FormSectionForm disableAll={disabled} size='small' onFinish={update} form={form} formDescriptions={config?.tableColumns} />
            }
        </Wrap>
    )
}