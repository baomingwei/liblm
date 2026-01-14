
import { MyFormSectionForm } from "@lm_fe/components_m";
import { BF_Wrap2 } from '@lm_fe/pages';
import { FormInstance } from "antd";
import React from "react";

import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo } from "@lm_fe/service";
import { filter_fds } from "../../../utils";
interface IProps {
    form?: FormInstance
    disableAll?: boolean
    headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
    diagnosesList: IMchc_Doctor_Diagnoses<"mchc">[]
}
interface IDataShape {
    name: string
}


function load_form_config() {
    // if (mchcEnv.is('广三')) return import('./广三')
    // if (mchcEnv.is('建瓯')) return import('./建瓯')
    return import('./default')
}



export default (props: IProps) => {
    const { diagnosesList, headerInfo, form } = props

    const { config, Wrap } = BF_Wrap2({ default_conf: { tableColumns: () => import('./default'), title: '复诊-产检信息' }, }, { headerInfo, form })

    const form_config = filter_fds(diagnosesList, config?.tableColumns)
    //@ts-ignore
    // return <MyFormSectionForm<IDataShape> formDescriptions={load_form_config} {...props} onValuesChange={(changedValues, values) => { }} />
    return <Wrap>

        <MyFormSectionForm<IDataShape> size='small' style={{ padding: '0 4px', overflow: 'hidden' }} formDescriptions={form_config} {...props} onValuesChange={(changedValues, values) => { }} />

    </Wrap>
}