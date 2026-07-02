import { mchcEnv, mchcEvent, mchcLogger, mchcUtils, TLevelType } from '@lm_fe/env'
import { IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor } from '@lm_fe/service'
import { EMPTY_PLACEHOLDER, expect_array, ICommonOption, setSearchParamsValue } from '@lm_fe/utils'
import { Button, ButtonProps, Space, Tag, Tooltip } from 'antd'
import classnames from 'classnames'
import { get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import { MyIcon, PatientSelect } from '@lm_fe/components'
import { OkButton } from '@lm_fe/components_m'
import { use_provoke } from '@lm_fe/provoke'
import { mchcModal__ } from 'src/modals'
import { safe_navigate } from 'src/utils'
import { DoctorEnd_ExemplaryCase } from '../ExemplaryCase/index'
import { CustomTag } from './CustomTag'
import { FuckTags } from './FuckTag'
import styles from './index.module.less'
import { IHeaderInfoProps } from './types'
import { use_headinfo_color } from './use_headinfo_color'
import { handleFuckinginfectionNoteLabel, use专案 } from './utils'

export default function HeaderInfoInner(props: IHeaderInfoProps) {
    const {
        // headerInfo,
        saveHeaderInfo,
        isNurse,
        id: _id,
        onDobuleClick,
    } = props

    const {
        头部信息拓展,
        专案拓展 = [],
        护士端_禁止编辑高危因素_传染病,
        highriskType,
        标签管理,
    } = use_provoke((s) => s.config)
    const pregnancyId = mchcUtils.single_id(props)

    const [headerInfo, setHeaderInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()
    const highriskLable: TLevelType = (headerInfo?.highriskLable as any) || 'Ⅰ'
    const color_conf = use_headinfo_color(highriskLable)

    const info_addon = 头部信息拓展 ?? []
    const caseManages = expect_array(headerInfo?.caseManages).filter(_ => _.code && _.name)

    const infectionNoteLabels = handleFuckinginfectionNoteLabel(headerInfo?.infectionNote)

    const { isShowBmi, isShowGdm, isShowMultiplets, isShowSlowGrowing, isShowTwins, is_show_乙肝, is_show_梅毒 } =
        use专案(infectionNoteLabels, headerInfo, false)

    const [isTwinkling, setIsTwinkling] = useState(true)

    const [exemplaryCaseVisible, setExemplaryCaseVisible] = useState(false)
    const [tabkey, setTabkey] = useState('1')

    const headerInfoCache = useRef(headerInfo)
    headerInfoCache.current = headerInfo

    const randomIds = useRef(+new Date())

    useEffect(() => {
        fetchHeaderInfo()
    }, [pregnancyId])

    useEffect(() => {
        return mchcEvent.on_rm('ws_event', (e) => {
            if (e.type !== 'obis-doctor' || e.event !== 'message' || !e.data) return
            if (e.data.type === 'RefreshPregnancyHeaderInfo') {
                mchcLogger.log('event !!', { e })
                fetchHeaderInfo()
            }
        })
    }, [])

    useEffect(() => {
        const rm = mchcEvent.on_rm('outpatient', (e) => {
            // TODO: 移除
            if (e.type === '弹窗' && !isNurse) {
                switch (e.modal_name) {
                    case '瘢痕子宫阴道试产表':
                        open瘢痕子宫阴道试产表()
                        break
                    case '子痫前期风险评估表':
                        open子痫前期风险评估表()
                        break
                    case '深静脉血栓高危因素孕期用药筛查表':
                        open深静脉血栓高危因素孕期用药筛查表()
                        break
                    case '梅毒管理':
                        open梅毒管理()
                        break
                    default:
                        break
                }
            }
            if (e.type === '刷新头部') {
                fetchHeaderInfo()
            }
        })
        return rm
    }, [])
    function open瘢痕子宫阴道试产表() {
        mchcModal__.openOne(randomIds.current + 1, '瘢痕子宫阴道试产表', {
            modal_data: { headerInfo: headerInfoCache.current! },
            onClose: fetchHeaderInfo,
        })
    }
    function open子痫前期风险评估表() {
        mchcModal__.openOne(randomIds.current + 2, '子痫前期风险评估表', {
            modal_data: { headerInfo: headerInfoCache.current! },
            onClose: fetchHeaderInfo,
        })
    }
    function open深静脉血栓高危因素孕期用药筛查表() {
        mchcModal__.openOne(randomIds.current + 3, '深静脉血栓高危因素孕期用药筛查表', {
            modal_data: { headerInfo: headerInfoCache.current! },
            onClose: fetchHeaderInfo,
        })
    }
    function open梅毒管理() {
        const ext = caseManages.find((_) => _.name?.includes('梅毒'))

        if (ext) {
            mchcModal__.open('拓展专案', {
                modal_data: { headerInfo, ...ext },
            })
        } else {
            mchcModal__.openOne(randomIds.current + 4, '梅毒管理', {
                modal_data: { headerInfo: headerInfoCache.current! },
                onClose: fetchHeaderInfo,
            })
        }
    }
    function open乙肝管理() {
        const ext = caseManages.find((_) => _.name?.includes('乙肝'))
        if (ext) {
            mchcModal__.open('拓展专案', {
                modal_data: { headerInfo, ...ext },
            })
        } else {
            mchcModal__.openOne(randomIds.current + 5, '乙肝管理', {
                modal_data: { headerInfo: headerInfoCache.current! },
                onClose: fetchHeaderInfo,
            })
        }
    }
    function open艾管理() {
        const ext = caseManages.find((_) => _.name?.includes('艾滋'))
        if (ext) {
            mchcModal__.open('拓展专案', {
                modal_data: { headerInfo, ...ext },
            })
        }
    }

    function open高危因素管理() {
        if (护士端_禁止编辑高危因素_传染病 && isNurse) return
        setIsTwinkling(false)

        mchcModal__.open('高危因素管理', {
            modal_data: {
                data: headerInfo!,
                pregnancyId,
                // onFinish: handleSaveHiskFactor,
                handleSubmit: fetchHeaderInfo,
            },
        })
    }

    function open标签管理() {
        mchcModal__.open('test', {
            title: '标签管理',
            width: 'auto',
            modal_data: {
                content: <CustomTag id={pregnancyId} dataSource={headerInfo?.labels} />,
            },
            onClose: fetchHeaderInfo,
        })
    }

    function switch_page() {
        // pregnancyId
        const path = isNurse ? '/prenatal-visit/pregnancy/doctor-end' : '/prenatal-visit/pregnancy/nurse-end'
        safe_navigate(`${path}?id=${pregnancyId}`, props, { id: pregnancyId })
    }

    function showSpan<T extends keyof IMchc_Doctor_OutpatientHeaderInfo>(key: T) {
        return headerInfo?.[key] ? true : false
    }

    function getValue<T extends keyof IMchc_Doctor_OutpatientHeaderInfo>(key: T) {
        return headerInfo?.[key] ?? EMPTY_PLACEHOLDER
    }

    function check_week_show(curgesweek: string) {
        let bool = true
        if (typeof curgesweek == 'string') {
            const index = curgesweek.indexOf('+')
            let week = curgesweek
            if (index != -1) {
                week = curgesweek.substr(0, index)
            }
            const week_ = parseInt(week)
            if (week_ >= 42) {
                bool = false
            }
        }
        return bool
    }

    function showTitle(bool: boolean) {
        const title = bool ? getValue('highriskNote') : getValue('highRiskDiagnosis')
        const a = title && title.length > 25 ? title : ''
        return a
    }
    function renderInfo() {
        const is_show_note = highriskType === 'highriskNote'
        return (
            <div
                className={classnames(styles['header-info-wrapper'])}
                onDoubleClick={(e) => { }}
                style={{ background: color_conf.高危背景 }}
            >
                <div className={styles['header-info-content']}>
                    <div className={styles['wrapper-btns']}>
                        <div className={styles['highrisk']}>
                            {
                                <span
                                    style={{ background: color_conf.高危颜色 }}
                                    className={classnames(
                                        styles['level-btn'],
                                        isTwinkling && highriskLable === 'Ⅴ' && !mchcEnv.is('广三')
                                            ? styles['twinkling']
                                            : '',
                                    )}
                                    title={JSON.stringify(props.id)}
                                    onClick={open高危因素管理}
                                >
                                    {color_conf.高危文字}
                                </span>
                            }
                            {showSpan('infectionLable') && !!infectionNoteLabels.length ? (
                                <span
                                    style={{
                                        padding: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        writingMode: 'unset',
                                        fontSize: infectionNoteLabels.length >> 1 ? 14 : 16,
                                    }}
                                    className={styles['infection-btn']}
                                    title={get(headerInfo, 'infectionLable')}
                                >
                                    {infectionNoteLabels.map((_) => (
                                        <span
                                            key={_.key}
                                            onClick={() => {
                                                if (_.type === '梅'
                                                    // || _.type === '传染病'
                                                ) {
                                                    open梅毒管理()
                                                }
                                                if (_.type === '乙') {
                                                    open乙肝管理()
                                                }
                                                if (_.type === '艾') {
                                                    open艾管理()
                                                }
                                            }}
                                            style={{
                                                background: _.color,
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                writingMode: 'vertical-lr',
                                            }}
                                        >
                                            {_.label}
                                        </span>
                                    ))}
                                    {/* 传染病 */}
                                </span>
                            ) : null}
                        </div>
                        <div className={styles['signs']}>
                            {showSpan('thrombusLable') && (
                                <span
                                    className={classnames(styles['signs-btn'], styles['trial'])}
                                    onClick={open瘢痕子宫阴道试产表}
                                >
                                    疤
                                </span>
                            )}
                            {showSpan('cicatrixLable') && (
                                <span
                                    className={classnames(styles['signs-btn'], styles['pahr'])}
                                    style={{ flexDirection: 'column' }}
                                    onClick={open深静脉血栓高危因素孕期用药筛查表}
                                >
                                    <span>
                                        VTE<em>{headerInfo?.alertAssessment?.value?.length ?? ''}</em>
                                    </span>
                                </span>
                            )}
                        </div>
                        {showSpan('eclampsiaLable') && (
                            <div className={styles['preeclampsia-btn']} onClick={open子痫前期风险评估表}>
                                子痫
                            </div>
                        )}
                    </div>

                    <div className={styles['wrapper-msg']}>
                        <div className={styles['msg-top']}>
                            <div className={styles['msg-item']}>
                                <span className={styles['value']}>{getValue('name')}</span>
                            </div>
                            <div className={styles['small-item']}>
                                <span className={styles['value']}>{getValue('age')}岁</span>
                            </div>
                            <div className={styles['small-item']}>
                                <span className={styles['value']}>
                                    G{getValue('g')}P{getValue('p')}
                                </span>
                            </div>
                            {get(headerInfo, `labourState`) ? (
                                <>
                                    <div className={styles['small-item']}>
                                        <span className={styles['label']}>产后：</span>
                                        <span className={styles['value']}>{getValue('daysAfterDelivery')}</span>
                                    </div>
                                    <div className={styles['small-item']}>
                                        <span className={styles['label']}>分娩孕周：</span>
                                        <span className={styles['value']}>{getValue('labourWeek')}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {check_week_show(getValue('curgesweek')) && (
                                        <div className={styles['small-item']}>
                                            <span className={styles['label']}>孕周：</span>
                                            <span className={styles['value']}>{getValue('curgesweek')}</span>
                                        </div>
                                    )}

                                    <div className={styles['small-item']}>
                                        <span className={styles['label']}>预产期：</span>
                                        <span className={styles['value']}>{getValue('edd')}</span>
                                    </div>
                                </>
                            )}

                            <div className={styles['small-item']}>
                                <span className={styles['label']}>就诊卡号：</span>
                                {render_select()}
                            </div>
                            {info_addon.map((_) => {
                                const txt = getValue(_.value)
                                return (
                                    <div key={_.label} className={styles['small-item']} title={txt}>
                                        <span className={styles['label']}>{_.label}：</span>
                                        <span className={styles['value']}>{txt}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles['msg-bottom']}>
                            <Space.Compact >
                                {caseManages.map((ext) => {
                                    // const show = __DEV__ ? true : is_show_专案(ext, headerInfo)
                                    // if (!show) return null
                                    return (

                                        <Tag
                                            style={{ cursor: 'pointer' }}
                                            color={ext.color}
                                            // variant='solid'
                                            onClick={() => {
                                                mchcModal__.open('拓展专案', {
                                                    modal_data: {
                                                        headerInfo,
                                                        ...ext
                                                    },
                                                })
                                            }}
                                        >
                                            {ext.name}
                                        </Tag>
                                    )
                                })}
                                {is_show_乙肝 && (
                                    <Button type="text" size="small" onClick={open乙肝管理}>
                                        乙肝专案管理
                                    </Button>
                                )}
                                {is_show_梅毒 && (
                                    <Button type="text" size="small" onClick={open梅毒管理}>
                                        梅毒专案管理
                                    </Button>
                                )}
                                {isShowGdm && (
                                    <Button
                                        size="small"
                                        type="text"
                                        onClick={() => {
                                            setExemplaryCaseVisible(true)
                                            setTabkey('1')
                                        }}
                                    >
                                        GDM专案
                                    </Button>
                                )}
                                {isShowSlowGrowing && (
                                    <Button
                                        size="small"
                                        type="text"
                                        onClick={() => {
                                            setExemplaryCaseVisible(true)
                                            setTabkey('2')
                                        }}
                                    >
                                        胎儿生长缓慢专案
                                    </Button>
                                )}
                                {isShowBmi && (
                                    <Button
                                        size="small"
                                        type="text"
                                        onClick={() => {
                                            setExemplaryCaseVisible(true)
                                            setTabkey('3')
                                        }}
                                    >
                                        BMI高危专案
                                    </Button>
                                )}
                                {/* {isShowTwins && (
                  <Button type="text" onClick={() => setState({ exemplaryCaseVisible: true, tabkey: '4' })}>
                    双胎妊娠专案
                  </Button>
                )} */}
                                {isShowMultiplets && (
                                    <Button
                                        size="small"
                                        type="text"
                                        onClick={() => {
                                            setExemplaryCaseVisible(true)
                                            setTabkey('5')
                                        }}
                                    >
                                        {get(props, `headerInfo.pregnancyCaseLable`) || '多胎'}妊娠专案
                                    </Button>
                                )}
                            </Space.Compact>
                            {showSpan('infectionNote') ? (
                                <div>
                                    <span style={{ color: color_conf.传染病颜色 }}>
                                        传染病:{getValue('infectionNote') || '无'}
                                    </span>
                                    <span style={{ margin: '0 4px' }}>/</span>
                                </div>
                            ) : null}

                            <Tooltip placement="bottomLeft" title={showTitle(is_show_note)}>
                                <div className={styles['msg-highrisk']} style={{ color: color_conf.高危文字颜色 }}>
                                    {is_show_note ? (
                                        <span>
                                            高危因素:
                                            {getValue('highriskNote') || '无'}
                                        </span>
                                    ) : (
                                        <span>高危诊断:{getValue('highRiskDiagnosis') || '无'}</span>
                                    )}
                                </div>
                            </Tooltip>
                            <FuckTags str_data={get(headerInfo, 'tags')} />
                            {/* 标签管理 */}
                            {标签管理 && (
                                <>
                                    {headerInfo?.labels.map((tag, i) => {
                                        return (
                                            <Tag key={tag.id} color={tag?.color}>
                                                {tag.name}
                                            </Tag>
                                        )
                                    })}
                                    <Tag
                                        icon={<MyIcon value="PlusOutlined" />}
                                        style={{ cursor: 'pointer' }}
                                        onClick={open标签管理}
                                    >
                                        标签
                                    </Tag>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {render_extra()}
            </div>
        )
    }

    async function fetchHeaderInfo() {
        if (!pregnancyId) return
        const data = await SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId)
        saveHeaderInfo?.(data)
        setHeaderInfo(data)
    }
    function render_extra() {
        if (!headerInfo) return null
        const common_props: Omit<ButtonProps, 'form'> = { shape: 'circle', style: { opacity: 0.6, marginLeft: 6 } }
        const wrap_style: React.CSSProperties = {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
        }
        return (
            <div style={{ flex: 1 }}>
                <div style={{ ...wrap_style, marginBottom: 4 }}>
                    <OkButton {...common_props} icon={<MyIcon value="ThunderboltOutlined" />} onClick={onDobuleClick} />
                    <OkButton {...common_props} icon={<MyIcon value="ReloadOutlined" />} onClick={fetchHeaderInfo} />
                    {mchcEnv.is_single ? null : (
                        <OkButton {...common_props} icon={<MyIcon value="RetweetOutlined" />} onClick={switch_page} />
                    )}
                </div>
                {/* <div style={wrap_style}>
                    <QuestionnaireButton
                        onOk={(qs) =>
                            request.post('/api/send/questionnaire', { type: 1, id: pregnancyId, questionnaire: qs })
                        }
                        {...common_props}
                        btn_text="问卷"
                        shape="round"
                    />
                </div> */}
            </div>
        )
    }
    function render_select() {
        if (!headerInfo) return EMPTY_PLACEHOLDER
        if (mchcEnv.isSp) return headerInfo?.outpatientNO
        return (
            <PatientSelect
                size="small"
                // PatientSelect_url='/api/getPregnancies'
                style={{ width: 120 }}
                className={styles['outpatientNO']}
                value={headerInfo?.outpatientNO}
                // PatientSelect_displayKey={['outpatientNO', 'info0', 'info1', 'info2',]}
                onPatientSelect={(v, form) => {
                    const new_url = setSearchParamsValue('id', v.id)
                    // safe_navigate(new_url)
                    mchcEnv.reload(new_url)
                }}
            />
        )
    }

    function handleAddTag() {
        console.log('-----add tag-----')
    }

    return (
        <React.Fragment>
            {renderInfo()}

            {exemplaryCaseVisible && (
                <DoctorEnd_ExemplaryCase
                    onClose={() => setExemplaryCaseVisible(false)}
                    isShowGdm={isShowGdm || true}
                    isShowBmi={isShowBmi || true}
                    isShowSlowGrowing={isShowSlowGrowing || true}
                    isShowTwins={isShowTwins || true}
                    isShowMultiplets={isShowMultiplets || true}
                    tabkey={tabkey}
                    {...props}
                />
            )}
        </React.Fragment>
    )
}
export function is_show_专案(ext: ICommonOption, headerInfo?: IMchc_Doctor_OutpatientHeaderInfo) {
    if (!headerInfo || !ext?.value || ext.disabled) return false
    let head_key: string

    const ext_key = ext.value
    head_key = `${ext_key}Case`

    return headerInfo[head_key]
}
