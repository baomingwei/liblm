
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';

export interface IDiagnosesItem_Props {
  edit?: boolean;
  index: number;
  diagnose: IMchc_Doctor_Diagnoses;
  do_del_diagnose_item?: (item: IMchc_Doctor_Diagnoses, idx: number) => Promise<void>
  updateNote?: Function
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  saveHeaderInfo(H: IMchc_Doctor_OutpatientHeaderInfo): void
  diagnosesList: IMchc_Doctor_Diagnoses[]
  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  isShowDiagnosesTemplate: boolean
}
