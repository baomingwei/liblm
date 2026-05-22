import React from 'react'
import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, IMchc_TableConfig, SMchc_FormDescriptions } from "@lm_fe/service";
import { IMyBaseList_ColumnType, MyBaseListProps, TableProps, RcTableProps } from "./types";
import { get, isFunction, isNil, isObject, isString } from "lodash";
import { AnyObject, expect_array, flat, safe_async_call, safe_json_parse, safe_json_parse_arr, safeGetFromFuncOrData } from "@lm_fe/utils";
import { ICommonOption } from "@lm_fe/env";
import { useEffect, useState } from "react";
export { TableProps }
export function formatProps(props: any, config?: IMchc_TableConfig) {
  const _props: MyBaseListProps = { ...props }
  const bf_conf = _props.bf_conf ?? config
  _props.handleBeforePopup = _props.handleBeforePopup ?? bf_conf?.handleBeforePopup ?? (values => values)
  _props.beforeSubmit = _props.beforeSubmit ?? bf_conf?.beforeSubmit ?? (values => values)
  _props.name = _props.name ?? bf_conf?.name
  _props.searchParams = safeGetFromFuncOrData(_props.searchParams ?? bf_conf?.searchParams)
  _props.initialSearchValue = safeGetFromFuncOrData(_props.initialSearchValue ?? bf_conf?.initialSearchValue)
  _props.searchConfig = safeGetFromFuncOrData(_props.searchConfig ?? bf_conf?.searchConfig)
  _props.tableColumns = _props.tableColumns ?? bf_conf?.tableColumns
  _props.showAction = _props.showAction ?? bf_conf?.showAction ?? true
  _props.showAdd = _props.showAdd ?? bf_conf?.showAdd ?? true
  _props.genColumns = _props.genColumns ?? bf_conf?.genColumns ?? undefined
  _props.showExport = _props.showExport ?? bf_conf?.showExport ?? false
  _props.showPrint = _props.showPrint ?? bf_conf?.showPrint ?? false
  _props.disableDoubleClick = _props.disableDoubleClick ?? bf_conf?.disableDoubleClick ?? false
  _props.requestBeforeEdit = _props.requestBeforeEdit ?? bf_conf?.requestBeforeEdit ?? false
  _props.showRowPrintBtn = _props.showRowPrintBtn ?? bf_conf?.showRowPrintBtn ?? false
  _props.needEditInTable = _props.needEditInTable ?? bf_conf?.needEditInTable ?? false
  _props.showRowDelBtn = _props.showRowDelBtn ?? bf_conf?.showRowDelBtn ?? true
  _props.showRowExportBtn = _props.showRowExportBtn ?? bf_conf?.showRowExportBtn ?? false
  _props.showRowEditBtn = _props.showRowEditBtn ?? bf_conf?.showRowEditBtn ?? true
  _props.showCopy = _props.showCopy ?? bf_conf?.showCopy ?? false
  _props.renderBtns = _props.renderBtns ?? bf_conf?.renderBtns
  _props.needChecked = _props.needChecked ?? bf_conf?.needChecked ?? false


  return _props
}

export function tranform_query_data(values: AnyObject, searchConfig: IMchc_FormDescriptions_Field_Nullable[] = [], isFuck = false) {
  const newValues = { ...values }
  const straws = flat(searchConfig.filter(_ => _?.inputType === 'straw')?.map(_ => _?.children ?? [])).map(_ => ({ ..._, straw_children: true }))
  const kvArr = [...searchConfig, ...straws]
    .filter(_ => _)
    .map(conf => {
      // const k = _?.name!
      const k = SMchc_FormDescriptions.get_form_item_name_str(conf)
      const v = get(newValues, k)
      return [k, v, conf] as const
    })
  return kvArr.reduce((sum, [k, v, conf]) => {

    if (isFuck) return { ...sum, [k]: v }
    const res = (conf && !get(conf, 'straw_children')) ? calcKeyByType(k, v, conf) : { [k]: v }
    return { ...sum, ...res }
  }, {})

}
function calcKey(k: string, v: any, searchConfig: IMchc_FormDescriptions_Field_Nullable[] = [],) {
  const config = searchConfig?.find(_ => _?.name === k)
  if (config) {
    return calcKeyByType(k, v, config)
  }


  return {}
}
function calcKeyByType(k: string, v: any, config: IMchc_FormDescriptions_Field) {

  const filter_type = config.filterType
  if (filter_type === null) return { [k]: v }

  const input_type = config.inputType! ?? 'input'
  const filter_type_arr = filter_type?.split?.(',') ?? []

  const type = config.inputProps?.type || config.inputProps?.mode
  const is_multiple = type === 'multiple' || type === 'tags'

  const f1 = filter_type_arr[0]
  const f2 = filter_type_arr[1]

  if (['input', 'Input', 'MyInput', 'address', 'MyAddress', 'MA'].includes(input_type)) {
    return { [`${k}.${f1 || 'contains'}`]: v }
  }
  if (['input_number', 'InputNumber', 'DatePicker', 'MSW', 'MySwitch', 'switch'].includes(input_type)) {
    return { [`${k}.${f1 || 'equals'}`]: v }
  }
  if (['select', 'Select', 'MySelect', 'MS'].includes(input_type)) {
    const obj = safe_json_parse(v, v)
    if (Array.isArray(obj)) {



      const arr = obj.map(_ => isObject(_) ? (_ as ICommonOption).value : _)

      const _v = arr.length > 1 ? arr.join(',') : arr[0]

      const has_comma = isString(_v) && _v.includes(',')

      const _df = (is_multiple || has_comma) ? 'in' : 'equals'

      return { [`${k}.${f1 || _df}`]: _v }

    } else {
      const has_comma = isString(v) && v.includes(',')

      const _df = (is_multiple || has_comma) ? 'in' : 'equals'
      return { [`${k}.${f1 || _df}`]: v }

    }
  }
  if (['RangePicker', 'rangeDate', 'MyRangeDate', 'rangeDateTime', 'MyRangeDateTime', 'ArrayInput'].includes(input_type)) {
    const value = safe_json_parse_arr(v)
    return {
      [`${k}.${f1 || 'greaterOrEqualThan'}`]: value[0],
      [`${k}.${f2 || 'lessOrEqualThan'}`]: value[1],

    }
  }

  return f1 ? { [`${k}.${f1}`]: v } : { [k]: v }
}
export function get_dataIndex<T>(record?: IMyBaseList_ColumnType) {
  const _dataIndex = record?.dataIndex ?? record?.name ?? record?.key
  if (isString(_dataIndex) && _dataIndex.includes('.')) {
    return _dataIndex.split('.')
  }
  return _dataIndex
}
export function get_title<T>(record?: IMyBaseList_ColumnType) {
  const _title = record?.title ?? record?.label ?? record?.name

  return _title
}
export function use_my_baselist<T>(props: MyBaseListProps) {
  const { tableColumns } = props
  const [table_columns, set_table_columns] = useState<IMyBaseList_ColumnType<T>[]>([])

  useEffect(() => {

    // if (isFunction(tableColumns)) {
    //   safe_async_call(tableColumns).then(data => {
    //     if (Array.isArray(data)) {
    //       set_table_columns(data.filter(_ => !isNil(_)))

    //     } else {
    //       set_table_columns(data.default.__lazy_config.filter(_ => !isNil(_)))

    //     }
    //   })
    // } else {
    //   set_table_columns((tableColumns ?? []).filter(_ => !isNil(_)))

    // }
    SMchc_FormDescriptions.extract_form_config(tableColumns)
      .then(conf => {
        set_table_columns(

          expect_array(conf)
            .filter(_ => !isNil(_))
          // .filter(_ => !_.hidden) // 不能在这过滤否则弹窗表单有问题

        )

      })

    return () => {

    }
  }, [tableColumns])


  return { table_columns }
}