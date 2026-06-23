import { MCHC_TYPE_MAP, MchcTypes } from "@lm_fe/env";
import { AnyObject } from "@lm_fe/utils";
import { IMchc_Nurse_OutpatientDocument_physicalExam } from "../../Nurse";


export interface IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient<T extends MchcTypes = MCHC_TYPE_MAP['mchc']> {

    inpatientInfo: any,
    id: number,
    recordsAfterDelivery: IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient_Record[]
}

export interface IMchc_Doctor_RvisitAfterDeliveryInfoOfOutpatient_Record {
    doctorName: string,
    visitDate: string,
    physicalExam: IMchc_Nurse_OutpatientDocument_physicalExam,
    isBanned?: boolean,
    id: number
    // new
    prenatalVisitId?: number
    caSignStatus?: boolean
}
