import { AnyObject, get, IRequest_AxiosRequestConfig, isObjectLike, isString, request } from "@lm_fe/utils";
import { Button, ButtonProps, Space, Switch, QRCode, Tag, Table } from "antd";
import React, { MouseEventHandler } from 'react';
import { mchcEnv } from "../env/MchcEnv";
import { mchcEvent } from "../event";
import { mchcUtils } from "../utils/mchcUtils";
import { getGlobalHistory } from "./state";


function Array_(arr: any[], linker: string | false = '/', value_path?: string,) {
    if (!arr) return null
    if (!Array.isArray(arr)) return <span>非数组：{JSON.stringify(arr)}</span>
    const _arr = arr
        .map(_ => isObjectLike(_) ? (value_path ? get(_, value_path) : '{}') : _)
        .map(_ => _ || '-')
    if (!linker) return <div style={{ whiteSpace: 'normal' }}>{_arr.map(i => <Tag>{i}</Tag>)}</div>
    let _linker = isString(linker) ? linker : '/'
    return <span>{_arr.join(_linker)}</span>
}
function Color_(content: number | string | boolean, is_red = false, color = 'red') {
    return <span style={{ color: is_red ? color : 'unset' }}>{content ?? ''}</span>
}
function render_btn(text: any, onClick: MouseEventHandler<HTMLElement>, others: ButtonProps = {}) {
    return <Button {...others} onClick={onClick}>{text}</Button>
}
//@ts-ignore
const const_ctx: IRTCtx = {
    required: true,
    request,
    mchcEnv,
    mchcEvent,
    React,
    utils: mchcUtils,
    ui: { Button, QRCode, Space, Tag, Switch, render_arr: Array_, render_color: Color_, Table, render_btn },
    modal() {
        if (!window.mchc_modal) mchcEnv.error('mchc_modal 不存在')
        return window.mchc_modal
    },
    goTo: function (url) {
        throw new Error("Function not implemented.");
    },
    safeTo: function (url_conf, params) {
        throw new Error("Function not implemented.");
    },
    print: function (url_conf): void {
        throw new Error("Function not implemented.");
    },
}
function gen_rt_ctx_helper(g: (p: IRTCtx) => IRTCtx) {
    return g(const_ctx)
}
export interface IRTCtx {
    type?: string,
    // 避免空判断生成冗余代码
    props: {
        table_helper: {
            bf_conf: () => { tableColumns: any[] }
            createOrUpdate: (submitData: AnyObject) => Promise<any>
            handleView: (rowData: AnyObject) => void
            handleDelete: (rowData: AnyObject) => Promise<void>
            handleEdit: (rowData: AnyObject) => Promise<void>
            handleSearch: (__params?: AnyObject) => Promise<void>
            getCheckRows(): AnyObject[]
            getSearchParams: (isFuck?: boolean) => AnyObject
        },
        table_preset: { [x: string]: any, name: string, tableColumns: any }
        [x: string]: any
    },
    required: boolean,
    request: typeof request
    mchcEnv: typeof mchcEnv
    mchcEvent: typeof mchcEvent
    React: typeof React
    goTo(url: string): void
    print(requestConfig: IRequest_AxiosRequestConfig): void
    modal(): any
    safeTo(url_conf: string, params?: AnyObject): void
    ui: { QRCode: typeof QRCode, Table: typeof Table, Button: typeof Button, Space: typeof Space, Tag: typeof Tag, Switch: typeof Switch, render_arr: typeof Array_, render_color: typeof Color_, render_btn: typeof render_btn },
    utils: typeof mchcUtils

}

export function gen_rt_ctx(type: string, ctx_props?: any) {
    return gen_rt_ctx_helper((ctx) => {
        return {
            ...ctx,
            type,
            utils: mchcUtils,
            mchcEnv: window.mchcEnv,
            props: ctx_props,
            print(requestConfig) {
                if (!window.mchc_modal) {
                    console.warn('找不到全局模态窗')
                    return
                }
                window.mchc_modal.open('print_modal', {
                    modal_data: {
                        requestConfig,
                    }
                })
            },
            safeTo(url_conf, params) {
                if (!window.safe_navigate) {
                    console.warn('找不到全局跳转函数')
                    return
                }
                window.safe_navigate(url_conf, ctx_props, params)
            },
            goTo(url) {
                const history = getGlobalHistory()

                const isSp = mchcEnv.isSp
                if (isSp) {
                    const isIncludeMask = url?.includes?.('?')
                    const _url = isIncludeMask ? `${url}&sp=1` : `${url}?sp=1`

                    window.open(_url)
                } else {
                    window.mchc_modal?.destroyAll?.()
                    return history.push(url)
                }

            },
        }
    })
}
export const rt_ctx: IRTCtx = gen_rt_ctx('global_ctx', { global_ctx: true })
