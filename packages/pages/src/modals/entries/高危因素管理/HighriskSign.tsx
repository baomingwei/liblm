import { HighRiskGradeSelectPure } from '@lm_fe/components_m'
import { ICommonOption, mchcConfig, mchcEnv } from '@lm_fe/env'
import {
    IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_HighriskGradeConfig,
    IMchc_TemplateTree_Item,
    SMchc_Common,
} from '@lm_fe/service'
import { Button, Col, Input, Row, Space } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { findIndex, get, includes, isEmpty, keyBy, keys, map, sortBy, split } from 'lodash'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'

import { MySelect, Tree_L } from '@lm_fe/components'
import { use_provoke } from '@lm_fe/provoke'
import { ColorSpan, transfer_to_treeNode } from './utils'

const boundSymbol = ':'
interface IProps {
    headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
    gradeOptions?: IMchc_HighriskGradeConfig[]
    contagionOptions?: ICommonOption[]
    initData?: IMchc_Doctor_OutpatientHeaderInfo
    assign_initData(v?: Partial<IMchc_Doctor_OutpatientHeaderInfo>): void
}
export function HighriskSign_高危因素管理(props: IProps) {
    const { config } = use_provoke('config')

    const { headerInfo, gradeOptions, contagionOptions = [], initData, assign_initData } = props
    const highRiskTreeDataMapping = useRef<{ [x: string]: IMchc_TemplateTree_Item }>({})

    const [currentTreeData, set_currentTreeData] = useState<IMchc_TemplateTree_Item[]>([])

    const [expandedKeys, set_expandedKeys] = useState<string[]>([])
    const [searchValue, set_searchValue] = useState('')
    const [selectTree, set_selectTree] = useState<IMchc_TemplateTree_Item[]>([])
    // const multiple = mchcEnv.in(['广三', '建瓯', '郫都', '广州市八']) ? true : false
    const multiple = config.高危标记多选
    const 高危管理_允许手输传染病 = config.高危管理_允许手输传染病
    const 高危管理_允许手输高危 = config.高危管理_允许手输高危

    function getInitData(_h = headerInfo) {
        if (!_h) return _h
        const grade = _h?.highriskLable || _h?.highriskGrade || ''
        const _data: IMchc_Doctor_OutpatientHeaderInfo = {
            ..._h,
            infectionNote: _h?.infectionNote ?? '',
            highriskNote: _h?.highriskNote ?? '',
            highriskGrade: grade,
            highriskLable: grade,
        }
        return _data
    }

    useEffect(() => {
        ; (async () => {
            // const gradeDic = initDictionaries.filter((item) => item.key === 'highriskGrade' && item.type === highriskVersion);

            if (headerInfo) {
                const highriskTreeData = await SMchc_Common.getHighriskTree()

                highRiskTreeDataMapping.current = keyBy(highriskTreeData, 'id')

                const highriskNote_ = headerInfo.highriskNote?.split?.(',')?.filter((_) => _) ?? []
                let _selectTree: IMchc_TemplateTree_Item[] = []
                highriskNote_.map((item) => {
                    map(highRiskTreeDataMapping.current, (v, i) => {
                        const addNote = getTargetNote(v)
                        if (item == addNote) {
                            _selectTree.push(v)
                        }
                    })
                })

                set_selectTree(_selectTree)
                set_expandedKeys(Object.keys(highRiskTreeDataMapping.current))
                assign_initData(getInitData())
                set_currentTreeData(highriskTreeData)
            }
        })()

        return () => { }
    }, [headerInfo])

    function handleSearch(e: ChangeEvent<HTMLInputElement>) {
        const searchValue: string = get(e, 'target.value')
        const { treeData, expandedKeys } = searchTreeData(searchValue)
        set_currentTreeData(!!searchValue ? treeData : Object.values(highRiskTreeDataMapping.current))
        set_expandedKeys(!!searchValue ? expandedKeys : [])
        set_searchValue(searchValue)
    }

    function searchTreeData(value: string) {
        const tree_data = Object.values(highRiskTreeDataMapping.current)
        const expandedKeys: string[] = []
        const treeData: any = []
        const searchValueArr = split(value, ',') || []
        while (searchValueArr.length > 0) {
            let searchValue = searchValueArr[0]
            if (!searchValue) {
                searchValueArr.shift()
                continue
            }
            tree_data.map((item) => {
                const val = item.val || ''
                const mnemonic = item.mnemonic || ''
                let pid = item.pid
                const id = item.id
                if (
                    (val.indexOf(searchValue) > -1 || mnemonic.indexOf(searchValue) > -1) &&
                    pid === 0 &&
                    !includes(expandedKeys, String(item.id))
                ) {
                    treeData.push(item)
                    expandedKeys.push(String(item.id))
                    map(tree_data, (subItem) => {
                        if (subItem.pid === id && !includes(expandedKeys, String(subItem.id))) {
                            treeData.push(subItem)
                            expandedKeys.push(String(subItem.id))
                        }
                    })
                } else if (
                    searchValue &&
                    val.indexOf(searchValue) > -1 &&
                    pid !== 0 &&
                    !includes(expandedKeys, String(item.id))
                ) {
                    treeData.push(item)
                    expandedKeys.push(String(item.id))
                    while (pid != 0) {
                        let bool = false
                        map(tree_data, (subItem) => {
                            if (subItem.id === pid && !includes(expandedKeys, String(subItem.id))) {
                                treeData.push(subItem)
                                expandedKeys.push(String(subItem.id))
                                pid = subItem.pid
                                bool = true
                            }
                        })
                        if (!bool) pid = 0
                    }
                    const id = get(item, 'id').toString()
                    searchValueArr.push(id)
                } else if (searchValue === get(item, 'pid')?.toString()) {
                    if (findIndex(treeData, (treeValue) => get(treeValue, 'id') == get(item, 'id')) == -1) {
                        treeData.push(item)
                    }
                }
            })
            searchValueArr.shift()
        }
        const sortTreeData = sortBy(treeData, (item: any) => get(item, 'id'))
        return { treeData: sortTreeData, expandedKeys }
    }

    function handle_select_change(_value: string) {
        const tag_arr = split(_value, ',')

        const tree_items: IMchc_TemplateTree_Item[] = []
        map(tag_arr, (str) => {
            map(highRiskTreeDataMapping.current, (v, i) => {
                const addNote = getTargetNote(v)
                if (str == addNote) {
                    tree_items.push(v)
                }
            })
        })
        calAndSetData(tree_items, tag_arr)
    }

    function handle_tree_select(ids: string[], e: any) {
        const custom_tags = get(initData, 'highriskNote', '')
            .split(',')
            .filter((_) => !_.includes(':'))
        let tree_items: IMchc_TemplateTree_Item[] = []

        ids.forEach((k) => {
            const _item = highRiskTreeDataMapping.current[k]

            add_item_to_arr(_item, tree_items)
        })

        const tag_to_add = tree_items.map((_item) => {
            const addNote = getTargetNote(_item)
            return addNote
        })

        calAndSetData(tree_items, [...tag_to_add, ...custom_tags])
    }

    function add_item_to_arr(_item: IMchc_TemplateTree_Item, mute_arr: IMchc_TemplateTree_Item[]) {
        const isIn = mute_arr.find((_) => _.id === _item?.id)
        if (isIn) return
        const pid = _item?.pid
        if (!pid) return

        //------
        const ind = mute_arr.findIndex((_) => _.pid == _item?.pid)
        const isBrotherIn = ind != -1

        if (isBrotherIn && !multiple) {
            mute_arr.splice(ind, 1, _item)
        } else {
            mute_arr.push(_item)
        }
    }
    function calAndSetData(tree_items: IMchc_TemplateTree_Item[], tag_arr: string[]) {
        let __highriskGrade = isEmpty(tree_items) ? initData?.highriskGrade! : ''
        tree_items.forEach((_) => {
            let code = _.code

            if (__highriskGrade == '' || code > __highriskGrade) {
                __highriskGrade = code
            }
        })
        assign_initData({
            highriskGrade: __highriskGrade,
            highriskNote: tag_arr.join(','),
        })
        set_selectTree([...tree_items])
    }

    function handleExpend(expandedKeys: any) {
        set_expandedKeys(expandedKeys)
    }

    function handleReset() {
        assign_initData({
            highriskGrade: '',
            highriskNote: '',
            infectionNote: '',
        })
        set_selectTree([])
    }

    function getGradeColor(grade: any) {
        grade = grade ?? 'I'

        const target = gradeOptions?.find((_) => _.label === grade)
        return target?.color
    }

    function renderColorSpan(label: string) {
        return (
            <span
                style={{
                    background: getGradeColor(label),
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    margin: '0 10px',
                }}
            ></span>
        )
    }

    function renderTree({ treeData, expandedKeys }: { treeData?: DataNode[]; expandedKeys: string[] }) {
        return (
            <Tree_L
                multiple
                showLine={{ showLeafIcon: false }}
                treeData={treeData}
                onSelect={handle_tree_select}
                onExpand={handleExpend}
                expandedKeys={expandedKeys}
                selectedKeys={selectTree.map((_) => _.id.toString())}
                titleRender={(treeNode) => {
                    return (
                        <div>
                            {treeNode.children?.length == 0 ? (
                                <ColorSpan bg_color={getGradeColor(get(treeNode, 'code'))} />
                            ) : null}
                            {get(treeNode as any, `title`)}
                        </div>
                    )
                }}
            />
        )
    }

    function renderhiskTree() {
        const treeData__ = transfer_to_treeNode(currentTreeData)

        const highriskVersion = mchcConfig.get('highriskVersion')

        if (highriskVersion === 23 || mchcEnv.is('华医') || mchcEnv.is('南医增城')) {
            return renderTree({ treeData: treeData__, expandedKeys })
        } else {
            return (
                <Row className={styles['row-content']} key={searchValue ? searchValue : currentTreeData.length}>
                    <Col span={8}>
                        <div className={styles['tree-title']}>{get(treeData__, `[0].title`)}</div>
                        <div className={styles['col-content']}>
                            {renderTree({ treeData: get(treeData__, `[0].children`), expandedKeys })}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className={styles['tree-title']}>{get(treeData__, `[1].title`)}</div>
                        <div className={styles['col-content']}>
                            {renderTree({ treeData: get(treeData__, `[1].children`), expandedKeys })}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className={styles['tree-title']}>{get(treeData__, `[2].title`)}</div>
                        <div className={styles['col-content']}>
                            {renderTree({ treeData: get(treeData__, `[2].children`), expandedKeys })}
                        </div>
                    </Col>
                    {/* {
            treeData.map((_: any) => {
              return <Col span={7}>
                <div className={styles["tree-title"]}>{get(_, `title`)}</div>
                <div className={styles["col-content"]}>
                  {renderTree({ treeData: get(_, `children`), expandedKeys })}
                </div>
              </Col>
            })
          } */}
                </Row>
            )
        }
    }
    function getTargetNote(v: IMchc_TemplateTree_Item) {
        const p = get(highRiskTreeDataMapping.current, v.pid)
        const addNote = `${p?.val}${boundSymbol}${v?.val}`

        return addNote
    }

    return (
        <div className={styles['highrisk-sign']}>
            <div className={styles['highrisk-sign-header']}>
                <Row gutter={8}>
                    <Col span={2}>高危等级:</Col>
                    <Col span={6}>
                        <HighRiskGradeSelectPure
                            onChange={(v) => {
                                assign_initData({ highriskGrade: v })
                            }}
                            value={get(initData, 'highriskGrade')}
                        />
                    </Col>
                    <Col span={15} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                onClick={() => {
                                    set_expandedKeys([])
                                }}
                            >
                                全部收起
                            </Button>

                            <Button
                                onClick={() => {
                                    set_expandedKeys(keys(highRiskTreeDataMapping.current))
                                }}
                            >
                                全部展开
                            </Button>
                            <Button onClick={handleReset}>清空</Button>
                            <Button type="primary" onClick={() => assign_initData(getInitData())}>
                                恢复
                            </Button>
                        </Space>
                    </Col>
                    <Col span={2}>
                        {' '}
                        传染病<span style={{ color: 'red', padding: 2, fontWeight: 'bold', fontSize: 22 }}>*</span>:
                    </Col>
                    <Col span={21}>
                        <MySelect
                            style={{ width: '100%' }}
                            options={contagionOptions}
                            onChange={(v) => {
                                assign_initData({ infectionNote: v })
                            }}
                            mode={高危管理_允许手输传染病 ? 'tags' : 'multiple'}
                            marshal={0}
                            value={initData?.infectionNote}
                        ></MySelect>
                    </Col>
                    <Col span={2}>高危因素:</Col>
                    <Col span={21}>
                        <MySelect
                            // mode="tags"
                            mode={高危管理_允许手输高危 ? 'tags' : 'multiple'}
                            style={{ width: '100%' }}
                            marshal={0}
                            className={styles['highrisk-factor']}
                            onChange={handle_select_change}
                            value={get(initData, 'highriskNote', '')}
                        ></MySelect>
                    </Col>

                    <Col span={2}>模糊查找:</Col>
                    <Col span={21}>
                        <Input onChange={handleSearch} />
                    </Col>
                </Row>
            </div>
            {/* style={{ overflow: 'hidden' }} */}
            <div className={styles['highrisk-sign-content']}>{renderhiskTree()}</div>
        </div>
    )
}

// console.dir("mapStateToProps",mapStateToProps);
