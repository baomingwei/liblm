
export const primary_env = [
    'mf', '广三', '广州市八', '广州市八', '建瓯', '南医附属', '南医增城', '越秀妇幼', '华医', '省二', '扬州妇幼'
] as const
export const all_env = [...primary_env, 'mchc', 'mf', '临洮', '潮汕', '郫都',] as const

type ENV_TYPE = typeof all_env;


export type MchcTypes = ENV_TYPE[number]
export type MCHC_TYPE_MAP = { [env in MchcTypes]: env }

export type Common_Form_Config_Names = '门诊_建档' | '住院_登记'


