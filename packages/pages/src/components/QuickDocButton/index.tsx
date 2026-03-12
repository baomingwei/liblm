import { MyIcon, OkButton } from "@lm_fe/components_m";
import { mchcEnv } from "@lm_fe/env";
import { IMchc_Pregnancy, SLocal_Calculator } from "@lm_fe/service";
import { getSearchParamsAll, request } from "@lm_fe/utils";
import { ButtonProps } from "antd";
import { get, keys } from "lodash";
import React from "react";
import { mchcModal__ } from "src/modals";
type TPageType = '单页' | '非单页'
export interface QuickDocButtonProps extends Omit<ButtonProps, 'form'> {
    page_type: TPageType
}

export function quick_doc(page_type: TPageType, onSubmit = (data: IMchc_Pregnancy) => { }) {
    const single = page_type === '单页'

    mchcModal__.open('modal_form', {

        title: `${page_type}快捷建档`,
        modal_data: {

            bf_title: `门诊-快捷建档${single ? '' : '非单页'}`,
            async getInitialData() {
                if (!single) return {}
                const res = await request.post('/api/doctor/initPregnancyForQuickDocument', getSearchParamsAll(), { unboxing: true })
                return res.data
            },
            async onValuesChange(changedValues, values, form) {
                const __key = keys(changedValues)[0]
                const is末次月经 = __key === 'lmp'
                if (is末次月经) {
                    const lmp = get(changedValues, 'lmp');
                    const { edd, sureEdd, gestationalWeek } = await SLocal_Calculator.lmp_计算_edd_gestationalWeek(lmp);
                    console.log({ edd, sureEdd, gestationalWeek })
                    form.setFieldsValue({
                        edd,
                        sureEdd,
                        gestationalWeek,
                    });
                }
            },
            async onSubmit(v) {
                const data = Object.assign(v, {
                    fileType: single ? 1 : 2,
                })
                const res = await request.post('/api/pregnancies', data, { successText: '操作成功' })
                if (single) {
                    setTimeout(mchcEnv.reload, 1000)
                } else {
                    onSubmit(res.data)
                    return true
                }

            },
            formDescriptions: () => import('./form_config')
        }
    })
};

export function QuickDocButton(props: QuickDocButtonProps) {
    const { page_type } = props



    return (
        <OkButton primary icon={<MyIcon value='UserAddOutlined' />} {...props} onClick={() => quick_doc(page_type)}>快捷建档</OkButton>
    );
}
