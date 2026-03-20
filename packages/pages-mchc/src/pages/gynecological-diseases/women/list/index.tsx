import { MyIcon } from '@lm_fe/components';
import { BF_Wrap2, IdNOButton, mchcModal__, MyBaseList, useReadIdNO } from '@lm_fe/pages';
import { SLocal_History } from '@lm_fe/service';
import { Button, Form, Space } from 'antd';
import React, { useEffect } from 'react';
import Gaopaiyi_List from 'src/pages/prenatal-visit/report/list';
import { bf_default } from './bf_default';

export default function Gynecological_diseases_women(props: any) {

  const [search_form] = Form.useForm()
  const { id_NO_msg } = useReadIdNO()
  useEffect(() => {
    if (id_NO_msg?.send_id === 'list')
      search_form.setFieldsValue(id_NO_msg.data)
  }, [id_NO_msg])
  const { config, Wrap } = BF_Wrap2({ default_conf: { ...bf_default, title: '妇女档案-列表' }, })

  return <Wrap>
    <MyBaseList
      tableColumns={config?.tableColumns}
      searchConfig={config?.searchConfig}
      name={config?.name ?? '/api/gynecological-patients'}
      // {...config}
      searchForm={search_form}

      ActionAddonBefore={({ rowData }) => {
        return <Space>

          <Button
            size="small"
            // icon={<EyeOutlined className="global-table-action-icon" />}
            onClick={() => {
              mchcModal__.open('modal_page', {
                title: '高拍仪查看',
                modal_data: {
                  content: <Gaopaiyi_List type={6} search={{ patientNo: rowData.outpatientNO }} />
                }
              })
            }}
          >
            同意书
          </Button>

          <Button
            size="small"
            icon={<MyIcon value='EyeOutlined' />}
            onClick={() => {
              SLocal_History.safe_history_push(`/gynecological-diseases/women/women-exam-records?id=${rowData.id}`, props);

            }}
          >
          </Button>
        </Space>
      }}
      renderBtns={(ctx) => {
        return <IdNOButton send_id='list' />
      }}
    />
  </Wrap>
}