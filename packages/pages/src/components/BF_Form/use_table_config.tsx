import { IMchc_TableConfig, SMchc_TableConfig } from '@lm_fe/service';
import { confirm_operation, expect_array } from '@lm_fe/utils';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { config_table_fd } from '../../form_config/config_table';
import { mchcModal__ } from '../../modals';
import { IBF_props } from './types';


export function use_table_config(setting: IBF_props, props?: any) {
    let { default_conf = {} } = setting
    const default_conf_ref = useRef<Partial<IMchc_TableConfig>>({})

    const [loading, setLoading] = useState(false)

    const [config, setConfig] = useState<IMchc_TableConfig>()
    const config_raw = useRef<Partial<IMchc_TableConfig>>()
    async function _fetch_conf() {
        let __title = default_conf.title
        if (!__title) return
        setLoading(true)
        const res = await SMchc_TableConfig
            .page({ params: { 'title.equals': __title, 'deleteFlag.equals': false }, ignore_usr: true })
            .finally(() => setLoading(false))
        const arr = expect_array(res.data)
        if (arr.length > 1) {
            message.warning('存在多份配置')
        }
        const _config = arr[0]
        if (!_config) {
            setConfig(undefined)
            return
        }
        config_raw.current = { ..._config }
        if (!_config?.tableColumns) return



        // _config.tableColumns = _fd_conf.map(f => f ? formatFormConfig(f, 2) : f);

        setConfig(SMchc_TableConfig.process_remote(_config, props))

    }
    function init_config() {
        edit_config(default_conf_ref.current)
    }
    function recover_config() {
        edit_config({ ...config_raw.current, ...default_conf_ref.current }, true)
    }
    function edit_config(edit_config = config_raw.current, is_recover = false) {
        mchcModal__.open('modal_form', {
            title: is_recover ? '恢复初始化' : '',
            width: '90vw',
            maskClosable: false,
            bodyStyle: { height: '80vh' },
            modal_data: {

                async getInitialData() {
                    return edit_config
                },
                async onSubmit(v) {
                    if (is_recover) {
                        if (!confirm_operation()) {
                            message.warning('输入错误')
                            return 0
                        }
                    }
                    if (v.id) {
                        await SMchc_TableConfig.put(v, { ignore_usr: true })
                    } else {
                        await SMchc_TableConfig.post(v, { ignore_usr: true })
                    }
                    await _fetch_conf()
                    return 1
                },
                formDescriptions: config_table_fd
            }
        })
    }


    useEffect(() => {

        if (default_conf.title
            //  && !config_raw.current
        ) {
            default_conf.handleBeforePopup = default_conf.handleBeforePopup ?? (values => values)
            default_conf.beforeSubmit = default_conf.beforeSubmit ?? ((new_values, old_values) => new_values)
            default_conf.renderBtns = default_conf.renderBtns ?? ((actions) => [])
            default_conf.watchScript = default_conf.watchScript ?? ((changed, values, form) => { })
            default_conf.initialSearchValue = default_conf.initialSearchValue ?? (() => ({}))
            default_conf.searchParams = default_conf.searchParams ?? (() => ({}))
            SMchc_TableConfig.process_local(default_conf)
                .then(r => {

                    default_conf_ref.current = r
                    _fetch_conf()
                })

        }
        return () => { }
    }, [default_conf.title])
    return { config, init_config, edit_config, loading, recover_config }
};