
export const all_env = [
    'mchc', 'mf',
    '临洮', '华医', '南医增城', '广三', '越秀妇幼', '建瓯', '广州市八', '南医附属',
    '潮汕', '郫都', '省妇幼'
] as const

type ENV_TYPE = typeof all_env;


export type MchcTypes = ENV_TYPE[number]
export type MCHC_TYPE_MAP = { [env in MchcTypes]: env }

export type Common_Form_Config_Names = '门诊_建档' | '住院_登记'


