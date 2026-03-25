import React, { useState, useEffect, useRef } from 'react'
import { Transfer, Button, Flex, Input, Popconfirm, Modal, message } from 'antd'
import type { InputRef } from 'antd'
import { MyIcon } from '@lm_fe/components'
import { request } from '@lm_fe/utils'
import { mchcModal__ } from 'src/modals'
import { map, filter, includes, isEmpty, find } from 'lodash'
import classNames from 'classnames'
import styles from './index.module.less'

// 获取门诊病历头部个人信息栏标签
async function getTagLabels(key?: string) {
    // const ret = await request.get<boolean>('/api/doctor/getOutpatientHeaderLabels', { params: { visitId: id || null } })
    const ret = await request.get('/api/label/findLabels', { params: { 'keyword.contains': key } })
    return ret.data
}

type CustomTagProps = {
    id: string // 孕册id
    dataSource: any[] // 标签数据
}

function CustomTag({ id, dataSource, ...props }: CustomTagProps) {
    const [tagsLib, setTagsLib] = useState([]) // 标签库
    const [tags, setTags] = useState([])
    const [targetTags, setTargetTags] = useState([]) // 显示在右侧框数据

    const [selectedTag, setSelectedTag] = useState()

    useEffect(() => {
        // 初始化右侧框数据
        setTargetTags(dataSource)
        // 初始化左侧框数据
        getTags()

        return () => {}
    }, [])

    // 获取标签库所有标签
    async function getTags(key?: string) {
        const d = (await getTagLabels(key)) || []
        setTagsLib(d)
        const targetTagKeys = !isEmpty(targetTags) ? map(targetTags, 'id') : map(dataSource, 'id')
        const _d = filter(d, (item) => !includes(targetTagKeys, item.id))
        setTags(_d)
    }

    function open标签库管理() {
        mchcModal__.open('test', {
            title: '标签库管理',
            width: 420,
            modal_data: {
                content: <CustomTagLib reload={getTags} />,
            },
            onClose: () => getTags(),
        })
    }

    const handleSearch = (e) => {
        const value = e.target.value
        const targetTagKeys = map(targetTags, 'id')
        const sourceOptions = filter(tagsLib, (item) => !includes(targetTagKeys, item.id))

        if (!value) {
            return setTags(sourceOptions)

        }
        const _filterOptions = filter(sourceOptions, (item) => includes(item.name, value))
        console.log('----123', value, _filterOptions);
        setTags(_filterOptions)
    }

    const handleLeftClick = (e: any) => {
        console.log('-----click', e)
        const key = e.id
        setSelectedTag(e)
    }

    const handleTranfer = (e) => {
        console.log('-----btn tran', e, selectedTag)
        if (!selectedTag) {
            return message.info('请先选择标签')
        }
        const _targetTags = [...targetTags, selectedTag]
        const _tags = tags.filter((item) => item.id !== selectedTag.id)
        setTags(_tags)
        setTargetTags(_targetTags)
        setSelectedTag(undefined)
    }

    const handleLeftDoubleClick = (e: any) => {
        const _tags = tags.filter((item) => item.id !== e.id)
        const _targetTags = [...targetTags, e]
        setTags(_tags)
        setTargetTags(_targetTags)
        setSelectedTag(undefined)
    }

    const handleDeleteTag = (e: any) => {
        // 校验改标签是否存在于标签库
        const _is = find(tagsLib, (item) => item.id === e.id)
        if (!_is) {
            return Modal.confirm({
                title: '删除标签',
                content: `[${e.name}]标签未在标签库中，请确认是否取消标记？`,
                onOk: () => {
                    const _targetTags = targetTags.filter((item) => item.id !== e.id)
                    setTargetTags(_targetTags)
                },
            })
        }
        const _targetTags = targetTags.filter((item) => item.id !== e.id)
        const _tags = filter(tagsLib, (item) => !includes(map(_targetTags, 'id'), item.id))
        setTags(_tags)
        setTargetTags(_targetTags)
        setSelectedTag(undefined)
    }

    return (
        <Flex gap="middle" vertical>
            <p>点击下方标签内容标记患者标签</p>
            <Flex gap="small" justify="center" align="center" className={styles['custom-transfer']}>
                <div className={styles['custom-transfer-left']}>
                    <div className={styles['custom-transfer-left-header']}>
                        <span>可设置标签</span>
                        <Input
                            placeholder="请输入搜索内容"
                            prefix={<MyIcon value="SearchOutlined" />}
                            style={{ width: 128 }}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className={styles['custom-transfer-left-body']}>
                        {map(tags, (item) => {
                            return (
                                <div
                                    key={item.id}
                                    className={classNames(styles['custom-transfer-left-body-item'], {
                                        [styles['custom-transfer-left-body-item-active']]: item.id === selectedTag?.id,
                                    })}
                                    onClick={() => handleLeftClick(item)}
                                    onDoubleClick={() => handleLeftDoubleClick(item)}
                                >
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Button icon={<MyIcon value="RightOutlined" />} onClick={handleTranfer}></Button>
                <div className={styles['custom-transfer-right']}>
                    <div className={styles['custom-transfer-right-header']}>
                        <span>标记标签</span>
                    </div>
                    <div className={styles['custom-transfer-left-body']}>
                        {map(targetTags, (item) => {
                            return (
                                <div key={item.id} className={styles['custom-transfer-left-body-item']}>
                                    {item.name}
                                    <MyIcon
                                        value="CloseOutlined"
                                        style={{ marginLeft: 12 }}
                                        onClick={() => handleDeleteTag(item)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Flex>
            <div>
                <Button icon={<MyIcon value="EditOutlined" />} onClick={open标签库管理}>
                    标签库维护
                </Button>
            </div>
        </Flex>
    )
}

function CustomTagLib({ reload }) {
    const [flag, setFlag] = useState('')
    const [tagLib, setTagLib] = useState([])

    useEffect(() => {
        getTagLib()

        return () => {}
    }, [])

    // 获取标签库所有标签
    async function getTagLib(key?: string) {
        const d = (await getTagLabels(key)) || []
        setTagLib(d)
    }

    async function addTagLabel(value: string) {
        await request
            .post('/api/label/saveLabel', {
                name: value,
                type: 0,
            })
            .then((res) => {
                message.success('添加成功')
                reload()
            })
    }

    function handleSearch(value?: string) {
        // getTagLib(value)
        if (!value) {
            getTagLib()
        }
        const d = filter(tagLib, (item) => includes(item.name, value))
        setTagLib(d)
    }

    function handleAddTag(value: string) {
        if (value) {
            addTagLabel(value)
        }
    }

    function handleDelete(id: string) {
        request.delete(`/api/label/deleteLabel/${id}`).then((res) => {
            message.success('删除成功!')
            handleSearch()
        })
    }

    async function handleUpdate(e, item) {
        const value = e.target.value
        await request
            .post('/api/label/saveLabel', {
                ...item,
                name: value,
            })
            .then((res) => {
                message.success('修改成功!')
                // reload()
            })
    }

    return (
        <div>
            <Input.Search
                placeholder="输入关键字查询标签"
                enterButton={
                    <>
                        <MyIcon value="SearchOutlined" /> 查询
                    </>
                }
                onSearch={handleSearch}
            />
            <ul className={styles['custom-tag-lib']}>
                {map(tagLib, (item) => {
                    return (
                        <li key={item.id}>
                            <CustomTagLibItem item={item} onPressEnter={handleUpdate} onDelete={handleDelete} />
                        </li>
                    )
                })}
            </ul>
            <Input.Search
                placeholder="输入新增的标签后回车或者点击添加按钮"
                enterButton={
                    <>
                        <MyIcon value="PlusOutlined" /> 添加
                    </>
                }
                onSearch={handleAddTag}
            />
        </div>
    )
}

function CustomTagLibItem({ item, onDelete, onPressEnter, onChange, onEdit }: any) {
    const inputRef = useRef<InputRef>(null)
    const [editable, setEditable] = useState(false)

    const handleBlur = () => {
        setEditable(false)
    }

    return (
        <div className={styles['custom-tag-lib-item']}>
            <Input
                ref={inputRef}
                variant="borderless"
                disabled={!editable}
                style={{ flex: 1 }}
                defaultValue={item.name}
                onChange={(e) => onChange?.(item.id, e.target.value)}
                onBlur={handleBlur}
                onPressEnter={(e) => onPressEnter?.(e, item)}
            ></Input>
            <Button
                size="small"
                type="link"
                icon={<MyIcon value="EditOutlined" />}
                onClick={() => {
                    setEditable(true)
                    setTimeout(() => {
                        inputRef.current!.focus({
                            cursor: 'end',
                        })
                    }, 200)
                }}
            ></Button>
            <Popconfirm
                title="提示"
                description="确定删除该标签?"
                onConfirm={() => onDelete?.(item.id)}
                okText="是"
                cancelText="否"
            >
                <Button size="small" type="text" icon={<MyIcon value="DeleteOutlined" />}></Button>
            </Popconfirm>
        </div>
    )
}

export { CustomTag, CustomTagLib }
