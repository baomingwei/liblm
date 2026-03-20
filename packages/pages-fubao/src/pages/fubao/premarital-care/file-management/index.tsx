import { DeleteOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { fubaoHistoryPush, OkButton } from '@lm_fe/components_m';
import { BF_Wrap2, IdNOButton, mchcModal__, MyBaseList, useReadIdNO } from '@lm_fe/pages';
import { ModelService } from '@lm_fe/service';
import { formatRangeDate, fubaoRequest as request } from '@lm_fe/utils';
import { Button, Divider, Form } from 'antd';
import React, { useEffect } from 'react';
const s = new ModelService({
  n: 'PremaritalCheckArchives', prePath: '/premarital/check',
  //  apiPrefix: `/fb/api`,
  fuckPage: true
})
export default function FileManagementList(props: any) {
  const conf_fn = () => import('./config/table').then(mod =>
    mod.default()
  )

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: `婚前检查-档案列表`,
      tableColumns: conf_fn,
      searchConfig: () => import('./config/search')
    }
  })
  const [search_form] = Form.useForm()
  const { id_NO_msg } = useReadIdNO()
  useEffect(() => {

    if (id_NO_msg?.send_id === 'list')
      search_form.setFieldsValue({
        womanName: id_NO_msg.data.name
      })
  }, [id_NO_msg])

  const handlePrint = (rowData: any, resource: any) => () => {
    const { id } = rowData;

    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestData: {
          url: '/api/premaritalCheckupsPrint',
          resource,
          id,
        }

      }
    })
    // mchcEnv.info('暂未开放此功能，敬请期待；');
  };


  function handleAdd() {
    fubaoHistoryPush(`/premarital-care/file-management/add`, props)

  };


  return <Wrap>
    <MyBaseList
      tableColumns={__DEV__ ? conf_fn : config?.tableColumns}
      renderBtns={() =>
        <>
          <IdNOButton send_id='list' />
          <OkButton onClick={handleAdd}>新增</OkButton>
        </>

      }
      searchForm={search_form}
      action_col={({ handleDelete }) => {
        return {
          title: '操作',
          showSorter: false,
          showFilter: false,
          fixed: 'right',
          width: 330,
          render: (value: any, rowData: any, index: number) => {
            return (
              <>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const { id } = rowData;
                    fubaoHistoryPush(`/premarital-care/wife-v2/wife-exam?id=${id}`, props)
                  }}
                >
                  查看
                </Button>
                <Divider type="vertical" />
                <Button
                  type="link"
                  size="small"
                  onClick={handlePrint(rowData, 'womanPremaritalCheckupsPrint')}
                >
                  打印<span style={{ color: '#6c6b6b' }}>(女方)</span>
                </Button>
                <Divider type="vertical" />
                <Button
                  type="link"
                  size="small"
                  onClick={handlePrint(rowData, 'manPremaritalCheckupsPrint')}
                >
                  打印<span style={{ color: '#6c6b6b' }}>(男方)</span>
                </Button>
                <Divider type="vertical" />
                <Button
                  onClick={() => handleDelete(rowData)}
                  type="link"
                  size="small"
                >
                  删除
                </Button>
              </>
            );
          },

        }
      }}
      customModelService={s}
      showRowDelBtn
      baseTitle='档案管理'
      showAdd={false}
      fuckPage

      beforeSearch={(v) => {
        const { filingDay, ...others } = v
        const rangeData = formatRangeDate({ filingDay })
        const res = {

          ...rangeData,
          ...others,
        }
        return res
      }}
      beforeSubmit={v => {
        const { configurationValue, configurationReplenishExplain, } = v
        let configurationState = v.configurationState
        if (configurationValue && configurationReplenishExplain) {
          configurationState = 1
        }
        if (!configurationValue && !configurationReplenishExplain) {
          configurationState = 0
        }
        v.configurationState = configurationState


        return v
      }}
      searchConfig={config?.searchConfig}
      searchParams={{ pageSize: 10 }}


    />
  </Wrap>
}


