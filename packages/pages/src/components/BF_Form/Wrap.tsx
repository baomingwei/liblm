import { Dropdown_L, LoadingPlaceholder, MyIcon, MyLazyComponent, OkButton } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { Button, MenuProps, Result } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import { ErrorBoundarySmall } from '../exception/ErrorBoundarySmall';
import { IBF_props } from './types';
import { use_table_config } from './use_table_config';






const items: MenuProps['items'] = [
    // {
    //     label: '編輯',
    //     key: 'edit',
    //     icon: <SettingOutlined />,
    // },
    {
        label: '初始',
        key: 'init',
        icon: <MyIcon value='UndoOutlined' />,
    },

];

export function BF_Wrap2(setting: IBF_props, props?: any) {

    const { config, edit_config, init_config, loading, recover_config } = use_table_config(setting, props ?? {})
    const sys_theme = use_provoke(s => s.sys_theme)

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'edit') {
            edit_config()
        }
        if (e.key === 'init') {
            recover_config()
        }
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };


    const Wrap = useMemo<FC<{ style?: React.CSSProperties, children?: ReactNode }>>(
        () => ({ children, style = {} }) => {
            if (loading) return <LoadingPlaceholder />

            const isAdmin = mchcEnv.isAdmin || __DEV__

            return <div style={{
                ...style,
                // height: '100%',
                position: 'relative',
                border: (isAdmin && !__DEV__) ? `1px dashed ${sys_theme.colorPrimary}` : 'none'
            }}>

                {
                    config

                        // ? <div style={{ minHeight: 256, height: '100%', position: 'relative' }}>
                        ? <>
                            <ErrorBoundarySmall>
                                <MyLazyComponent>
                                    {children}
                                </MyLazyComponent>
                            </ErrorBoundarySmall>

                            {
                                isAdmin
                                    ? <Dropdown_L
                                        // title='编辑配置'
                                        // type='primary'
                                        // style={{ position: 'absolute', top: 6, right: 6, opacity: .8, width: 'auto' }}
                                        // size='small'
                                        menu={menuProps}
                                        trigger={['hover']}
                                    >
                                        <Button
                                            onClick={() => edit_config()}

                                            size='small'
                                            shape='circle'
                                            type='primary'
                                            style={{ position: 'absolute', top: 6, right: 6, opacity: .8, width: 'auto' }}
                                            icon={<MyIcon value='AppstoreOutlined' />}
                                        />


                                        {/* <div style={{ position: 'absolute', top: 6, right: 6, cursor: 'help' }} ><DownOutlined /></div> */}

                                    </Dropdown_L>
                                    : null
                            }


                        </>


                        : <Result
                            status="warning"
                            title={`配置缺失`}
                            subTitle={`请联系管理员初始化[${setting.default_conf?.title}]`}
                            extra={
                                <OkButton onClick={init_config}>初始化</OkButton>
                            }
                        />


                }
            </div>
        }, [config, loading]
    )
    return {
        config,
        Wrap
    }
};

Object.assign(window, { BF_Wrap2 })