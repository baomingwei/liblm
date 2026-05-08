import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from "@lm_fe/service";
import { safe_json_parse, safe_json_parse_arr, safeExec } from "@lm_fe/utils";
import { Col, Form, FormItemProps, Row, Tooltip } from "antd";
import { get, isNumber } from "lodash";
import React from "react";

import { MyIcon } from '@lm_fe/components';
function wrap(col: any) {
    return isNumber(col) ? { span: col } : col
}
function calLayout(targetLabelCol: number, percentStr: string,) {
    if (!percentStr || typeof percentStr !== 'string') return null
    const p = percentStr.split('/').map(_ => parseInt(_)).map(_ => _ || 1)
    const percent = (p[0] / p[1]) || 1
    const span = Math.floor(24 * percent)
    const labelCol = Math.floor(targetLabelCol / percent)
    const wrapperCol = 24 - labelCol
    return {
        labelCol,
        wrapperCol,
        // wrapperCol: wrapperCol > 15 ? wrapperCol - 2 : wrapperCol,
        span
    }
}
function setFormItemLayout(config: IMchc_FormDescriptions_Field, targetLabelCol: number,) {
    const _config = { ...config }
    const formItemLayout: any = _config.formItemLayout ?? {}

    const layoutObj = calLayout(targetLabelCol, config.layout ?? formItemLayout?.layout)
    let labelCol: any
    let wrapperCol: any
    let span: any
    let offset: any
    let push: any
    let pull: any



    const inputProps = _config.inputProps ?? {}

    labelCol = formItemLayout.labelCol ?? layoutObj?.labelCol ?? _config.labelCol ?? inputProps.labelCol
    wrapperCol = formItemLayout.wrapperCol ?? layoutObj?.wrapperCol ?? _config.wrapperCol ?? inputProps.wrapperCol


    span = _config.span ?? layoutObj?.span ?? formItemLayout.span ?? inputProps.span
    offset = _config.offset ?? formItemLayout.offset ?? (inputProps as any).offset
    push = _config.push ?? formItemLayout.push ?? (inputProps as any).push
    pull = _config.pull ?? formItemLayout.pull ?? (inputProps as any).pull


    config.span = config.form_hidden ? 0 : span
    config.offset = offset
    config.push = push
    config.pull = pull
    config.formItemLayout = { labelCol: _config.label ? wrap(labelCol) : 0, wrapperCol: _config.label ? wrap(wrapperCol) : 24 }
    return config
}
function setInputProps(config: IMchc_FormDescriptions_Field) {
    const _config = { ...config }

    const inputProps = safe_json_parse(_config.inputProps, _config.props) ?? {}




    const label = config.label ?? ''



    const type: string = _config.inputType ?? ''
    const optionName = (['input', 'text',].some(_ => type.toLowerCase().includes(_))) ? '输入' : '选择'
    inputProps.placeholder = inputProps.placeholder ?? `请${optionName}${label}`



    _config.inputProps = inputProps


    return _config
}
export function formatFormConfig(__config: IMchc_FormDescriptions_Field, targetLabelCol?: number | string, defaultConfig: IMchc_FormDescriptions_Field_Nullable = {}) {
    const config = { ...__config }
    const _targetLabelCol = Number(targetLabelCol ?? 4)

    SMchc_FormDescriptions.format_form_item_name_and_label(config)
    config.__format = true
    config.specialConfig = safe_json_parse(config.specialConfig) as any
    config.inputProps = safe_json_parse(config.inputProps) ?? config.inputPropsFn?.() as any
    config.formItemLayout = safe_json_parse(config.formItemLayout) as any
    config.layout = config.layout ?? defaultConfig?.layout
    config.required = config.required ?? defaultConfig?.required
    config.containerType = config.containerType ?? defaultConfig?.containerType
    let _config = setInputProps(config)

    _config = setFormItemLayout(_config, _targetLabelCol)




    const isActive = config.isActive ?? 1




    _config.isActive = isActive ? 1 : 0



    return _config
}
export function RenderEditItem(config: any, ReactNode: React.ReactNode, defaultOptions: FormItemProps<any> & { styles?: any } = {}) {
    const _config = formatFormConfig(config, defaultOptions?.labelCol?.span)
    const { rules, inputProps, key, label, } = _config;
    const safe_rules = safe_json_parse(rules)
    const required = safeExec(_config.required as any) ?? _config.required
    // let name = key?.includes('.') ? key.split('.') : key;
    let name = SMchc_FormDescriptions.parse_form_item_name(config)

    const placeholder = get(inputProps, 'placeholder') || '';
    const labelAlign = get(_config, 'labelAlign') ?? get(inputProps, 'labelAlign');
    const colon = get(inputProps, 'colon');
    const { styles: s = {}, ...o } = defaultOptions
    const labelCol: any = _config.formItemLayout?.labelCol ?? defaultOptions.labelCol ?? {}
    const wrapperCol: any = _config.formItemLayout?.wrapperCol ?? defaultOptions.wrapperCol ?? {}
    const label_node = render_form_label(_config)
    const cal_rules = required ? [{ required: true, message: placeholder ?? ('请填写' + (label ?? '')) }] : []
    return (
        <Form.Item
            hidden={safeExec(_config.form_hidden as any) || _config.form_hidden}
            {...o}
            style={{ ...s }}
            labelAlign={labelAlign}
            colon={colon}
            key={key}
            label={label_node}
            name={name}
            rules={safe_rules || cal_rules}
            labelCol={labelCol}
            wrapperCol={wrapperCol}

        >
            {ReactNode}

        </Form.Item>
    );
};
export function RenderEditItemStandalone(config: any, ReactNode: React.ReactNode, defaultOptions: FormItemProps<any> & { styles?: any } = {}) {
    const _config = formatFormConfig(config, defaultOptions?.labelCol?.span)
    const { inputProps, key } = _config;

    const colon = get(inputProps, 'colon') ?? true;
    const { styles: s = {}, } = defaultOptions
    const labelCol: any = _config.formItemLayout?.labelCol ?? defaultOptions.labelCol ?? {}
    const wrapperCol: any = _config.formItemLayout?.wrapperCol ?? defaultOptions.wrapperCol ?? {}
    return (
        <Row
            hidden={safeExec(_config.form_hidden as any) || _config.form_hidden}
            style={{ ...s, marginBottom: 6 }}

            key={key}

        >
            <Col {...labelCol}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', margin: '0 8px 0 2px' }}>
                    {
                        render_form_label(_config)
                    }
                    {colon ? ':' : ''}

                </div>
            </Col>
            <Col {...wrapperCol}>
                {ReactNode}
            </Col>
        </Row>
    );
};

export function render_form_label(config: IMchc_FormDescriptions_Field,) {
    const { inputProps, label, title } = config;
    const _label = label || title
    let name_str = SMchc_FormDescriptions.get_form_item_name_str(config)
    const unit = get(config, 'unit') || get(inputProps, 'unit');
    const tip = get(config, 'tip') || get(inputProps, 'tip');

    const label_node = _label ? (
        <span title={_label} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {_label}
            {unit ? <sub style={{ fontSize: 8 }}>{unit}</sub> : ''}
            {tip
                ? <Tooltip title={tip} >
                    <MyIcon value='QuestionCircleOutlined' style={{ cursor: 'help', marginLeft: 2 }} />
                </Tooltip>
                : null
            }

        </span>
    ) : ''
    return label_node
};