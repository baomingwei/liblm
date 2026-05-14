import { ITemplateConfig } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { AnyObject } from '@lm_fe/utils';
import { ButtonProps, FormInstance, ModalProps } from 'antd';
import React from 'react';
export interface IMultiTemplateType {
    label: string
    params?: AnyObject
    canOperate?: boolean
}
export interface IRemoteTemplates {

    description: string
    id: number
    type: string
    data: IRemoteTemplates_item[]
}
export interface IRemoteTemplates_item { title: string, [x: string]: any }
export interface IMultiTemplateProps extends Omit<ButtonProps, 'form'> {
    value?: string
    url?: string
    onChange?(v: any): void
    style?: React.CSSProperties
    MultiTemplate_type?: IMultiTemplateType[]
    btn_text?: string
    modal_props?: ModalProps
    fds: IMchc_FormDescriptions_Field[]
    form?: FormInstance
}
