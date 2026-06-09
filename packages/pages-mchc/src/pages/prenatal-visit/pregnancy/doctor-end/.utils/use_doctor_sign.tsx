import { mchcEnv } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { isString, request } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react'

import { use_provoke } from '@lm_fe/provoke';

interface IProps {
    type: 'prenatalVisit' | 'prenatalFVisit' | 'prenatalVisitCH'
}
interface IConfig {
    caType: 'qrCode' | 'http'
    preForm?: string
    paramsUrl?: string
    reqUrl?: string
    resUrl?: string
}

// parse string like post:http://abc.com
const allow_method = ['get', 'post', 'put']

function parseReqUrl(str: string): { method: 'get' | 'post' | 'put', url: string } | null {
    if (!str) return null
    if (!allow_method.some(m => str.startsWith(m + ':'))) {
        mchcEnv.error('不合法的url:' + str)
        return null
    }
    const arr = str.split(':')
    return { method: arr[0] as any, url: arr[1] }
}
export function use_doctor_sign(props: IProps) {
    const [ca_conf, set_ca_conf] = useState<IConfig>()
    const {
        type
    } = props
    const { 签名方式 } = use_provoke(c => c.config)

    useEffect(() => {
        request.get<IConfig>('/api/ca/conf').then(res => {
            set_ca_conf(res.data)
        })

        return () => {

        }
    }, [])

    async function handle_cs_sign<T>(data: T) {
        if (ca_conf?.caType === 'qrCode') {
            return handle_cs_sign_qrcode(data)
        } else if (ca_conf?.caType === 'http') {
            return handle_cs_sign_http(data)
        }
    }
    async function handle_cs_sign_http<T>(data: T) {
        try {

            const params_res = await request.post(ca_conf?.paramsUrl!, { type, data },)
            const params = params_res.data


            const sign_res = await request.post(ca_conf?.reqUrl!, params)

            const sign_data = sign_res.data
            const res = await request.post(ca_conf?.resUrl!, { type, data, sign_data })
            mchcEnv.success('操作成功')
            return res.data
        } catch (error) {
            mchcEnv.error('操作失败')
            throw error
        }
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
    // 前端获取签名配置 get /api/ca/conf 返回 { caType:String preForm:String }
    // preForm 返回一个表单名字，如果返回了签名前会弹出一个表单
    // caType 为 'qrCode' 即走目前弹窗扫码的形式
    // catype 为 'http', 表示走本地http签名服务， /api/ca/conf 返回体需同时返回
    //  { paramsUrl:'post:/api/ca/params', reqUrl:'post:http://127.0.0.1:38877/tjca/gmt0020/', resUrl:'post:/api/ca/response' },
    // 我会调用 paramsUrl 并传当前签名的数据，paramsUrl 返回调用本地签名服务的传参，如 	{"func_name": "BHCA_Login",	"param0": 0}
    // 用来调用本地签名服务 reqUrl，本地签名服务返回数据, 我会将签名返回传递给 resUrl











    return {
        签名方式,
        handle_cs_sign
    }

}
