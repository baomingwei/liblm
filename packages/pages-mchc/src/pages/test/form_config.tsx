import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { Input } from "antd";
const ctx = rt_ctx
const layout = '1/2'
const React = ctx.React
export default defineFormConfig([

  {
    label: '根据门诊号选择孕妇联动',
    children: [
      {
        label: '就诊卡号',
        inputType: 'PatientSelect',
        dataIndex: 'outpatientNO',
        layout: '1/3',
        disabledDeps(f) {
          return !!f.getFieldValue('id')
        },
        inputProps: {
          onPatientSelect(v, form) {
            if (form) {
              v.pregnancyId = v.id
              v.id = undefined
              form.setFieldsValue(v)
            }
          },
        },
        // hidden: true,
      },

      {
        dataIndex: 'pregnancyId',
        title: 'pregnancyId',
        layout: '1/3',
        inputProps: { disabled: true }
      },
      {
        title: '姓名',
        dataIndex: 'name',
        inputProps: { disabled: true },
        layout: '1/3',
      },
      {
        title: '证件号码',
        dataIndex: 'idNO',
        inputProps: { disabled: true },
        layout: '1/3',
      },


      {
        title: '年龄',
        dataIndex: 'age',
        inputProps: { disabled: true },
        layout: '1/3',
        inputType: 'InputNumber'
      },
      {
        title: '孕周',
        dataIndex: 'gestationalWeek',
        inputProps: { disabled: true },
        layout: '1/3',
      },
    ]
  },
  {
    label: 'bmi联动',
    children: [
      {
        label: 'weight',
        name: 'physicalExamination.weight',
        inputProps: { unit: 'kg' },
        processLocal: function (v, form) {  // bmi 联动示例，假设当前字段为 height，v 为 height 的值
          if (form) {
            var values = form.getFieldsValue() // 获取整体表单值
            var height = ctx.utils.get<number>(values, 'physicalExamination.height') // 从取整体表单值获取 height
            var bmi = ctx.utils.calc_bmi(height, v) // 参数 1 为体重，参数 2 为身高
            var new_values = ctx.utils.set({}, 'physicalExamination.bmi', bmi) // 新的表单值
            form.setFieldsValue(new_values)
          }
        },
        layout: layout
      },
      {
        label: 'height',
        name: 'physicalExamination.height',
        inputProps: { unit: 'cm' },

        processLocal: function (v, form) {  // bmi 联动示例，假设当前字段为 height，v 为 height 的值
          if (form) {
            var values = form.getFieldsValue() // 获取整体表单值
            var weight = ctx.utils.get<number>(values, 'physicalExamination.weight') // 从取整体表单值获取 weight
            var bmi = ctx.utils.calc_bmi(weight, v) // 参数 1 为体重，参数 2 为身高
            var new_values = ctx.utils.set({}, 'physicalExamination.bmi', bmi) // 新的表单值
            form.setFieldsValue(new_values)
          }
        },
        layout: layout
      },
      { label: 'bmi', name: 'physicalExamination.bmi', inputProps: { disabled: true }, layout: layout },
    ]
  },
  {
    label: '证件联动',
    children: [
      {

        "key": "BasicInfo.idType",
        "label": "证件类型",

        "inputType": "MS",
        inputProps: {
          uniqueKey: '证件类型',

        },
        required: () => ctx.required,
        layout: layout,
      },
      {

        "key": "BasicInfo.idNO",
        "label": "证件号码",
        processLocal(v, form) {
          if (form) {

            var idNO = ctx.utils.trim(v) // 去掉空格
            var idNO_len = ctx.utils.size(idNO) // 用户输入的长度
            var values = form.getFieldsValue() // 获取整体表单值
            var idType = ctx.utils.get(values, 'BasicInfo.idType') // 获取证件类型
            // 证件类型为身份证，输入长度为 18 才计算
            if (idType === 1 && idNO_len === 18) {
              var id_info = ctx.utils.checkIdNo_new(idNO) // 通过身份证计算

              // 说明身份证正确
              if (id_info) {
                // 设置对应的字段
                var baseInfo = {
                  dob: id_info.birth,
                  nationality: id_info.nationality,
                  nativeplace: id_info.province,
                  age: id_info.age,
                }
                var new_values = ctx.utils.set({}, 'BasicInfo', baseInfo) // 新的表单值
                form.setFieldsValue(new_values);
              } else {
                ctx.mchcEnv.error('请输入符合规范的身份证号码！');
              }
            }
            form.setFieldsValue({})
          }


        },
        "inputType": "input",
        required: () => ctx.required,
        layout: layout,
      },
      {

        "key": "BasicInfo.dob",
        "label": "出生日期",

        "inputType": "single_date_picker",

        required: () => ctx.required,
        layout: layout,
      },
      {

        "key": "BasicInfo.age",
        "label": "年龄",

        "inputType": "input_number",
        required: () => ctx.required,
        layout: layout,
      },
      {

        "key": "BasicInfo.nationality",
        "label": "国籍",
        "inputType": "country_select",
        required: () => ctx.required,
        layout: layout,
      },
      {

        "key": "BasicInfo.nativeplace",
        "label": "籍贯",

        "inputType": "MS",
        required: () => ctx.required,
        "inputProps": { marshal: 0, uniqueKey: '省份s' },
        layout: layout,
      },
    ]
  },
  {
    label: '接口联动(通过接口计算预产期)',
    children: [

      {

        label: "末次月经",
        name: "pregnancy.lmp",
        inputType: "single_date_picker",
        inputProps: { placeholder: "请输入末次月经" },
        processLocal(v, f) {
          if (v && f) {

            ctx.request.get(`/api/pregnancyCalc-calcEddByLmp`, { params: { lmp: v } })
              .then(r => {
                const edd = r.data
                f.setFieldsValue({
                  sureEdd: edd,
                  pregnancy: {
                    edd,
                  }
                })
              })
          }
        },
        layout: '1/3'

      },
      {
        label: "预产期",
        name: "pregnancy.edd",
        inputType: "single_date_picker",
        inputProps: { disabled: true },
        layout: '1/3'
      },
      {
        label: "修订预产期",
        name: "sureEdd",
        inputType: "single_date_picker",
        inputProps: { disabled: true },
        layout: '1/3'
      },

    ]
  },
  {
    label: '其他联动',
    children: [
      { title: '隐藏显示联动(联合)', inputType: 'title' },
      {
        label: '吃饭了吗',
        layout: '1/2',
        inputProps: { size: 'small' },

        inputType: 'straw',
        children: [
          {
            name: 'show0',
            inputType: 'MC',
            inputProps: {
              vertical: true,
              options: [{ value: 0, label: '还没' }, { value: 1, label: '拉了' },],
              marshal: 0,
            },
          },
          {
            name: 'show0Note',
            inputType: 'MA',
            inputProps: {
              options: 'aa,bb',
              width: 90
            },
            layout: '1/1',

            showDeps: f => {
              var value = f.getFieldValue('show0')
              return value > 0
            }

          },
        ]
      },
      {
        label: '联动',
        layout: '1/2',


        inputType: 'straw',
        children: [
          {
            name: 'show0',
            inputType: 'MSW',
            inputProps: {
              checked_value: 1,
              unchecked_value: 0,
            },
          },
          {
            name: 'show0Note',
            inputType: 'MA',
            inputProps: { placeholder: '请输入备注', width: 120 },
            layout: '1/1',

            showDeps: {
              show0(v) { return v === 1 }
            }

          },
        ]
      },
      { title: '隐藏显示联动(普通)', inputType: 'title' },
      {
        name: 'show0',
        inputType: 'MC',
        label: '控制显示',
        layout: '1/2',
        inputProps: { options: '否,是', marshal: 0, },
      },
      {
        name: 'show0Note', inputType: 'MA', label: '输入', layout: '1/2',

        showDeps: {
          show0: [1]
        }

      },
      { title: '必填联动', inputType: 'title' },
      {
        name: 'required0',
        inputType: 'MC',
        label: '控制必填',
        layout: '1/2',
        inputProps: { options: '否,是', marshal: 0, },
      },
      {
        name: 'required0Note', inputType: 'MA', label: '输入', layout: '1/2',

        requiredDeps: {
          required0: [1]
        }

      },
      { title: '禁用联动', inputType: 'title' },
      {
        name: 'disabled0',
        inputType: 'MC',
        label: '控制必填',
        layout: '1/2',

        inputProps: {
          options: '否,是',
          marshal: 0,
          // width: 120,
        },
      },
      {
        name: 'disabled0Note',
        inputType: 'MA',
        label: '输入',

        layout: '1/2',
        disabledDeps: {
          disabled0: [1]
        }

      },
    ]
  },

  {
    label: '常用组件',
    children: [
      {
        containerType: 'tabs',
        label: '输入MA',
        children: [
          {
            name: 'ma0',
            label: '远程配置(接口)',
            inputType: 'MA',
            layout: layout,
            inputProps: {
              marshal: 0,
              fetch_options() {
                return ctx.request.get('/api/document-templates', { params: { page: 0, size: 20, 'moduleType.equals': 1 } }).then(r => {
                  return ctx.utils.expect_array(r.data).map((_: any) => ({ label: _.title, value: _.title }))
                })
              }
            }
          },
          {
            label: '动态选项',
            inputType: 'MA',
            name: 'ma0',
            layout: layout,
            inputProps: {
              memorieskey: '测试用'
            }
          },
          {
            label: '输入框',
            inputType: 'MA',
            name: 'ma0',
            layout: layout,
          },
          {
            label: '配置',
            layout: layout,
            name: 'ma0',
            inputType: 'MA',
            inputProps: {
              options: '我,和,你'
            }
          },
          {
            label: '字典',
            layout: layout,
            name: 'ma0',
            inputType: 'MA',
            inputProps: {
              uniqueKey: '民族s'
            }
          },

        ],

      },
      {
        containerType: 'tabs',
        label: '下拉MS',
        children: [
          {
            name: 'ms0',
            label: '远程配置2',
            inputType: 'MS',
            layout: layout,
            inputProps: {
              marshal: 0,
              fetch_options: {
                url: "/api/document-templates?moduleType.equals=1&page=0&size=9999",
                labelKey: "title",
                valueKey: "id",
              }
            }
          },

          {
            name: 'ms0',
            label: '配置',
            inputType: 'MS',
            layout: layout,
            inputProps: {
              marshal: 0,
              options: 'a,b,c,d,e,f,g,h,i'
            }
          },
          {
            label: '字典',
            name: 'ms0',
            inputType: 'MS',
            layout: layout,
            inputProps: {
              marshal: 0,
              uniqueKey: '职业'
            }
          },
          {
            label: '自定义',
            name: 'ms0',
            layout: layout,
            inputType: 'MS',
            inputProps: {
              marshal: 1,
              options: 'a,b,c,d,e,f,g,h,i,j,k'
            }
          },
          {
            label: '多选',
            name: 'ms0',
            layout: layout,
            inputType: 'MS',
            inputProps: {
              marshal: 0,
              type: 'multiple',
              options: [
                { label: '无', value: '000', exclusive: true, },
                { label: '选项1', value: 'aaa', },
                { label: '选项2', value: 'bbb', },
                { label: '选项3', value: 'ccc', },
              ]
            }
          },
          { title: 'frugal 对象存储, 只能单选, marshal只能1或2', inputType: 'title' },
          {
            label: 'frugal',
            name: 'ms0',
            layout: '1/1',
            inputType: 'MS',
            inputProps: {
              marshal: 1,
              frugal: true,
              options: [
                { label: '无', value: '000', exclusive: true, },
                { label: '选项1', value: 'aaa', },
                { label: '选项2', value: 'bbb', },
                { label: '选项3', value: 'ccc', },
              ]
            }
          },
          {
            label: '值',
            name: 'ms0',
            inputType: 'text_area',
            inputProps: {
            }
          },
        ],

      },
      {
        containerType: 'tabs',
        label: '勾选MC',
        children: [
          {
            label: '字典',
            name: 'mc0',
            inputType: 'MC',
            layout: '1/1',
            inputProps: {
              marshal: 0,
              uniqueKey: '性别4'
            }
          },
          {
            label: '配置',
            name: 'mc0',
            layout: '1/1',
            inputType: 'MC',
            inputProps: {
              marshal: 0,
              options: 'a,b,c,d,e,f,g,h,i,j'
            }
          },
          {
            label: '带组件',
            name: 'mc0',
            layout: '1/1',
            inputType: 'MC',
            inputProps: {
              options: [
                { label: '无', value: 0 },
                { label: '日期', value: 11, inputType: 'MyDatePicker', props: {} },
                { label: '带MA括号', parentheses: true, value: 22, inputType: 'MA', props: { options: 'a,b,c' } },
                { label: '带MS', value: 33, inputType: 'MS', props: { options: 'a,b,c', marshal: 0 } },
                { label: '带MC', value: 44, inputType: 'MC', props: { options: 'a,b,c', marshal: 0 } },

              ]
            }
          },
          {
            label: '多选',
            name: 'mc0',
            layout: '1/1',
            inputType: 'MC',
            inputProps: {
              type: 'multiple',
              options: [
                { label: '无', value: 55, exclusive: true },
                { label: '日期', value: 66, inputType: 'MyDatePicker', props: {} },
                { label: '带MA', value: 77, inputType: 'MA', props: { options: 'a,b,c' } },
                { label: '带MS', value: 88, inputType: 'MS', props: { options: 'a,b,c', marshal: 0 } },
                { label: '带MC', value: 99, inputType: 'MC', props: { options: 'a,b,c', marshal: 0 } },

              ]
            }
          },
          {
            label: '普通多选',
            name: 'mc1',
            layout: '1/1',
            inputType: 'MC',
            inputProps: {
              type: 'multiple',
              marshal: 0,
              options: [
                { label: '无', value: 11, exclusive: true },
                { label: '日期', value: 22, props: {} },
                { label: '带MA', value: 33, },
                { label: '带MS', value: 44, },
                { label: '带MC', value: 55, },

              ]
            }
          },
          { title: 'frugal 对象存储, 只能单选, marshal只能1或2', inputType: 'title' },

          {
            label: 'frugal',
            name: 'mc0',
            layout: '1/1',
            inputType: 'MC',
            inputProps: {
              marshal: 1,
              frugal: true,
              options: [
                { label: '无', value: '000', exclusive: true, },
                { label: '选项1', value: 'aaa', inputType: 'MC', props: { options: '1,2,3,4' } },
                { label: '选项2', value: 'bbb', },
                { label: '选项3', value: 'ccc', },
              ]
            }
          },
          {
            label: '值',
            name: 'mc0',
            inputType: 'text_area',
            inputProps: {
            }
          },
          {
            label: '多选值',
            name: 'mc1',
            inputType: 'text_area',
            inputProps: {
            }
          },
        ],

      },
      {
        label: '开关MSW',
        containerType: 'tabs',

        children: [
          {
            label: '形式1',
            name: 'switch0',
            inputType: 'MSW',
            layout: '1/3',
            inputProps: {
              checked_value: '选中值,默认true',
              unchecked_value: '反选中值,默认false',
            }
          },
          {
            label: '形式2',
            layout: '1/3',

            name: 'switch0',
            inputType: 'MSW',
            inputProps: {
              switch_type: 'checkbox',
              checked_value: '选中值,默认true',
              unchecked_value: '反选中值,默认false',
            }
          },
          {
            inputType: 'MA',
            name: 'switch0',
            layout: '1/3',

          }
        ]
      },
      {
        containerType: 'tabs',
        label: '列表',
        children: [
          {
            layout: '1/1',
            label: 'MyEditTable',
            name: 'lb0',
            inputType: 'MyEditTable',
            inputProps: {
              marshal: 0,
              showEdit: true,
              genRowData(arr) { return { aa: '99', bb: ctx.utils.formatDateTime() } },
              formDescriptions: [
                { label: 'aa', name: 'aa', inputType: 'MA', props: { options: '1,2' } },
                { label: 'bb', name: 'bb', inputType: 'MyDatePicker', inputProps: { showTime: true } }
              ]
            }
          },
          {
            layout: '1/1',
            label: 'MyEditTable',
            name: 'lb0',
            inputType: 'MyEditTable',
            inputProps: {
              marshal: 0,
              genRowData(arr) { return { aa: '99', bb: ctx.utils.formatDateTime() } },
              formDescriptions: [
                { label: 'aa', name: 'aa', inputType: 'MyPressure', props: { options: '1,2' } },
                { label: 'bb', name: 'bb', inputType: 'DateTimeInput', inputProps: { showSecond: false } }
              ]
            }
          },
          {
            layout: '1/1',
            name: 'lb0',
            label: 'ArrayPanel',
            inputType: 'ArrayPanel',
            inputProps: {
              marshal: 0,
              genRowData(arr) { return { aa: '22', } },
              formDescriptions: [
                { label: 'aa', name: 'aa', inputType: 'MA', props: { options: '1,2' }, layout: '1/2' },
                { label: 'bb', name: 'bb', inputType: 'MyDatePicker', layout: '1/2', inputProps: { showTime: true } }
              ]
            }
          },
          {
            layout: '1/1',
            name: 'lb0',
            label: '值',
            inputType: 'component',
            inputProps: {
              component: ({ value }: any) => {
                return JSON.stringify(value)
              }
            }
          },

          {
            layout: '1/1',
            name: 'lb1',
            label: 'ArraySingle',
            inputType: 'ArraySingle',
            inputProps: {
              marshal: 0,
              genRowData(arr) { return ctx.utils.formatDate() },
              inputType: 'MA',
            }
          },
          {
            layout: '1/1',
            name: 'lb1',
            label: '值',
            inputType: 'component',
            inputProps: {
              component: ({ value }: any) => {
                return JSON.stringify(value)
              }
            }
          },
        ]
      },

      {
        containerType: 'tabs',
        label: '地址',
        children: [
          {
            label: '地址1',
            name: 'dz0',
            inputType: 'MyAddress',
            layout: '1/1',
            inputProps: {
            }
          },
          {
            label: '时间',
            name: 'dz1',
            inputType: 'MyAddress',
            layout: '1/1',
            inputProps: {
              addressBtns: [
                { label: '同上', name: 'dz0' }
              ]
            }
          },

        ],

      },
      {
        containerType: 'tabs',
        label: '日期时间',
        children: [
          {
            label: '选择',
            children: [
              {
                label: '日期',
                name: 'rq0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                }
              },
              {
                label: '日期时间',
                name: 'sjrq0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  showTime: true
                }
              },
              {
                label: '日期时间带秒',
                name: 'sjrqm0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  showTime: true,
                  format: 'YYYY-MM-DD HH:mm:ss'
                }
              },
              {
                label: '时间',
                name: 'sj0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  time_only: true
                }
              },
              {
                label: '时间',
                name: 'sjz',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  time_only: true
                }
              },
              {
                label: '星期',
                name: 'xq0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  picker: 'week',
                  format: null
                }
              },
              {
                label: '月份',
                name: 'yf0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  picker: 'month',
                  format: null

                }
              },
              {
                label: '季度',
                name: 'jd0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  picker: 'quarter',
                  format: null

                }
              },
              {
                label: '年度',
                name: 'nd0',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  picker: 'year',
                  format: null

                }
              },

            ]
          },
          {
            label: '范围',
            children: [
              {
                label: '日期格式1',
                name: 'rqfw0',
                inputType: 'MyRangeDate',
                layout: '1/2',
              },

              {
                label: '日期值',
                name: 'rqfw0',
                inputType: 'text_area',
                layout: '1/1',
                inputProps: {
                }
              },
              {
                label: '日期格式2',
                name: 'rqfw1',
                inputType: 'MyRangeDate',
                layout: '1/2',
                inputProps: {
                  marshal: 0
                }
              },

              {
                label: '日期值',
                name: 'rqfw1',
                inputType: 'text_area',
                layout: '1/1',
                inputProps: {
                }
              },
              {
                label: '日期时间',
                name: 'rqfwt0',
                inputType: 'MyRangeDateTime',
                layout: '1/2',
              },

              {
                label: '日期值',
                name: 'rqfwt0',
                inputType: 'text_area',
                layout: '1/1',
                inputProps: {
                }
              },

            ]
          },
          {
            label: '手输', children: [
              {
                label: '日期时间',
                name: 'sj1',
                inputType: 'MyDatePicker',
                layout: '1/2',
                inputProps: {
                  showTime: true,
                  format: ctx.utils.formatDateTime.format
                }
              },
              {
                label: '日期时间秒',
                name: 'sj1',
                inputType: 'DateTimeInput',
                layout: '1/2',
                inputProps: {
                  showSecond: true
                }
              },
            ]
          },


        ],

      },
      {
        containerType: 'tabs',
        label: '模板',
        children: [
          {
            label: '主诉',
            name: 'chiefcomplaint',
            inputType: 'TemplateTextarea',
            layout: '1/2',
            inputProps: {
              defaultExpandAll: true,
              TemplateTextarea_type: [
                {
                  "title": "科室xx",
                  "type": 16,
                  "depid": 2
                },
                {
                  "title": "个人xx",
                  "type": 17
                },
                {
                  "title": "gg",
                  "type": 18
                },
              ]
            }
          },
          {
            "name": "inspection",
            "label": "检验检查",
            "inputType": "textareaWithResult",
            layout: '1/2',
            "inputProps": {
              "TemplateTextarea_type": [
                {
                  "title": "检验结果",
                  "url": "/api/getLabExamImportTree"
                },
                {
                  "title": "超声结果",
                  "url": "/api/getImageExamImportTree"
                }
              ],
              "gen_obj": function gen_obj() {
                return {
                  pregnancyId: ctx.utils.single_id() || 2
                };
              }
            },
          },

          {
            label: 'MultiTemplate',
            "inputType": "MultiTemplate",
            "inputProps": {
              url: '/api/multiTemplate',
              fds: [
                { inputType: 'text_area', name: 'chiefcomplaint', label: '主诉', layout: '1/1' },
                { inputType: 'text_area', name: 'inspection', label: '检验检查', layout: '1/1' },
              ],
              btn_text: '多模板导入',
              MultiTemplate_type: [
                {
                  label: '个人',
                  params: { 'type': '配置练习模板_个人' },
                  canOperate: true
                },
                {
                  label: '科室',
                  params: { 'type': '配置练习模板_科室' },
                  canOperate: false

                },
              ],
            },
            layout: '1/1'
          },
          {
            inputType: 'title',
            layout: '1/1',
            inputProps: { title: `MultiTemplate 配置编辑权限： canOperate: ctx.mchcEnv.user_data.groups.some(function (g) { return g.name.toLowerCase() === 'admin' }) ` }
          },
        ],

      },
      {
        containerType: 'tabs',
        label: '多个值',
        children: [
          {
            label: '单字段',
            layout: '1/1',
            name: 'ma0',
            inputType: 'ArrayInput',
            inputProps: {
              options: [{ inputType: 'MA', prefix: '这里有', suffix: '个人' }, { inputType: 'MyDatePicker', prefix: '日期是', },]
            }
          },

          {
            label: '血压',
            layout: '1/2',

            inputType: 'straw',
            children: [
              {
                name: 'systolic',
                // label: '收缩压',
                inputType: 'input_number',
                inputProps: {
                  width: 80,
                  placeholder: '请输入收缩压'
                },
              },
              {
                "inputType": "input",
                processRemote(v) { return '/' },
                "inputProps": {
                  disabled: true,
                  width: 12,
                  style: { paddingLeft: 2, paddingRight: 2 }
                }
              },
              {
                name: 'diastolic',
                // label: '舒张压',
                inputType: 'input_number',
                inputProps: {
                  width: 80,

                  placeholder: '请输入舒张压'
                },
                layout: '1/1',


              },
            ]
          },


        ],

      },
    ]
  },
  {
    label: '状态判断',
    children: [
      {
        label: '自身状态判断(输入 123 或者 456 变色)',
        inputType: 'input_number',
        name: 'color0',
        checkWarn(v, form) {
          if (v === 123) {
            return 'error'
          }
          if (v === 456) {
            return 'warning'
          }
          return ''
        },
      },
      {
        name: 'color1',

        label: '根据其他表单值变色',
        inputType: 'MA',
        error_deps: {
          color0(v) {
            return v === 123
          }
        },
        warning_deps: {
          color0(v) {
            return v === 456
          }
        },
      },
      {
        name: 'color2',

        label: '静态状态',
        inputType: 'MA',
        processRemote(v, form) {
          return v || '!!!'
        },
        inputProps: {
          status: 'error'
        }
      },
    ]
  },
  {
    title: '一键勾选',
    children: [

      {
        label: 'MSW',
        name: 'yj0',
        layout: "1/3",
        inputType: 'MSW'
      },
      {
        label: 'MC',
        name: 'yj1',
        inputType: 'MC',
        layout: "1/3",
        inputProps: { options: 'aa,bb,cc', marshal: 0 }
      },
      {
        "inputType": "check_invert_button",

        layout: "1/3",
      },
      {
        "inputType": "check_invert_button",
        label: '自定义',
        layout: "1/3",
        inputProps: {
          check_invert_values: {
            yj1: [2, 3],
            yj2: [2, 3],
          }
        }
      },
      {
        label: '嵌套',
        children: [
          {
            label: 'MS',
            name: 'yj2',
            inputType: 'MS',
            layout: "1/3",
            inputProps: { options: 'aa,bb,cc,dd', marshal: 0 }
          },
          {
            label: 'MA',
            name: 'yj3',
            inputType: 'MA',
            layout: "1/3",
            inputProps: { options: 'aa,bb,cc' }
          },
          {
            label: '不受选中',
            name: 'yj4',
            inputType: 'MS',
            layout: "1/3",
            disabled_check: true,
            inputProps: { options: 'aa,bb,cc', }
          },
        ]
      }
    ]
  },
  {
    title: '按钮',
    children: [
      {
        inputType: 'MyButton',
        layout: '1/2',
        inputProps: {
          btn_text: '设置数据',
          on_btn_click(e, form) {
            if (form) {

              form.setFieldsValue({ btn_input: 'aabbcc' })
            }
            return ctx.request.get('/api/pregnancies', { params: { 'name.equals': 'abc' } })
              .then(r => {
                console.log('data', r.data)
                ctx.mchcEnv.success('获取到数据')
              })
          },
        }
      },
      {
        title: '姓名',
        inputType: 'MA',
        name: 'btn_input',
        layout: '1/2',

      },
      {
        inputType: 'MyButton',
        layout: '1/2',
        inputProps: {
          btn_text: '打印',
          on_btn_click(e, form) {
            if (form) {
              var id = form.getFieldValue('btn_input') || 14
              ctx.print({
                url: '/api/pdf-preview', method: 'post', data: { resource: "prenatalRVisit", id: id }
              })
            }
          },
        }
      },
      {
        inputType: 'MyButton',
        layout: '1/2',
        inputProps: {
          btn_text: '弹窗添加孕册',
          on_btn_click(e, form) {
            if (form) {

              ctx.modal().
                open('modal_form', {
                  width: '40vw',
                  styles: { body: { height: '40vh', } },
                  modal_data: {

                    onSubmit(new_data: any, old_data: any) {
                      return ctx.request.post('/api/pregnancies', { name: form.getFieldValue('btn_input'), outpatientNO: new_data.outpatientNO, idType: new_data.idType }, { successText: '操作成功' })
                    },

                    formDescriptions: [
                      {
                        inputType: 'input',
                        label: '就诊卡号',
                        dataIndex: 'outpatientNO',
                      },
                      {
                        inputType: 'MC',
                        name: 'idType',
                        label: '证件类型',
                        required: true,
                        inputProps: {
                          marshal: 0,
                          width: 120,
                          uniqueKey: "证件类型"
                        },
                        layout: '1'
                      },

                    ]
                  }
                })
            }
          },
        }
      },
      {
        inputType: 'MyButton',
        layout: '1/2',
        inputProps: {
          btn_text: '跳转孕册列表页',
          on_btn_click(e, form) {
            ctx.safeTo('/prenatal-visit/pregnancy/list')
          },
        }
      },

    ]
  }
])