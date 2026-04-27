// import { ILmFormItemConfigMixin } from "@/lmTypes"
import { MyFormSection } from "@lm_fe/components_m";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { FormInstance } from "antd";
import React from "react";
// import { ArrayInput } from "../ArrayInput";

// import { HospitalTreeSelect } from "../../demain-components/HospitalTreeSelect";


export function MyBaseListRenderFormSection({ config, disabled, form }: { config: IMchc_FormDescriptions_Field_Nullable[], disabled?: boolean, form?: FormInstance }) {

    return (
        <MyFormSection form={form} defaultOptions={{}} inline formDescriptions={config.map(_ => {
            if (!_) return _
            const props = _.inputProps ?? _.props ?? {}
            props.allowClear = true
            if (['Select', 'select', 'MySelect', 'MS', 'MA', 'input', 'MI', 'MyInput'].includes(_.inputType!) && !_.inputProps?.width) {
                props.width = 128
            }
            _.inputProps = props

            return _
        })} disableAll={disabled} />

    )
}
