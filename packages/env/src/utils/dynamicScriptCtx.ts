import { safe_evaluate_context, safeGetFromFuncOrData } from "@lm_fe/utils";
import { gen_rt_ctx } from "./runtime_ctx";









export function safe_get_symbol(str: any, props?: any, default_v?: any) {
    const { is_err, data } = safe_evaluate_context(str, () => gen_rt_ctx('instance_ctx', props))
    if (is_err) return default_v
    return data
}

export function safe_get_object_symbol(value: any, props?: any, default_v?: any,) {
    let maybe_fn = safe_get_symbol(value, props, default_v)
    return safeGetFromFuncOrData(maybe_fn, default_v)
}
