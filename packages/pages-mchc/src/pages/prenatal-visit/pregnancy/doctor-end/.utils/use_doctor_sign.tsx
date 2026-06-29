import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { AnyObject, isString, object_to_formData, object_to_searchparams, request } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react'

import { use_provoke } from '@lm_fe/provoke';


export function use_doctor_sign(type: 'prenatalVisit' | 'prenatalFVisit' | 'prenatalVisitCH', data_with_sign_status?: { prenatalVisitId?: any, caSignStatus?: boolean }) {

    const { 签名形式, 本地http签名地址, 本地http签名格式, 本地http签名净化, 签名方式 } = use_provoke(c => c.config)
    const is_signed = data_with_sign_status?.caSignStatus
    const is_saved = !!data_with_sign_status?.prenatalVisitId

    function format_ca_req_data(data: AnyObject) {
        if (本地http签名格式 === 'formdata') {
            return object_to_formData(data)
        }
        if (本地http签名格式 === 'searchparams') {
            return object_to_searchparams(data)
        }
        if (本地http签名格式 === 'json_formdata') {
            return JSON.stringify(data)
        }
        return data
    }
    function sign_btn_disabled() {
        if (签名形式 === 'CA签名' && is_signed) {
            return true
        }
        return false
    }
    function sign_btn_text() {
        if (签名形式 === 'CA签名' && is_signed) {
            return '已签名'
        }
        if (签名形式 === 'CA签名并保存' && is_signed) {
            return '签名并保存（已签名）'
        }

        return 签名形式
    }
    function sign_btn_hidden() {
        if (签名形式 === 'CA签名' && !is_saved) {
            return true
        }
        if (!签名形式) {
            return true
        }
        return false
    }
    useEffect(() => {


        return () => {

        }
    }, [])

    async function handle_cs_sign<T>(data: T) {
        if (!data) return Promise.reject()
        if (签名方式 === '本地http签名') {
            return handle_cs_sign_http(data)
        } else {
            return handle_cs_sign_qrcode(data)
        }
    }
    function sign_confirm() {
        if (is_signed) {
            return confirm('该记录已签名，继续操作签名将无效，需重签，是否继续？')
        }
        return true
    }
    async function handle_cs_sign_http<T>(data: T) {
        return new Promise<T>(async (resolve, reject) => {
            try {

                const params_res = await request.post('/api/ca/getParam', { type, data },)
                const params = params_res.data

                const sign_res = await request.post(本地http签名地址!, format_ca_req_data(params), { pure_req: 本地http签名净化 })
                const signData = sign_res.data

                const res = await request.post('/api/ca/sign', { type, data, signData, params },)
                mchcEnv.success('签名成功')
                resolve(res.data)
            } catch (error) {
                mchcEnv.error('签名失败')
                reject(error)
            }

        })
    }
    async function handle_cs_sign_qrcode<T>(newData: T, this_res?: (value: T) => void, this_rej?: (reason?: any) => void,) {
        return new Promise<T>(async (resolve, reject) => {
            const res = await request.post('/api/ca/sign', { type, data: newData })
            const res_data = res.data
            const maybe_base64 = res_data.data
            if (isString(maybe_base64)) {
                mchcModal__.open('box', {
                    title: '请扫码授权',
                    okText: '已扫码授权',
                    onClose(status) {
                        if (status)
                            handle_cs_sign_qrcode(newData, resolve, reject)
                    },
                    modal_data: { content: <img src={`data:image/png;base64,${maybe_base64}`} /> }
                })
            } else {
                mchcEnv.success('操作成功')
                const _resolve = this_res ?? resolve
                _resolve(res_data);

            }
        })
    }

    return {
        签名形式,
        handle_cs_sign,
        sign_btn_disabled: sign_btn_disabled(),
        sign_btn_text: sign_btn_text(),
        sign_btn_hidden: sign_btn_hidden(),
        save_btn_hidden: 签名形式 === 'CA签名并保存',
        sign_confirm
    }

}
