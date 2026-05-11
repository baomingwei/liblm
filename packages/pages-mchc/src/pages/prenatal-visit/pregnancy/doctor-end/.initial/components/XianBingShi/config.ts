import { rt_ctx } from "@lm_fe/env";
import { conceive_mode_conf, mlUltrasounds_fd } from "@lm_fe/pages";
import { defineFormConfig } from '@lm_fe/service';
const ctx = rt_ctx
const React = ctx.React
export default defineFormConfig([
  {
    key: 'id',
    form_hidden: true,
  },
  {
    key: "pregnancyId",
    form_hidden: true
  },
  {
    key: "prenatalVisitId",
    form_hidden: true
  },
  {
    key: 'sureEddModify',
    inputType: 'MS',
    label: '修改过预产期-B超',
    form_hidden: true,
    inputProps: { options: '否,是', marshal: 0 },
  },
  {
    "key": "lmp",
    "label": "末次月经",
    "inputType": "date",
    layout: '1/6',
    form_hidden: () => ctx.props.less,
    processLocal(lmp, f) {
      if (lmp && f) {
        var values = f.getFieldsValue()
        var sureEddModify = values.sureEddModify
        var ntExams = ctx.utils.expect_array<{ checkdate: string, menopause: string }>(values.ntExams)
        var nfExams = ctx.utils.expect_array<{ checkdate: string, menopause: string }>(values.nfExams)
        var conceiveMode = ctx.utils.safe_json_parse_arr(values.conceiveMode__)[0]?.value
        const calc_edd = ctx.utils.cal_edd_by_lmp(lmp)

        values.edd = calc_edd
        if (conceiveMode !== 1 && !sureEddModify) {
          values.sureEdd = calc_edd
          ctx.utils.safeExec(ctx.props.fuck_sureEdd, calc_edd)
        }
        values.ntExams = ntExams.map(_ => {
          return ctx.utils.set(_, 'menopause', _.checkdate ? ctx.utils.menopauseWeek(_.checkdate, lmp) : '')
        })
        values.nfExams = nfExams.map(_ => {
          return ctx.utils.set(_, 'menopause', _.checkdate ? ctx.utils.menopauseWeek(_.checkdate, lmp) : '')
        })
        f.setFieldsValue(values)
      }
    }
  }, {
    "key": "edd",
    "label": "预产期-日期",
    form_hidden: () => ctx.props.less,
    "inputType": "date",
    layout: '1/6',

  }, {
    "key": "sureEdd",
    "label": "预产期-B超",
    form_hidden: () => ctx.props.less,
    "inputType": "date",
    processLocal(v, f) {
      if (!f) return
      f.setFieldValue('sureEddModify', 1)
      ctx.utils.safeExec(ctx.props.fuck_sureEdd, v)
    },
    required: true,
    layout: '1/6',

  },
  {
    "key": "fetalcount",
    "label": "胎数",
    form_hidden: () => ctx.props.less,
    "inputType": "select",
    "inputProps": { 'marshal': 0, 'options': '1,2,3,4,5,6' },

    layout: '1/6',

  },

  {

    "key": "sac",
    "label": "孕囊",

    "inputType": "input",


    "inputProps": { 'type': 'number', 'unit': '个' },
    layout: '1/6',


  },
  {


    "key": "yolksac",
    "label": "卵黄囊",

    "inputType": "input",


    "inputProps": { 'type': 'number', 'unit': '个' },
    layout: '1/6',


  },
  conceive_mode_conf({
    "key": "conceiveMode__",
    form_hidden: () => ctx.props.less,
    processLocal(v, f) {
      ctx.utils.safeExec(ctx.props.fuck_conceive, v)

    }
  }),
  {
    "key": "chiefcomplaint",
    "label": "主诉",
    form_hidden: () => ctx.props.less,

    "inputType": "textareaWithTemplate",
    isNewRow: 1,
    "inputProps": {
      rows: 2,
      "TemplateTextarea_type": [
        {
          "title": "科室",
          "type": 16,
          depid: 2
        },
        {
          "title": "个人",
          "type": 17
        }
      ]
    },
    layout: '1/2',

  }, {
    "key": "presentmhNote",
    "label": "现病史",
    form_hidden: () => ctx.props.less,

    "inputType": "textareaWithTemplate",
    "inputProps": {
      rows: 2,
      "TemplateTextarea_type": [
        {
          "title": "科室",
          "type": 8,
          depid: 2
        },
        {
          "title": "个人",
          "type": 9
        }
      ]
    },
    layout: '1/2',

  },
  { inputType: 'title', title: 'NT检查' },
  {
    "key": "ntExams",
    inputType: 'ArrayPanel',
    processRemote(v, f) { return ctx.utils.isEmpty(v) ? [{}] : v },

    inputProps: {
      on_row_value_change(arr, idx, changed, form) {
        if (!form) return
        var checkdate = ctx.utils.get<string>(changed, 'checkdate')
        var lmp = form.getFieldValue('lmp')
        if (lmp && checkdate) {
          arr[idx] = ctx.utils.set(arr[idx], 'menopause', ctx.utils.menopauseWeek(checkdate, lmp))
          form.setFieldValue('ntExams', arr)
        }

      },
      marshal: 0,
      targetLabelCol: 2,
      formDescriptions: [
        { label: '检查日期', name: 'checkdate', inputType: 'DatePicker', props: {}, layout: '1/6' },
        { label: '停经', name: 'menopause', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },
        { label: 'CRL', name: 'crl', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6' },
        {
          label: 'NT', name: 'nt', inputType: 'input_number', props: { suffix: 'mm' },
          layout: '1/6',
          tip: 'NT的正常范围值是0~3mm',
          checkWarn: function (v) { return v > 3; },

        },
        { label: '如孕', name: 'gestationalWeek', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },

      ]

    },
    layout: '1/1',

  },
  { inputType: 'title', title: 'NF检查' },

  {
    "key": "nfExams",
    inputType: 'ArrayPanel',
    processRemote(v, f) { return ctx.utils.isEmpty(v) ? [{}] : v },
    inputProps: {
      marshal: 0,
      targetLabelCol: 2,
      on_row_value_change(arr, idx, changed, form) {
        if (!form) return
        var checkdate = ctx.utils.get<string>(changed, 'checkdate')
        var lmp = form.getFieldValue('lmp')
        if (lmp && checkdate) {
          arr[idx] = ctx.utils.set(arr[idx], 'menopause', ctx.utils.menopauseWeek(checkdate, lmp))
          form.setFieldValue('nfExams', arr)
        }
      },
      formDescriptions: [
        { label: '检查日期', name: 'checkdate', inputType: 'DatePicker', props: {}, layout: '1/6' },
        { label: '停经', name: 'menopause', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },
        { label: 'BPD', name: 'bpd', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6' },
        {
          label: 'NF', name: 'nf', inputType: 'input_number', props: { suffix: 'mm' }, layout: '1/6',
          tip: 'NF的正常范围值是0~3mm',
          checkWarn: function (v) {
            return v > 3;
          },
        },
        { label: '如孕', name: 'gestationalWeek', inputType: 'MA', props: { suffix: '周' }, layout: '1/6' },

      ]
    },
  },
  mlUltrasounds_fd()
]);
