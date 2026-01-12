import { safe_get_symbol, mchcEvent, mchcLogger } from "@lm_fe/env";
import { config_table_fd, mchcModal__, MyBaseListProps } from "@lm_fe/pages";
import { IMchc_TableConfig, ModelService, SMchc_TableConfig, TIdType } from "@lm_fe/service";
import { get_global_happy_arg, getHappyConfig, request, safeGetFromFuncOrData } from "@lm_fe/utils";
import { useEffect, useRef, useState } from "react";
export type TConfig = Partial<MyBaseListProps> & { watchScript?: string, needSync?: boolean, showPrint?: boolean, needPrint?: boolean }
export interface ICommonProps {
    configId?: TIdType
    id?: any
    history?: any
}
export function getConfigOne(props: ICommonProps) {

    const id = get_global_happy_arg('usr1') ?? props.configId

    return request.get<IMchc_TableConfig>(`/api/tableConfig/${id}`, { showMsg: false }).then(r => {


        return r.data
    })
}
export function useConfigHook(props?: any) {
    const model = useRef<ModelService | null>()
    const [config, setconfig] = useState<Partial<IMchc_TableConfig>>()
    const config_raw = useRef<Partial<IMchc_TableConfig>>()
    const _requesting = useRef(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        _fetch_conf()
    }, [props])

    function _fetch_conf() {
        if (!_requesting.current) {
            _requesting.current = true
            setLoading(true)
            getConfigOne(props)
                .then(c => {
                    config_raw.current = c
                    const config = SMchc_TableConfig.process_remote(c, props)

                    setconfig(config)
                })
                .finally(() => {
                    _requesting.current = false
                    setLoading(false)
                })
        }
    }
    function edit_config(edit_config = config_raw.current) {
        mchcModal__.open('modal_form', {
            width: '90vw',
            maskClosable: false,
            bodyStyle: { height: '80vh' },
            modal_data: {

                async getInitialData() {
                    return edit_config
                },
                async onSubmit(v) {
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
        const watchScript = config?.watchScript
        // const _message = message
        const rm = mchcEvent.on_rm('my_form', safe_get_symbol(watchScript!, props) ?? function (event) {


        })


        model.current = model.current || getM(config)
        return rm
    }, [config])
    return [config, model, edit_config, loading] as const
}
export function getM(config?: Partial<IMchc_TableConfig>) {
    if (!config?.name) return null
    return new ModelService({ n: config.name, needTransferParams: false, apiPrefix: config.apiPrefix })
}
export function getConfigFullUrl(config?: TConfig) {
    if (!config) return ''
    return `${config.apiPrefix}${config.name}`
}