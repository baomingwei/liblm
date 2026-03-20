import { fubaoHistoryPush, OkButton } from '@lm_fe/components_m';
import { mchcModal__, MyBaseList } from '@lm_fe/pages';
import { formatRangeDate, fubaoRequest as request, safe_async_call } from '@lm_fe/utils';
import { Button, Divider } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { queryFormDescriptions } from './config/form';
import { tableColumns } from './config/table';
import { form_config } from './form_config';




function showView(record: any, handleSearch: any) {
  mchcModal__.open('modal_form', {
    modal_data: {
      targetLabelCol: 4,
      formDescriptions: form_config,
      getInitialData() {
        return record
      },
      async onSubmit(data) {
        await request.put('/api/two/cancer/screening/updateTwoCancerPathologicalExaminationRemind', data);
        return safe_async_call(handleSearch)
      },
    }
  })
};



function handleView(rowData: any) {
  const { twoCancerScreeningId, cervicalCancerScreeningId, breastCancerScreeningId, breastCancerXRayId } = rowData;
  if (get(rowData, 'screeningType') && get(rowData, 'screeningType').indexOf('乳腺') > -1) {
    if (breastCancerScreeningId) {
      fubaoHistoryPush(
        `/gynecological-diseases/two-cancers/exam?id=${twoCancerScreeningId}&breastCancerScreeningId=${breastCancerScreeningId}&activeKey=MammaryCancer`,
      );
    } else {
      fubaoHistoryPush(
        `/gynecological-diseases/two-cancers/exam?id=${twoCancerScreeningId}&breastCancerXRayId=${breastCancerXRayId}&activeKey=MammaryCancer`,

      );
    }
  } else {
    fubaoHistoryPush(
      `/gynecological-diseases/two-cancers/exam?id=${twoCancerScreeningId}&cervicalCancerScreeningId=${cervicalCancerScreeningId}`,

    );
  }
};

export default function Pathological_reminder(props: any) {
  const handlePrint = (rowData: any, resource: any) => () => {
    const { id } = rowData;


    // mchcEnv.info('暂未开放此功能，敬请期待；');
  };

  const handleEdit = (rowData: any) => () => {
    const { id } = rowData;

    fubaoHistoryPush(`/premarital-care/file-management/edit?id=${id}`, props)
  };

  const handleDelete = (rowData: any) => async () => {
    const _res = await request.delete(`/api/premarital/check/deletePremaritalCheckArchives/${get(rowData, 'id')}`);

  };

  return <MyBaseList genColumns={({ handleDelete, handleSearch }) => {
    return [...tableColumns as any,
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',

      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              onClick={() => handleView(rowData)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={() => showView(rowData, handleSearch)}
            >
              通知
            </Button>
          </>
        );
      },
    }].map(_ => ({ ..._, align: 'center' }))
  }}
    get_fuck_page={async (config) => {

      return (await request.get('/api/two/cancer/screening/getTwoCancerPathologicalExaminationRemind', { ...config, unboxing: true })).data
    }}
    showRowDelBtn
    baseTitle='档案管理'
    showAdd={false}
    needChecked
    renderBtns={({ getSearchParams, getCheckRows, handleSearch }) => {

      const ids = getCheckRows().map(_ => _.id)
      return <>
        <OkButton primary disabled={!ids.length} onClick={() =>
          request.post('/api/two/cancer/screening/pushTwoCancerPathologicalExaminationRemindBatch', { ids }, { successText: '操作成功' }).then(handleSearch)
        }>批量通知</OkButton>
      </>
    }}
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
    searchConfig={[
      { inputType: 'rangeDate', name: 'checkDate', label: '检查', props: {} },
      { inputType: 'MS', name: 'screeningType', label: '筛查类型', props: { options: queryFormDescriptions.screeningType.options } },
      { inputType: 'MS', name: 'loseTrack', label: '是否失访', props: { options: queryFormDescriptions.loseTrack.options } },
      { inputType: 'MS', name: 'notificationStatus', label: '通知状态', props: { options: queryFormDescriptions.notificationStatus.options } },

      // {
      //   type: 'Select', outerOptions: { name: 'configurationState', label: '配置状态' }, innerOptions: {
      //     options: [{ label: '未配置', value: '0' },
      //     { label: '已配置', value: '1' },]
      //   }
      // },

    ]}
    searchParams={{ pageSize: 10 }}


  />
}



