
import { mchcEnv, rt_ctx } from "@lm_fe/env"
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service"
import { isEmpty, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils"
import { isObject, values } from "lodash"



export function conceive_mode_conf(conf: IMchc_FormDescriptions_Field = {},) {

    return defineFormConfig([
        {
            "key": "pregnancyInfo.conceiveMode__",
            "label": "受孕方式",
            "inputType": "MC",
            required: mchcEnv.in(['南医增城', '越秀妇幼']) ? false : true,

            "inputProps": {
                marshal: 1,
                options: [
                    { value: 2, label: '自然' },
                    {
                        value: 1, label: 'IVF', parentheses: true, inputType: 'ArrayInput', props: {
                            // marshal: 1,
                            options: [
                                { inputType: 'DatePicker', prefix: '移植时间' },
                                { inputType: 'input_number', prefix: '第', suffix: '天胚胎' },
                                { inputType: 'input_number', prefix: '胚胎数', },
                            ]
                        }
                    },
                    { "value": 4, "label": "ICSI", },
                    { "value": 5, "label": "PGT", },
                    { "value": 6, "label": "AIH", },
                    { "value": 7, "label": "AID", },
                    {
                        "value": 3, "label": "其他", inputType: 'Input',
                    }
                ]
            },
            layout: '1/1',
            ...conf,
        },
    ]).__lazy_config[0]
}
