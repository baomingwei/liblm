import { MyFormSectionForm } from "@lm_fe/components_m";
import { rt_ctx } from "@lm_fe/env";
import { BF_Wrap2 } from "@lm_fe/pages";
import { SMchc_Doctor, TIdTypeCompatible } from "@lm_fe/service";
import { FormInstance } from "antd";
import { useEffect } from "react";
const ctx = rt_ctx
const React = ctx.React

export default function ChaoShen({ form, pid, on_finish }: { on_finish: () => void, form: FormInstance, pid: TIdTypeCompatible }) {

    useEffect(() => {
        SMchc_Doctor.getFirstVisitPresentmh_out(pid).then(v => {
            form.setFieldsValue(v)
        })

        return () => {

        }
    }, [])


    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '门诊-现病史-超声?',
            tableColumns: () => import('../../../../.initial/components/XianBingShi/config')
        },
    }, { less: true })

    return <Wrap>
        <MyFormSectionForm
            onFinish={(v) => {
                SMchc_Doctor.updateFirstVisitPresentmh_out(v)
                    .then((v) => {
                        form.setFieldsValue(v)
                        on_finish()
                    })
            }}
            form={form} bf_config={config}
        />
    </Wrap>
}