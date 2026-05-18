// export * from './dynamicScriptCtx'

import { mchcEnv } from "@lm_fe/env";
import { SLocal_Calculator, SLocal_History } from "@lm_fe/service";
import { AnyObject, calc_edd_by_IVF, debounce, getSearchParamsAll, ICommonOption, request, safe_json_parse_arr } from "@lm_fe/utils";
import { message } from "antd";
import { get, isString, keys } from "lodash";
import { mchcModal__ } from "src/modals";
export * from './helper'
export function safe_navigate(where: string | URL, props?: AnyObject, params?: AnyObject, replace = false) {
    const _url = isString(where) ? where : `${where.pathname}${where.search}`
    console.log('ctx safe_navigate', { url_conf: _url, props, params })

    if (_url.includes('://')) {
        mchcEnv.open(_url)
        return
    }
    if (mchcEnv.is_fullscreen)
        return


    if (props?.is_modal) {
        mchcModal__.open('modal_page', {
            modal_data: { route_conf: { url: _url, params } }
        })
        return
    }
    if (location.pathname == _url) {
        message.info('已在当前页面')
        return
    }
    return replace
        ? SLocal_History.safe_history_replace(_url, props)
        : SLocal_History.safe_history_push(_url, props);
}


window.safe_navigate = safe_navigate