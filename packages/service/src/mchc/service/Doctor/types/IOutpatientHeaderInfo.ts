import { MCHC_TYPE_MAP, MchcTypes } from '@lm_fe/env'

export interface IMchc_Doctor_OutpatientHeaderInfo<T extends MchcTypes = MCHC_TYPE_MAP['mchc']> {
    age: number
    tags: string | null
    labels: {
        "id": number
        "module": number
        "type": number
        "code": string
        "name": string
        "color": string
        "sort": number,
        "keyword": string[]
    }[]
    caseManages: {
        code: string
        color: string
        id: number
        name: string
    }[]
    birthInsurance: false
    checkupNO: string
    cicatrixLable: string
    curgesweek: string
    daysAfterDelivery: null
    eclampsiaLable: null
    edd: string
    g: number
    gesweek: string
    hbvReportCardRemind: T extends MCHC_TYPE_MAP['越秀妇幼'] ? boolean : never
    highRiskDiagnosis: string
    highriskLable: string
    highriskNote?: string
    id: string
    infectionLable: string
    infectionNote?: string
    labourDate: null
    labourState: false
    labourWeek: null
    name: string
    outpatientNO: string
    p: number
    pregnancyCaseLable: string
    printLetterOfConsent: null
    recordstate: '1' | '0' | '6'
    tabPage: 'Initial'
    thrombusLable: string
    highriskGrade?: string

    // nurse
    // "sureEdd" : "2023-05-11",
    // append
    alertAssessment?: {
        pregnancyId: 3
        type: 31
        templateId: null
        value?: {
            id: 47
            type: 31
            systemType: null
            pid: 31
            val: 'IVF/ART'
            code: null
            mnemonic: null
            wb: null
            sort: null
            depid: null
            userid: null
            diagnosisCode: null
            categoryCode: null
            categoryName: null
            icdCode: null
            active: null
            personal: false
        }[]
        first: false
    }
}
