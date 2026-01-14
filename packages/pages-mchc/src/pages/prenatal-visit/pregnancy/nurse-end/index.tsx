import { DoctorEnd_HeaderInfoLayout } from '@lm_fe/pages';
import { SLocal_SystemConfig } from '@lm_fe/service';
import { getSearchParamsValue, request } from '@lm_fe/utils';
import { message, Tabs } from 'antd';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import './index.less';
import React from 'react';
import ArchivalInformation from './archival-information/index1';
import CloseArchives from './close-archives/index1';
import FurtherVisit from './further-visit/index1';
import InformedConsent from './InformedConsent/index1';
import PostpartumVisit from './postpartum-visit/index1';
import { mchcUtils } from '@lm_fe/env';
import { MyLazyComponent } from '@lm_fe/components';
import { use_provoke } from '@lm_fe/provoke';

function NurseMain(props: any) {
  const { sys_theme, config } = use_provoke()
  const 护士端_模块隐藏 = config.护士端_模块隐藏 || []
  const [headerData, set_headerData] = useState({})
  const [activeKey, set_activeKey] = useState<string>('')
  const pregnancy_id = get(props, `id`) ?? getSearchParamsValue('id');

  useEffect(() => {
    if (pregnancy_id) {
      getHeaderInfo();
      set_activeKey(mm[0]?.title)
    }

    return () => {

    };
  }, [pregnancy_id]);



  // 子页面 档案信息点击保存后刷新表头信息
  async function getHeaderData() {
    const id = get(props, 'id') || getSearchParamsValue('id');
    const headerData = (await request.get(`/api/nurse/getOutpatientHeaderInfo?id=${id}&q=1`)).data;

    set_headerData(headerData)

  };
  async function getHeaderInfo() {
    const id = getSearchParamsValue('id') || get(props, `id`);
    if (!id) {
      message.error('请选择就诊人');
      return null;
    }
    const res = (await request.get('/api/doctor/getOutpatientHeaderInfo?q=2&id=' + id)).data;

    set_headerData(res)
    return res

  }
  async function handleChangeTab(activeKey: string) {
    set_activeKey(activeKey)

  };


  const mm = [
    { title: '档案信息', comp: () => <ArchivalInformation id={pregnancy_id} reloadHeader={getHeaderData} {...props} /> },
    { title: '复诊管理', comp: () => <FurtherVisit id={get(headerData, 'outpatientNO')} head_info={headerData} {...props} /> },
    { title: '产后复诊管理', comp: () => <PostpartumVisit id={get(headerData, 'outpatientNO')} head_info={headerData} {...props} /> },
    { title: '补助券管理', comp: () => <InformedConsent id={pregnancy_id} head_info={headerData} {...props} /> },
    { title: '结案管理', comp: () => <CloseArchives id={pregnancy_id} {...props} /> },
  ].filter(_ => !护士端_模块隐藏.includes(_.title))


  function renderContent() {

    return (
      <MyLazyComponent>
        <Tabs destroyOnHidden className="panel-with-child_content-tabs" style={{ background: sys_theme.bg_color, }} activeKey={activeKey} onChange={handleChangeTab}>
          {
            mm.map(_ => {
              return <Tabs.TabPane tab={_.title} key={_.title}>
                {_.comp()}
              </Tabs.TabPane>
            })
          }


        </Tabs>
      </MyLazyComponent>
    );
  };
  return <DoctorEnd_HeaderInfoLayout {...props}
    id={pregnancy_id}
    isNurse
    saveHeaderInfo={set_headerData} >

    {renderContent()}
  </DoctorEnd_HeaderInfoLayout>
}
export default NurseMain
