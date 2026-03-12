import { mchcEvent } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from '@lm_fe/service';
import { AnyObject, expect_array } from '@lm_fe/utils';
import { FormInstance, Segmented, Tabs, message } from 'antd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';


import { MyIcon } from '@lm_fe/components';
import { use_provoke } from '@lm_fe/provoke';
import styles from '../../BaseEditPanel/less/base-edit-panel-form.module.less';
import { useReadIdNO } from '../IdNOButton';
import { IFormSectionProps, } from './types';








export function RenderTab(props: { fds: IMchc_FormDescriptions_Field_Nullable[], renderContent(arr?: IMchc_FormDescriptions_Field_Nullable[]): any, form?: FormInstance }) {
    const sys_theme = use_provoke(s => s.sys_theme)
    const { fds, renderContent, form } = props

    const configArr = expect_array(fds)
    const firstTab = configArr[0]
    const FirstTitle = SMchc_FormDescriptions.get_form_item_title_or_Name(firstTab)

    const [activeKey, setActiveKey] = useState(FirstTitle)

    function changeActiveKey(k: string) {
        setActiveKey(k)
        mchcEvent.emit('my_form', {
            type: 'onTabChange',
            activeKey: k,
            oldKey: activeKey,
            form,
        })
    }

    return <Tabs
        size='small'
        tabBarStyle={{ marginBottom: 6 }}
        activeKey={activeKey}
        // tabPosition='right'
        onChange={k => {
            return changeActiveKey(k)


        }}

    >
        {
            configArr.map(_ => {
                const title = SMchc_FormDescriptions.get_form_item_title_or_Name(_)
                const tabConfig = _?.children ?? []


                return <Tabs.TabPane forceRender={!_?.fd_lazy} tabKey={title} key={title} tab={<span style={{ textDecorationLine: _?.remote_filter_key ? 'underline' : 'unset' }}>{title}</span>}>

                    {isEmpty(tabConfig) ? `请配置${title}的 children` : renderContent(tabConfig)}

                </Tabs.TabPane>

            })
        }
    </Tabs >
};
export function RenderSegs(props: { fds: IMchc_FormDescriptions_Field_Nullable[], renderContent(arr?: IMchc_FormDescriptions_Field_Nullable[]): any, form?: FormInstance }) {
    const sys_theme = use_provoke(s => s.sys_theme)
    const { fds, renderContent, form } = props

    const configArr = expect_array(fds)
    const firstTab = configArr[0]
    const FirstTitle = SMchc_FormDescriptions.get_form_item_title_or_Name(firstTab)

    const [activeKey, setActiveKey] = useState(FirstTitle)

    function changeActiveKey(k: string) {
        setActiveKey(k)
        mchcEvent.emit('my_form', {
            type: 'onTabChange',
            activeKey: k,
            oldKey: activeKey,
            form,
        })
    }
    const is全部 = activeKey === '全部'

    return <div style={{
        margin: '6px 0',
        position: 'relative',
        borderRadius: 4,
        border: `1px solid ${sys_theme.colors?.light[0]}`
    }}>

        <Segmented<string>
            size='small'
            style={{ position: 'absolute', left: 24, top: -12 }}
            // block
            value={activeKey}
            options={
                [
                    ...configArr.map(_ => {
                        const title = SMchc_FormDescriptions.get_form_item_title_or_Name(_)
                        return title
                    }),
                    // '全部'
                ]
            }
            onChange={(k) => {
                changeActiveKey(k)
            }}
        />
        <div style={{ padding: 8 }}>
            {
                configArr.map(_ => {
                    const title = SMchc_FormDescriptions.get_form_item_title_or_Name(_)

                    // if (is全部)
                    //     return <RenderSection key={title} renderContent={renderContent} fd={{ ..._, containerType: 'section(default)' }} />

                    const is_show = activeKey === title
                    if (is_show)
                        return <div key={title}>{renderContent(_?.children)}</div>
                    return _?.fd_lazy
                        ? null
                        : <div key={title} hidden={is全部 ? false : true}>{renderContent(_?.children)}</div>

                })
            }
        </div>
    </div>

};



export function RenderSection(props: { fd: IMchc_FormDescriptions_Field_Nullable, renderContent(arr: IMchc_FormDescriptions_Field_Nullable[]): React.JSX.Element, form?: FormInstance }) {
    const { fd, renderContent, } = props
    const sys_theme = use_provoke(s => s.sys_theme)
    if (!fd) return null
    // const bg = '#eee'
    const bg = sys_theme.colors?.light[0]
    const { containerType = 'section(default)', children = [], collapsed } = fd
    if (isEmpty(children)) return null
    const title = SMchc_FormDescriptions.get_form_item_title_or_Name(fd)
    const [hidden, setHidden] = useState(collapsed)

    const node = <div hidden={hidden}>{renderContent(children)}</div>
    if (containerType === 'plain')
        return (
            <>
                {/* {this.renderItem({ ...withTitle, inputType: 'title' })} */}
                <div hidden={!title} style={{ padding: '4px 0', fontWeight: 'bold', fontSize: 20, color: sys_theme.colorPrimary, margin: '6px 0 12px 0', textIndent: 12 }}>
                    {title}:
                </div>
                {node}
            </>
        )


    return title
        ? <div className={classnames(styles['base-edit-panel-form_section'], { [styles['border']]: true })} style={{ border: `1px solid ${bg}`, borderRadius: 4 }} >
            <span className={styles["base-edit-panel-form_section_title"]} style={{ cursor: 'pointer', color: sys_theme.colorPrimary, background: sys_theme.bg_color }} onClick={() => setHidden(!hidden)}>
                {<MyIcon value={hidden ? 'RightOutlined' : 'DownOutlined'} style={{ fontSize: 14, marginRight: 6 }} />}
                <span style={{ userSelect: 'none', }}>{title}</span>
            </span>
            {node}
        </div>
        : node
};




export function use_form_config(props: IFormSectionProps) {
    const { formDescriptions, bf_config, initialValues } = props
    const form = props.form as FormInstance & { setFieldsValue_old: FormInstance['setFieldsValue'] }
    const value_cache = useRef<AnyObject>()

    function assign_cache(value: any) {
        if (!value) return
        if (!value_cache.current) {
            value_cache.current = {}
        }
        Object.assign(value_cache.current, value)
    }
    const is_init = useRef(false)

    const { id_NO_msg } = useReadIdNO()

    const [form_config, setForm_config] = useState<IMchc_FormDescriptions_Field_Nullable[]>()


    if (form) {
        if (!form.setFieldsValue_old) {
            form.setFieldsValue_old = form.setFieldsValue
        }

        form.setFieldsValue = (value: any,) => {
            // mchcLogger.log('setFieldsValue 00', form, value_cache.current, value, form_config)

            if (!form_config) {
                assign_cache(value)
            } else {
                form.setFieldsValue_old?.(value)
            }
        };
    }
    useEffect(() => {
        if (!is_init.current && initialValues) {
            is_init.current = true
            assign_cache(initialValues)

        }
        return () => {

        }
    }, [initialValues])

    useEffect(() => {
        const fd_config = formDescriptions ?? bf_config?.tableColumns
        fd_config && SMchc_FormDescriptions.filter_form_config(fd_config)
            .then(f => {
                setForm_config(f)
                // mchcLogger.log('setFieldsValue 11 0', form, value_cache.current, value_cache)
                setTimeout(() => {

                    if (value_cache.current) {
                        // mchcLogger.log('setFieldsValue 11 1', form, value_cache.current)

                        form?.setFieldsValue(value_cache.current,)
                        value_cache.current = undefined
                    }
                }, 500);

            })

        return () => {

        }
    }, [formDescriptions, bf_config])

    useEffect(() => {

        if (id_NO_msg?.data && form) {
            form.setFieldsValue(id_NO_msg.data)
        }
    }, [id_NO_msg])

    return [form_config]
}

