import { FormSectionForm } from "@lm_fe/components_m";
import { IMchc_TableConfig } from "@lm_fe/service";
import { AnyObject, ICommonOption, request } from "@lm_fe/utils";
import { Card, Col, Empty, Row, List, Form, Typography } from "antd";
import { values } from "lodash";
import React, { useEffect, useState } from 'react'
interface IProps { ext: ICommonOption, config?: IMchc_TableConfig, recordId: number }
interface IItem { modifiedDate: string, version: number, modifiedBy: string }
export function ExtHistory({ ext, config, recordId }: IProps) {
    const [list, set_list] = useState<IItem[]>([])
    const [active, set_active] = useState<IItem>()
    const ext_value = ext.value
    const base_args = {
        recordId,
    }
    const [form] = Form.useForm()

    useEffect(() => {
        request.get<IItem[]>(`/api/case/manage/${ext_value}/historyList`, { params: base_args })
            .then(res => {
                const arr = res.data
                set_list(arr)
                if (arr.length)
                    set_active(arr[0])

            })
        return () => {

        }
    }, [])
    useEffect(() => {
        if (active)
            getDetail(active)

        return () => {

        }
    }, [active])

    function getDetail(item: IItem) {
        request
            .get<AnyObject>(`/api/case/manage/${ext_value}/historyDetail`, { params: item })
            .then(res => form.setFieldsValue(res.data))
    }

    if (!list.length) return <Empty />
    return <Row style={{ height: '100%' }}>
        <Col span={4} style={{ height: '100%', overflow: 'auto' }}>

            <List
                dataSource={list}
                renderItem={(item, index) => (
                    <List.Item onClick={() => set_active(item)}>
                        <List.Item.Meta
                            style={{ cursor: 'pointer', background: item.version === active?.version ? '#ddd' : '' }}
                            title={item.modifiedDate}
                            description={item.modifiedBy}
                        />
                    </List.Item>
                )}
            />


        </Col>
        <Col span={20} style={{ height: '100%', overflow: 'auto' }}>
            <FormSectionForm targetLabelCol={config?.targetLabelCol ?? 8} form={form} bf_config={config} />

        </Col>
    </Row>
}