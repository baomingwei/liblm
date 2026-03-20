import { form_validate, IGlobalModalProps, validate_form } from '@lm_fe/components';
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import { Button, Empty, Form, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';

import { FormSectionForm, OkButton } from '@lm_fe/components_m';
import { ICommonOption } from '@lm_fe/env';
import { AnyObject, get, isNil, request } from '@lm_fe/utils';
import React from 'react';
import { BF_Wrap2 } from 'src/components';
import { mchcModal__ } from 'src/modals';
import { ExtHistory } from './History'


function Index(props: IGlobalModalProps<{ headerInfo?: IMchc_Doctor_OutpatientHeaderInfo, ext: ICommonOption }>) {

  const { modal_data, close, ...others } = props
  const { headerInfo, ext } = modal_data
  const ext_value = ext.value
  const ext_label = ext.label
  if (!ext_label || !ext_label || !headerInfo) return <Empty />

  const [data, setData] = useState<AnyObject>({})
  const relationId = headerInfo.id
  const [form] = Form.useForm()
  const { config, Wrap } = BF_Wrap2({ default_conf: { title: `拓展专案-${ext.value}` } })
  const base_args = {
    relationId,
    // type: ext_value,
  }
  async function fetch_data() {
    let res = await request.get(`/api/case/manage/${ext_value}`, { params: base_args })
    setData(res.data)

  }
  useEffect(() => {

    fetch_data()
    return () => {

    }
  }, [])
  useEffect(() => {

    form.setFieldsValue(data)

    return () => {

    }
  }, [data])


  const data_id = get(data, 'id')



  async function handleOk() {

    const values = await validate_form(form)
    if (values) {
      const res = await request.put(`/api/case/manage/${ext_value}`, values, { successText: '操作成功' })
      setData(res.data)
    }


  };
  function open_history() {
    mchcModal__.open('box', {
      footer: null,
      title: '历史记录',
      width: '90vw',
      styles: { body: { height: '80vh', overflow: 'auto' } },
      modal_data: { content: <ExtHistory ext={ext} recordId={data_id} config={config} /> }
    })

  }

  function renderFooter() {
    return (
      <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <OkButton hidden={!data_id} onClick={open_history}>
          查看历史
        </OkButton>

        <OkButton hidden={!data_id} onClick={() => mchcModal__.open('print_modal', {
          modal_data: { requestData: { url: `/api/case/manage/${ext_value}/print`, template: ext_value, relationId, id: data_id } }
        })}>
          打印
        </OkButton>

        <OkButton type="primary" onClick={handleOk}>
          确定
        </OkButton>
      </Space>
    );
  }


  return (
    <Modal
      {...others}
      title={ext_label}

      width={'70vw'}
      styles={{ body: { height: '80vh', overflow: 'auto' } }}
      onOk={handleOk}
      maskClosable={false}
      footer={renderFooter()}
    >
      <Wrap>
        <FormSectionForm form={form} bf_config={config} />
      </Wrap>

    </Modal>
  );
}
export default Index;
