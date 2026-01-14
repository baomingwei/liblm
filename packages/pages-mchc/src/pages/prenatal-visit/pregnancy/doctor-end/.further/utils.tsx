import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { expect_array, identity, isEmpty } from '@lm_fe/utils'
interface IPreDiagKeyword { diagKeyword: string[], }
/*关联表单关键词*/
export const diag_filter_map: { [x: string]: IPreDiagKeyword } = {
    diabetes: {
        diagKeyword: ['糖尿病', 'GDM', 'gdm'], //   诊断关键词

    },
    ultrasounds: {
        diagKeyword: ['双胎', '三胎', '多胎', '胎妊娠', '胎儿发育迟缓', '胎儿生长缓慢', '胎儿生长发育迟缓'],
    },
    hypertension: {
        diagKeyword: ['高血压', '子痫', '肾炎', '肾脏', '肾病', '红斑狼疮', '免疫系统疾病', 'SLE', 'sle', '风湿性关节炎', '类风湿性关节炎', '硬皮病',],

    },
    coronary: {
        diagKeyword: ['心脏', '心肌', '心包', '心血管', '血管', '冠心病', '心力衰竭'],
    },
    ICP: {
        diagKeyword: ['ICP', 'icp', '肝内胆汁淤积'],
    },
    hypothyroidism: {
        diagKeyword: ['甲减', '甲状腺机能减退', '甲状腺功能减退'],
    },
    fetalGrowth: {
        diagKeyword: ['胎儿发育迟缓', '胎儿生长缓慢', '胎儿生长发育迟缓'],
    },
};

const hide_base_on_diag = (list: IMchc_Doctor_Diagnoses[] = [], searchObj?: IPreDiagKeyword) => {
    if (!searchObj?.diagKeyword) return false
    let diagItem = list
        ?.filter(l => l.diagnosis)
        ?.map(l => l.diagnosis) ?? [];

    // let searchObj = diag_search_param[type];

    const is_coronary = searchObj.diagKeyword.includes('心脏')
    const refreshFrom = () => {
        let is_hidden = true;

        for (let user_diag of diagItem) {
            for (let pre_diag of searchObj['diagKeyword']) {


                if (user_diag.includes(pre_diag)) {

                    if (!is_coronary) {
                        return false
                    }
                    if (is_coronary && user_diag.includes('胎')) {

                        return false
                    }
                }
            }

        }




        return is_hidden;
    };

    return refreshFrom();
};






export function filter_fds(diagnosesList: IMchc_Doctor_Diagnoses[], fds: IMchc_FormDescriptions_Field[]) {
    const arr = expect_array(fds).filter(identity)
    return arr
        .filter(f => {
            if (!f?.usr1) return true
            return !hide_base_on_diag(diagnosesList, f?.usr1)
        })

}