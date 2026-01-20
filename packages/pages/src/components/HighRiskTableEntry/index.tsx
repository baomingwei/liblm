import { MyIcon } from '@lm_fe/components';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { Button, Divider, Space } from 'antd';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import styles from './index.module.less';
import { highRiskTablePopup, IHighRiskTableEntryProps, isShowPopupRemind, TPopupRemindkey } from './utils';
import { use_provoke } from '@lm_fe/provoke';
import { mchcModal__ } from 'src/modals';
import { OkButton } from '@lm_fe/components_m';
const wraning_color = 'rgb(255, 146, 0)'
function _HighRiskTableEntry(props: IHighRiskTableEntryProps) {
    const { headerInfo, data } = props
    const { config } = use_provoke('config')
    const ext_arr = config.量表拓展 ?? []
    const hiden_old_arr = config.旧版量表隐藏 ?? []
    useEffect(() => {


        return () => {

        }
    }, [])
    const show_瘢痕子宫 = isShowPopupRemind('瘢痕子宫', headerInfo, data)
    const show_子痫 = isShowPopupRemind('子痫', headerInfo, data)
    const show_VTE = isShowPopupRemind('VTE', headerInfo, data)
    return <div style={props.style}>
        <Space style={{ flexWrap: 'wrap' }}>
            {
                <OkButton
                    hidden={hiden_old_arr.includes('瘢痕子宫')}
                    style={{ borderColor: show_瘢痕子宫 ? wraning_color : undefined }}
                    className={classnames(styles['his-btn'], { [styles['btn-risk']]: show_瘢痕子宫 })}
                    type="dashed"
                    icon={<MyIcon value='TableOutlined' />}
                    onClick={() => {
                        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '瘢痕子宫阴道试产表' })

                    }}
                >
                    瘢痕子宫阴道试产表
                    <ShowRisk show={show_瘢痕子宫} />
                </OkButton>
            }
            <OkButton
                hidden={hiden_old_arr.includes('子痫')}

                className={classnames(styles['his-btn'], { [styles['btn-risk']]: show_子痫 })}
                style={{ borderColor: show_子痫 ? wraning_color : undefined }}

                type="dashed"
                icon={
                    <MyIcon value='TableOutlined' />
                }
                onClick={() => {
                    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '子痫前期风险评估表' })

                }}
            >
                子痫前期风险评估表
                <ShowRisk show={show_子痫} />

            </OkButton>
            <OkButton
                hidden={hiden_old_arr.includes('VTE')}

                className={classnames(styles['his-btn'], { [styles['btn-risk']]: show_VTE })}
                style={{ borderColor: show_VTE ? wraning_color : undefined }}

                type="dashed"
                icon={<MyIcon value='TableOutlined' />}
                onClick={() => {
                    mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '深静脉血栓高危因素孕期用药筛查表' })
                }}
            >
                VTE预防用药筛查表
                <ShowRisk show={show_VTE} />

            </OkButton>

            {
                ext_arr.map(ext => {
                    if (ext.disabled || !ext.value) return null
                    const show = isShowPopupRemind(ext, headerInfo, data)
                    return <OkButton
                        className={classnames(styles['his-btn'], { [styles['btn-risk']]: show })}
                        style={{ borderColor: show ? wraning_color : undefined }}

                        type="dashed"
                        icon={<MyIcon value='ExceptionOutlined' />}
                        onClick={() => {
                            mchcModal__.open('拓展量表', {
                                modal_data: { headerInfo, ext }
                            })
                        }}
                    >
                        {ext.label}
                        <ShowRisk show={show} />

                    </OkButton>
                })
            }
        </Space>
    </div>
}
function ShowRisk({ show }: { show: boolean }) {
    return show ? (
        <>
            <Divider type="vertical" />
            <span style={{}}>存在风险 </span>
            <MyIcon value={'ExclamationCircleOutlined'} style={{ fontSize: '14px' }} />
        </>
    ) : null;
}
type TExportType = typeof _HighRiskTableEntry & { highRiskTablePopup: typeof highRiskTablePopup }
export const HighRiskTableEntry: TExportType = Object.assign(_HighRiskTableEntry, { highRiskTablePopup })