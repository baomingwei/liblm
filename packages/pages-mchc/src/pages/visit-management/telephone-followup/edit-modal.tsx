import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Row, Col, Collapse, Select, Radio, AutoComplete, message } from 'antd'
import { map, get, includes } from 'lodash'
import { MyDatePicker } from '@lm_fe/components_m'
import { SLocal_State } from '@lm_fe/service'
import { request } from '@lm_fe/utils'
import dayjs from 'dayjs'

const EditModal = ({ dataSource, ...props }) => {
    const [form] = Form.useForm()
    const [records, setRecords] = useState([])
    const [newRecord, setNewRecord] = useState({
        followUpName: SLocal_State.userData?.login,
        followUpDate: dayjs().format('YYYY-MM-DD'),
    })

    useEffect(() => {
        getRecords(dataSource.id)
        // console.log('----787878', dataSource)

        return () => {}
    }, [])

    const getRecords = async (id) => {
        const { data } = await request.get(`/api/prenatal-visit-logs/timeoutToPhoneData/${id}`, {})
        setRecords(data)
    }

    const handleFinish = async (flag, values) => {
        // console.log('Success:', { flag, values })
        let _values = {}
        if (flag === 'new') {
            // 新随访
            _values = {
                pregnancyId: dataSource.pregnancyId,
                prenatalVisitId: dataSource.id,
                records: [
                    {
                        ...newRecord,
                        ...values,
                    },
                ],
            }
        } else {
            // 历史随访
            const currentR = records.find((item) => item.id === flag)
            _values = {
                pregnancyId: dataSource.pregnancyId,
                prenatalVisitId: dataSource.id,
                records: [
                    {
                        ...currentR,
                        ...values,
                    },
                ],
            }
        }
        if (includes([2, 3, 4], values.timeoutReason)) {
            //
            Modal.confirm({
                title: '确认',
                content: '是否同步更新孕册信息？',
                okText: '是',
                onOk: async () => {
                    await updateRecords({ ..._values, syncPregnancy: true }, flag)
                },
                cancelText: '否',
                onCancel: async () => {
                    await updateRecords(_values, flag)
                },
            })
        } else {
            await updateRecords(_values, flag)
        }
    }

    const updateRecords = async (values: any, flag?: any) => {
        await request
            .put('/api/prenatal-visit-logs/timeoutToPhoneData', values)
            .then((res) => {
                // console.log('----787878success：', { res, flag, values, _callback: get(res, ['data', 0]) })
                if (flag === 'new') {
                    // 新建不刷新记录列表
                    setNewRecord(get(res, ['data', 0]))
                } else {
                    // getRecords(dataSource.id)
                }
                // 刷新列表
                message.success('保存成功!')
            })
            .catch((err) => {
                console.log('----error：', err)
                message.error('保存失败，请稍后再试！')
            })
    }

    return (
        <Row gutter={24} style={{ minHeight: 550 }}>
            <Col flex="200px" style={{ borderRight: '1px solid #ddd' }}>
                <div style={{ fontWeight: 'bold' }}>
                    <div style={{ fontSize: '16px' }}>{dataSource.name}</div>
                    <div>
                        <span>电话：</span>
                        {dataSource?.telephone}
                    </div>
                </div>
                <p>
                    <span>诊疗卡号：</span>
                    <span>{dataSource?.patientNO}</span>
                </p>
                <p>
                    <span>建档号：</span>
                    <span>{dataSource?.outpatientNO}</span>
                </p>
                <p>
                    <span>现孕周：</span>
                    <span>{dataSource?.currentGestationalWeek}</span>
                </p>
                <p>
                    <span>高危等级：</span>
                    <span>{dataSource?.highriskGrade}</span>
                </p>
                <p>
                    <span>诊断：</span>
                    <span>{dataSource?.highriskNote}</span>
                </p>
                <p>
                    <span>妊娠监督：</span>
                    <span>{dataSource?.cardNo}</span>
                </p>
                <p>
                    <span>末次产检时间：</span>
                    <span>{dataSource?.visitDate}</span>
                </p>
                <p>
                    <span>预约复诊时间：</span>
                    <span>{dataSource?.appointmentDate}</span>
                </p>
                <p>
                    <span>超时天数：</span>
                    <span
                        style={{
                            paddingRight: 6,
                            color: dataSource?.timeoutDays > 7 ? 'red' : 'black',
                            fontWeight: 'bold',
                        }}
                    >
                        {dataSource?.timeoutDays}
                    </span>
                    天
                </p>
            </Col>
            <Col flex="auto">
                <Collapse ghost accordion bordered={false} size="small" defaultActiveKey={['_1']}>
                    <Collapse.Panel header="新增随访记录" key="_1">
                        <ItemForm flag={'new'} values={newRecord} onSubmit={handleFinish} />
                    </Collapse.Panel>
                    <Collapse.Panel
                        collapsible="disabled"
                        header="本次产检超时复诊追踪历次电话随访记录"
                        key="2"
                        showArrow={false}
                    ></Collapse.Panel>
                    {map(records, (item) => {
                        return (
                            <Collapse.Panel
                                key={item?.id}
                                header={`电话随访记录纪录 ${item?.followUpDate} ${get(
                                    ['', '接通', '未接通', '号码错误'],
                                    item.phoneStatus,
                                )}`}
                            >
                                <ItemForm key={item.id} flag={item.id} values={item} onSubmit={handleFinish} />
                            </Collapse.Panel>
                        )
                    })}
                </Collapse>
            </Col>
        </Row>
    )
}

const ItemForm = ({ flag, values, onSubmit }: any) => {
    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue(values)

        return () => {}
    }, [values.id])

    const handleSubmit = (values: any) => {
        // form.validateFields().then((values: any) => {
        //   onSubmit(values)
        // }).catch((info: any) => {
        //   console.log('Validate Failed:', info)
        // })
        onSubmit(flag, values)
    }

    return (
        <Form
            layout="horizontal"
            name={flag}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            form={form}
            onFinish={handleSubmit}
        >
            <Form.Item noStyle name="id">
                <Input style={{ height: 0, padding: 0, border: 'none' }} />
            </Form.Item>
            <Form.Item name="phoneStatus" label="电话状态">
                <Radio.Group>
                    <Radio value={1}>接通</Radio>
                    <Radio value={2}>未接通</Radio>
                    <Radio value={3}>号码错误</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="timeoutReason" label="超时原因">
                <Radio.Group>
                    <Radio value={1}>住院</Radio>
                    <Radio value={2}>转院</Radio>
                    <Radio value={3}>已分娩</Radio>
                    <Radio value={4}>终止妊娠</Radio>
                    <Radio value={5}>其他原因</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.timeoutReason !== currentValues.timeoutReason}
            >
                {({ getFieldValue }) => {
                    const _values = getFieldValue('timeoutReason')
                    if (_values === 2) {
                        // 转院
                        return (
                            <>
                                <Form.Item name="transferReason" label="转出原因">
                                    <Input.TextArea
                                        placeholder="请输入备注"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        style={{ width: 256 }}
                                    />
                                </Form.Item>
                                <Form.Item name="transferUnit" label="转至单位">
                                    <AutoComplete
                                        style={{ width: 256 }}
                                        options={[{ value: '单位一' }, { value: '单位二' }, { value: '单位三' }]}
                                    />
                                </Form.Item>
                                <Form.Item name="transferDate" label="转出时间">
                                    <MyDatePicker valueType="YYYY-MM-DD" placeholder="请选择时间" />
                                </Form.Item>
                            </>
                        )
                    }
                    if (_values === 3) {
                        // 已分娩
                        return (
                            <>
                                <Form.Item name="deliveryDate" label="分娩时间">
                                    <MyDatePicker valueType="YYYY-MM-DD" placeholder="请选择时间" />
                                </Form.Item>
                                <Form.Item name="deliveryWeek" label="分娩孕周">
                                    <Input placeholder="" style={{ width: 256 }} />
                                </Form.Item>
                                <Form.Item name="deliveryType" label="分娩方式">
                                    <Select placeholder="" style={{ width: 256 }} />
                                </Form.Item>
                            </>
                        )
                    }
                    if (_values === 4) {
                        // 终止妊娠
                        return (
                            <>
                                <Form.Item name="terminationDate" label="终止时间">
                                    <MyDatePicker valueType="YYYY-MM-DD" placeholder="" />
                                </Form.Item>
                                <Form.Item name="terminationWeek" label="终止孕周">
                                    <Input placeholder="" style={{ width: 256 }} />
                                </Form.Item>
                                <Form.Item name="terminationReason" label="终止原因">
                                    <AutoComplete
                                        options={[{ value: '自然流产' }, { value: '人工流产' }]}
                                        placeholder=""
                                        style={{ width: 256 }}
                                    />
                                </Form.Item>
                            </>
                        )
                    }
                    if (_values === 5) {
                        return (
                            <Form.Item name="reasonOther" label="其他原因备注">
                                <Input placeholder="请输入其他原因备注" />
                            </Form.Item>
                        )
                    }
                    return null
                }}
            </Form.Item>

            <Form.Item name="remark" label="备注">
                <Input.TextArea placeholder="请输入备注" autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: 256 }} />
            </Form.Item>

            <Form.Item name="followUpName" label="随访人">
                <Input placeholder="" style={{ width: 256 }} />
            </Form.Item>

            <Form.Item name="followUpDate" label="随访时间">
                <MyDatePicker valueType="YYYY-MM-DD" placeholder="" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 5 }}>
                <Button type="primary" htmlType="submit">
                    保存
                </Button>
            </Form.Item>
        </Form>
    )
}

export default EditModal
