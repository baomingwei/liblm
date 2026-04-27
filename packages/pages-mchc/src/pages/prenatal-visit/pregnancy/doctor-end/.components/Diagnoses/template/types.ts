import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
export interface IDiagnosesTemplate {
    diagnosesList: IMchc_Doctor_Diagnoses[]
    add_diag(v: any): void,
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    closeTemplate(): void

    isShowDiagnosesTemplate: boolean

    setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
    saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void
}
