import { MCHC_TYPE_MAP, MchcTypes } from "@lm_fe/env";
import { IMchc_Doctor_Diagnoses } from "./common";
import { IMchc_Nurse_OutpatientDocument_physicalExam } from "../../Nurse";


export interface IMchc_Doctor_RvisitInfoOfOutpatient<T extends MchcTypes = MCHC_TYPE_MAP['mchc']> {

    diagnoses: IMchc_Doctor_Diagnoses<T>[]
    lackReports: string[]
    rvisits: IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit[]
    visitPlans: []
    id: number
    isOpenVTETable: number // isOpenVTETable
    isOpenSCTable: number // 瘢痕子宫阴道试产表
    isOpenEclampsiaTable: number // isOpenEclampsiaTable
    serialNo: string
}

export interface IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit {
    today?: boolean
    appointmentCycle: null
    appointmentDate: string
    appointmentPeriod: string
    appointmentType: null
    chiefComplaint: null
    childUltrasounds: []
    doctorName: string
    edema: null
    exam: null
    fetusExam: {

        fetalHeartRate?: string,
        fetalMovement?: string,
        fetalPosition?: string,
        position?: string,
        presentation?: string,
    }[]
    gestationalWeek: string
    id: number
    inspection: null
    nucleicAcidTest: number
    outEmrId: number
    outpatientNo: string
    phi: null
    prescription: null
    serialNo: string
    visitDate: string
    cardiacDisease: {
        heartrate: null
        medication: null
        otherNote: null
    }
    gdm: {
        fbg: null
        hbalc: null
        inslname: null
        pbg2: null
    }
    gynExam: {
        engagement: null
        fundalHeight: null
        waistHip: null
    }
    hypothyroidism: {
        t4: null
        tsh: null
    }
    icp: {
        alt: null
        ast: null
        tba: null
    }
    physicalExam: IMchc_Nurse_OutpatientDocument_physicalExam
    pih: {
        medication: null
        quality: null
        quantity: null
    }

    isOpenVTETable: number
    isOpenSCTable: number
    isOpenEclampsiaTable: number

    // added
    isBanned: boolean
    caSignStatus?: boolean

    prenatalVisitId?: number
}
