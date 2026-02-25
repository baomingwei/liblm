
import { useEffect } from 'react';
import { checkLogin } from './checkLogin';
import { checkVersion } from './checkVersion';
import { mchcEnv, mchcLogger, mchcUtils } from '@lm_fe/env';
import { useHistory } from 'react-router-dom';
import { use_provoke } from '@lm_fe/provoke';
export function use_task(disabled = false) {

    const { fetch_user, fetch_sys_config, sys_theme } = use_provoke()
    const history = useHistory()

    useEffect(() => {
        mchcUtils.setGlobalHistory(() => history)
        fetch_user_info()
        fetch_sys_config()
        history.listen((loc, act) => {
            mchcLogger.log('history', { loc, act, len: history.length })
        })
    }, [])
    function fetch_user_info() {
        const in_login_page = location.pathname.includes('/login')
        if (!mchcEnv.is_single)
            fetch_user()
                .then(() => {
                    if (in_login_page)
                        mchcEnv.reload('/')
                })
                .catch(e => {
                })
    }
    useEffect(() => {

        if (!disabled) {
            const minute = 60 * 1000
            setInterval(fetch_user_info, 5 * minute);
            setInterval(checkVersion, 2 * minute);
            setInterval(checkLogin, .5 * minute);

        }
        return () => {

        }
    }, [])
    return { sys_theme }
}
