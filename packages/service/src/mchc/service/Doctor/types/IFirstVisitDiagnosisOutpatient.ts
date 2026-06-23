import { MchcTypes, } from "@lm_fe/env";
import { IMchc_Doctor_Diagnoses } from "./common";
import { IMchc_Doctor_Pregnancymh } from "./IMchc_Doctor_Pregnancymh";
import { IMchc_Doctor_FirstVisitPastmhOutpatient } from "./IMchc_Doctor_FirstVisitPastmhOutpatient";


export interface IMchc_Doctor_FirstVisitDiagnosisOutpatient<T extends MchcTypes = 'mchc'> {

    age: 23
    bmi: 17.9
    conceiveMode: 2
    conceiveModeNote: null
    eddAge: 23
    gravidity: 1
    id: 13
    parity: 0
    serialNo: "78e8kk9k76"
    admissionInfoVM: {
        creatDeliveryNursingDate: null
        deliverytype: null
        fetusdeath: null
        gestationalWeek: null
        isDeliveryNursing: false
        postpartumhemorrhage: null
        totalstage: null
        totalstageh: null
        totalstagem: null
    }
    advice: {
        appointmentCycle: "28"
        appointmentDate: "2022-09-21"
        appointmentPeriod: null
        appointmentType: "1"
        doctorName: "超级管理员"
        exam: "234"
        id: 8
        prescription: "wer"
        visitDate: "2022-08-24"
    }
    diseaseHistory: IMchc_Doctor_FirstVisitPastmhOutpatient
    familyHistory: {
        birthdefects: false
        birthdefectsNote: null
        diabetes: false
        diabetesNote: null
        heritableDisease: false
        heritableDiseaseNote: null
        hypertension: false
        hypertensionNote: null
        other: false
        otherNote: null
    }
    personalProfile: {
        alcohol: false
        alcoholNote: null
        hazardoussubstances: false
        hazardoussubstancesNote: null
        medicine: false
        medicineNote: null
        other: null
        otherNote: null
        radioactivity: false
        radioactivityNote: null
        smoke: false
        smokeNote: null
    }
    diagnoses: IMchc_Doctor_Diagnoses[]
    pregnancymh: IMchc_Doctor_Pregnancymh[]

    isOpenEclampsiaTable: number
    isOpenSCTable: number
    isOpenVTETable: number

    // new
    prenatalVisitId?: number
    caSignStatus?: boolean
}



