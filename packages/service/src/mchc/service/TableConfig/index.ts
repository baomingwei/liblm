import { safe_get_object_symbol, safe_get_symbol } from "@lm_fe/env"
import { ModelService } from "../../../ModelService"
import { IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_Field_Nullable_Arr, SMchc_FormDescriptions } from "../FormDescriptions"
import { set_deps_string, set_fn_string, stringify_bf, stringify_bf_fn, stringify_bf_obj } from "./utils"
export { IMchc_FormDescriptions_Field_Nullable_Arr, stringify_bf_obj }
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
        return stringify_bf_obj(fd_with_safe_fn, example)
    }
    async process_local(config: Partial<IMchc_TableConfig>, props?: any) {

        const _con = { ...config }

        _con.tableColumns = await this.clippy_local(config.tableColumns, true)

        _con.handleBeforePopup = stringify_bf_fn(config.handleBeforePopup,)
        // _con.handleBeforePopup = make_bf_script_field(config.handleBeforePopup,)

        _con.watchScript = stringify_bf_fn(config.watchScript,)

        _con.beforeSubmit = stringify_bf_fn(config.beforeSubmit,)
        _con.renderBtns = stringify_bf_fn(config.renderBtns,)
 

        _con.genColumns = stringify_bf_fn(config.genColumns,)
        _con.initialSearchValue = stringify_bf(config.initialSearchValue,)
        _con.searchParams = stringify_bf(config.searchParams,)
        _con.initialValues = stringify_bf_obj(config.initialValues,)

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

            set_fn_string(cloned, 'render')
            set_fn_string(cloned, 'title')
            set_fn_string(cloned, 'processRemote')
            set_fn_string(cloned, 'processLocal')
            set_fn_string(cloned, 'checkWarn')
            set_fn_string(cloned, 'required')
            // set_fn_string(cloned, 'disabledDeps')
            // set_fn_string(cloned, 'requiredDeps')
            // set_fn_string(cloned, 'showDeps')
            set_deps_string(cloned)
            const props = f?.inputProps || f?.props
            if (props) {
                const cloned_ip = { ...props }
                set_fn_string(cloned_ip, 'DisplayFC_render')
                set_fn_string(cloned_ip, 'component')
                set_fn_string(cloned_ip, 'genRowData')
                set_fn_string(cloned_ip, 'onPatientAutoComplete')
                set_fn_string(cloned_ip, 'onPatientSelect')
                set_fn_string(cloned_ip, 'onClick')
                set_fn_string(cloned_ip, 'on_btn_click')
                set_fn_string(cloned_ip, 'onIdxChange')
                set_fn_string(cloned_ip, 'fetch_options')
                set_fn_string(cloned_ip, 'EditInTable_beforeAdd')
                set_fn_string(cloned_ip, 'on_row_value_change')
                set_fn_string(cloned_ip, 'gen_obj')
                set_fn_string(cloned_ip, 'onFocus')
                set_fn_string(cloned_ip, 'onBlur')

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

