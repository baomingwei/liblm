import { IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit } from "@lm_fe/service";
import { ColumnsType } from "antd/lib/table";
import { rt_ctx } from "@lm_fe/env";
const ctx = rt_ctx
const React = ctx.React
const c = React.createElement
type TfetusExam = IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit['fetusExam']

function get_table_columns_default(): ColumnsType<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit> {
  return [
    {
      "title": "主诉",
      "dataIndex": "physicalExam.chiefComplaint",
      isNewRow: 1
    },
    {
      "title": "现病史",
      "dataIndex": "physicalExam.phi",
      isNewRow: 1
    },
    {
      title: "血压",
      dataIndex: 'physicalExam',
      isNewRow: 1,
      render: function (data) {
        if (!data) return '';
        var firstPart = data.systolic && data.diastolic ? '首:' + data.systolic + '/' + data.diastolic + 'mmhg; ' : '';
        var secondPart = data.systolic2 && data.diastolic2 ? '二:' + data.systolic2 + '/' + data.diastolic2 + 'mmhg; ' : '';
        var thirdPart = data.systolic3 && data.diastolic3 ? '三:' + data.systolic3 + '/' + data.diastolic3 + 'mmhg; ' : '';
        if (firstPart || secondPart || thirdPart) {
          return firstPart + secondPart + thirdPart;
        }
        return '';
      }
    },
    {
      "title": "脉搏",
      "dataIndex": "physicalExam.pulse",
      render: function (data) {
        if (!data) return '';
        return data + ' bpm'
      }
    },
    {
      "title": "体重",
      "dataIndex": "physicalExam.weight",
      render: function (data, rowData) {
        if (!data) return '';
        var weightGain = rowData?.physicalExam?.weightGain || '';
        return data + ' kg' + '(增长' + weightGain + 'kg)'
      }
    },
    {
      "title": "宫高",
      "dataIndex": "physicalExam.fundalHeight",
    },
    {
      "title": "腹围",
      "dataIndex": "physicalExam.waistHip",
    },
    {
      "title": "衔接",
      "dataIndex": "physicalExam.engagement",
    },
    {
      "title": "浮肿",
      "dataIndex": "physicalExam.edema",
    },
    {
      "title": "胎心率",
      "dataIndex": "fetuses",
      "render": function (value) {
        return (value || []).map(function (fetus) { return fetus.fetalHeartRate; }).join('/');
      },
      isNewRow: 1
    },
    {
      "title": "胎动",
      "dataIndex": "fetuses",
      "render": function (value) {
        return (value || []).map(function (fetus) { return fetus.fetalMovement; }).join('/');
      }
    },
    {
      "title": "胎方位",
      "dataIndex": "fetuses",
      "render": function (value) {
        return (value || []).map(function (fetus) { return fetus.fetalPosition; }).join('/');
      }
    },
    {
      "title": "先露",
      "dataIndex": "fetuses",
      "render": function (value) {
        return (value || []).map(function (fetus) { return fetus.presentation; }).join('/');
      }
    },
    {
      "title": "检验检查",
      "dataIndex": "physicalExam.inspection",
      isNewRow: 1
    },
    {
      "title": "处理措施",
      "dataIndex": "physicalExam.prescription",
      isNewRow: 1
    },
    {
      "title": "下次产检时间",
      "dataIndex": "appointmentDate",
    },
  ]
}
export default function get_table_columns() {
  const arr = get_table_columns_default()
  return arr.filter((_: any) => !_.hidden) as ColumnsType<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>
}

