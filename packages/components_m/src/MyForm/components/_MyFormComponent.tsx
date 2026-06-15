import { pack_components } from '@lm_fe/components';
import MyCustom from './MyCustom';
import MyTreeSelect from './MyTreeSelect';
import PrenatalReturnTable from './business/prenatalReturnTable';

import { MyForm_Business_PregnancyHistory } from './business/PregnancyHistory';
// import IntrauterineBloodTransfusion from './business/PdProcedure/IntrauterineBloodTransfusion';
// import Cystocentesis from './business/PdProcedure/Cystocentesis';
// import PdProcedure from './business/PdProcedure';
import GeneralComponents_InputWithLabel from '../../GeneralComponents/InputWithLabel';
import AddressCascader from '../../selects/CascaderAddress';
import NativePlace from '../../selects/NativePlace/NativePlace';
// import { MyAutoComplete } from '../../FU_components/MyAutoComplete';
import { DateTimeInput, HbvdnaInput, MyEditTable, OkButton, TemplateTextarea } from '../../FU_components';
import TextareaWithTemplate from './business/TextareaWithTemplate';

import React, { lazy } from 'react';


import CheckboxWithInput_lm from '../../ConfigComponents/CheckboxWithInput';
import CheckAndCancelButton from '../../GeneralComponents/CheckAndCancelButton';

// const BloodAndThalassemia = lazy(() => import('./business/BloodAndThalassemia'))
// const BloodFlows = lazy(() => import('./business/BloodFlows'))
const BloodPressureInput = lazy(() => import('./business/BloodPressure'))
const DoubleInput = lazy(() => import('./business/DoubleInput'))
const FilterDateInput = lazy(() => import('./business/FilterDateInput'))
const FundalHeightInput = lazy(() => import('./business/FundalHeightInput'))
// const HemogramExam = lazy(() => import('./business/HemogramExam'))
const NormalButton = lazy(() => import('./business/NormalButton'))
// const MyForm_Input = lazy(() => import('./MyInput'))
const TextareaWithBtn = lazy(() => import('./business/TextareaWithBtn'))
const MyAutoCompleteOld = lazy(() => import('./MyAutoComplete'))
const MyCascader = lazy(() => import('./MyCascader'))
// const MyDateTime = lazy(() => import('./MyDateTime'))
// const MyInputWithRed = lazy(() => import('./MyInputWithRed'))
// const MySelect = lazy(() => import('./MySelect'))
// const MyTable = lazy(() => import('./MyTable'))
const SingleCheckbox = lazy(() => import('./SingleCheckbox'))
const DefaultSelect = lazy(() => import('./MySelect/DefaultSelect'))
const ArrayCustom = lazy(() => import('./MyCustom/ArrayCustom'))

const MyCheckboxOld = lazy(() => import('./MyCheckbox'))
const MyComponent = {
  MyEditTable,
  DefaultSelect,
  SingleCheckbox,
  // date: MyDateTime,
  // select: MySelect,
  // Select: MySelect,
  // MS: MySelect,
  // MySelect,
  // Checkbox: MyCheckboxOld,
  // MyCheckbox: MyCheckbox,
  // MC: MyCheckbox,
  // table: MyTable,
  // MyTable,
  cascader: MyCascader,
  treeselect: MyTreeSelect,
  MyTreeSelect,
  autoComplete: MyAutoCompleteOld,
  // MyAutoComplete,
  // MA: MyAutoComplete,
  // "simple-object": SimpleObject,
  // 功能性的button组件
  button: OkButton,
  normalButton: NormalButton,
  textareaWithBtn: TextareaWithBtn,
  textareaWithTemplate: TextareaWithTemplate,
  custom: MyCustom,
  // 业务类组件
  addressCascader: AddressCascader,
  bloodPressureInput: BloodPressureInput,
  doubleInput: DoubleInput,
  'array-custom': ArrayCustom,
  // 产前的孕产史组件
  pdPrenancyHistoriesTable: MyForm_Business_PregnancyHistory,
  // 带有template的textarea
  'template-textarea': TemplateTextarea,
  TemplateTextarea,
  // 产科门诊孕产史
  pregnancyHistoryTable: MyForm_Business_PregnancyHistory,
  // 孕产史年月组件
  filterDateInput: FilterDateInput,
  FilterDateInput,
  fundalHeightInput: FundalHeightInput,
  prenatalReturnTable: PrenatalReturnTable,
  input_with_label: GeneralComponents_InputWithLabel,
  // my_input_with_red: MyInputWithRed,

  // 'blood-and-thalassemia': BloodAndThalassemia,
  // 'blood-flows': BloodFlows,
  // 'pd-procedure': PdProcedure,
  // 'intrauterine-blood-transfusion': IntrauterineBloodTransfusion,
  // cystocentesis: Cystocentesis,
  // 'hemogram-exam': HemogramExam,
  'native-place': NativePlace,
  blank: () => <div style={{ height: 32 }}></div>,
  check_invert_button: CheckAndCancelButton,
  'checkbox_with_input': CheckboxWithInput_lm,
  hbvdna_input: HbvdnaInput,
  DateTimeInput,
  // Input: MyForm_Input,
  // input: MyForm_Input,
  ...pack_components,
  checkbox: MyCheckboxOld,


} as const;
export default MyComponent
