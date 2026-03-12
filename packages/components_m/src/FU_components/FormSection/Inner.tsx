import { MyCheckbox, MyIcon } from '@lm_fe/components';
import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_InputProps } from '@lm_fe/service';
import { safe_json_parse } from '@lm_fe/utils';
import { Button, Col, ConfigProvider, Empty, FormItemProps, Popover, Row } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { forEach, get, isEmpty, isNil, join, map, omit } from 'lodash';
import React, { lazy, useState } from 'react';
import { MyLazyComponent } from '../../MyLazyComponent';
import { RenderSection, RenderSegs, RenderTab, use_form_config } from './helper';
import { IFormSectionProps } from './types';
import { RenderEditItem, formatFormConfig } from './utils';


const RenderFormSectionComponent = lazy(() => import('./RenderFormSectionComponent'))

type c = IMchc_FormDescriptions_Field['containerType']

const typeToText: { [x in NonNullable<c>]: string } = {
  'section(default)': '分块(默认)',
  'plain': '简约',
  'tabs': '标签页',
  'segs': '分段'
}
const typeOption = Object.keys(typeToText).map((k) => ({ value: k, label: typeToText[k as NonNullable<c>] }))
function MyFormSection(props: IFormSectionProps) {

  const { needControl, bf_config } = props

  const [f_config] = use_form_config(props)

  const [dispalyType, setDispalyType] = useState<c>()


  function renderRowAndCol(arr: IMchc_FormDescriptions_Field[] = [], dynamicFormItemProps: FormItemProps = {}) {
    const rowKey = join(map(arr, 'key'), '~')

    return (
      <Row key={rowKey} gutter={24}>
        {map(arr, (_config) => {
          if (!_config) return
          const dependency = _config.inputProps?.dependency
          const showDeps = _config.showDeps
          const disabledDeps = _config.disabledDeps
          const requiredDeps = _config.requiredDeps

          const span = get(_config, 'span') ?? props.span
          const offset = _config.offset ?? 0
          const push = _config.push ?? 0
          const pull = _config.pull ?? 0



          return (
            <Col span={span} push={push} pull={pull} offset={offset} key={_config.key}>
              {renderItem(_config, dynamicFormItemProps)}
            </Col>
          )
        })}
      </Row>
    )
  }
  function renderTab_Wrap(arr: IMchc_FormDescriptions_Field[] = []) {
    const rowKey = join(map(arr, 'key'), '~')

    return (
      <RenderTab fds={arr} key={rowKey} form={props.form} renderContent={renderContent}>
      </RenderTab>
    )
  }
  function renderSeg_Wrap(arr: IMchc_FormDescriptions_Field[] = []) {
    const rowKey = join(map(arr, 'key'), '~')

    return (
      <RenderSegs fds={arr} key={rowKey} form={props.form} renderContent={renderContent}>
      </RenderSegs>
    )
  }

  function getLabelCol() {
    const value = props.targetLabelCol ?? bf_config?.targetLabelCol ?? 2
    return value as number
  }
  // 返回 renderEditItem 的返回
  function renderItem(_config: IMchc_FormDescriptions_Field<false>, dynamicFormItemProps: FormItemProps = {}) {
    const {
      data,
      extraData,
      events,
      form,
      formName,
      disableAll = false,
      // defaultOptions 
      defaultOptions = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 20,
        },
      }
    } = props

    if (!_config) return null










    const _inputProps = _config.inputProps!
    const parseProps = safe_json_parse<IMchc_FormDescriptions_InputProps>(_inputProps, {})!
    _config.inputProps = (typeof _inputProps === 'object' ? { ..._inputProps } : parseProps)
    _config.inputProps = _config.inputProps ?? {}

    _inputProps.size = _inputProps.size ?? props.size
    if ((_config as any).editable === false) {
      _inputProps.disabled = true

    }

    // const renderEditItem = props.renderEditItem ?? _renderEditItemInner(_config, defaultOptions)
    const renderEditItem = _renderEditItemInner(_config, { ...defaultOptions, ...dynamicFormItemProps })

    const option = { formDescription: _config, formName, renderEditItem, disableAll, form, events, data, extraData, targetLabelCol: getLabelCol() }
    // 返回 renderEditItem 的返回




    return <RenderFormSectionComponent {...option} />


  }
  function _renderEditItemInner(_: IMchc_FormDescriptions_Field_Nullable, defaultOptions?: FormItemProps<any>) {
    const R = props.renderEditItemInner ?? RenderEditItem
    return (c: IMchc_FormDescriptions_Field_Nullable, ReactNode: React.ReactNode, userSetConfig: FormItemProps = {}) => {
      return R(c, ReactNode, { ...defaultOptions, ...userSetConfig },)
    }
  }
  function renderContent(_fds: IMchc_FormDescriptions_Field_Nullable<false>[] = [], dynamicFormItemProps: FormItemProps = {}) {
    const fds = _fds || []
    const { inline = false } = props
    let tempArr: IMchc_FormDescriptions_Field[] = []
    let tempTabItemArr: IMchc_FormDescriptions_Field[] = []
    let tempSegItemArr: IMchc_FormDescriptions_Field[] = []
    let tempSpan = 0
    const formArray: any[] = []
    const len = fds.length
    const flush = () => {
      if (!isEmpty(tempArr)) {
        formArray.push(renderRowAndCol(tempArr, dynamicFormItemProps))
        tempArr = []
        tempSpan = 0
      }
    }
    const flushTab = () => {
      if (!isEmpty(tempTabItemArr)) {
        formArray.push(renderTab_Wrap(tempTabItemArr))
        tempTabItemArr = []

      }
    }
    const flushSeg = () => {
      if (!isEmpty(tempSegItemArr)) {
        formArray.push(renderSeg_Wrap(tempSegItemArr))
        tempSegItemArr = []

      }
    }

    let metTabItem = false
    forEach(fds, (_config, index) => {
      if (!_config) return
      const span = get(_config, 'span') ?? props.span
      const offset = _config.offset ?? 0
      if (!_config.isActive) return
      const children = _config.inputType === 'straw' ? [] : _config.children

      if (_config.containerType === 'tabs') {
        flush()
        tempTabItemArr.push(_config)
        return
      }
      flushTab()

      if (_config.containerType === 'segs') {
        flush()
        tempSegItemArr.push(_config)
        return
      }
      flushSeg()


      if (children && !isEmpty(children)) {

        flush()
        const n = renderSection(_config)
        formArray.push(n)

      } else if (!isNil(span) && !isNil(offset) && !inline) {


        if (get(_config, 'isNewRow')) {
          flush()
        }


        if (tempSpan < 25 && tempSpan + span + offset < 25) {
          tempSpan = tempSpan + span + offset
          tempArr.push(_config)
          if (Number(index) === len - 1) {
            flush()
          }
        } else {
          flush()

          tempSpan = tempSpan + span + offset

          tempArr.push(_config)
        }
      }
      else {
        // 修改位置！
        flush()
        // 修改位置！

        formArray.push(renderItem(_config, dynamicFormItemProps))
      }

    })
    // 修改位置！

    flushTab()
    flushSeg()
    flush()



    // 修改位置！
    return <MyLazyComponent>
      {formArray}
    </MyLazyComponent>

  }


  function renderSection(fd: IMchc_FormDescriptions_Field_Nullable) {
    return <RenderSection fd={fd} form={props.form} renderContent={renderContent} />

  };



  function __formatFormConfig(_: IMchc_FormDescriptions_Field, siblings: IMchc_FormDescriptions_Field_Nullable[], defaultData: IMchc_FormDescriptions_Field = {}) {
    const c = formatFormConfig(_, getLabelCol(), { layout: props.defaultFormItemLayout, required: props.defaultRequired, ...defaultData },)
    const formItemName = c.name!
    const requiredKeys = props.requiredKeys ?? {}
    const keys = Object.keys(requiredKeys)
    if (keys.includes(formItemName)) {
      c.required = requiredKeys[formItemName]
    }

    const arr = c.children ?? c.fields

    if (arr) {
      const filterArr = arr.filter(_ => _) as IMchc_FormDescriptions_Field[]

      c.children = filterArr
        .map(c => {
          c.parent = omit(c, ['children', 'fields'])
          return __formatFormConfig(c!, filterArr)
        })
    }
    c.siblings = siblings

    return c
  }

  function render() {
    if (!f_config || isEmpty(f_config)) return <Empty />
    const filterArr: any[] = (f_config ?? []).filter(_ => _)

    const fds = filterArr
      .map(_ => {
        return __formatFormConfig(_!, filterArr, { containerType: dispalyType })
      })
    const node =
      props.sectionName
        ? renderSection({ title: props.sectionName, children: fds })
        : renderContent(fds)
    if (!needControl) return node
    return <div style={{ position: 'relative' }}>
      <div style={{ float: 'right', padding: 6, zIndex: 999, position: 'relative' }}>
        <Popover placement='leftBottom' content={<MyCheckbox marshal={0} value={dispalyType} onChange={v => setDispalyType(v)} options={typeOption} />} title="显示模式">
          <Button icon={<MyIcon value='SettingOutlined' />} shape='circle' />
        </Popover>
      </div>
      {node}
    </div>
  }

  return <ConfigProvider locale={zhCN}>
    {render()}
  </ConfigProvider>
}

export default MyFormSection

