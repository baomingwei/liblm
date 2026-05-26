import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
export interface IDiagnosesTemplate {
    diagnosesList: IMchc_Doctor_Diagnoses[]
    add_diag_inner(v: any): void,
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    closeTemplate(): void

    isShowDiagnosesTemplate: boolean
    del_diagnose_item_inner?: (item: IMchc_Doctor_Diagnoses, idx: number) => Promise<void>

    setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
    saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void
}
