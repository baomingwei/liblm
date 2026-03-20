import { fubaoHistoryPush, OkButton } from '@lm_fe/components_m';
import { formatRangeDate, fubaoRequest as request } from '@lm_fe/utils';
import { Form, message, Space } from 'antd';
import { get } from 'lodash';
import React, { useEffect } from 'react';

import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, IdNOButton, MyBaseList, useReadIdNO } from '@lm_fe/pages';
import { ModelService } from '@lm_fe/service';
import { Follow_up_btn_两癌 } from './.两癌随访';
import { load_form_config } from './edit/form_config/Form';

const s = new ModelService({
  n: 'TwoCancerScreeningFile', prePath: '/two/cancer/screening',
  //  apiPrefix: `/fb/api`,
  fuckPage: true
})






function handleView(rowData: any) {
  const { id } = rowData;
  const { history } = this.props as any;
  fubaoHistoryPush(`/gynecological-diseases/two-cancers/exam?id=${id}`, this.props as any);
};

export default function Pathological_follow_up(props: any) {
  // const [modal_form] = Form.useForm()
  const [search_form] = Form.useForm()
  const { id_NO_msg } = useReadIdNO()
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '两癌筛查-列表',
      tableColumns: load_form_config,
      searchConfig: [
        { inputType: 'input', name: 'outpatientNo', label: '门诊号', props: {} },
        { inputType: 'input', name: 'telephone', label: '手机号码', props: {} },
        { inputType: 'input', name: 'idNO', label: '身份证号码', props: {} },
        { inputType: 'input', name: 'name', label: '姓名', props: {} },
        { inputType: 'input', name: 'unitName', label: '检测单位', props: {} },
      ]
    }
  })
  useEffect(() => {


    mchcEvent.on_rm('my_form', e => {
      if (e.type !== 'onClick') return
      const idNO = e.values?.idNO
      if (!idNO) return mchcEnv.warning('请输入证件号码')
      request
        .get<{ uploadMsg: string }>('/api/two/cancer/screening/reportVerification', { params: { 'idNO.equals': idNO }, unboxing: true })
        .then(({ data }) => { mchcEnv.info(data.uploadMsg) })
    })
  }, [])

  useEffect(() => {

    if (id_NO_msg?.send_id === 'list')
      search_form.setFieldsValue(id_NO_msg.data)
  }, [id_NO_msg])


  const handlePrint = (rowData: any, resource: any) => () => {
    const { id } = rowData;


    // mchcEnv.info('暂未开放此功能，敬请期待；');
  };

  const handleEdit = (rowData: any) => () => {
    const { id } = rowData;
    fubaoHistoryPush(`/gynecological-diseases/two-cancers/edit?id=${id}`, this.props as any);
  };

  const handleDelete = (rowData: any) => async () => {
    const res = await request.delete(`/api/two/cancer/screening/deleteTwoCancerScreeningFile/${get(rowData, 'id')}`);

    this.handleSearch();

  };

  return <Wrap>
    <MyBaseList
      searchForm={search_form}
      modalFormConfig={{
        modal_data: {
          // form: modal_form,
          onValuesChange(changedValues, values, form) {

          },
        }
      }
      }
      customModelService={s}
      // tableColumns={tableColumns}
      tableColumns={config?.tableColumns}

      // get_fuck_page={async (config) => {

      //   return (await request.get('/api/two/cancer/screening/getTwoCancerScreeningFile/page', { ...config, unboxing: true })).data
      // }}
      baseTitle='档案管理'
      // showAdd={false}
      // needChecked
      ActionAddonBefore={({ handleSearch, rowData }) => {
        return <Space>
          <Follow_up_btn_两癌 handleSearch={handleSearch} rowData={rowData} />
          <OkButton size='small'
            onClick={() => {
              fubaoHistoryPush(`/gynecological-diseases/two-cancers/exam?id=${rowData.id}`, props);
            }}
          >筛查</OkButton>
        </Space>
      }}
      renderBtns={() => <IdNOButton send_id='list' />}

      beforeSearch={(v) => {
        const { filingDay, ...others } = v
        const rangeData = formatRangeDate({ filingDay })
        const res = {

          ...rangeData,
          ...others,
        }
        return res
      }}
      beforeSubmit={async v => {
        const { configurationValue, configurationReplenishExplain, } = v
        let configurationState = v.configurationState
        if (configurationValue && configurationReplenishExplain) {
          configurationState = 1
        }
        if (!configurationValue && !configurationReplenishExplain) {
          configurationState = 0
        }
        v.configurationState = configurationState

        const idNO = v.idNO
        const check_res = mchcUtils.checkIdNo_new(idNO)
        if (!check_res?.status) {
          mchcEnv.info('证件号码填写错误')
          return null
        }
        return v

      }}
      searchConfig={config?.searchConfig}
      searchParams={{ pageSize: 10 }}


    />
  </Wrap>
}
