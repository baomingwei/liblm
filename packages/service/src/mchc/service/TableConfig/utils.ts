import { AnyObject, formatDateTime, keys } from "@lm_fe/utils"
import { IMchc_FormDescriptions_Field } from "@noah-libjs/components"
import { get, isFunction, set } from "lodash"


export function tc_process_dep_conf(config: AnyObject,) {

    ['showDeps', 'requiredDeps', 'disabledDeps', 'warning_deps', 'error_deps'].forEach(name => {
        const deps: IMchc_FormDescriptions_Field['showDeps'] = get(config, name)
        if (!deps) return
        if (isFunction(deps)) {
            tc_convert_fn_wrapped_str(config, name)
        } else {
            const ks = keys(deps)
            const cloned_deps = { ...deps }
            ks.forEach(k => {
                const v = cloned_deps[k]
                if (isFunction(v)) {
                    tc_convert_fn_wrapped_str(cloned_deps, k)
                }
            })
            config[name] = cloned_deps
        }
    })

}
export function tc_convert_fn_wrapped_str(config: AnyObject, name: string) {
    const fn = get(config, name)
    const str = wrap_fn_tag(fn)
    if (str) {
        config[name] = str
    }
}
function wrap_fn_tag(fn?: Function) {
    if (isFunction(fn)) {
        return `#${fn.toString()}#`
    }
    return
}
export function tc_stringify_fn_or_obj(fn_or_obj?: Function) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fn_or_obj) return ''


    return isFunction(fn_or_obj) ? tc_stringify_fn(fn_or_obj) : tc_stringify_obj(fn_or_obj)

}
export function tc_stringify_fn(fn?: Function) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fn) return ''


    return format_output_str(JSON.stringify(wrap_fn_tag(fn), null, 4), false, true)

}
export function tc_stringify_obj(fd?: AnyObject | string, example = false,) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fd) return ''


    return format_output_str(JSON.stringify(fd, null, 4), example)
}
function format_output_str(str: string = '', example = false, is_fn = false) {
    // if (!fd) return script_field_template(undefined, false)
    if (!str) return ''
    const conf_str = str
        .replaceAll(/"#(.*?)#"/g, (a, b) => b)
        .replaceAll(`\\"`, `'`)
        .replaceAll("\\r\\n", '\r\n')
        .replaceAll("\\n", '\n')
        .replaceAll("\\\\u", '\\u')

    return gen_script_template(conf_str, example, is_fn)
}
const example_tmp = ''

function gen_script_template(conf_str?: string, example = false, is_fn = false) {
    const ret = is_fn
        ? `
ret = fd ${example ? example_tmp : ''};`
        : `
ret = function (){
    return fd ${example ? example_tmp : ''}
};`
    return `/**
 * @author brainfucker
 * @create date ${formatDateTime()}
 * @AI 优化以下代码格式，仅调整：1. 变量名（符合对应语言命名规范，语义清晰）；2. 合理换行（提升可读性）；3. 一字不差保留原有文件头注释，并为关键逻辑、函数、变量添加简洁易懂的注释；4. 不修改任何代码逻辑、功能，保持代码原有执行效果不变。
 */
var React = ctx.React, utils = ctx.utils, mchcEnv = ctx.mchcEnv, request = ctx.request, goTo = ctx.goTo;

var c = React.createElement;
var formatDate = utils.formatDate, formatDateTime = utils.formatDateTime, getSearchParamsAll = utils.getSearchParamsAll;
ctx.required = true; // 表单必填

var fd = ${conf_str || '[]'}
${ret}`
}


