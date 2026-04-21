import { MyBaseList } from '@lm_fe/pages';
import React from 'react';



export default function List(props: {}) {




  return <MyBaseList
    table_preset={{
      title: `知识库-列表`,
      tableColumns: () => import('./form_config'),
      name: '/api/knowledges',
      searchParams: { 'sort': 'id,desc' },
      beforeSubmit: (v: any) => ({ ...v }),
      showCopy: 1,
      searchConfig: [
        {
          name: 'title',
          label: '标题',
        },
        {
          label: '类型',
          name: 'type',
          inputType: 'MS',
          inputProps: { uniqueKey: 'Knowledge.knowledgeType' }
        },
      ]
    }}
  />
}




