import { rt_ctx } from '@lm_fe/env';
import { MyBaseList } from '@lm_fe/pages';
import { AnyObject } from '@lm_fe/utils';
const ctx = rt_ctx
const React = ctx.React


export default () => {


  return <MyBaseList
    table_preset={{
      title: '系统管理-配置管理',
      tableColumns: () => import('./config/table'),
      name: "/api/getAllConfiguration/page",
      showRowDelBtn: 1,
      showAdd: 0,
      beforeSubmit: (v: AnyObject) => {
        const configurationValue = v.configurationValue
        const configurationReplenishExplain = v.configurationReplenishExplain
        let configurationState = v.configurationState

        if (configurationValue && configurationReplenishExplain) {
          configurationState = 1
        }
        if (!configurationValue && !configurationReplenishExplain) {
          configurationState = 0
        }
        v.configurationState = configurationState


        return v
      },
      searchConfig: [
        { inputType: 'Input', name: 'configurationExplain', label: '配置说明' },
        { inputType: 'Input', name: 'configurationKey', label: '配置名' },
        { inputType: 'Input', name: 'configurationType', label: '配置类型' },
        { inputType: 'Input', name: 'configurationValue', label: '配置值' },
        { inputType: 'MS', name: 'configurationState', label: '配置状态', inputProps: { options: '未配置,已配置' }, },
      ],
      renderBtns: () => {


        return <>
          {ctx.ui.render_btn('刷新', () => {
            ctx.request.get<{ code: number, msg: string }>('/api/flushConfiguration',).then(() => ctx.props.table_helper.handleSearch());

          })}
        </>
      }
    }}


  />
}

