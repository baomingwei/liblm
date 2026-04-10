import { rt_ctx } from '@lm_fe/env';
import { MyBaseList } from '@lm_fe/pages';
import { Empty } from 'antd';
import React from 'react';
import { IProps } from './types';

const ctx = rt_ctx
export default function FurtherVisit({ head_info }: IProps) {
  if (!head_info) return <Empty />
  return <MyBaseList
    outpatientNO={head_info.outpatientNO}
    table_preset={{
      title: '编辑孕册-复诊管理',
      name: '/api/measures',
      needEditInTable: 1,
      tableColumns: () => import('./form_config'),
      handleBeforePopup: (v: any) => {
        v.createDate = v.createDate || ctx.utils.formatDate()
        v.createUser = v.createUser || ctx.mchcEnv.user_data.firstName
        return v
      },
      beforeSubmit: (v: any) => {

        return ctx.utils.assign(v, { type: 1, outpatientNO: ctx.props.outpatientNO })
      },
      searchParams: () => {
        return {
          sort: 'createDate,DESC',
          'type.equals': 1,
          'outpatientNO.equals': ctx.props.outpatientNO
        }
      }
    }}

  />
}
