import { mchcEnv } from "@lm_fe/env";
import { IMchc_Doctor_OutpatientHeaderInfo } from "@lm_fe/service";
import { keys, mapKeys } from "lodash";
import { useState } from "react";

type InfectionType = '艾' | '梅' | '乙' | '传染病';
type VType<T> = { [x in InfectionType]: T }
interface IRet {
  label: string;
  type: InfectionType;
  allType: InfectionType[];
  color: string;
  key: number;
}
const infectionNameMap: VType<string> = {
  艾: 'HIV',
  梅: '梅毒',
  乙: '乙肝',
  传染病: '传染病',
};
const infectionKeywordMap: VType<string[]> = {
  艾: ['HIV', 'hiv', '艾滋'],
  梅: ['梅毒'],
  乙: ['乙肝', 'HBsAg阳性', '乙型肝炎', '乙型病毒性肝炎', '小三阳', '大三阳'],
  传染病: ['结核病', '重症感染性肺炎', '特殊病毒感染', '丙型病毒性肝炎', '传染病', '病毒性肝炎'],
};
const infectionExcludeKeywordMap: VType<string[]> = {
  艾: [],
  梅: ['史'],
  乙: [],
  传染病: [],
};
const infectionColorMap: VType<string> = {
  艾: '#C736FF',
  梅: '#8D36FF',
  乙: '#6236FF',
  传染病: '#9340BA',
};
const sorting: VType<number> = {
  艾: 1,
  梅: 2,
  乙: 3,
  传染病: -1,
};

function getTheFuckingLabel(str: string, isMulti = false): IRet | null {
  const keys = Object.keys(infectionKeywordMap) as InfectionType[];
  const type = keys.reduce<InfectionType | null>((res, key) => {
    if (res) return res;
    const value = infectionKeywordMap[key];
    const exlucdeValue = infectionExcludeKeywordMap[key];
    const isTarget = value.some((v) => str.includes(v) && !exlucdeValue.includes(v));

    return isTarget ? key : null;
  }, null);

  if (!type) return null;
  const label = isMulti ? type : infectionNameMap[type];
  const color = infectionColorMap[type];
  let key = sorting[type];
  return { label, type, color, key, allType: [] };
}
export function handleFuckinginfectionNoteLabel(infectionNote?: string) {
  if (!infectionNote) return [];
  const arr = infectionNote.split(',').filter((_) => _ && !['无', '未查'].includes(_));
  const len = arr.length;
  let result = arr.map((str) => getTheFuckingLabel(str, len > 1)!).filter((_) => _);
  let hash: Partial<VType<boolean>> = {};

  result = result.reduce((item, next) => {
    if (!hash[next.type]) {
      hash[next.type] = true;
      item.push(next)
    }
    return item;
  }, [] as IRet[]);
  result = result.map(_ => ({ ..._, allType: keys(hash) as InfectionType[] }))
  const 传染病item = result.find((item) => item.type === '传染病');
  if (传染病item) {
    result = [传染病item];

  } else {

    result.sort((a, b) => a.key - b.key);
  }

  return result;
}
function hasKeyword(arr: string[], val?: string,) {
  if (!val) return false
  return arr.some(_ => _?.includes(val) || val?.includes(_))
};



export function use专案(infectionNoteLabels: IRet[], headerInfo?: IMchc_Doctor_OutpatientHeaderInfo, is_show_all?: boolean,) {
  const multipletsArr = ['三胎妊娠', '四胎妊娠', '五胎妊娠', '六胎妊娠', '多胎妊娠'];
  const twinsArr = ['双胎妊娠'];

  const isShowTwins = hasKeyword(twinsArr, headerInfo?.pregnancyCaseLable)
  const isShowMultiplets = hasKeyword(multipletsArr, headerInfo?.pregnancyCaseLable,)

  const is_show_梅毒 = infectionNoteLabels.some((_) => _.type === '梅')
  const is_show_乙肝 = infectionNoteLabels.some((_) => _.type === '乙')

  return {
    isShowGdm: is_show_all,
    isShowBmi: is_show_all,
    isShowSlowGrowing: is_show_all,
    isShowTwins: is_show_all && isShowTwins,
    isShowMultiplets: is_show_all && isShowMultiplets,
    is_show_梅毒: is_show_all && is_show_梅毒,
    is_show_乙肝: is_show_all && is_show_乙肝,
  }

}