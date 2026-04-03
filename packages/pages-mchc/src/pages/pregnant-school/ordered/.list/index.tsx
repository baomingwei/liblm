import { OkButton } from '@lm_fe/components_m';
import { mchcEvent } from '@lm_fe/env';
import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import { SMchc_Courses } from '@lm_fe/service';
import React, { useEffect } from 'react';
import { WhichType } from '../../types';



export default function List(props: { which_type: WhichType }) {
  const { which_type } = props
  const type = which_type === '孕妇学校' ? 1 : 2
  const is_midwifery = which_type === '助产士'

  const load_form = () => is_midwifery ? import('./form_config_midwifery') : import('./form_config')
  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: `${which_type}-预约列表`,
      tableColumns: load_form,
      name: '/api/course-reservations',
      searchParams: { 'course.type.equals': type },

      searchConfig: [
        {
          name: 'course.name',
          label: '课程标题',
          inputType: 'input',
          filterType: '',
        },
        {
          name: 'pregnancy.name',

          label: '姓名',
          inputType: 'input',
          filterType: '',
        },

        {
          name: 'status',
          label: '签到状态',
          inputType: 'MS',
          filterType: 'in',
          inputProps: {
            options: [
              { label: '未签到', value: '0' },
              { label: '已签到', value: '1' },
              { label: '已取消', value: '2' },
            ],
          },
          style: {
            width: 100,
          },
        },


        {
          label: '课程标题',
          name: 'course.name',
        },
      ]
    }
  })
  useEffect(() => {
    const rm = mchcEvent.on_rm('custom_msg', e => {
      const rowData = e.data

    })

    return rm
  }, [])


  return <Wrap>
    <MyBaseList
      bf_conf={config}
      showAdd={false}
      // name={config?.name}
      // searchParams={config?.searchParams}
      useListSourceCount
      showRowEditBtn={false}
      beforeSubmit={v => ({ ...v, type })}
      // showPrint
      // showRowDelBtn={false}
      printDefaultConfig={{ method: 'GET' }}
      // searchConfig={config?.searchConfig}
      ActionAddonBefore={({ rowData, handleSearch }) => {

        const { id, course } = rowData
        const is签到 = rowData.status === 1
        const fn = is签到 ? SMchc_Courses.cancel_sign : SMchc_Courses.sign
        return < OkButton size='small' danger={is签到} onClick={() => { fn(course?.id, id).then(() => handleSearch()) }}  >{is签到 ? '取消' : '签到'}</OkButton>

      }}
      // tableColumns={__DEV__ ? load_form : config?.tableColumns}
    />
  </Wrap >
}



