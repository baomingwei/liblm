import { AutoComplete, ButtonProps, Col, Divider, Form, FormInstance, Input, Radio, Row, Space } from 'antd';
import { get, isNil, keyBy, set } from 'lodash';
import React, { lazy } from 'react';
import DataSelectWithOptionsOrInput from '../../selects/DataSelectWithOptionsOrInput';

// import RowoftireRecordBaby from '../../others/baby-form';
// const BirthCertificateChildren = lazy(() => import('../../BusinessComponents/BirthCertificateChildren'))
// const Deathclassification1 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification1'))
// const Deathclassification2 = lazy(() => import('../../BusinessComponents/TemplateTexDeathclassification2'))
const TemplateTextareav3 = lazy(() => import('../../BusinessComponents/TemplateTextareav3'))
// const TemplateTextrootcauseDeath = lazy(() => import('../../BusinessComponents/TemplateTextrootcauseDeath'))
const BorderTitle = lazy(() => import('../../GeneralComponents/border-title/border-title'))
const NativePlace = lazy(() => import('../../selects/NativePlace/NativePlace'))
// const CureState = lazy(() => import('../../special-components/cure-state/cure-state'))
// const SyphilisTested = lazy(() => import('../../special-components/syphilis-tested/syphilis-tested'))
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
// const FamilyTumorHistory = lazy(() => import('../../BusinessComponents/FamilyTumorHistory'))
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
const RecordState = lazy(() => import('../../BusinessComponents/RecordState'))
const ReferralRegister = lazy(() => import('../../BusinessComponents/ReferralRegister'))
const ReferralToRegister = lazy(() => import('../../BusinessComponents/ReferralToRegister'))
const ShiftPatients = lazy(() => import('../../BusinessComponents/ShiftPatients'))
const TemplateTextarea = lazy(() => import('../../BusinessComponents/TemplateTextarea'))
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
// const CheckboxGroupObject = lazy(() => import('../../GeneralComponents/CheckboxGroupObject'))
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
const AutoCompleteWithRed = lazy(() => import('../../selects/AutoCompleteWithRed'))
const CountrySelect = lazy(() => import('../../selects/CountrySelect'))
// const CronSelect = lazy(() => import('../../selects/CronSelect'))
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
const TriggerTypeSelect = lazy(() => import('../../selects/TriggerTypeSelect'))
const DataPickWithCheck = lazy(() => import('../../GeneralComponents/datapick_with_check/datapick_with_check'))
const CusDataTimePicker = lazy(() => import('../../GeneralComponents/DataTimePick'))
const HepatitsNewBabyCom = lazy(() => import('../../newly-component/hepatitis-new-baby'))

// const PostpartumCarerecordTable2 = lazy(() => import('../../ConfigComponents/PostpartumCarerecordTable2'))
// const ObserMagnesiumsulphateTable = lazy(() => import('../../ConfigComponents/ObserMagnesiumsulphateTable2'))
// const PostUrinaryretentionTable = lazy(() => import('../../ConfigComponents/PostUrinaryretentionTable2'))
// const NeonatalScaleExamination = lazy(() => import('../../ConfigComponents/NeonatalScaleExamination'))
// import VaginaStrumentsRecordForm from '../../ConfigComponents/VaginaStrumentsRecordForm';
import CascaderAddress from '../../selects/CascaderAddress';
import SelectWithOptionsOrInput from '../../selects/SelectWithOptionsOrInput';

// import TreatmentProgramTable from '../../BusinessComponents/TreatmentProgram/TreatmentProgramTable'
// import TextareaTemplate from '../../GeneralComponents/TextareaTemplate'
// import ImageEditor from '../../GeneralComponents/ImageEditor'

// import UploadImg from '../../GeneralComponents/UploadImg'
// import CustomEditor from '../../GeneralComponents/CustomEditor'
import MobileEditor from '../../GeneralComponents/MobileEditor';
// import PregnancyHistory from '../../BusinessComponents/PregnancyHistory'
import { safe_json_parse } from '@lm_fe/utils';
import ImageUploadPreview from '../../GeneralComponents/ImageUploadPreview';
import ImageUploadPreviewIntranet from '../../GeneralComponents/ImageUploadPreviewIntranet';
// import { safe_json_parse } from '@lm_fe/utils';
import { IMchc_FormDescriptions_Field_Nullable, MyImageEditor } from '@lm_fe/components';
import { mchcEvent } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { IMchc_FormDescriptions_FormItemLayout } from '@lm_fe/service/dist/mchc/service/FormDescriptions/types/FormItemLayout';
import { InterceptComponent } from 'src/utils/InterceptComponent';
import { MyRangePicker, OkButton, RolesPicker } from '../../FU_components';

import { getFormSectionComponent } from './FormSectionComponent';

import { form_control } from './form_control';
import { formatFormConfig, render_form_label } from './utils';
import my_styles from './RenderFormSectionComponent.module.less'
interface IProps {
    formDescription: IMchc_FormDescriptions_Field_Nullable,
    renderEditItem: (key: IMchc_FormDescriptions_Field_Nullable, ReactNode: React.ReactNode, others?: any) => any,
    disableAll: boolean,
    form?: FormInstance,
    events: any,
    data: any,
    extraData: any
    formName?: string
}
function RenderFormSectionComponent(props: IProps) {

    const { formDescription, renderEditItem, disableAll, form, formName, events, data, extraData } = props
    const _config = formDescription
    if (!_config) return null
    const dependency = _config.inputProps?.dependency

    const { showDeps, error_deps, requiredDeps, warning_deps, disabledDeps } = _config


    if (![showDeps, error_deps, requiredDeps, warning_deps, disabledDeps].every(isNil) || dependency) {
        return (
            <Form.Item noStyle shouldUpdate key={_config.key}>
                {f => {
                    const { isShow, isDisabled, isRequired, is_error, is_warning } = form_control(f, _config)


                    let newDescription = { ..._config }

                    let _props = get(newDescription, 'inputProps', {})

                    if (!isShow) {
                        return null
                    }
                    if (isDisabled) {

                        newDescription.inputProps = { ..._props, disabled: true }
                    }
                    if (isRequired) {
                        set(newDescription, 'required', true)
                    }


                    if (is_warning) {
                        newDescription.inputProps = { ..._props, status: 'warning' }

                    }
                    if (is_error) {
                        newDescription.inputProps = { ..._props, status: 'error' }

                    }
                    return (
                        renderC(newDescription)
                    )
                }}
            </Form.Item>
        )
    }


    function renderC(config: IMchc_FormDescriptions_Field) {
        const {
            formItemLayout = {} as IMchc_FormDescriptions_FormItemLayout,
            styles,
            key,
            inputProps = {},
            special_config,
            specialConfig,
        } = config
        const form_config = config as any
        const formDescriptionPath = get(config, 'path') as any
        const inputType = get(config, 'inputType') as any
        const formDescriptionSpecialConfig = safe_json_parse(specialConfig,) ?? safe_json_parse(special_config, {})
        const formItemOthers = { disabled: disableAll, }
        const label = config.label || config.title
        switch (inputType) {
            case 'straw':
                const straw_conf = formatFormConfig(config)
                const labelCol: any = straw_conf.formItemLayout?.labelCol ?? {}
                const wrapperCol: any = straw_conf.formItemLayout?.wrapperCol ?? {}
                const straw_props = straw_conf.inputProps ?? {}
                return <Row>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end', }} span={labelCol.span}>
                        <span style={{ marginBottom: 4, display: 'flex', alignItems: 'center', }}>{render_form_label(straw_conf)}{straw_conf.label ? <span style={{ margin: '0 8px 0 2px' }}>:</span> : ''}</span>
                    </Col>
                    <Col span={wrapperCol.span}>
                        <Space.Compact rootClassName={my_styles.compact} style={{ width: '100%', }}
                            {...straw_props}
                        // size={_config.inputProps?.size ?? 'small'}
                        >
                            {
                                straw_conf.children?.map(c => {
                                    if (!c || [false, 0].includes(c.isActive!)) return null
                                    // c.styles = { width: c.inputProps?.width ?? '100%' } // 必须设置 100%，否则一些输入框长度有问题
                                    // c.styles = { width: c.inputProps?.width ?? 'auto' } // 必须设置 100%，否则一些输入框长度有问题
                                    return <RenderFormSectionComponent
                                        // style={{ margin: 0 }}
                                        disableAll={disableAll}
                                        renderEditItem={renderEditItem} formDescription={c} />
                                })
                            }
                        </Space.Compact>
                    </Col>
                </Row>

            case 'title':
                // 显示小标题
                return (
                    <div style={{ padding: '4px 0', fontWeight: (inputProps?.bold ?? true) ? 'bold' : '', fontSize: (inputProps.bold ?? true) ? 18 : 14, color: '#666', ...styles }}>
                        {inputProps.title || label}
                    </div>
                );


            case 'radio_group':
                return renderEditItem(
                    config,
                    <Radio.Group {...formItemOthers} {...get(config, 'inputProps')} />,
                    {
                        ...formItemLayout,
                        styles: get(config, 'styles'),
                    }
                );
            case 'normal_select':
                return renderEditItem(
                    form_config,
                    <NormalSelect
                        type={get(formDescriptionSpecialConfig, 'type')}
                        showSearch={get(formDescriptionSpecialConfig, 'showSearch')}
                        autoWrite={get(formDescriptionSpecialConfig, 'autoWrite')}
                        popupMatchSelectWidth={get(formDescriptionSpecialConfig, 'popupMatchSelectWidth')}
                        {...formItemOthers}
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'dictionary_select':
            //     return renderEditItem(formDescriptionKey, <ConfigComponents_DictionarySelect {...formItemOthers} config={config} />, {
            //         ...formItemLayout,
            //         styles,
            //     });
            case 'country_select':
                return renderEditItem(
                    form_config,
                    <CountrySelect {...formItemOthers} language="zh-CN" placeholder="请选择国籍" />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'dysmenorrhea_radio':
                return renderEditItem(
                    form_config,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'true_or_false_radio':
                return renderEditItem(
                    form_config,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pregnant_radio':
                return renderEditItem(
                    form_config,
                    <Radio.Group {...formItemOthers}>
                        <Radio value={false}>否</Radio>
                        <Radio value={true}>是</Radio>
                    </Radio.Group>,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'radio_with_input':
                return renderEditItem(form_config, <RadioWithInput {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'radio_input':
                return renderEditItem(
                    form_config,
                    <RadioInput name={config.name} {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'checkbox_with_input':
                return renderEditItem(form_config, <CheckboxWithInput {...formItemOthers} config={config} formSection />, {
                    ...formItemLayout,
                    styles,
                });
            case 'checkbox_with_inputv2':
                return renderEditItem(
                    form_config,
                    <CheckboxWithInputv2 {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );





            case 'checkbox_with_single_input':
                return renderEditItem(
                    config,
                    <CheckboxWithSingleInput {...formItemOthers} config={config} />,
                    formItemLayout
                );
            case 'pure_checkbox':
                return renderEditItem(
                    config,
                    <PureCheckbox {...formItemOthers} config={config} />,
                    formItemLayout
                );
            case 'checkbox_group':
                return renderEditItem(form_config, <CheckboxGroup {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'select_with_none_option':
                return renderEditItem(
                    form_config,
                    <SelectWithNoneOption {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'select_with_options':
            //     return renderEditItem(form_config, <SelectWithOptions {...formItemOthers} config={config} />, {
            //         ...formItemLayout,
            //         styles,
            //     });
            case 'radio_with_input_number':
                return renderEditItem(
                    form_config,
                    <RadioWithInputNumber {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'pregnancy_history':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <PregnancyHistory {...formItemOthers} config={formDescription} form={form} />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'pregnancy_history_v2':
                return renderEditItem(
                    form_config,
                    <PregnancyHistoryV2 {...formItemOthers} {...inputProps} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'highrisk_sign':
                return renderEditItem(
                    form_config,
                    <HighriskSign {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'referral_register':
                return renderEditItem(
                    form_config,
                    <ReferralRegister {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'referral_to_register':
                return renderEditItem(
                    form_config,
                    <ReferralToRegister {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'record_state':
                return renderEditItem(
                    form_config,
                    <RecordState {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pressure':
                return renderEditItem(
                    form_config,
                    <PressureInput {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'pressure-v2':
                return renderEditItem(
                    form_config,
                    <PressureInputV2 name={config.name} {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );





            // case 'fetus_appendages':
            //     return renderEditItem(
            //         form_config,
            //         <FoetalAppendage
            //             {...formItemOthers}
            //             {...inputProps}
            //             renderEditItem={renderEditItem}
            //             form={form} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'noenate_record':
                return renderEditItem(
                    form_config,
                    <NoenateRecord
                        {...formItemOthers}
                        {...inputProps}
                        renderEditItem={renderEditItem}
                        form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multiple_input_with_label':
                return renderEditItem(
                    form_config,
                    <MultipleInputWithLabel {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'input_with_label':
                return renderEditItem(form_config, <InputWithLabel {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'input_with_range':
                return renderEditItem(form_config, <InputWithRange {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'input_with_range_tip':
                return renderEditItem(form_config, <InputWithRangTip {...formItemOthers} config={config} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'id_number_input':
                return renderEditItem(
                    form_config,
                    <InputWithTitle
                        {...formItemOthers}
                        {...inputProps}
                        onChange={get(events, 'handleIDNumberChange')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'cron':
            //     return renderEditItem(form_config, <CronSelect {...formItemOthers} {...inputProps} />, {
            //         ...formItemLayout,
            //         styles,
            //     });
            case 'trigger_type_select':
                return renderEditItem(
                    form_config,
                    <TriggerTypeSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'text_area':
            case 'TextArea':
                return renderEditItem(
                    form_config,
                    <Input.TextArea {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'parent_select':
                return renderEditItem(
                    form_config,
                    <ParentPermissionSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'password':
                return renderEditItem(
                    form_config,
                    <Input.Password {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'auto_complete':
                return renderEditItem(form_config, <AutoComplete {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });

            case 'async_autoComplete':
                // console.log('-------测试-------', formItemOthers, inputProps);
                return renderEditItem(form_config, <AsyncAutoComplete {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'validdate':
                return renderEditItem(
                    form_config,
                    <DataSelect
                        {...formItemOthers}
                        dataSource={[
                            { id: 30, name: '30天' },
                            { id: 60, name: '60天' },
                            { id: 90, name: '90天' },
                            { id: 280, name: '一个孕周' },
                        ]}
                        valueKey="id"
                        labelKey="name" />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'editor':
            //   return renderEditItem(formDescriptionKey, <CustomEditor {...inputProps} />, {
            //     ...formItemLayout,
            //     styles,
            //   });
            // case 'product':
            //     return get(config, 'viewOnly')
            //         ? renderEditItem(
            //             form_config,
            //             <span>{get(keyBy(products, 'id'), `${get(data, formDescriptionPath)}.name`)}</span>
            //         )
            //         : renderEditItem(
            //             form_config,
            //             <DataSelect
            //                 {...formItemOthers}
            //                 url="/products"
            //                 valueKey="id"
            //                 labelKey="name"
            //                 {...inputProps} />,
            //             {
            //                 ...formItemLayout,
            //                 styles,
            //             }
            //         );
            case 'roles':
                return renderEditItem(
                    form_config,
                    // <DataSelect
                    //     {...formItemOthers}
                    //     url="/groups"
                    //     valueKey="id"
                    //     labelKey="nickname"
                    //     mode="multiple"
                    //     {...inputProps} />,
                    <RolesPicker {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'common_labels_select':
                return renderEditItem(
                    form_config,
                    <DataSelect
                        {...formItemOthers}
                        url="/common-labels?page=0&size=50"
                        valueKey="id"
                        labelKey="name"
                        mode="multiple"
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'tube_bed_doctor_select':
                return renderEditItem(
                    form_config,
                    <DataSelectWithAutoInput {...formItemOthers} {...inputProps} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'device_status':
                return renderEditItem(
                    form_config,
                    <DeviceStatusSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'address':
                return renderEditItem(
                    form_config,
                    <CascaderAddress

                        needStreet={get(formDescriptionSpecialConfig, 'needStreet')}
                        onExtra={get(events, 'handleIDNumberChange')}
                        {...formItemOthers}
                        {...inputProps}
                        name={form_config}
                    />,

                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'permission_type':
                return renderEditItem(
                    form_config,
                    <PermissionTypeSelect {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'upload_img':
            //   return renderEditItem(formDescriptionKey, <UploadImg {...inputProps} allowUploadImages={10} />, {
            //     ...formItemLayout,
            //     styles,
            //   });TimePicker
            // case 'single_date_picker':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <DatePickerCus {...formItemOthers} {...inputProps} config={config} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'data_picker_checkbox':
                return renderEditItem(
                    form_config,
                    <DataPickWithCheck {...formItemOthers} {...inputProps} config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'range_date_picker':
                return renderEditItem(form_config, <RangePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'RangePicker':
                return renderEditItem(form_config, <MyRangePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'single_time_picker':
                return renderEditItem(form_config, <TimePicker {...formItemOthers} {...inputProps} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'date_time_picker':
                return renderEditItem(
                    form_config,
                    <CusDataTimePicker {...formItemOthers} {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'apgar_score_input':
                return renderEditItem(
                    form_config,
                    <ApgarScoreInput {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'mobile_editor':
                return renderEditItem(
                    form_config,
                    <MobileEditor {...formItemOthers} config={formDescription} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'image_upload_preview':
                return renderEditItem(
                    form_config,
                    <ImageUploadPreview {...formItemOthers} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'image_upload_preview_Intranet':
                return renderEditItem(
                    form_config,
                    <ImageUploadPreviewIntranet
                        {...formItemOthers}
                        form={form}
                        {...inputProps}
                    />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'upload_file':
                return renderEditItem(
                    form_config,
                    <UploadFile {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'upload_file_url_edit':
                return renderEditItem(
                    form_config,
                    <UploadFileUrlEdit {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'blood_and_thalassemia':
                return renderEditItem(
                    form_config,
                    <BloodAndThalassemia {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textarea':
                return renderEditItem(
                    form_config,
                    <TemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textareav2':
                return renderEditItem(
                    form_config,
                    <TemplateTextareav2
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'template_textareav3':
                return renderEditItem(
                    form_config,
                    <TemplateTextareav3
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            // case 'template_textrootcauseDeath':
            //     return renderEditItem(
            //         form_config,
            //         <TemplateTextrootcauseDeath
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             patientId={get(extraData, 'patient.id')}
            //             admissionId={get(data, 'id')}
            //             pregnancyId={get(data, 'pregnancy.id')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );

            // case 'template_textDeath1':
            //     return renderEditItem(
            //         form_config,
            //         // Deathclassification
            //         <Deathclassification1
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             patientId={get(extraData, 'patient.id')}
            //             admissionId={get(data, 'id')}
            //             pregnancyId={get(data, 'pregnancy.id')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'template_textDeath2':
            //     return renderEditItem(
            //         form_config,
            //         // Deathclassification
            //         <Deathclassification2
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             patientId={get(extraData, 'patient.id')}
            //             admissionId={get(data, 'id')}
            //             pregnancyId={get(data, 'pregnancy.id')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'gynaecology_template_textarea':
                return renderEditItem(
                    form_config,
                    <GynaecologyTemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'operation_template_textarea':
                return renderEditItem(
                    form_config,
                    <GynaecologyOperationTemplateTextarea
                        {...formItemOthers}
                        config={config}
                        form={form}
                        patientId={get(extraData, 'patient.id')}
                        admissionId={get(data, 'id')}
                        pregnancyId={get(data, 'pregnancy.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            // case 'inspection_result_textarea':
            //     // 产时保健-入院登记-B超(超声检查)
            //     return renderEditItem(
            //         form_config,
            //         <InspectionResultTextarea
            //             {...formItemOthers}
            //             {...inputProps}
            //             form={form}
            //             patientId={get(extraData, 'patient.id')}
            //             pregnancyId={get(data, 'pregnancy.id')}
            //             admissionId={get(data, 'id')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'ultrosound_result_textarea':
            //     // 产时保健-入院登记-检验(检验检查)
            //     return renderEditItem(
            //         form_config,
            //         <UltrosoundResultTextarea
            //             {...formItemOthers}
            //             {...inputProps}
            //             form={form}
            //             patientId={get(extraData, 'patient.id')}
            //             pregnancyId={get(data, 'pregnancy.id')}
            //             admissionId={get(data, 'id')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'middle_ultsounds':
            //     return renderEditItem(
            //         form_config,
            //         <MiddleUltsounds {...formItemOthers} config={config} form={form} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'post_partumFetal':
                return renderEditItem(
                    form_config,
                    <PostpartumFetal {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'post_partum_carerecord_Table2':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PostpartumCarerecordTable2 {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'obser_magnesium_sulphate_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <ObserMagnesiumsulphateTable {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'post_urinary_retention_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PostUrinaryretentionTable {...formItemOthers} config={config} {...props} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'middle_ultsounds_single':
            //     return renderEditItem(
            //         form_config,
            //         <MiddleUltsoundsSingle {...formItemOthers} config={config} form={form} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'calculate-score-table':
            //     return renderEditItem(
            //         form_config,
            //         <CalculateScoreTable {...formDescriptionSpecialConfig} config={config} form={form} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'fetal_nt_check':
                return renderEditItem(
                    form_config,
                    <FetalNTCheck {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'blood_pressure':
                return renderEditItem(
                    form_config,
                    <BloodPressure {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'edit_in_table':
                return renderEditItem(
                    form_config,
                    <CustomEditInTable {...formItemOthers} {...inputProps} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );


            // case 'normal_nursing_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NormalNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             data={props.data}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'pre_deliver_nursing_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PreDeliverNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'past_delivery_nursing_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <PastDeliveryNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'special_nursing_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <SpecialNursingTable {...formItemOthers} config={config} form={form} onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );

            // case 'neonatal_care_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NeonatalCareRecordTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'blood_sugar_nursing_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <BloodSugarNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'temperature_nursing_Table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <TemperatureNursingTable
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'procedure_records':
                return renderEditItem(
                    form_config,
                    <ProcedureRecords {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'procedure_cystocentesis_records':
                return renderEditItem(
                    form_config,
                    <ProcedureCystocentesis {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'select_tag_with_options':
                return renderEditItem(
                    form_config,
                    <SelectTagWithOptions {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'select_with_options_or_input':
                return renderEditItem(
                    form_config,
                    <SelectWithOptionsOrInput {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );



            case 'referral_organization_select':
                return renderEditItem(
                    form_config,
                    <ReferralOrganizationSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'age_select':
                return renderEditItem(
                    form_config,
                    <AgeSelect {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'tree_select_v2':
                return renderEditItem(
                    form_config,
                    <CustomTreeSelect {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis':
                return renderEditItem(
                    form_config,
                    <Diagnosis {...formItemOthers} {...formDescriptionSpecialConfig} patientId={get(extraData, 'patient.id')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'image_editor':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <ImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'gynaecology_image_editor':
                return renderEditItem(
                    form_config,
                    <MyImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );
            case 'MyImageEditor':
                return renderEditItem(
                    form_config,
                    <MyImageEditor {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    },
                );

            case 'appgar':
                return renderEditItem(
                    form_config,
                    <Appgar {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'nurse_children':
                return renderEditItem(
                    form_config,
                    <NurseChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nurse_children2':
                return renderEditItem(
                    form_config,
                    <NurseChildren2 {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'caesarean_children':
                return renderEditItem(
                    form_config,
                    <CaesareanChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'birth_certificate_children':
            //     return renderEditItem(
            //         form_config,
            //         <BirthCertificateChildren {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'shift_patients':
                return renderEditItem(
                    form_config,
                    <ShiftPatients
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        {...props.data}
                        form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'neonatal_scale_examination':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NeonatalScaleExamination
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //             defaultInputData={extraData}
            //             onRef={get(events, 'onRef')}
            //         />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            // case 'vagina_struments_record_form':
            //     return <VaginaStrumentsRecordForm {...formItemOthers} config={config} form={form} />;
            // case 'family_tumor_history':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <FamilyTumorHistory {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // 催产素的表格
            // case 'oxytocin_table':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <OxytocinTable {...formItemOthers} config={config} form={form} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'fetal_ultrasound':
            //     return renderEditItem(
            //         form_config,
            //         <FetalUltrasound {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'checkbox_group_object':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <CheckboxGroupObject {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'labor_process':
                return renderEditItem(
                    form_config,
                    <LaborProcess {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'labor_processV2':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <LaborProcess2 {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'nursing_fetus':
                return renderEditItem(
                    form_config,
                    <NursingFetus {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nursing_fetusv2':
                return renderEditItem(
                    form_config,
                    <NursingFetusv2
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...inputProps}
                        {...extraData}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'nursing_fetusv3':
                return renderEditItem(
                    form_config,
                    <NursingFetusv3
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        onRef={get(events, 'onRef')} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'nursing_fetusv4':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <NursingFetusv4
            //             {...formItemOthers}
            //             {...formDescriptionSpecialConfig}
            //             {...extraData}
            //             onRef={get(events, 'onRef')} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'knowledge_base':
                return renderEditItem(
                    form_config,
                    <KnowledgeBase {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'optimize_edit_in_table':
                const input_props = { input_props: formDescriptionSpecialConfig };
                return renderEditItem(form_config, <OptimizeEditInTable {...formItemOthers} {...input_props} />, {
                    ...formItemLayout,
                    styles,
                });
            case 'induced_fetus':
                return renderEditItem(
                    form_config,
                    <InducedFetus {...formItemOthers} {...formDescriptionSpecialConfig} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list':
                return renderEditItem(
                    form_config,
                    <DiagnosisList {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list_v2':
                return renderEditItem(
                    form_config,
                    <DiagnosisListv2 {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'diagnosis_list_induced':
                return renderEditItem(
                    form_config,
                    <DiagnosisListInduced {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'bregma_group':
                return renderEditItem(
                    form_config,
                    <BregmaGroup {...config} {...formDescriptionSpecialConfig} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multiple_input_group':
                // 多字段多表单聚集
                return renderEditItem(
                    form_config,
                    <MultipleInputGroup {...config} {...formItemOthers} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'single_selector':
                return renderEditItem(
                    form_config,
                    <SingleSelector {...config} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'multi_selector':
                return renderEditItem(
                    form_config,
                    <MultiSelector {...config} {...formDescriptionSpecialConfig} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'button':

            case 'MyButton':
                return renderEditItem(
                    config,
                    <OkButton disabled={disableAll} primary btn_text={inputProps.btn_text || label} name={key} key={key} form={form} {...(inputProps as any)} />
                );

            case 'node':
                return inputProps.standalone ? (inputProps?.node ?? null) : renderEditItem(
                    form_config,
                    inputProps?.node ?? null
                );
            case 'component':
                const C1 = inputProps?.component
                return inputProps.standalone ? (C1 ? <C1 {...inputProps} /> : null) : renderEditItem(
                    form_config,
                    C1 ? <C1 {...inputProps} form={form} /> : null
                );
            // case 'check_invert_button':

            //     return renderEditItem(
            //         formDescriptionKey,
            //         <CheckAndCancelButton
            //             form={form}
            //             {...config}
            //             {...inputProps}
            //             onClick={get(events, 'handleButton')} />
            //     );
            case 'view_only':
                return renderEditItem(form_config, <span>{get(data, formDescriptionPath)}</span>);


            case 'treatment_program':
                return renderEditItem(
                    form_config,
                    <TreatmentProgramBaisc {...formItemOthers} config={config} form={form} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'treatment_program_table':
            //   return renderEditItem(
            //     formDescriptionKey,
            //     <TreatmentProgramTable
            //       {...formItemOthers}
            //       config={formDescription}
            //       form={form}
            //       programData={data}
            //     // projectId={get(data, 'id')}
            //     />,
            //     {
            //       ...formItemLayout,
            //       styles,
            //     },
            //   );
            case 'hepatitis-new-baby':
                return renderEditItem(
                    form_config,
                    <HepatitsNewBabyCom
                        {...formItemOthers}
                        {...formDescriptionSpecialConfig}
                        {...extraData}
                        config={config} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'border_title':
                return renderEditItem(
                    form_config,
                    <BorderTitle {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'cure-state':
            //     return renderEditItem(
            //         form_config,
            //         <CureState {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            // case 'syphilis-tested':
            //     return renderEditItem(
            //         form_config,
            //         <SyphilisTested
            //             {...formItemOthers}
            //             {...formDescriptionSpecialConfig}
            //             config={config}
            //             {...extraData} />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         }
            //     );
            case 'native-place':
                return renderEditItem(
                    form_config,
                    <NativePlace {...formItemOthers} {...formDescriptionSpecialConfig} config={config} {...extraData} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );

            case 'normal_checkbox_with_input':
                return renderEditItem(
                    form_config,
                    <NormalCheckboxWithInput
                        config={config}

                    />,
                    {
                        ...formItemLayout,
                    },
                );
            case 'c':
                return renderEditItem(
                    form_config,
                    <NormalCheckboxWithInput {...formItemOthers} config={config} />,
                    {
                        ...formItemLayout,
                    }
                );

            case 'data_select_with_options_or_input':
                return renderEditItem(
                    form_config,
                    <DataSelectWithOptionsOrInput
                        {...formItemOthers}
                        {...inputProps}
                        config={config}
                        form={form}
                        programData={data} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            case 'search_select':
                return renderEditItem(
                    form_config,
                    <MySearchSelect
                        name={form_config}
                        {...inputProps} />,
                    {
                        ...formItemLayout,
                        styles,
                    }
                );
            // case 'rowoftire_record_baby':
            //     return renderEditItem(
            //         formDescriptionKey,
            //         <RowoftireRecordBaby
            //             {...formItemOthers}
            //             config={config}
            //             form={form}
            //         // projectId={get(data, 'id')}
            //         />,
            //         {
            //             ...formItemLayout,
            //             styles,
            //         },
            //     );
            default:
                const C: any = getFormSectionComponent(inputType)
                const node: any = <InterceptComponent
                    {...formDescriptionSpecialConfig}
                    {...formItemOthers}
                    C={C}
                    formName={formName}
                    config={config}
                    form={form}
                />
                return config?.plainForm ? node : renderEditItem(
                    form_config,
                    node,
                    {
                        ...formItemLayout,
                        styles,
                    }
                )
        }
    }

    return renderC(formDescription)
}


export default RenderFormSectionComponent