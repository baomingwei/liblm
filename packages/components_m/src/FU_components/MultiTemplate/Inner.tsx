import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IMultiTemplateProps, IRemoteTemplates_item } from './types';
import { MultiTemplateTemplateGroup } from './Templates';
import { mchcLogger } from '@lm_fe/env';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { assign, get, set } from '@lm_fe/utils';

const SPLIT_KEY = ' / '
export default function MultiTemplateInner(props: IMultiTemplateProps) {
    const { btn_text = '导入', onChange, style, MultiTemplate_type, modal_props = {}, disabled, form, fds = [], ...others } = props

    const active = useRef<IRemoteTemplates_item>()



    const el = useRef<HTMLDivElement>(null)
    return <div ref={el} style={{ display: 'inline-block', position: 'relative', width: '100%' }}>

        <Button
            disabled={disabled}
            onClick={() => {
                window.mchc_modal?.open('box', {
                    width: 1200,
                    title: '模板',
                    getContainer: () => el.current!,
                    okText: '导入',
                    ...modal_props,
                    modal_data: {
                        content: <MultiTemplateTemplateGroup on_select={item => { active.current = item }} {...props} />
                    },
                    onClose(status: Boolean) {
                        if (!status) return
                        const old_data = form?.getFieldsValue() ?? {}
                        const templates_data = active.current ?? {}
                        const new_data = fds.reduce((result, conf) => {
                            const key = SMchc_FormDescriptions.get_form_item_name_raw(conf) as string
                            const old_value = get(old_data, key)
                            const new_value = get(result, key)
                            if (!new_value) return result
                            const mixed = old_value ? `${old_value} ${SPLIT_KEY} ${new_value}` : new_value

                            return set(result, key, mixed)

                        }, templates_data)

                        mchcLogger.log('导入', { status, old_data, templates_data, new_data })

                        form?.setFieldsValue(new_data)
                    }
                })
            }}
            style={{}}
            {...others}
        >{btn_text}</Button>
    </div>
}

