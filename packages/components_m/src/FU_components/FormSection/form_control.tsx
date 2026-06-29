import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { safe_json_parse } from '@lm_fe/utils';
import { FormInstance } from 'antd';
import { isArray, isFunction, isObject, isString } from 'lodash';





export function form_control(f_ins: FormInstance, config: IMchc_FormDescriptions_Field) {
    const dependency = config?.inputProps?.dependency

    if (dependency) {
        return getFormItemControlByDependency(f_ins, config)
    } else {
        return getFormItemControlByNew(f_ins, config)
    }

}

function getFormItemControlByNew(form_ins: FormInstance, config: IMchc_FormDescriptions_Field) {

    const showDeps = config?.showDeps
    const requiredDeps = config?.requiredDeps
    const disabledDeps = config?.disabledDeps
    const warning_deps = config?.warning_deps
    const error_deps = config?.error_deps

    const res = {
        isShow: compute_dep_status(form_ins, showDeps, !showDeps),
        isRequired: compute_dep_status(form_ins, requiredDeps),
        isDisabled: compute_dep_status(form_ins, disabledDeps,),
        is_warning: compute_dep_status(form_ins, warning_deps,),
        is_error: compute_dep_status(form_ins, error_deps,),
    }
    return res
}
function compute_dep_status(form_ins: FormInstance, dep_config: IMchc_FormDescriptions_Field['showDeps'], default_status = false) {
    if (isFunction(dep_config)) {
        return dep_config(form_ins)
    }
    const config_obj = dep_config ?? {}
    const dep_keys = Object.keys(config_obj)

    return dep_keys.reduce((state, k) => state || getDepStatus(form_ins, k, config_obj[k]), default_status)
}
function getFormItemControlByDependency(form_ins: FormInstance, config: IMchc_FormDescriptions_Field) {
    const dependency = config?.inputProps?.dependency

    return {
        isShow: getDepStatus(form_ins, dependency?.show?.key, dependency?.show?.value),
        isDisabled: getDepStatus(form_ins, dependency?.disabled?.key, dependency?.disabled?.value),
        isRequired: getDepStatus(form_ins, dependency?.required?.key, dependency?.required?.value),
        is_warning: false,
        is_error: false
    }
}

function getDepStatus(form_ins: FormInstance, depKey: string | string[] = '', depValue: any[] | ((v: any) => boolean) = []) {

    //key值有.的情况下showKey处理
    if (isString(depKey) && depKey.includes('.')) {
        depKey = depKey.split('.')
    }
    const __showVal = form_ins.getFieldValue(depKey)
    const targetShowVal = getUglyValue(__showVal)
    return chekc_value(__showVal, depValue) ?? chekc_value(targetShowVal, depValue)

}
function chekc_value(target_value: any, dep_values: any[] | ((v: any) => boolean) = []) {


    if (isFunction(dep_values))
        return dep_values(target_value)

    return dep_values.includes(target_value)
}

function getUglyValue(v: any) {
    const __value = safe_json_parse(v, v)

    let checkedValue = __value
    if (isArray(__value)) {
        return getUglyArrValue(__value)
    }
    if (isObject(__value)) {
        // [todo]:如果是多选的情况 如何处理
        return getUglyObjValue(__value)
    }
    return checkedValue
}

function getUglyArrValue(__arr: any) {
    if (!isArray(__arr)) return __arr
    if (__arr.length > 1) {
        return __arr.map(getUglyObjValue).join(',')
    }
    return getUglyObjValue(__arr[0])
}
function getUglyObjValue(__obj: any) {
    return __obj?.value ?? __obj?.key ?? __obj?.checkedValues?.[0]
}







