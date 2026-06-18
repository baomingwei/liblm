import { QuestionnaireButton, SelectTip } from '@lm_fe/pages'
import { Button, Card, Col, Tag, Form, List, message, Row, Radio, Space } from 'antd'
import { filter, get, isEmpty, map, set } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'

import { FormSection, MyIcon } from '@lm_fe/components_m'
import { mchcEnv } from '@lm_fe/env'
import {
    IMchc_FormDescriptions_Field_Nullable,
    IMchc_FormDescriptions_MIX,
    IMchc_QuestionItem,
    IMchc_Questionnaire,
    IMchc_QuestionWrite,
    IMchc_WriteRecord,
    mchcEnums,
    SMchc_Questionnaire,
} from '@lm_fe/service'
import {
    AnyObject,
    expect_array,
    formatDate,
    formatDateTimeNoSecond,
    getSearchParamsValue,
    request,
    safe_json_parse_arr,
    safe_json_stringify,
} from '@lm_fe/utils'
import classnames from 'classnames'
import { IDoctorEnd_QQProps } from './types'
import './index.less'

const EQuestionType = mchcEnums.Questionnaire.type
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}
export default function BirthPlan(props: IDoctorEnd_QQProps) {
    const { headerInfo } = props
    const pregnancyId = getSearchParamsValue('id') || headerInfo?.id

    const [form] = Form.useForm()
    const [siderPanels, set_siderPanels] = useState<IMchc_WriteRecord[]>([])
    const [status, set_status] = useState<undefined | 'all' | 'isAnwsered'>(undefined)
    const [activeItem, set_activeItem] = useState<AnyObject>({})
    const [formDescriptions, set_formDescriptions] = useState<IMchc_FormDescriptions_Field_Nullable[]>([])
    const [originFormFieldsValue, set_originFormFieldsValue] = useState({})
    const [propaganda, set_propaganda] = useState<AnyObject>({})

    useEffect(() => {
        getQueList()

        return () => {}
    }, [])

    async function getQueList() {
        SMchc_Questionnaire.fk_getWriterRecords(headerInfo).then((d) => {
            set_status('all')
            set_siderPanels(expect_array(d))
            if (d[0] && activeItem?.id) {
                fuck_one(d[0])
            }
        })
    }

    async function fuck_one(item: IMchc_WriteRecord) {
        if (activeItem?.id === item.id) {
            return
        }
        set_activeItem(item)
        let result = await SMchc_Questionnaire.fk_getResultById(item.id)
        // handleClickListItem(result)

        getBirthPlanDescriptions(result.questionnaire)
        setFieldsValueByQuestion(result)
    }

    async function getBirthPlanDescriptions(res: IMchc_Questionnaire) {
        let groupJsonArr = safe_json_parse_arr(get(res, 'groupJson'))
        let questionIndexList = res.groupVOList?.[0].questionIndexList // 排序的questionIndex
        let formDescriptions = formatQuestionListToFormDescriptions(
            expect_array(res.questionList),
            expect_array(questionIndexList),
        )
        set_formDescriptions(formDescriptions)
        set_propaganda(res)
    }

    function formatQuestionListToFormDescriptions(questionList: IMchc_QuestionItem[], questionIndexList: number[]) {
        // 通过questionIndex进行排序
        let arr: IMchc_FormDescriptions_Field_Nullable[] = []
        questionList.sort((a, b) => {
            // 根据questionIndex进行排序
            return questionIndexList.indexOf(a.questionIndex) - questionIndexList.indexOf(b.questionIndex)
        })
        questionList.map((question: any) => {
            const labelType = EQuestionType.getLabel(question.questionType)
            let logic = question.logic || {}
            let deps = undefined
            if (logic.bind) {
                let bind = logic.bind // 题目绑定的index
                let depQuestion = filter(questionList, (dep) => {
                    return dep.questionIndex == bind
                })[0]
                deps = {
                    [depQuestion.id]: map(logic.selectOption, (select) => {
                        return select + 1000
                    }),
                }
            }
            if (labelType == '单选题') {
                let option = question.questionOptionList.map((data) => {
                    return { label: data.optionTitle, value: data.optionIndex }
                })
                arr.push({
                    name: question.id,
                    label: question.questionTitle,
                    inputType: 'MC',
                    layout: '1',
                    inputProps: {
                        // type: 'multiple',
                        options: option,
                    },
                    formItemLayout: formItemLayout,
                    showDeps: deps,
                })
            }
            if (labelType == '多选题') {
                let option = question.questionOptionList.map((data) => {
                    return { label: data.optionTitle, value: data.optionIndex }
                })
                arr.push({
                    name: question.id,
                    label: question.questionTitle,
                    inputType: 'MC',
                    layout: '1',
                    inputProps: {
                        type: 'multiple',
                        options: option,
                    },
                    formItemLayout: formItemLayout,
                    required: true,
                    showDeps: deps,
                })
            }

            if (labelType == '填空题') {
                arr.push({
                    name: question.id,
                    label: question.questionTitle,
                    inputType: 'text_area',
                    layout: '1',
                    formItemLayout: formItemLayout,
                    required: true,
                    showDeps: deps,
                })
            }

            if (labelType == '打分题') {
                arr.push({
                    name: question.id,
                    label: question.questionTitle,
                    inputType: 'Rate',
                    layout: '1',
                    formItemLayout: formItemLayout,
                    required: true,
                    showDeps: deps,
                })
            }
        })
        return arr
    }

    async function getBirthPlanList() {
        const list = (
            await request.get(`/api/pnc/midwife/getPncMidwifePropagandaResult`, {
                params: {
                    pregnancyId: pregnancyId,
                    visitType: 1, // 分娩计划书传1，母乳喂养传2
                },
            })
        ).data

        set_siderPanels(list)
        return list
    }

    async function handleClickListItem(item: IMchc_QuestionWrite) {
        if (get(activeItem, 'id') === get(item, 'id')) return
        if (get(activeItem, 'id', -1) < 0) {
            // 如果原先处于暂存的诊断
            let formFieldsValue = form?.getFieldsValue()
            set_originFormFieldsValue(formFieldsValue)
        }

        // 判断点的列表是已有的还是新增的
        if (get(item, 'id') < 0) {
            set_activeItem(item)

            form?.setFieldsValue({
                ...originFormFieldsValue,
            })
        } else {
            const newItem = (
                await request.get(`/api/propaganda/questionnaire/getWriterRecordsDetailById?id=${get(item, 'id')}`)
            ).data
            set_activeItem(newItem)

            setFieldsValueByQuestion(newItem)
        }
    }
    function setFieldsValueByQuestion(newItem: IMchc_QuestionWrite) {
        let writeDetailList: any = get(newItem, 'writeDetailList')
        let questionnaireQuestionList = get(newItem, 'questionnaire.questionList') // 问卷的问题
        let finalValue = {}
        writeDetailList.map((writeDetail: any) => {
            let questionType = filter(questionnaireQuestionList, (question) => {
                return question.id == writeDetail.questionId
            })[0].questionType
            const labelType = EQuestionType.getLabel(questionType)
            let optionIndex: string = get(writeDetail, 'optionIndex')
            let questionResult: string = get(writeDetail, 'questionResult')
            let value = optionIndex // questionResult
            // if (labelType == '填空题') {
            //     value = questionResult
            // }
            if (labelType == '多选题') {
                let optionIndexArr = optionIndex.split(',')
                let valueArr: any = []
                map(optionIndexArr, (optionIndex) => {
                    // 先找到对应的题目
                    let questionListDetailArr: any =
                        filter(questionnaireQuestionList, (questionnaireOption: any) => {
                            return questionnaireOption.id == writeDetail.questionId
                        }) || []

                    // 通过题目的optionIndex和已勾选的optionIndex选项 找到对应的option 将label赋值
                    let questionOptionList = questionListDetailArr[0]?.questionOptionList
                    let detailOptionArr = filter(questionOptionList, (questionOption) => {
                        return questionOption.optionIndex == optionIndex
                    })
                    valueArr.push({
                        label: detailOptionArr[0].optionTitle,
                        value: parseInt(optionIndex),
                    })
                })
                value = safe_json_stringify(valueArr)
            }
            set(finalValue, writeDetail.questionId, value)
        })
        form?.setFieldsValue({ ...finalValue })
    }

    async function handleSubmit() {
        await form?.validateFields()
        let formData = form?.getFieldsValue()
        const serialNo = getSearchParamsValue('serialNo')
        const nurseNO = mchcEnv.user_data?.login
        let questionList = get(propaganda, 'questionList')
        let writeDetailList: any = []
        console.log('formData', formData, questionList)
        map(questionList, (question) => {
            const labelType = EQuestionType.getLabel(question.questionType)
            let value = get(formData, question.id)

            if (labelType == '多选题') {
                let optionIndexArr = map(safe_json_parse_arr(value), (data) => {
                    return data.value
                })
                writeDetailList.push({
                    questionId: question.id,
                    optionIndex: optionIndexArr.join(','),
                    questionResult: optionIndexArr.join(','),
                })
            }
            if (labelType == '填空题') {
                writeDetailList.push({
                    questionId: question.id,
                    questionResult: value,
                    optionIndex: question.questionOptionList[0].optionIndex,
                })
            }
        })
        console.log('writeDetailList', writeDetailList)
        let id = activeItem.id < 0 ? null : activeItem.id
        const res = (
            await request.post(`/api/pnc/midwife/savePncMidwifePropaganda/${pregnancyId}`, {
                ...activeItem,
                id: id,
                questionnaireId: propaganda.id,
                questionnaireTitle: propaganda.questionnaireTitle,
                writeDetailList,
                isAnswer: 1,
                fillDate: formatDate(),
                beginTime: formatDateTimeNoSecond(),
                endTime: formatDateTimeNoSecond(),
                nurseNO,
                serialNo,
            })
        ).data
        set_activeItem(res)
        // await getBirthPlanList()
        message.success('操作成功')
    }

    function handleFieldsChange(changedFields: any) {}

    function handleFilterStatus(e: any) {
        e.preventDefault()
        const value = e.target.value
        if (value === status) {
            return
        }
        set_status(value)
    }

    const filterSiderPanels = useMemo(() => {
        let r = []
        if (status === 'all') {
            r = siderPanels
        }
        if (status === 'isAnswered') {
            r = siderPanels.filter((item: any) => item.isAnswer)
        }

        return r
    }, [status])

    function renderSider() {
        return (
            <div className="questionnaire-sider" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '6px 12px' }}>
                    <Radio.Group value={status} buttonStyle="solid" onChange={handleFilterStatus}>
                        <Radio.Button value="all">全部</Radio.Button>
                        <Radio.Button value="isAnswered">已填写</Radio.Button>
                    </Radio.Group>
                </div>
                <List
                    size="small"
                    className="questionnaire-sider-list"
                    dataSource={filterSiderPanels}
                    renderItem={(item) => {
                        return (
                            <List.Item
                                className={classnames('questionnaire-sider-item', {
                                    active: item.id === activeItem.id,
                                })}
                                onClick={() => fuck_one(item)}
                            >
                                {item.id < 0 && <MyIcon value="InfoCircleOutlined" />}
                                <div>
                                    {item.questionnaireTitle}
                                    <p style={{ marginTop: 0 }}>{item?.createDate} {`孕周${item?.expandField1 || ''}`}</p>
                                </div>
                                <div>{item.isAnswer ? <Tag color="success">已填写</Tag> : <Tag>未填写</Tag>}</div>
                            </List.Item>
                        )
                    }}
                />
                <div style={{ padding: '6px 12px' }}>
                    <QuestionnaireButton
                        ghost
                        type="primary"
                        btn_text="发送问卷"
                        // onOk={(qs) => {
                        //     set_siderPanels(qs)

                        // }}
                        onOk={(qs) =>
                            request
                                .post('/api/send/questionnaire', { type: 1, id: pregnancyId, questionnaire: qs })
                                .then((res) => {
                                    getQueList()
                                })
                        }
                        btn_text="问卷"
                        shape="round"
                    />
                </div>
            </div>
        )
    }

    return (
        <Row style={{ height: '100%', width: '100%' }}>
            <Col flex="256px" style={{ height: '100%', marginRight: 12, backgroundColor: '#fff' }}>
                {renderSider()}
            </Col>
            <Col flex="auto" style={{ height: '100%',overflow: 'auto', backgroundColor: '#fff' }}>
                <Space style={{ height: '58px', paddingLeft: 48 }}>
                    <h3>{activeItem?.questionnaireTitle}</h3>
                    <span>评测积分：{activeItem?.totalScore} 分</span>
                </Space>
                <Card>
                    {isEmpty(activeItem) ? (
                        <SelectTip />
                    ) : (
                        <Form
                            key={get(activeItem, 'id')}
                            form={form}
                            onFinish={handleSubmit}
                            onFieldsChange={handleFieldsChange}
                        >
                            <FormSection formDescriptions={formDescriptions} form={form} />
                            {/* <div style={{ textAlign: 'center' }}>
                                <Space>
                                    <Button
                                        // disabled={disabled}
                                        size="large"
                                        type="primary"
                                        onClick={() => handleSubmit()}
                                        icon={<MyIcon value="SaveOutlined" />}
                                    >
                                        保存
                                    </Button>
                                </Space>
                            </div> */}
                        </Form>
                    )}
                </Card>
            </Col>
        </Row>
    )
}
