import { safe_get_object_symbol, safe_get_symbol } from "@lm_fe/env"
import { ModelService } from "../../../ModelService"
import { IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_Field_Nullable_Arr, SMchc_FormDescriptions } from "../FormDescriptions"
import { tc_process_dep_conf, tc_convert_fn_wrapped_str, tc_stringify_fn_or_obj, tc_stringify_fn, tc_stringify_obj } from "./utils"
export { IMchc_FormDescriptions_Field_Nullable_Arr, tc_stringify_obj as stringify_bf_obj }
export interface IMchc_TableConfig {
    "id": any,
    "initialSearchValue": any,
    "renderBtns": any,
    "needChecked": any,
    "initialValues": any,
    searchParams: any
    tableColumns: any
    searchConfig: any
    watchScript: any
    "name": any,
    "dept": any,
    "apiPrefix": any,
    "title": any,
    "rowKey": any,
    handleBeforePopup: any
    genColumns: any
    beforeSubmit: any
    targetLabelCol?: number,
    "showAction": any,
    "category": any,
    "needSync": any,
    "needPrint": any,
    "showPrint": any,
    "disableDoubleClick": any,
    "requestBeforeEdit": any,
    "showRowPrintBtn": any,
    "needEditInTable": any,
    "showRowExportBtn": any,
    "showRowDelBtn": any,
    "showRowEditBtn": any,
    "showCopy": any,
    "showAdd": any,
    "showExport": any,
    "deleteFlag": false
    // new
    "renderExtraBtns": any
}

class Mchc_TableConfig_Service extends ModelService<IMchc_TableConfig> {

    process_remote(config: IMchc_TableConfig, props?: any) {

        const _con = { ...config }

        _con.genColumns = safe_get_symbol(config.genColumns, props,)!

        _con.handleBeforePopup = safe_get_symbol(config.handleBeforePopup, props,)!

        _con.watchScript = safe_get_symbol(config.watchScript, props,)!

        _con.beforeSubmit = safe_get_symbol(config.beforeSubmit, props,)!
        _con.renderBtns = safe_get_symbol(config.renderBtns, props,)!

        _con.tableColumns = safe_get_object_symbol(config.tableColumns, props, [])


        _con.initialSearchValue = safe_get_object_symbol(config.initialSearchValue, props, {})


        _con.searchParams = safe_get_object_symbol(config.searchParams, props, {})

        _con.initialValues = safe_get_object_symbol(config.initialValues, props, {})

        _con.searchConfig = safe_get_object_symbol(config.searchConfig, props, [])
        return _con
    }


    async clippy_local(value: any, example = false) {
        const fd_arr = await SMchc_FormDescriptions.extract_form_config(value)
        const fd_with_safe_fn = this.format_fd_arr(fd_arr)
        return tc_stringify_obj(fd_with_safe_fn, example)
    }
    async process_local(config: Partial<IMchc_TableConfig>, props?: any) {

        const _con = { ...config }

        _con.tableColumns = await this.clippy_local(config.tableColumns, true)

        _con.handleBeforePopup = tc_stringify_fn(config.handleBeforePopup,)
        // _con.handleBeforePopup = make_bf_script_field(config.handleBeforePopup,)

        _con.watchScript = tc_stringify_fn(config.watchScript,)

        _con.beforeSubmit = tc_stringify_fn(config.beforeSubmit,)
        _con.renderBtns = tc_stringify_fn(config.renderBtns,)
 

        _con.genColumns = tc_stringify_fn(config.genColumns,)
        _con.initialSearchValue = tc_stringify_fn_or_obj(config.initialSearchValue,)
        _con.searchParams = tc_stringify_fn_or_obj(config.searchParams,)
        _con.initialValues = tc_stringify_obj(config.initialValues,)

        // const searchConfig = await SMchc_FormDescriptions.extract_form_config(config.searchConfig,)
        // _con.searchConfig = stringify_bf_obj(searchConfig,)


        _con.searchConfig = await this.clippy_local(config.searchConfig,)





        return _con
    }
    format_fd_arr(fd: IMchc_FormDescriptions_Field_Nullable_Arr) {

        if (!Array.isArray(fd))
            return []


        return fd.map(f => {
            const cloned = { ...f }

            tc_convert_fn_wrapped_str(cloned, 'render')
            tc_convert_fn_wrapped_str(cloned, 'form_hidden')
            tc_convert_fn_wrapped_str(cloned, 'title')
            tc_convert_fn_wrapped_str(cloned, 'processRemote')
            tc_convert_fn_wrapped_str(cloned, 'processLocal')
            tc_convert_fn_wrapped_str(cloned, 'checkWarn')
            tc_convert_fn_wrapped_str(cloned, 'required')
            // set_fn_string(cloned, 'disabledDeps')
            // set_fn_string(cloned, 'requiredDeps')
            // set_fn_string(cloned, 'showDeps')
            tc_process_dep_conf(cloned)
            const props = f?.inputProps || f?.props
            if (props) {
                const cloned_ip = { ...props }
                tc_convert_fn_wrapped_str(cloned_ip, 'DisplayFC_render')
                tc_convert_fn_wrapped_str(cloned_ip, 'component')
                tc_convert_fn_wrapped_str(cloned_ip, 'genRowData')
                tc_convert_fn_wrapped_str(cloned_ip, 'onPatientAutoComplete')
                tc_convert_fn_wrapped_str(cloned_ip, 'onPatientSelect')
                tc_convert_fn_wrapped_str(cloned_ip, 'onClick')
                tc_convert_fn_wrapped_str(cloned_ip, 'on_btn_click')
                tc_convert_fn_wrapped_str(cloned_ip, 'onIdxChange')
                tc_convert_fn_wrapped_str(cloned_ip, 'fetch_options')
                tc_convert_fn_wrapped_str(cloned_ip, 'EditInTable_beforeAdd')
                tc_convert_fn_wrapped_str(cloned_ip, 'on_row_value_change')
                tc_convert_fn_wrapped_str(cloned_ip, 'gen_obj')
                tc_convert_fn_wrapped_str(cloned_ip, 'onFocus')
                tc_convert_fn_wrapped_str(cloned_ip, 'onBlur')

                if (cloned_ip.fds) {
                    cloned_ip.fds = this.format_fd_arr(cloned_ip.fds)
                }
                if (cloned_ip.formDescriptions) {
                    cloned_ip.formDescriptions = this.format_fd_arr(cloned_ip.formDescriptions)
                }

                cloned.inputProps = cloned_ip
            }
            if (cloned.children) {
                cloned.children = this.format_fd_arr(cloned.children)
            }

            return cloned as IMchc_FormDescriptions_Field_Nullable
        })


    }

}


export const SMchc_TableConfig = new Mchc_TableConfig_Service({
    n: '/tableConfig',
})

