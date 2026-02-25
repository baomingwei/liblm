import { mchcEnv } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { isString, request } from '@lm_fe/utils';
import React from 'react'

import { use_provoke } from '@lm_fe/provoke';

interface IProps {
    type: 'prenatalVisit' | 'prenatalFVisit' | 'prenatalVisitCH'
}
export function use_doctor_sign(props: IProps) {

    const {
        type
    } = props
    const { 签名方式 } = use_provoke(c => c.config)




    async function handleSign<T>(newData: T, this_res?: (value: T) => void, this_rej?: (reason?: any) => void,) {
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
                            handleSign(newData, resolve, reject)
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
        签名方式,
        handleSign
    }

}
