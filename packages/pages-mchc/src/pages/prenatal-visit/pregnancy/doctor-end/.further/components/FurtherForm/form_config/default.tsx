import { mchcEnv, otherOptions, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { 门诊_胎儿_form } from "src/pages/prenatal-visit/pregnancy/utils";
import { diag_filter_map } from '../../../utils'
import { pressure_fd } from "@lm_fe/pages";
const ctx = rt_ctx
export default defineFormConfig(
    [
        {
            "key": "id",
            form_hidden: true,
        },
        {
            "key": "outEmrId",
            form_hidden: true,
        },
        {

            "key": "visitDate",
            "label": "日期",
            "inputType": "DatePicker",
            required: true,
            layout: '1/4',
        },
        {

            "key": "gestationalWeek",
            "label": "孕周",
            "inputType": "input",
            required: true,
            inputProps: {
                onFocus(e) {
                    ctx.mchcEvent.emit('my_form', {
                        type: 'onFocus',
                        name: 'gestationalWeek'
                    })
                }
            },
            layout: '1/4',
        },
        {

            "key": "physicalExam.height",
            "label": "身高",
            "inputType": "InputNumber",
            required: true,
            isActive: mchcEnv.in(['广州市八']),

            isNewRow: true,
            "inputProps": { 'unit': 'cm' },

            layout: '1/4',
        },
        {

            "key": "physicalExam.weight",
            "label": "体重",
            "inputType": "InputNumber",
            required: true,
            "inputProps": { 'unit': 'kg' },

            layout: '1/4',
        },
        {

            "key": "physicalExam.bmi",
            "label": "bmi",
            "inputType": "InputNumber",
            required: true,
            "inputProps": {},
            isActive: mchcEnv.in(['广州市八']),

            layout: '1/4',
        },


        pressure_fd(
            { label: '血压首测', isNewRow: true, },
            { name: 'physicalExam.systolic', required: true },
            { name: 'physicalExam.diastolic', required: true }
        ),
        pressure_fd(
            { label: '血压二测' },
            { name: 'physicalExam.systolic2' },
            { name: 'physicalExam.diastolic2' }
        ),
        pressure_fd(
            { label: '血压三测' },
            { name: 'physicalExam.systolic3' },
            { name: 'physicalExam.diastolic3' }
        ),


        {

            "key": "physicalExam.pulse",
            "label": "脉搏",
            "inputType": "InputNumber",
            "inputProps": { 'unit': '次/分', },
            layout: '1/4',

        },

        {

            "key": "chiefComplaint",
            "label": "主诉",
            "inputType": "textareaWithTemplate",
            isNewRow: 1,
            inputProps: {
                TemplateTextarea_type: [
                    { title: '科室', type: 16, depid: 2 },
                    { title: '个人', type: 17 },
                ]
            },
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '主诉模板', 'departmentTempalteType': 16, 'personalTempalteTType': 17, 'departmentId': 2 },
            layout: '1/2',
        },
        {

            "key": "phi",
            "label": "现病史",
            "inputType": "textareaWithTemplate",
            // "inputProps": { 'minRows': 2, 'maxRows': 5, 'title': '现病史模板', 'departmentTempalteType': 8, 'personalTempalteTType': 9, 'departmentId': 2 },
            inputProps: {
                TemplateTextarea_type: [
                    { title: '科室', type: 8, depid: 2 },
                    { title: '个人', type: 9 },
                ]
            },
            layout: '1/2',
        },
        {

            "key": "gynExam.fundalHeight",
            "label": "宫高",
            "inputType": "InputNumber",
            "inputProps": { 'unit': 'cm' },
            layout: '1/4',
            "isNewRow": 1,
        }, {

            "key": "gynExam.waistHip",
            "label": "腹围",
            "inputType": "InputNumber",
            "inputProps": { 'unit': 'cm' },
            layout: '1/4',
        }, {

            "key": "edema",
            "label": "下肢水肿",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('edemaOptions'), marshal: 0, },
            layout: '1/4',
        }, {

            "key": "gynExam.engagement",
            "label": "衔接",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('engagementOptions'), marshal: 0, },
            layout: '1/4',
        },

        门诊_胎儿_form,


        // {

        //     "key": "childUltrasounds",
        //     "label": "",
        //     "inputType": "array-custom",
        //     "inputProps": { 'array_title': '超声', 'config': [{ 'name': 'id', 'key': '.id', 'label': 'id', 'input_type': 'input', 'hidden': true, 'span': 5 }, { 'name': 'bpd', 'key': '.bpd', 'label': 'BPD', 'input_type': 'input', 'span': 6, 'unit': 'mm', 'input_props': { 'type': 'number' } }, { 'name': 'fetalweight', 'key': '.fetalweight', 'label': '胎儿体重', 'input_type': 'input', 'span': 6, 'unit': 'g', 'input_props': { 'type': 'number' } }, { 'name': 'afv', 'key': '.afv', 'label': 'AFV', 'input_type': 'input', 'span': 6, 'unit': 'mm', 'input_props': { 'type': 'number' } }, { 'name': 'ubf', 'key': '.ubf', 'label': '脐血流', 'input_type': 'input', 'span': 6 }] },
        //     "span": 24,
        //     "isNewRow": 1,
        // },
        {




            "name": "childUltrasounds",
            "label": "",
            "inputType": "ArrayPanel",
            inputProps: {
                marshal: 0,
                targetLabelCol: 2,
                tip: '胎儿超声',
                formDescriptions: [
                    { layout: '1/4', inputType: 'input', label: 'BPD', name: 'bpd', unit: 'mm', inputProps: { type: 'number', }, },
                    { layout: '1/4', inputType: 'input', label: '胎儿体重', name: 'fetalweight', unit: 'g', inputProps: { type: 'number', }, },
                    { layout: '1/4', inputType: 'input', label: 'AFV', name: 'afv', unit: 'mm', inputProps: { type: 'number', }, },
                    { layout: '1/4', inputType: 'input', label: '脐血流', name: 'ubf', unit: 'mm', inputProps: { type: 'number', }, },

                    { layout: '1/5', name: 'id', form_hidden: true },
                ]
            },
            usr1: diag_filter_map.ultrasounds,
            layout: '1/1',
        },

        {
            label: '妊娠糖尿病',
            usr1: diag_filter_map.diabetes,

            children: [
                {

                    "key": "gdm.fbg",
                    "label": "FBG",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'mmol/L' },
                    layout: '1/4',
                }, {

                    "key": "gdm.pbg2",
                    "label": "P2BG",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'mmol/L' },
                    layout: '1/4',
                }, {

                    "key": "gdm.hbalc",
                    "label": "HbA1C",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': '%' },
                    layout: '1/4',
                }, {

                    "key": "gdm.inslname",
                    "label": "胰岛素方案",
                    "inputType": "input",
                    layout: '1/1'
                },
            ]
        },
        {
            label: '妊娠高血压',
            usr1: diag_filter_map.hypertension,

            children: [
                {

                    "key": "pih.quality",
                    "label": "尿蛋白-定性",
                    "inputType": "input",
                    layout: '1/4',
                    "isNewRow": 1,
                }, {

                    "key": "pih.quantity",
                    "label": "24H定量",
                    "inputType": "input",
                    layout: '1/4',
                }, {

                    "key": "pih.medication",
                    "label": "用药方案",
                    "inputType": "MA",
                    "inputProps": { 'options': '拉贝洛尔,硝苯地平,硫酸镁' },
                    layout: '1/2',
                },
            ]
        },
        {
            label: '心脏病',
            usr1: diag_filter_map.coronary,

            children: [
                {

                    "key": "cardiacDisease.otherNote",
                    "label": "其他异常特征",
                    "inputType": "input",
                    layout: '1/1',
                },
                {

                    "key": "cardiacDisease.heartrate",
                    "label": "心率",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': '次/分' },
                    layout: '1/4',
                    "isNewRow": 1,
                },
                {

                    "key": "cardiacDisease.medication",
                    "label": "用药情况",
                    "inputType": "input",
                    layout: '3/4',
                },
            ]
        },
        {
            label: 'ICP',
            usr1: diag_filter_map.ICP,

            children: [
                {

                    "key": "icp.tba",
                    "label": "TBA",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'umol/L' },
                    layout: '1/4',
                    "isNewRow": 1,
                },
                {

                    "key": "icp.alt",
                    "label": "ALT",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'U/L' },
                    layout: '1/4',
                },
                {

                    "key": "icp.ast",
                    "label": "AST",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'U/L' },
                    layout: '1/4',
                },
            ]
        },
        {
            label: '甲减',
            usr1: diag_filter_map.hypothyroidism,

            children: [
                {

                    "key": "hypothyroidism.tsh",
                    "label": "TSH",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'uIU/ml' },
                    layout: '1/4',
                    "isNewRow": 1,
                },
                {

                    "key": "hypothyroidism.t4",
                    "label": "游离T4",
                    "inputType": "InputNumber",
                    "inputProps": { 'unit': 'pmol/L' },
                    layout: '1/4',
                },
            ]

        },
        // {

        //     "key": "inspection",
        //     "label": "检验检查",
        //     "inputType": "textareaWithBtn",
        //     isActive: !mchcEnv.in(['广州市八']),
        //     "inputProps": { 'minRows': 2, 'maxRows': 5, 'disabled': false },
        //     layout: '1/2',
        //     "isNewRow": 1,
        // }, 
        {

            "key": "inspection",
            "label": "检验检查",
            "inputType": "textareaWithResult",
            isActive: true,
            "inputProps": {
                'rows': 2,
                TemplateTextarea_type: [{ title: '检验结果', url: '/api/getLabExamImportTree' }, { title: '超声结果', url: '/api/getImageExamImportTree' }],
                gen_obj: function () {
                    return { pregnancyId: ctx.utils.single_id() }
                },
            },
            layout: '1/2',
            "isNewRow": 1,
        },
        {

            "key": "exam",
            "label": "辅助检查",
            "inputType": "textareaWithTemplate",
            inputProps: {
                TemplateTextarea_type: [
                    { title: '个人', type: 14 },
                    { title: '科室', type: 13, depid: 2 },
                ]
            },
            layout: '1/2',
        },
        {

            "key": "prescription",
            "label": "处理措施",
            "inputType": "textareaWithTemplate",
            inputProps: {
                TemplateTextarea_type: [
                    { title: '个人', type: 7 },
                    { title: '科室', type: 6, depid: 2 },
                ]
            },
            layout: '1/2',
        }, {

            "key": "appointmentType",
            "label": "下次复诊",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentTypeOptions'), marshal: 0, },
            layout: '1/4',
            "isNewRow": 1,
        }, {

            "key": "appointmentCycle",
            "label": "",
            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentCycleOptions'), marshal: 0, },


            "span": 2,
        }, {

            "key": "appointmentDate",
            "label": "",
            "inputType": "DatePicker",
            required: true,
            "span": 3,
        }, {

            "key": "appointmentPeriod",
            "label": "",
            isActive: !mchcEnv.in(['广州市八']),

            "inputType": "select",
            "inputProps": { 'options': mchcEnv.get_other_options('appointmentPeriodOptions'), marshal: 0, },
            "span": 2,
        }]
)
