import { ICommonOption, mchcEvent } from "@lm_fe/env";
import { peek_provoke } from "@lm_fe/provoke";
import { IMchc_Doctor_OutpatientHeaderInfo, mchcEnums } from "@lm_fe/service";
import { isObject } from "@lm_fe/utils";
import { CSSProperties } from "react";
import { mchcModal__ } from "src/modals";
export interface IHighRiskTableEntryProps {
  headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
  data?: IData
  style?: CSSProperties
}
export type IData = {
  isOpenVTETable: number;
  isOpenSCTable: number;
  isOpenEclampsiaTable: number;
}



const isPopup = mchcEnums.Doctor.modalPopup.getValue('弹窗')
const isRemid = mchcEnums.Doctor.modalPopup.getValue('提醒')
const isNoop = mchcEnums.Doctor.modalPopup.getValue('无')

export enum remindEnum {
  popup = isPopup,
  remind = isRemid,
  no = isNoop,
}

/**
 * 根据后端逻辑弹出子痫，vte,疤痕提醒
 * @param res
 */
export function highRiskTablePopup(res: IData, headerInfo?: IMchc_Doctor_OutpatientHeaderInfo<"mchc">) {
  if (peek_provoke().config.禁用量表自动弹出)
    return
  const { isOpenSCTable, isOpenEclampsiaTable, isOpenVTETable } = res;
  if (isOpenSCTable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '瘢痕子宫阴道试产表' })
  }
  if (isOpenEclampsiaTable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '子痫前期风险评估表' })

  }
  if (isOpenVTETable == remindEnum.popup) {
    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '深静脉血栓高危因素孕期用药筛查表' })
  }
  const 量表拓展 = peek_provoke('config')?.量表拓展 ?? []
  const keys = Object.keys(res)
    .filter(k => k.startsWith('isOpen'))
    .forEach(k => {

      const ext_value = k.replace('isOpen', '')
      const ext = 量表拓展.find(e => e.value === ext_value)
      if (!ext) return
      mchcModal__.open('拓展量表', { modal_data: { headerInfo, ext } })

    })
}
export const popupRemindkeyMap = {
  VTE: ['cicatrixLable', 'isOpenVTETable'] as const,
  子痫: ['eclampsiaLable', 'isOpenEclampsiaTable'] as const,
  瘢痕子宫: ['thrombusLable', 'isOpenSCTable'] as const,
}
export type TPopupRemindkey = (keyof typeof popupRemindkeyMap) | ICommonOption
export function isShowPopupRemind(key_or_ext: TPopupRemindkey, headerInfo?: IMchc_Doctor_OutpatientHeaderInfo, value?: IData,) {
  if (!headerInfo || !value) return false
  let head_key: string
  let visit_key: string
  if (isObject(key_or_ext)) {
    const ext_key = key_or_ext.value
    head_key = `${ext_key}Lable`
    visit_key = `isOpen${ext_key}`
  } else {
    const item = popupRemindkeyMap[key_or_ext]
    head_key = item[0]
    visit_key = item[1]
  }
  const valueOfHeaderinfo = headerInfo[head_key]
  const valueOfRvisit = value[visit_key]
  if (valueOfHeaderinfo) return false
  return (valueOfRvisit == remindEnum.popup || valueOfRvisit == remindEnum.remind)

}

