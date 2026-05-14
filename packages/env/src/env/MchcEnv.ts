import { AppEnv, expect_array, getSearchParamsValue, isString } from "@lm_fe/utils";
import { IMchc_User, mchcConfig } from "../state";
import { ds, getMacroValue, gs, mchcMacro } from "../macro";
import { getOptionLabel, getOptionValue, getOtherOptions, getPresetOptions, merge_preset_options_inner } from "../select_options";
import { all_env, Common_Form_Config_Names, MchcTypes, primary_env } from "./type";


import { mchcEvent } from "../event";
import { MchcUtils, mchcUtils } from "../utils/mchcUtils";

const env_to_key_map: { [x in MchcTypes]?: string } = {
    '广三': 'gysy',
    '建瓯': 'jianou',
    '广州市八': 'gzs8',
    '南医增城': 'zcyy',
    '越秀妇幼': 'yxfy'
}
class MchcEnv<T> extends AppEnv<T> {
    utils: MchcUtils = mchcUtils
    debug_flag() {
        return getSearchParamsValue('debug')
    }
    info(msg: string, duration?: number) { return new Promise(res => { mchcEvent.emit('toast', { type: 'info', msg, duration, cb: () => res(null) }) }) }
    warning(msg: string, duration?: number) { return new Promise(res => { mchcEvent.emit('toast', { type: 'warning', msg, duration, cb: () => res(null) }) }) }
    success(msg: string, duration?: number) { return new Promise(res => { mchcEvent.emit('toast', { type: 'success', msg, duration, cb: () => res(null) }) }) }
    error(msg: string, duration?: number) { return new Promise(res => { mchcEvent.emit('toast', { type: 'error', msg, duration, cb: () => res(null) }) }) }

    get_pathname(p = location.pathname) {
        const decoded = decodeURI(p)
        const pp = mchcMacro.PUBLIC_PATH!
        if (!isString(decoded)) return '/'
        return pp === '/' ? decoded : decoded.replace(pp!, '/')
    }
    set_pathname(p = location.pathname) {
        const pp: string = mchcMacro.PUBLIC_PATH!

        if (!isString(p)) return pp

        if (pp === '/' || p.startsWith(pp!)) return p
        return `${pp}/${p}`.replaceAll('///', '/').replaceAll('//', '/')
    }
    gs = gs
    ds = ds

    _fd_handers: { [x in Common_Form_Config_Names]?: { conf: any, handler: any } } = {}
    constructor(appName?: T) {
        super(appName)
    }
    _sys_name?: T
    public get appName() {
        if (this._sys_name) {
            return this._sys_name
        }
        const sys_name = mchcConfig.get('系统环境')
        if (sys_name) {
            return this._sys_name = sys_name
        }
        return super.appName
    }
    public set appName(value: T | undefined) {
        super.appName = value;
    }

    get env_key() {
        return env_to_key_map[this.appName as MchcTypes]
    }
    get is_primary() {
        return primary_env.includes(this.appName as any)
    }
    event = mchcEvent
    get_options = getPresetOptions
    get_other_options = getOtherOptions
    merge_options = merge_preset_options_inner
    get_option_label = getOptionLabel
    get_option_value = getOptionValue
    expect_array = expect_array
    all_env = all_env
    setEnvFormConfig(confs: { name: Common_Form_Config_Names, conf: any, handler?: any }[]) {
        confs.forEach(({ name, handler, conf }) => {
            const old = this._fd_handers[name]
            if (old) {
                alert('已经存在表单配置')
                return
            }
            this._fd_handers[name] = { conf, handler }
        })
    }

    getEnvFormConfig(fd_name: Common_Form_Config_Names) {

        return this._fd_handers[fd_name]
    }



    in_group(...gs: string[]) {
        
        const u = this.user_data
        return u?.groups?.some?.((_: any) => gs.includes(_.name?.toLowerCase()))
    }
    _user?: IMchc_User
    set user_data(user: IMchc_User) {
        this._user = user
    }
    get user_data() {
        return (this._user ?? window.peek_provoke?.('user_info'))
    }
    get isAdmin() {
        const state = this.in_group('admin') || getSearchParamsValue('admin') === '1' || false
        return !!state
    }
}

export const mchcEnv = (window.mchcEnv = new MchcEnv<MchcTypes>(getMacroValue('appName') ?? 'mchc'))
