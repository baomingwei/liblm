import { ds } from "@lm_fe/env"
import { all_files } from '@lm_fe/static'
import { load_src, sleep } from "@lm_fe/utils"
import { IFuck_Xemr } from "./types"
let loaded = false

export function get_editor_frame() {
    let _emr_el = document.getElementById('_emreditor') as HTMLIFrameElement
    return _emr_el
}
function vender(x: typeof all_files, sub: string) {
    return x.lm_libs["X-EMR"].vender + sub
}
export async function load_xemr() {
    if (!loaded) {

        // const pp = mchcMacro.PUBLIC_PATH
        // let emr_base = `${pp}lib/X-EMR`
        // let emr_vender = `${emr_base}/vender`
        load_src({ text: `#_printview {display: none !important;} #_emreditor {display: block !important;}`, type: 'text/css' })
        await ds([
            x => x.lm_libs["X-EMR"].stylesheets + 'editor.css',
            x => vender(x, 'jquery/zTreeStyle/zTreeStyle.css'),
            x => vender(x, 'jquery/jquery.js'),
            x => vender(x, 'jquery/jquery.ztree.core.min.js'),
            x => vender(x, 'jquery/jquery.ztree.exedit.min.js'),
            x => vender(x, 'jquery/jquery.ztree.exhide.min.js'),
            x => vender(x, 'fabric.js'),
            x => vender(x, 'date97/WdatePicker.js'),
            x => vender(x, 'codemirror.js'),
            x => x.lm_libs["X-EMR"].js + 'editor.js',

            // `${emr_base}/stylesheets/editor.css`,
            // `${emr_vender}/jquery/zTreeStyle/zTreeStyle.css`,
            // `${emr_vender}/jquery/jquery.js`,
            // `${emr_vender}/jquery/jquery.ztree.core.min.js`,
            // `${emr_vender}/jquery/jquery.ztree.exedit.min.js`,
            // `${emr_vender}/jquery/jquery.ztree.exhide.min.js`,
            // `${emr_vender}/fabric.js`,
            // `${emr_vender}/date97/WdatePicker.js`,
            // `${emr_vender}/codemirror.js`,
            // `${emr_base}/js/editor.js`,

        ])
        loaded = true
        await sleep(1000)

    }
    //@ts-ignore
    return window['editor'] as IFuck_Xemr

}