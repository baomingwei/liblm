import { APP_CONFIG } from "@lm_fe/components_m";
import { defineFormConfig } from "@lm_fe/service";
export default defineFormConfig(
  [
    {
      title: '序号',
      dataIndex: ['index'],
      ellipsis: true,
      width: 36,
      align: 'center',
      isActive: 0,
      render: (text, record, index) => index + 1,
    },
    {
      title: '配置名(key)',
      dataIndex: 'configurationKey',
      inputProps: { disabled: true },
      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_LARGE,
    },
    {
      title: '配置类型',
      dataIndex: 'configurationType',
      inputProps: { disabled: true },

      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '配置状态', //（0未配置，1已配置，默认未0）
      dataIndex: 'configurationState',
      //
      align: 'center',
      width: 56,
      inputType: 'MySelect',
      inputProps: { options: ['未配置', '已配置'].map((label, value) => ({ label, value })), marshal: 0, disabled: true },
      // render: (text) => (text == 0 ? '未配置' : text == 1 ? '已配置' : ''),
    },
    {
      title: '配置说明',
      dataIndex: 'configurationExplain',
      inputProps: { disabled: true },

      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_LARGE,
    },
    {
      title: '配置值',
      dataIndex: 'configurationValue',

      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_LARGE,
    },
    {
      title: '配置补充说明',
      dataIndex: 'configurationReplenishExplain',

      align: 'center',
      width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    },
  ]
)
