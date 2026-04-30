import { MyIcon } from '@lm_fe/components';
import { use_provoke } from '@lm_fe/provoke';
import { AnyObject } from '@lm_fe/utils';
import { Button, Radio } from 'antd';
import { cloneDeep, forEach, get } from 'lodash';
import React, { useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { draw_info, get_abnormal_color, get_canvas_el, get_fetus_color, get_line_color, get_text_color } from 'src/curve/utils';
import { bmiData1, bmiData2, bmiData3, bmiData4 } from '../../data';
import { judgeAreas, printCanvas, setHorRules, setVerRules } from '../../func';
import { curve_api } from '../api';
import './index.less';

interface IProps { hidePrintBtn?: boolean, isAllPregnancies?: boolean, onLoad?(): void, headerInfo?: any, id?: any }

const recordOptions = [
  { label: '全部', value: 0 },
  { label: '产检记录', value: 1 },
  { label: '居家记录', value: 2 },
];


export default function BmiCanvas(props: IProps) {
  const { sys_theme, config } = use_provoke('sys_theme', 'config')

  const { headerInfo, id, isAllPregnancies } = props;
  const line_color = get_line_color(sys_theme)
  const font_color = get_text_color(sys_theme)

  const pid: string = get(headerInfo, `id`) || id;



  const imageRef = useRef<any>();
  const bmi_Data = useRef(bmiData1);

  const bmiNum = useRef('')
  const bmiTz = useRef('')
  const bmiList = useRef([])
  const resdata = useRef<AnyObject>({})


  const default_type = config.医生端_BMI曲线类型 ?? 0
  useEffect(() => {

    getResData().then(() => {
      ste_data_and_draw(default_type);
    });

  }, [])

  async function getResData() {
    const pregnancyId = get(headerInfo, 'id') || id;
    const res0 = await curve_api.curve.getBmi(pregnancyId, 0);
    const res1 = await curve_api.curve.getBmi(pregnancyId, 1);
    const res2 = await curve_api.curve.getBmi(pregnancyId, 2);
    resdata.current = { 0: res0, 1: res1, 2: res2 }
  }

  async function ste_data_and_draw(type: number) {
    let res = get(resdata.current, `${type}`);
    if (get(res, 'preBmi') < 18.5) {
      bmi_Data.current = bmiData1

    } else if (get(res, 'preBmi') < 25) {
      bmi_Data.current = bmiData2

    } else if (get(res, 'preBmi') < 30) {
      bmi_Data.current = bmiData3

    } else if (get(res, 'preBmi') >= 30) {
      bmi_Data.current = bmiData4

    }
    bmiNum.current = get(res, 'preBmi')
    bmiTz.current = get(res, 'weight')
    bmiList.current = get(res, 'items')
    // console.log('bmiList', bmiList)
    drawBmiCanvas();
  };

  function handleRadioChange(e: any) {
    ste_data_and_draw(e.target.value);
  };

  //绘制曲线
  function drawScaleLine(
    canvas: any,
    ctx: any,
    oringin: [number, number],
    steps: [number, number],
    data: any,
    point: [boolean, string],
    color: string,
    shape: number[],
    lineWidth: number,
  ) {
    for (let i = 0; i < data.length; i++) {
      //绘制曲线
      ctx.beginPath();
      ctx.setLineDash(shape);
      ctx.lineWidth = lineWidth;
      if (i < data.length - 1) {
        ctx.moveTo(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y);
        ctx.lineTo(oringin[0] + steps[0] * data[i + 1].x, oringin[1] - steps[1] * data[i + 1].y);
      }
      ctx.strokeStyle = color;
      ctx.stroke();
      //绘制红点
      if (point[0]) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = point[1];
        ctx.fill();
      }
    }
  }

  //绘制x轴线
  function setVertical(
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) {
    context.strokeStyle = line_color;
    for (let i = 0; i < xCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(baseLeft, baseTop + xStep * i);
      context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
      context.textBaseline = 'middle';
      context.fillStyle = font_color;
      context.font = 'bold 12px consolas';
      context.fillText(i * 2 + -8, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('体重增长(kg)', baseLeft - 20, baseTop - 20);
  };

  //绘制y轴线
  function setHorizontal(
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) {
    for (let i = 0; i < yCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(yStep * i + baseLeft, baseTop);
      context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
      context.textAlign = 'center';
      context.fillStyle = font_color;
      context.font = 'bold 12px consolas';
      if (i % 2 == 0) {
        context.fillText(i, baseLeft + i * yStep, xStep * xCount + baseTop - 15);
      }
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
  };

  function drawBmiCanvas() {
    const { bmiBottomLine, bmiIntro, bmiLinesPoints, bmiTopLine } = bmi_Data.current
    let newBmiList = cloneDeep(bmiList.current);
    console.log('bmiTz', bmiTz)
    newBmiList.map((item: any) => {
      if (!item.weight || !item.week) {
        item.weight = 0;
        // item.week = -1;
        item.week = 0;
      } else {
        item.weight = item.weight - Number(bmiTz.current);
        if (item.week.indexOf('+') !== -1) {
          const arr = item.week.split('+');
          item.week = Number(arr[0]) + Number(arr[1]) / 7;
        }
        // item.week = item.week - 1;
      }
    });
    // console.log(newBmiList, 'bmi1');
    newBmiList = newBmiList.filter((i: any) => i.week >= 0 && i.week <= 39 && i.weight >= -8 && i.weight <= 24);
    // 统一曲线 x,y 表示
    newBmiList.length > 0 &&
      newBmiList.map((item: any) => {
        item.x = item.week;
        item.y = item.weight;
      });
    const unusualColor =
      newBmiList.length > 0 && judgeAreas(newBmiList[newBmiList.length - 1], bmiLinesPoints) ? get_fetus_color(sys_theme, 0) : get_abnormal_color(sys_theme);

    const canvas = get_canvas_el('bmi-canvas', sys_theme);
    const context = canvas.getContext('2d')!;
    canvas.width = 730;
    canvas.height = 710;

    const baseLeft = 60;
    const baseTop = 190;
    const xStep = 30;
    const yStep = 15;
    const xCount = 17;
    const yCount = 42;

    context.fillStyle = font_color;
    context.font = 'bold 16px normal';
    context.textAlign = 'center';
    context.fillText(`${draw_info(headerInfo,)}`, canvas.width / 2, baseTop - 120);

    context.fillText('BMI孕期体重管理曲线', canvas.width / 2, baseTop - 80);

    context.fillStyle = '#52aaff';
    context.font = 'normal 12px normal';
    context.fillText(`孕前BMI: ${bmiNum.current} kg/㎡`, canvas.width / 2, baseTop - 50);
    context.fillText(bmiIntro, canvas.width / 2, baseTop - 30);
    context.fillStyle = font_color;

    setVertical(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setHorizontal(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, line_color, 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, line_color, 1, xStep, 5);

    const endLineArr = [bmiBottomLine, bmiTopLine];
    forEach(endLineArr, (line) => {
      drawScaleLine(
        canvas,
        context,
        [baseLeft, baseTop + (xCount - 5) * xStep],
        [yStep, xStep / 2],
        line,
        [true, '#787878'],
        '#787878',
        [8],
        2,
      );
    });

    // console.log(newBmiList, 'bmi2');
    drawScaleLine(
      canvas,
      context,
      [baseLeft, baseTop + (xCount - 5) * xStep],
      [yStep, xStep / 2],
      newBmiList,
      [true, unusualColor],
      unusualColor,
      [],
      2,
    );
    imageRef.current = canvas?.toDataURL('image/jpg');
    props.onLoad && props.onLoad();
  }

  return (
    <div className="bmi-wrapper">
      <Radio.Group className="bmi-radio" options={recordOptions} defaultValue={default_type} onChange={handleRadioChange} />
      {!get(props, 'hidePrintBtn') && (
        <ReactToPrint
          trigger={() => (
            <Button type="primary" size="small" className="print-btn">
              <MyIcon value='PrinterOutlined' /> 打印
            </Button>
          )}
          content={() => printCanvas('bmi-canvas')}
        />
      )}

      <canvas id="bmi-canvas" className="bmi-canvas">
        您的浏览器不支持canvas，请更换浏览器.
      </canvas>
    </div>
  );
}
