import { lazy } from 'react';
import { ConfigComponents_DictionarySelect } from '../../ConfigComponents/DictionarySelect';
import {
    ArrayPanel,
    CheckboxWithValue,
    HourMinuteInput,
    MyEditTable,
    MyRangeDate,
    MyRangeDateTime,
    MyReferralOrganizationSelect
} from '../../FU_components';
import { MyAutoComplete } from '../../FU_components/MyAutoComplete';
import { MyPressure } from '../../FU_components/PressureInput';
// import RowoftireRecordBaby from '../../others/baby-form';
import { MyMonaco, pack_components } from '@lm_fe/components';
import CheckboxGroupObjectCustom from '../../GeneralComponents/CheckboxGroupObjectCustom';
import DictionarySelect from '../../GeneralComponents/DictionarySelect';
import DataSelectWithOptionsOrInput from '../../selects/DataSelectWithOptionsOrInput';
import NativePlace from '../../selects/NativePlace/NativePlace';
import PatientAutoComplete from '../../selects/PatientAutoComplete';



const BirthCertificateChildren = lazy(() => import('../../BusinessComponents/BirthCertificateChildren'))
const Deathclassification1 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification1'))
const Deathclassification2 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification2'))
const TemplateTextareav3 = lazy(() => import('../../BusinessComponents/TemplateTextareav3'))
const BorderTitle = lazy(() => import('../../GeneralComponents/border-title/border-title'))
const DataSelect = lazy(() => import('../../DataSelect'))
const DataSelectWithAutoInput = lazy(() => import('../../DataSelectWithAutoInput'))
const PressureInputV2 = lazy(() => import('../../BusinessComponents/PressureInput/index-v2'))
const TreatmentProgramBaisc = lazy(() => import('../../BusinessComponents/TreatmentProgram/TreatmentProgramBasic'))
const MultiSelector = lazy(() => import('../../GeneralComponents/Select/MultiSelector'))
const SingleSelector = lazy(() => import('../../GeneralComponents/Select/SingleSelector'))
const OptimizeEditInTable = lazy(() => import('../../MyForm/components/MyTable'))
const Appgar = lazy(() => import('../../BusinessComponents/Appgar'))
const BloodAndThalassemia = lazy(() => import('../../BusinessComponents/BloodAndThalassemia'))
const BloodPressure = lazy(() => import('../../BusinessComponents/BloodPressure'))
const BregmaGroup = lazy(() => import('../../BusinessComponents/BregmaGroup'))
const CaesareanChildren = lazy(() => import('../../BusinessComponents/CaesareanChildren'))
// const CalculateScoreTable = lazy(() => import('../../BusinessComponents/CalculateScoreTable'))
const Diagnosis = lazy(() => import('../../BusinessComponents/Diagnosis'))
const DiagnosisList = lazy(() => import('../../BusinessComponents/DiagnosisList'))
const DiagnosisListInduced = lazy(() => import('../../BusinessComponents/DiagnosisListInduced'))
const DiagnosisListv2 = lazy(() => import('../../BusinessComponents/DiagnosisListv2'))
const FamilyTumorHistory = lazy(() => import('../../BusinessComponents/FamilyTumorHistory'))
const FetalNTCheck = lazy(() => import('../../BusinessComponents/FetalNTCheck'))
// const FetalUltrasound = lazy(() => import('../../BusinessComponents/FetalUltrasound'))
// const FoetalAppendage = lazy(() => import('../../BusinessComponents/FoetalAppendage'))
const GynaecologyOperationTemplateTextarea = lazy(() => import('../../BusinessComponents/GynaecologyOperationTemplateTextarea'))
const GynaecologyTemplateTextarea = lazy(() => import('../../BusinessComponents/GynaecologyTemplateTextarea'))
const HighriskSign = lazy(() => import('../../BusinessComponents/HighriskSign'))
const InducedFetus = lazy(() => import('../../BusinessComponents/InducedFetus'))
// const InspectionResultTextarea = lazy(() => import('../../BusinessComponents/InspectionResultTextarea'))
const KnowledgeBase = lazy(() => import('../../BusinessComponents/KnowledgeBase'))
const LaborProcess = lazy(() => import('../../BusinessComponents/LaborProcess'))
// const LaborProcess2 = lazy(() => import('../../BusinessComponents/LaborProcess2'))
// const MiddleUltsounds = lazy(() => import('../../BusinessComponents/MiddleUltsounds'))
// const MiddleUltsoundsSingle = lazy(() => import('../../BusinessComponents/MiddleUltsoundsSingle'))
const NoenateRecord = lazy(() => import('../../BusinessComponents/NoenateRecord'))
const NurseChildren = lazy(() => import('../../BusinessComponents/NurseChildren'))
const NurseChildren2 = lazy(() => import('../../BusinessComponents/NurseChildren2'))
const NursingFetus = lazy(() => import('../../BusinessComponents/NursingFetus'))
const NursingFetusv2 = lazy(() => import('../../BusinessComponents/NursingFetusv2'))
const NursingFetusv3 = lazy(() => import('../../BusinessComponents/NursingFetusv3'))
// const NursingFetusv4 = lazy(() => import('../../BusinessComponents/NursingFetusv4'))
// const OxytocinTable = lazy(() => import('../../BusinessComponents/OxytocinTable'))
const PostpartumFetal = lazy(() => import('../../BusinessComponents/PostpartumFetal'))
const PregnancyHistoryV2 = lazy(() => import('../../BusinessComponents/PregnancyHistoryV2'))
const PressureInput = lazy(() => import('../../BusinessComponents/PressureInput'))
const ProcedureCystocentesis = lazy(() => import('../../BusinessComponents/ProcedureCystocentesis'))
// const ProcedureIntrauterine = lazy(() => import('../../BusinessComponents/ProcedureIntrauterine'))
const RecordState = lazy(() => import('../../BusinessComponents/RecordState'))
const ReferralRegister = lazy(() => import('../../BusinessComponents/ReferralRegister'))
const ReferralToRegister = lazy(() => import('../../BusinessComponents/ReferralToRegister'))
const ShiftPatients = lazy(() => import('../../BusinessComponents/ShiftPatients'))
// const SurgicalInspectionReport = lazy(() => import('../../BusinessComponents/SurgicalInspectionReport'))
// const TemplateTextarea = lazy(() => import('../../BusinessComponents/TemplateTextarea'))
const TemplateTextareav2 = lazy(() => import('../../BusinessComponents/TemplateTextareav2'))
// const UltrosoundResultTextarea = lazy(() => import('../../BusinessComponents/UltrosoundResultTextarea'))
// const BloodSugarNursingTable = lazy(() => import('../../ConfigComponents/BloodSugarNursingTable'))
const CheckboxGroup = lazy(() => import('../../ConfigComponents/CheckboxGroup'))
const CheckboxWithInput = lazy(() => import('../../ConfigComponents/CheckboxWithInput'))
const CheckboxWithInputv2 = lazy(() => import('../../ConfigComponents/CheckboxWithInputv2'))
const CheckboxWithSingleInput = lazy(() => import('../../ConfigComponents/CheckboxWithSingleInput'))
const CustomEditInTable = lazy(() => import('../../ConfigComponents/CustomEditInTable'))
const InputWithLabel = lazy(() => import('../../ConfigComponents/InputWithLabel'))
const InputWithRange = lazy(() => import('../../ConfigComponents/InputWithRange'))
const InputWithRangTip = lazy(() => import('../../ConfigComponents/InputWithRangTip'))
const MultipleInputWithLabel = lazy(() => import('../../ConfigComponents/MultipleInputWithLabel'))
// const NeonatalCareRecordTable = lazy(() => import('../../ConfigComponents/NeonatalCareRecordTable'))
const NormalCheckboxWithInput = lazy(() => import('../../ConfigComponents/NormalCheckboxWithInput'))
// const NormalNursingTable = lazy(() => import('../../ConfigComponents/NormalNursingTable'))
// const PastDeliveryNursingTable = lazy(() => import('../../ConfigComponents/PastDeliveryNursingTable'))
// const PreDeliverNursingTable = lazy(() => import('../../ConfigComponents/PreDeliverNursingTable'))
const ProcedureRecords = lazy(() => import('../../ConfigComponents/ProcedureRecords'))
const PureCheckbox = lazy(() => import('../../ConfigComponents/PureCheckbox'))
// const SpecialNursingTable = lazy(() => import('../../ConfigComponents/SpecialNursingTable'))
// const TemperatureNursingTable = lazy(() => import('../../ConfigComponents/TemperatureNursingTable'))
const MySearchSelect = lazy(() => import('../../FU_components/MySearchSelect'))
const AsyncAutoComplete = lazy(() => import('../../GeneralComponents/AsyncAutoComplete'))
const CheckAndCancelButton = lazy(() => import('../../GeneralComponents/CheckAndCancelButton'))
const CheckboxGroupObject = lazy(() => import('../../GeneralComponents/CheckboxGroupObject'))
const CustomTreeSelect = lazy(() => import('../../GeneralComponents/CustomTreeSelect'))

const InputWithTitle = lazy(() => import('../../GeneralComponents/FormSectionInput'))
const InputNumber = lazy(() => import('../../GeneralComponents/InputNumber'))
const MultipleInputGroup = lazy(() => import('../../GeneralComponents/MultipleInputGroup'))
const RadioInput = lazy(() => import('../../GeneralComponents/RadioWithInput'))
const RangePicker = lazy(() => import('../../GeneralComponents/RangePicker'))
const TimePicker = lazy(() => import('../../GeneralComponents/TimePicker'))
const UploadFile = lazy(() => import('../../GeneralComponents/UploadFile'))
const UploadFileUrlEdit = lazy(() => import('../../GeneralComponents/UploadFileUrlEdit'))
const AgeSelect = lazy(() => import('../../selects/AgeSelect'))
const ApgarScoreInput = lazy(() => import('../../selects/ApgarScoreInput'))
const CountrySelect = lazy(() => import('../../selects/CountrySelect'))
const DeviceStatusSelect = lazy(() => import('../../selects/DeviceStatusSelect'))
const NormalSelect = lazy(() => import('../../selects/NormalSelect'))
const ParentPermissionSelect = lazy(() => import('../../selects/ParentPermissionSelect'))
const PermissionTypeSelect = lazy(() => import('../../selects/PermissionTypeSelect'))
const RadioWithInput = lazy(() => import('../../selects/RadioWithInput'))
const RadioWithInputNumber = lazy(() => import('../../selects/RadioWithInputNumber'))
const ReferralOrganizationSelect = lazy(() => import('../../selects/ReferralOrganizationSelect'))
const SelectTagWithOptions = lazy(() => import('../../selects/SelectTagWithOptions'))
const SelectWithNoneOption = lazy(() => import('../../selects/SelectWithNoneOption'))
// const SelectWithOptions = lazy(() => import('../../selects/SelectWithOptions'))
const SelectWithOptionsOrInput = lazy(() => import('../../selects/SelectWithOptionsOrInput'))
const TriggerTypeSelect = lazy(() => import('../../selects/TriggerTypeSelect'))
const DataPickWithCheck = lazy(() => import('../../GeneralComponents/datapick_with_check/datapick_with_check'))
const CusDataTimePicker = lazy(() => import('../../GeneralComponents/DataTimePick'))
// const PostpartumCarerecordTable2 = lazy(() => import('../../ConfigComponents/PostpartumCarerecordTable2'))
// const ObserMagnesiumsulphateTable = lazy(() => import('../../ConfigComponents/ObserMagnesiumsulphateTable2'))
// const PostUrinaryretentionTable = lazy(() => import('../../ConfigComponents/PostUrinaryretentionTable2'))
// const NeonatalScaleExamination = lazy(() => import('../../ConfigComponents/NeonatalScaleExamination'))
import { MyFormList_必须搭配Form使用 } from 'src/FU_components/FormList';
import VaginaStrumentsRecordForm from '../../ConfigComponents/VaginaStrumentsRecordForm';
import { HighRiskGradeSelectPure } from '../../doctor-end';
import { CalcBmi, DateTimeInput, FormTabs, HbvdnaInput, TakeInVolumn, TakeOutVolumn, TemplateTextarea, ToggleForm, ResultTextarea } from '../../FU_components';
import { HighriskButton } from '../../FU_components/HighriskButton';
import { IdNOButton } from '../../FU_components/IdNOButton';
import { EditInTable } from '../../GeneralComponents/EditInTable';
import CascaderAddress from '../../selects/CascaderAddress';

import TextareaWithBtn from '../../MyForm/components/business/TextareaWithBtn';
import { LoadFlag } from '../LoadFlag';


export const FormSectionComponent = {
    nursing_table: EditInTable,
    EditInTable,
    IdNOButton,
    CalcBmi,
    TakeInVolumn,
    TakeOutVolumn,
    CascaderAddress,
    BirthCertificateChildren,
    Deathclassification1,
    Deathclassification2,
    TemplateTextareav3,
    textareaWithTemplate: TemplateTextarea,
    TemplateTextarea,

    textareaWithResult: ResultTextarea,
    result_textarea: ResultTextarea,
    ResultTextarea,
    BorderTitle,
    CheckboxGroupObjectCustom,
    'custom-checkbox': CheckboxGroupObjectCustom,
    NativePlace,
    HbvdnaInput,
    DateTimeInput,
    DataSelect,
    DataSelectWithAutoInput,

    PressureInputV2,

    TreatmentProgramBaisc,
    MultiSelector,
    SingleSelector,
    OptimizeEditInTable,

    Appgar,
    BloodAndThalassemia,
    BloodPressure,
    BregmaGroup,
    CaesareanChildren,
    Diagnosis,
    DiagnosisList,
    DiagnosisListInduced,
    DiagnosisListv2,
    FamilyTumorHistory,
    FetalNTCheck,
    // FetalUltrasound,
    // FoetalAppendage,
    GynaecologyOperationTemplateTextarea,
    GynaecologyTemplateTextarea,
    HighriskSign,
    InducedFetus,
    // InspectionResultTextarea,
    KnowledgeBase,
    LaborProcess,
    ToggleForm,
    // LaborProcess2,
    // MiddleUltsounds,
    // MiddleUltsoundsSingle,
    NoenateRecord,
    NurseChildren,
    NurseChildren2,
    NursingFetus,
    NursingFetusv2,
    NursingFetusv3,
    // NursingFetusv4,
    FormTabs,
    PostpartumFetal,
    PregnancyHistoryV2,
    PressureInput,
    ProcedureCystocentesis,
    RecordState,
    ReferralRegister,
    ReferralToRegister,



    ShiftPatients,
    TemplateTextareav2,
    // UltrosoundResultTextarea,
    CheckboxGroup,
    CheckboxWithInput,
    CheckboxWithInputv2,
    CheckboxWithSingleInput,
    CustomEditInTable,
    InputWithLabel,
    InputWithRange,
    InputWithRangTip,
    MultipleInputWithLabel,
    // NeonatalCareRecordTable,
    NormalCheckboxWithInput,
    ProcedureRecords,
    PureCheckbox,
    MySearchSelect,
    AsyncAutoComplete,
    CheckAndCancelButton,
    check_invert_button: CheckAndCancelButton,
    CheckboxGroupObject,
    checkbox_group_object: CheckboxGroupObject,
    CustomTreeSelect,
    // DatePicker,
    // MyDatePicker: DatePicker,
    // date: DatePicker,
    InputWithTitle,
    // InputNumber,
    // input_number: InputNumber,
    MultipleInputGroup,
    RadioInput,
    // RangePicker,
    // MyRangeDate,
    // rangeDate: MyRangeDate,
    // MyRangeDateTime,
    // rangeDateTime: MyRangeDateTime,
    TimePicker,
    UploadFile,
    UploadFileUrlEdit,
    AgeSelect,
    ApgarScoreInput,
    CountrySelect,
    LoadFlag,
    DataSelectWithOptionsOrInput,
    DeviceStatusSelect,
    NormalSelect,
    ParentPermissionSelect,
    PatientAutoComplete,
    patient_auto_complete: PatientAutoComplete,

    PermissionTypeSelect,
    RadioWithInput,
    RadioWithInputNumber,
    ReferralOrganizationSelect,
    SelectTagWithOptions,
    SelectWithNoneOption,
    // SelectWithOptions,
    SelectWithOptionsOrInput,
    TriggerTypeSelect,
    DataPickWithCheck,
    CusDataTimePicker,
    // PostpartumCarerecordTable2,
    // ObserMagnesiumsulphateTable,
    // PostUrinaryretentionTable,
    // NeonatalScaleExamination,
    ConfigComponents_DictionarySelect,
    dictionary_select: ConfigComponents_DictionarySelect,
    // MyCheckbox,
    // Checkbox: MyCheckbox,
    // checkbox: MyCheckbox,
    // MC: MyCheckbox,
    // ArrayInput,
    // MArr: ArrayInput,
    HourMinuteInput,
    CheckboxWithValue,
    ArrayPanel,
    // MySelect,
    // select: MySelect,
    // Select: MySelect,
    // MS: MySelect,
    // RowoftireRecordBaby,
    MyPressure,
    // MyAutoComplete,
    // MA: MyAutoComplete,
    autoComplete: MyAutoComplete,
    VaginaStrumentsRecordForm,
    DictionarySelect,
    MyMonaco,
    MyEditTable,
    HighRiskGradeSelectPure,
    HighriskButton,
    MyReferralOrganizationSelect,
    MyFormList_必须搭配Form使用,
    textareaWithBtn: TextareaWithBtn,
    ...pack_components,


}
export function getFormSectionComponent(type: keyof typeof FormSectionComponent = 'Input') {
    const C = FormSectionComponent[type] ?? (() => `未知组件:${type}`)

    return C
}