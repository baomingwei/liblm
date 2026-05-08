import { MyFormSectionForm } from "@lm_fe/components_m";
import { mchcEvent } from "@lm_fe/env";
import { SMchc_Doctor, TIdTypeCompatible } from "@lm_fe/service";
import { FormInstance } from "antd";
import React, { useEffect } from "react";
import { BF_Form } from "src/components";
import { form_confg } from "./form_config";
interface IProps {
    form: FormInstance
    disabled?: boolean
    pregnancyId: TIdTypeCompatible
    on_finish: () => void
}

export default function DoctorEnd_检验检查_History(props: IProps) {
    const { pregnancyId, form, disabled, on_finish } = props

    useEffect(() => {


        return mchcEvent.on_rm('my_form', e => {
            if (e.type === 'onClick') {
                if (e.btnName === 'syncBtn') {
                    SMchc_Doctor.syncPatientReport(pregnancyId)
                        .then(r => {
                            form.setFieldsValue(r)
                        })
                }
                return
            }
        })
    }, [])


    return <BF_Form
        disabled={disabled}
        form={form}
        fallback_init={() => SMchc_Doctor.getLabExamOfOutpatient_out(pregnancyId)}
        on_finish={on_finish}
        fallback_finish={(v) =>
            SMchc_Doctor.updateLabExam_out(v)

        }
        default_conf={{ tableColumns: form_confg, title: "门诊-检验检查" }}
        history_args={{ relationId: pregnancyId }}

    />
}