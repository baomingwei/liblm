import { APP_CONFIG } from '@lm_fe/components_m';
import { rt_ctx } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';
const ctx = rt_ctx
const React = ctx.React
export default defineFormConfig(
  [
    {
      title: '创建时间',
      dataIndex: 'createDate',

      rules: [{ required: true, message: '创建时间是必填项' }],
      width: APP_CONFIG.CELL_WIDTH_MIDDLE,
      inputType: 'single_date_picker',
    },
    {
      title: 'physicalExamMeasure.id',
      dataIndex: 'physicalExamMeasure.id',
      hidden: true,
      form_hidden: true,
    },
    {
      title: 'gynecologicalExamMeasure.id',
      dataIndex: 'gynecologicalExamMeasure.id',
      hidden: true,
      form_hidden: true,
    },
    {
      title: '血压-首测',
      dataIndex: 'bloodPressure',
      children: [
        {
          inputType: 'input_number',
          title: '收缩压',
          dataIndex: 'physicalExamMeasure.systolic'
        },
        {
          inputType: 'input_number',
          title: '舒张压',
          dataIndex: 'physicalExamMeasure.diastolic'
        },
      ],

    },
    {
      title: '血压-二测',
      dataIndex: 'bloodPressure',
      children: [
        {
          inputType: 'input_number',
          title: '收缩压',
          dataIndex: 'physicalExamMeasure.systolic2'
        },
        {
          inputType: 'input_number',
          title: '舒张压',
          dataIndex: 'physicalExamMeasure.diastolic2'
        },
      ],

    },
    {
      title: '血压-三测',
      dataIndex: 'bloodPressure',
      children: [
        {
          inputType: 'input_number',
          title: '收缩压',
          dataIndex: 'physicalExamMeasure.systolic3'
        },
        {
          inputType: 'input_number',
          title: '舒张压',
          dataIndex: 'physicalExamMeasure.diastolic3'
        },
      ],

    },

    {
      title: '脉搏(bpm)',
      dataIndex: ['physicalExamMeasure', 'pulse'],

      inputType: 'MI',
      inputProps: { min: 60, max: 100, tip: '脉搏的正常范围值是60~100bpm' },
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '体重(kg)',
      dataIndex: ['physicalExamMeasure', 'weight'],

      inputType: 'MI',
      inputProps: { min: 0, type: 'number' },
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '宫高(cm)',
      dataIndex: ['gynecologicalExamMeasure', 'fundalHeight'],

      inputType: 'MI',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '腹围(cm)',
      dataIndex: ['gynecologicalExamMeasure', 'waistHip'],

      inputType: 'MI',
      inputProps: { min: 0, type: 'number' },
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      render: (value: any) => value || '',
    },
    {
      title: '备注',
      dataIndex: 'remark',

      inputType: 'MA',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',

      inputType: 'MA',
      width: APP_CONFIG.CELL_WIDTH_MIDDLE,
      inputProps: {
        disabled: true,
      },
    },
  ]

)