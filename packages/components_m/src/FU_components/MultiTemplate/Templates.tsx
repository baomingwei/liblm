import { MyIcon } from '@lm_fe/components';
import { mchcEnv } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { isEmpty, request } from '@lm_fe/utils';
import { Button, Empty, Form, Input, Space, Tabs } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { MyFormSectionForm } from '../FormSection/FormSectionForm';
import styles from './index.module.less';
import { IMultiTemplateProps, IMultiTemplateType, IRemoteTemplates, IRemoteTemplates_item } from './types';
interface IExtraProps extends IMultiTemplateProps { on_select(item?: IRemoteTemplates_item): void, maintain_mode?: boolean }

export function MultiTemplateTemplateGroup(props: IExtraProps) {
    const { MultiTemplate_type = [] } = props


    return <div className={styles.container}>
        <Tabs
            className={styles.tabs}
            items={MultiTemplate_type.map(_ => ({
                label: _.label,
                key: _.label,
                children: <ActiveTemplates parent_props={props} item={_} />
            }))}
        />
    </div>
}

function ActiveTemplates(props: { item: IMultiTemplateType, parent_props: IExtraProps }) {
    const { item, parent_props } = props
    const { url = '/api/multiTemplate', maintain_mode, fds = [], on_select } = parent_props
    const { sys_theme } = use_provoke()
    const [templates, set_templates] = useState<IRemoteTemplates>()
    const [active, set_active] = useState<IRemoteTemplates_item>()
    const [title_to_add, set_title_to_add] = useState('')
    // const [maintain_mode, set_maintain_mode] = useState(false)
    const [form] = Form.useForm()
    const el = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch_data()
    }, [item])

    useEffect(() => {
        form.resetFields()
        form.setFieldsValue(active)
        on_select(active)
    }, [active])

    function fetch_data() {
        if (item) {
            request
                // .get<IRemoteTemplates[]>(url, { params: { 'type.equals': item?.params?.type } })
                .get<IRemoteTemplates[]>(url, { params: item?.params })
                .then(res => {
                    const res_data = res.data[0]
                    set_templates(res_data)
                    set_active(res_data?.data?.[0])
                })
        }
    }

    function op_init() {
        request
            .post<IRemoteTemplates>(url, { ...item.params, data: [] }, { successText: '操作成功' })
            .then(res => set_templates(res.data))
    }

    function op_add() {
        if (!templates || !title_to_add.trim()) return
        if (templates.data.some(_ => _.title === title_to_add)) {
            mchcEnv.warning('模板重复')
            return
        }
        request
            .put<IRemoteTemplates>(url, { ...templates, data: [...templates.data, { title: title_to_add }] }, { successText: '操作成功' })
            .then(res => {
                set_templates(res.data)
                set_title_to_add('')
            })
    }

    function op_edit() {
        if (!active || !templates) return
        const form_data = form.getFieldsValue()
        const old = templates.data.find(_ => _.title === active.title) ?? {}
        Object.assign(old, form_data)
        request
            .put<IRemoteTemplates>(url, templates, { successText: '操作成功' })
            .then(res => {
                set_templates(res.data)
            })
    }
    function op_remove(item: IRemoteTemplates_item) {
        if (!templates) return
        const idx = templates.data.findIndex(_ => _.title === item.title)
        templates.data.splice(idx, 1)
        request
            .put<IRemoteTemplates>(url, templates, { successText: '操作成功' })
            .then(res => {
                set_templates(res.data)
            })
    }



    if (!templates) {
        return <div className={styles['init-wrapper']}>
            <div className={styles['init-text']}>暂无{item.label}模板配置</div>
            <Button type="primary" onClick={op_init}>初始化{item.label}模板</Button>
        </div>
    }

    return <div ref={el} className={styles.layout}>
        <div className={styles.sidebar}>
            <div className={styles['sidebar-header']}>
                <span>模板列表</span>
                {
                    maintain_mode
                        ? null
                        : <Button
                            size="small"
                            disabled={!item.canOperate}
                            icon={<MyIcon value={maintain_mode ? 'CheckOutlined' : 'EditOutlined'} />}
                            onClick={() => {
                                window.mchc_modal?.open('box', {
                                    title: '模板维护',
                                    width: 1200,
                                    getContainer: () => el.current!,
                                    onClose: fetch_data,
                                    modal_data: { content: <MultiTemplateTemplateGroup maintain_mode {...parent_props} /> },

                                })
                            }}
                        >
                            模板维护
                        </Button>
                }
            </div>

            <div className={styles.list}>
                {isEmpty(templates.data)
                    ? <div className={styles.empty}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无模板" />
                    </div>
                    : templates.data?.map(t => {
                        const is_active = active?.title === t.title
                        return <div
                            key={t.title}
                            className={classNames(styles['list-item'], {
                                [styles.active]: is_active
                            })}
                            style={is_active ? {
                                color: sys_theme.colorPrimary,
                                borderColor: sys_theme.colorPrimary
                            } : undefined}
                            onClick={() => set_active(t)}
                        >
                            <span
                                className={styles['list-item-icon']}
                                style={is_active ? { background: sys_theme.colorPrimary } : undefined}
                            />
                            <span className={styles['list-item-title']}>{t.title}</span>
                            {maintain_mode && (
                                <MyIcon
                                    value='DeleteOutlined'
                                    className={styles['list-item-delete']}
                                    onClick={(e: React.MouseEvent) => {
                                        if (!confirm('确认删除吗？'))
                                            return
                                        e.stopPropagation()
                                        op_remove(t)
                                    }}
                                />
                            )}
                        </div>
                    })
                }
            </div>

            {maintain_mode && (
                <Space.Compact className={styles['add-bar']}>
                    <Input
                        onChange={e => set_title_to_add(e.target.value)}
                        value={title_to_add}
                        placeholder="新模板标题"
                        onPressEnter={op_add}
                    />
                    <Button onClick={op_add} type="primary">添加</Button>
                </Space.Compact>
            )}
        </div>

        <div className={styles.content}>
            <div className={styles['content-header']}>
                <div className={styles['content-title']}>
                    <span style={{ background: sys_theme.colorPrimary }} className={styles['content-title-dot']} />
                    <span>{active?.title || '请选择模板'}</span>
                </div>
            </div>

            <div className={styles['content-body']}>
                {
                    active
                        ? <MyFormSectionForm onValuesChange={(obj, values) => { on_select(values) }} form={form} formDescriptions={fds} data={active} />
                        : <Empty />
                }
            </div>

            {maintain_mode && (
                <div className={styles['content-footer']}>
                    <Button
                        disabled={!active}
                        onClick={op_edit}
                        type="primary"
                        block
                        className={styles['save-button']}
                    >
                        保存修改
                    </Button>
                </div>
            )}
        </div>
    </div>
}
