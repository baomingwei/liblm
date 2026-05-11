import { ICommonOption, mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { form_config_家族史 } from "../../../common";
import { marry_deps } from "./common";
import { 既往史_pack } from "./既往史";
import { conceive_mode_conf, not_yes_input } from "@lm_fe/pages";
import { 个人史_pack } from "./个人史";


const 有无option: ICommonOption[] = [
    {
        "value": false,
        "label": "无"
    },
    {
        "value": true,
        "label": "有",
        "warning": true,
        "inputType": "Input"
    }
]


export const 本次孕产信息_config = () => {
    const has_艾梅乙 = mchcEnv.in(['广三', '广州市八'])
    const 艾梅乙_props = {
        isActive: has_艾梅乙,
        required: true,
        showDeps: {
            'pregnancyInfo.checkAmy': [1]
        },
    }
    const has_艾梅乙_男方 = mchcEnv.in(['广州市八'])
    const 艾梅乙_男方_props = {
        isActive: has_艾梅乙_男方,
        // required: true,
        showDeps: {
            'pregnancyInfo.partnerCheckAmy': [1]
        },
    }

    const config: IMchc_FormDescriptions_Field_Nullable = {
        "name": "本次孕产信息",
        "children": [
            {
                "key": "pregnancyInfo.createDate",
                "label": "建档日期",
                "inputType": "single_date_picker",

                "inputProps": { "placeholder": "请输入建档日期", "maxDate": "now" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.checkupNO",
                "label": "产检编号",
                "inputType": "input",

                "inputProps": { "placeholder": "请输入产检编号", "disabled": false },
                layout: '1/3',
            },
            // {
            //     "key": "pregnancyInfo.healthHandbookNO",
            //     "label": "保健手册号",
            //     "inputType": "input",
            //     "inputProps": { "placeholder": "请输入保健手册号" },
            //     layout: '1/3',
            // },
            {
                "key": "pregnancyInfo.lmp",
                "label": "末次月经",
                "inputType": "single_date_picker",
                required: mchcEnv.in(['南医增城']),

                "inputProps": { "placeholder": "请输入末次月经", "maxDate": "now" },
                layout: '1/3',
                "isNewRow": 1,
            }, {
                "key": "pregnancyInfo.edd",
                "label": "预产期-日期",
                "inputType": "single_date_picker",

                "inputProps": { "placeholder": "请输入预产期-日期", "minDate": "now" },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.sureEdd",
                "label": "预产期-B超",
                "inputType": "single_date_picker",
                "rules": [{ "required": true, "message": "预产期-B超是必填项" }],
                "inputProps": { "placeholder": "请输入预产期-B超", "minDate": "now" },
                layout: '1/3',
            },


            {
                "key": "pregnancyInfo.preweight",
                "label": "孕前体重(kg)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入孕前体重(kg)", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.preheight",
                "label": "孕前身高(cm)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入孕前身高(cm)", "style": { "width": 156 } },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.bmi",
                "label": "BMI",
                "inputType": "input_with_range",

                "specialConfig": { "tip": "BMI的正常范围值是18.5~24.9kg/㎡", "min": 18.5, "max": 24.9 },
                "inputProps": { "placeholder": "请输入BMI", "style": { "width": 156 }, "disabled": true },
                layout: '1/3',
            },
            conceive_mode_conf(),
            // {
            //     "key": "pregnancyInfo.conceiveMode__",
            //     "label": "受孕方式",
            //     "inputType": "MC",
            //     required: mchcEnv.in(['南医增城', '越秀妇幼']) ? false : true,

            //     "inputProps": {
            //         marshal: 1,
            //         options: [
            //             { value: 2, label: '自然' },
            //             {
            //                 value: 1, label: 'IVF', parentheses: true, inputType: 'ArrayInput', props: {
            //                     // marshal: 1,
            //                     options: [
            //                         { inputType: 'DatePicker', prefix: '移植时间' },
            //                         { inputType: 'Input', prefix: '第', suffix: '天胚胎' },
            //                         { inputType: 'Input', prefix: '胚胎数', },
            //                     ]
            //                 }
            //             },
            //             { "value": 4, "label": "ICSI", },
            //             { "value": 5, "label": "PGT", },
            //             { "value": 6, "label": "AIH", },
            //             { "value": 7, "label": "AID", },
            //             {
            //                 "value": 3, "label": "其他", inputType: 'Input',
            //             }
            //         ]
            //     },
            //     layout: '1/1',
            // },
            {
                "key": "pregnancyInfo.maritalAge",
                "label": "结婚年龄",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入结婚年龄", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menarche",
                "label": "初潮(岁)",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入初潮(岁)", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualCycle",
                "label": "月经周期",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入月经周期", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualPeriod",
                "label": "月经持续天数",
                "inputType": "input_number",

                "inputProps": { "placeholder": "请输入痛经持续天数", "style": { "width": 156 } },
                layout: '1/3',
            }, {
                "key": "pregnancyInfo.menstrualVolume",
                "label": "经量",
                "inputType": "checkbox_group",

                "specialConfig": { "type": "single", "options": [{ "value": "多", "label": "多", "withInput": false, "span": 6 }, { "value": "中", "label": "中", "withInput": false, "span": 6 }, { "value": "少", "label": "少", "withInput": false, "span": 6 }] },
                "inputProps": { "placeholder": "请输入经量" },
                layout: '1/3',
            },
            {
                "key": "本次孕产信息一键勾选",
                "label": "一键勾选",
                "inputType": "check_invert_button",
                layout: '1/3',
            },
            // {
            //     "key": "pregnancyInfo.dysmenorrhea__",
            //     "label": "痛经",
            //     "inputType": "MC",

            //     "inputProps": { marshal: 1, options: [{ value: false, label: '否' }, { value: true, label: '是', inputType: 'MyInput' }] },
            //     layout: '1/3',
            // },

            not_yes_input('pregnancyInfo.dysmenorrhea', '痛经'),
            {
                "key": "pregnancyInfo.nearRelation",
                "label": "近亲结婚",
                "inputType": "MC",

                "inputProps": { marshal: 0, options: [{ value: false, label: '否' }, { value: true, label: '是', }] },


                layout: '1/3',
            },
            ...个人史_pack(),








            ...既往史_pack(),



            // {
            //     "key": "pregnancyInfo.fmh",
            //     "label": "家族史",
            //     "inputType": "checkbox_group_object",
            //     required: mchcEnv.in(['广三']),
            //     "inputProps": {
            //         uniqueKey: '家族史',
            //     },
            //     layout: '1/1',
            //     "isNewRow": 1,
            // },

            form_config_家族史('pregnancyInfo'),
            {
                "key": "pregnancyInfo.personalBg",
                "label": "女方ABO血型",
                "inputType": "MC",
                required: mchcEnv.in(['广三']),

                // "specialConfig": { "type": "aboMapping" },

                "inputProps": { uniqueKey: 'aboMapping', marshal: 0 },

                // "inputProps": { "placeholder": "请选择ABO血型" },
                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.personalRh",
                "label": "女方Rh血型",
                "inputType": "MC",
                required: mchcEnv.in(['广三']),
                "inputProps": { uniqueKey: 'rhMapping', marshal: 0 },

                layout: '1/3',
            },
            {
                "key": "pregnancyInfo.rhNegativeReport",
                "label": "女方Rh阴性上报",
                isActive: mchcEnv.in(['广州市八']),
                showDeps: {
                    'pregnancyInfo.personalRh': v => v == 1
                },
                "inputType": "MC",

                "inputProps": {
                    options: '否,是',
                    marshal: 0
                },
                layout: '1/3',
            },

            {
                "key": "pregnancyInfo.partnerBg",
                "label": "男方ABO血型",
                "inputType": "MC",
                requiredDeps: {
                    ...marry_deps
                },
                // "specialConfig": { "type": "aboMapping" },
                "inputProps": { uniqueKey: 'aboMapping', marshal: 0 },

                layout: '1/3',
            }, {
                "key": "pregnancyInfo.partnerRh",
                "label": "男方Rh血型",
                "inputType": "MC",
                requiredDeps: {
                    ...marry_deps
                },
                // "specialConfig": { "type": "rhMapping" },
                "inputProps": { uniqueKey: 'rhMapping', marshal: 0 },

                layout: '1/3',
            }, {
                "key": "pregnancyInfo.deliveryPoint",
                "label": mchcEnv.in(['南医增城']) ? '建档医院' : '定点分娩医院',
                "inputType": "MC",
                "required": mchcEnv.in(['南医增城', '广三']),
                inputProps: { options: '本院、外院、未确定', marshal: 0 },
                layout: '1/3',
            },
            {
                title: '艾梅乙',
                children: [
                    {
                        "key": "pregnancyInfo.checkAmy",
                        "label": "是否检查",
                        isActive: has_艾梅乙,
                        isNewRow: 1,
                        required: true,
                        "inputType": "MC",
                        "inputProps": { "options": "无,有", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.checkHospital",
                        "label": "检测方",
                        ...艾梅乙_props,
                        "inputType": "MC",
                        "inputProps": { "options": '本院,外院i', marshal: 1 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.hivResult",
                        "label": "HIV结果",
                        ...艾梅乙_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.syphilisResult",
                        "label": "梅毒结果",
                        ...艾梅乙_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.hbvResult",
                        "label": "乙肝结果",
                        ...艾梅乙_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },

                    {
                        "key": "pregnancyInfo.partnerCheckAmy",
                        "label": "男方是否检查",
                        isActive: has_艾梅乙_男方,
                        isNewRow: 1,
                        required: true,
                        "inputType": "MC",
                        "inputProps": { "options": "无,有", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.partnerCheckHospital",
                        "label": "男方检测方",
                        ...艾梅乙_男方_props,
                        "inputType": "MC",
                        "inputProps": { "options": '本院,外院i', marshal: 1 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.partnerHivResult",
                        "label": "男方HIV结果",
                        ...艾梅乙_男方_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.partnerSyphilisResult",
                        "label": "男方梅毒结果",
                        ...艾梅乙_男方_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },
                    {
                        "key": "pregnancyInfo.partnerHbvResult",
                        "label": "男方乙肝结果",
                        ...艾梅乙_男方_props,
                        "inputType": "MC",
                        "inputProps": { "options": "阴性、阳性、未查", "marshal": 0 },
                        layout: '1/3',
                    },
                ]
            }
        ]
    }
    return config
}
