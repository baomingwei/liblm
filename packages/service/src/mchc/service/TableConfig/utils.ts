import { AnyObject, formatDateTime, keys } from "@lm_fe/utils"
import { IMchc_FormDescriptions_Field } from "@noah-libjs/components"
import { get, isFunction, set } from "lodash"


export function set_deps_string(config: AnyObject,) {

    ['showDeps', 'requiredDeps', 'disabledDeps', 'warning_deps', 'error_deps'].forEach(name => {
        const deps: IMchc_FormDescriptions_Field['showDeps'] = get(config, name)
        if (!deps) return
        if (isFunction(deps)) {
            set_fn_string(config, name)
        } else {
            const ks = keys(deps)
            const cloned_deps = { ...deps }
            ks.forEach(k => {
                const v = cloned_deps[k]
                if (isFunction(v)) {
                    set_fn_string(cloned_deps, k)
                }
            })
            config[name] = cloned_deps
        }
    })

}
export function set_fn_string(config: AnyObject, name: string) {
    const fn = get(config, name)
    const str = make_fn_tag(fn)
    if (str) {
        config[name] = str
    }
}
function make_fn_tag(fn?: Function) {
    if (isFunction(fn)) {
        return `#${fn.toString()}#`
    }
    return
}
export function stringify_bf(fn_or_obj?: Function) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fn_or_obj) return ''


    return isFunction(fn_or_obj) ? stringify_bf_fn(fn_or_obj) : stringify_bf_obj(fn_or_obj)

}
export function stringify_bf_fn(fn?: Function) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fn) return ''


    return make_bf_string(JSON.stringify(make_fn_tag(fn), null, 4), false, true)

}
export function stringify_bf_obj(fd?: AnyObject | string, example = false,) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fd) return ''


    return make_bf_string(JSON.stringify(fd, null, 4), example)
}
export function make_bf_string(str: string = '', example = false, is_fn = false) {
    // if (!fd) return script_field_template(undefined, false)
    if (!str) return ''
    const conf_str = str
        .replaceAll(/"#(.*?)#"/g, (a, b) => b)
        .replaceAll(`\\"`, `'`)
        .replaceAll("\\r\\n", '\r\n')
        .replaceAll("\\n", '\n')
        .replaceAll("\\\\u", '\\u')

    return bf_template(conf_str, example, is_fn)
}
const example_tmp = ''
// const example_tmp = `||
// // 下面是一个示例
// // 常用组件: MC(单选、多选, options, marshal, type), MS(下拉 options, marshal, type), MA(下拉输入 options), 
// // 常用组件: Input(输入框, 数字 {type:number} ), DatePicker(时间日期), MyEditTable(表格), ArrayPanel(胎儿)
//     [
//         {
//             "label": "示例标题",
//             "name": "height",
//             "inputType": "MA", // 组件类型 MC 勾选框 MS 下拉 MA 可选择输入(inputProps配置memorieskey 可升级为记忆组件)
//             "width": 120, // 表格所占宽度
//             "layout": "2/3", // 表单布局
//             // hidden: true, // 表格隐藏
//             // isActive: false, // 表单显示
//             inputProps: { options: '红色,白色i,紫色i', marshal:1, type:'multiple' }, // options 选项(后缀i代表输入框) marshal 0基本值 1序列化对象 2对象 type 配置多选
//             processRemote: function(v, form){return v || 'default'}, // 空数据显示默认值
//             processLocal: function(v, form){  // bmi 联动示例，假设当前字段为 height，v 为 height 的值
//                 if (form) {
//                     var values = form.getFieldsValue() // 获取整体表单值
//                     var weight = ctx.utils.get(values, 'physicalExamination.weight') // 从取整体表单值获取 weight
//                     var bmi = ctx.utils.calc_bmi(weight, v) // 参数 1 为体重，参数 2 为身高
//                     var new_values = ctx.utils.set({}, 'physicalExamination.bmi', bmi) // 新的表单值
//                     form.setFieldsValue(new_values)
//                 }
//             }, 
//             processLocal(v, form) { // bmi 联动示例，假设当前字段为 idNO
//                 if (form) {
//                     var value = ctx.utils.trim(v) // 去掉空格
//                     var len = ctx.utils.size(value) // 用户输入的长度
//                     var values = form.getFieldsValue() // 获取整体表单值
//                     var idType = ctx.utils.get(values, 'BasicInfo.idType') // 获取证件类型
//                     // 证件类型为身份证，输入长度为 18 才计算
//                     if (idType === 1 && len === 18) {
//                         var id_info = ctx.utils.checkIdNo_new(value) // 通过身份证计算

//                         // 说明身份证正确
//                         if (id_info) {
//                             // 设置对应的字段
//                             var baseInfo = {
//                                 dob: id_info.birth,
//                                 nationality: id_info.nationality,
//                                 nativeplace: id_info.province,
//                                 age: id_info.age,
//                             }
//                             var new_values = ctx.utils.set({}, 'BasicInfo', baseInfo) // 新的表单值
//                             form.setFieldsValue(new_values);
//                         } else {
//                             ctx.mchcEnv.error('请输入符合规范的身份证号码！');
//                         }
//                     }

//                 }
//             },
//             checkWarn: function (v) { return v > 5 }, // 配置表单警告
//             render: function (a, row) { // 表格自定义渲染, a 当前行字段值, row 当前行数据
//                 if (a == '阳性')
//                     return c('span', { style: { color: 'red' }, }, a)
//                 return ( a + 'id:' + row.id ) || '默认值' // 表格默认值
//             }
//         }
//     ]`
function bf_template(conf_str?: string, example = false, is_fn = false) {
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


