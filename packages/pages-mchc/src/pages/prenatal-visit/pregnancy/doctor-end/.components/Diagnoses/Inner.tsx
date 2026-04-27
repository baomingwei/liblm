import { formatTimeToStandard, OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses } from '@lm_fe/service';
import { getSearchParamsAll, request } from '@lm_fe/utils';
import { Empty, message, Space } from 'antd';
import { cloneDeep, floor, forEach, get, includes, isString, size, split } from 'lodash';
import React, { useEffect, useState } from 'react';
import requestMethods from '../../.further/methods/request';
import DiagnosesItem from './diagnoses-item/diagnoses-item';
import DiagnosesWeek from './diagnoses-week/diagnoses-week';
import './index.less';
import DoctorEnd_DiagnosesTemplate from './template';
import { IDiagnosesprops } from './types';

function Diagnoses(props: IDiagnosesprops) {
  const [visible, setVisible] = useState(false)

  const [noteChange, setNoteChange] = useState(false)


  const {
    isAllPregnancies,
    diagnosesList = [],
    headerInfo,
    saveHeaderInfo,
    setDiagnosesList,
    page,
    serialNo,
  } = props;

  useEffect(() => {

    // SMchc_Doctor.getFirstVisitDiagnosisOutpatient(headerInfo?.id).then(l => setList(l.diagnoses))

    return () => {

    }
  }, [])


  const handleVisibleChange = (visible: boolean, i: number) => {
    const newList = cloneDeep(diagnosesList);
    const item = newList[i];
    item.visible = visible;
    setDiagnosesList(newList);
  };

  async function changeHeaderInfo() {
    const res = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(headerInfo, `id`));
    saveHeaderInfo(res.data);
  }

  const getTitle = (item: any) => {
    const createdDate = item.createdDate ? `诊断时间: ${formatTimeToStandard(item.createdDate)}\n` : '';
    const diagnosis = item.diagnosis ? `诊断全称: ${item.diagnosis}\n` : '';
    const preNote = item.preNote ? `前备注: ${item.preNote}\n` : '';
    const note = item.note ? `后备注: ${item.note}\n` : '';
    const doctor = item.doctor ? `诊断医生: ${item.doctor}\n` : '';

    return `${createdDate}${diagnosis}${preNote}${note}${doctor}`;
  };

  const handleDelete = async (item: any, i: number) => {
    const newList = cloneDeep(diagnosesList);
    const delArr = newList.splice(i, 1);
    await requestMethods.deleteDiagnosis(get(delArr, `[0].id`));
    mchcEnv.success('删除成功！');
    setDiagnosesList(newList);
    changeHeaderInfo();
  };

  function changeState(value: boolean) {
    setNoteChange(value)
  }

  const changeNote = (v: string, i: number, key: string) => {
    changeState(true);

    const newList = cloneDeep(diagnosesList);
    const item = newList[i];
    item[`${key}`] = v;
    setDiagnosesList(newList);
  };

  function updateNote(i) {
    if (!noteChange) {
      return false;
    }

    const postData = diagnosesList[i];
    requestMethods.newAddDiagnosis(postData);
    changeState(false);
  }

  const handleBtnClick = () => {
    setVisible(true);
  };


  const add_diag = async (diagnosisObj: any) => {
    if (serialNo) {
      diagnosisObj.serialNo = serialNo

    }
    const diag = get(diagnosisObj, 'diagnosis');
    if (diagnosesList.filter((item: any) => item.diagnosis === diag).length === 0) {
      /**判断是否打开VTE */
      // showScreening(cloneDeep(diagnosesList), diagnosisObj);
      const res = await requestMethods.newAddDiagnosis(diagnosisObj);
      mchcEnv.success('添加成功！');
      const newList = cloneDeep(diagnosesList);
      const data = res || diagnosisObj;
      setDiagnosesList([...newList, data]);
      changeHeaderInfo();
      if (diag.indexOf('梅毒') > -1) {
        mchcEvent.emit('outpatient', { type: '弹窗', modal_name: '梅毒管理', })
        // changeSyphilis(true);
      }
      // /**诊断对应的专案管理弹窗*/
      // if (diag === '瘢痕子宫' || diag === '疤痕子宫') {
      //   const currentGestationalWeek = parseInt(get(headerInfo, 'gesweek'));
      //   if (currentGestationalWeek >= 32) changeTolac(true);
      // }
      // const preeclampsiaArr = [
      //   // '双胎',
      //   // '多胎',
      //   '三胎妊娠',
      //   '四胎妊娠',
      //   '五胎妊娠',
      //   '六胎妊娠',
      //   '多胎妊娠',
      //   '胎妊娠',
      //   '慢性高血压',
      //   '1型糖尿病',
      //   '2型糖尿病',
      //   { hasWord: '尿毒症', withoutWord: '胎' },
      //   { hasWord: '肾炎', withoutWord: '胎' },
      //   { hasWord: '肾衰竭', withoutWord: '胎' },
      //   { hasWord: '肾病', withoutWord: '胎' },
      //   { hasWord: '肾积水', withoutWord: '胎' },
      //   { hasWord: '肾盂积水', withoutWord: '胎' },
      //   { hasWord: '肾小管', withoutWord: '胎' },
      //   { hasWord: '肾硬化', withoutWord: '胎' },
      //   '红斑狼疮',
      //   '抗磷脂综合征',
      //   'SLE',
      //   '高血压',
      //   '绒毛膜上皮性疾病',
      //   '异位妊娠史',
      //   '葡萄胎史',
      //   'PGDM',
      //   '肾脏',
      // ];
      // const noSameDay = (diagnosesList: any) => {
      //   let bool = true;
      //   for (let i = 0; i < size(diagnosesList); i++) {
      //     let item = get(diagnosesList, `[${i}]`);
      //     // const createdDate = get(item, 'createdDate');
      //     const diagnosis = get(item, 'diagnosis');
      //     const createdDate = hasKeyword(diagnosis, diag) && get(item, 'createdDate');
      //     if (hasKeyword(diagnosis, diag) && dayjs(new Date()).isSame(createdDate, 'day')) {
      //       bool = false;
      //       continue;
      //     }
      //   }
      //   return bool;
      // };
      // if (
      //   page === 'return' &&
      //   (hasKeyword(diag, preeclampsiaArr) || hasCode(diagnosisObj)) &&
      //   noSameDay(diagnosesList)
      // ) {
      //   console.log('子痫弹窗');
      //   changePreeclampsia(true);
      // }
    } else {
      message.warning('添加诊断重复！');
    }
  };
  /**添加诊断判断是否弹出VTE */
  function showScreening(diagnosesList: any, diagnosisObj: any) {

    const keyArr = [
      ['抗凝血酶缺乏症', '蛋白C缺陷', '蛋白S缺陷', '因子V莱顿', '凝血酶原基因突变', '红斑狼疮'],
      ['癌', '肿瘤', '心力衰竭', 'SLE', '炎性多关节病', 'IBD', '肾病综合征', '镰状细胞病'],
      ['静脉曲张'],
      ['截瘫'],
      ['双胎妊娠', '三胎妊娠', '四胎妊娠', '五胎妊娠'],
      ['栓', 'VTE', '梗', 'pe', 'dvt'],
      ['子痫前期'],
      ['剧吐', '脱水'],
      ['卵巢过度刺激综合征'],
    ];
    let count = 0;

    for (let i = 0; i < size(diagnosesList); i++) {
      let item = get(diagnosesList, `[${i}]`);
      const diag = get(item, 'diagnosis');
      for (let j = 0; j < size(keyArr); j++) {
        let childrenKey = get(keyArr, `[${j}]`) as unknown as string[];
        if (hasKeyword(diag, childrenKey)) {
          count++;
          if (count == 2) {
            break;
          }
        }
      }
      if (count == 2) {
        break;
      }
    }
    const diag = get(diagnosisObj, 'diagnosis');
    let bool = false;
    for (let j = 0; j < size(keyArr); j++) {
      let childrenKey = get(keyArr, `[${j}]`) as unknown as string[];
      if (hasKeyword(diag, childrenKey)) {
        count++;
        if (count >= 1) {
          bool = true;
          break;
        }
      }
    }
    if (diag.indexOf('1型糖尿病') !== -1 && diag.indexOf('肾') !== -1 && diag.indexOf('胎') == -1) {
      bool = true;
    }
    if (bool) {
      console.log('vte弹窗');
    }
  }

  const hasCode = (diagnosisObj: any) => {
    const arr = [
      'N00',
      'N01',
      'N02',
      'N03',
      'N04',
      'N05',
      'N06',
      'N07',
      'N08',
      'N09',
      'N010',
      'N11',
      'N12',
      'N14',
      'N15',
      'N16',
      'N17',
      'N18',
      'N19',
      'N25',
      'N26',
      'N27',
    ];
    const code = get(diagnosisObj, 'diagnosisCode');
    const codeArr = split(code, '.');
    let bool = includes(arr, get(codeArr, '[0]'));
    if (bool) return bool;
    if (get(codeArr, '[0]') == 'N28') {
      const item = get(codeArr, `[1]`) as unknown as string
      const codeNum = floor(Number(item));
      if (codeNum <= 820) return true;
    }
    return bool;
  };

  const hasKeyword = (val: string, arr: any[]) => {
    let bool = false;
    forEach(arr, (item) => {
      if (
        (isString(item) && val.indexOf(item) !== -1) ||
        (!isString(item) && val.indexOf(item.hasWord) !== -1 && val.indexOf(item.withoutWord) === -1)
      ) {
        bool = true;
      }
    });
    return bool;
  };

  const closeTemplate = () => {
    setVisible(false);
  };
  function 诊断管理按钮() {
    return !isAllPregnancies && (
      <div className="diag-btn" style={{ display: 'flex', justifyContent: 'flex-end', padding: 4 }}>
        <Space.Compact size='small' >
          <OkButton
            type='dashed'
            // className="diag-btn"
            // icon={<BookOutlined />} 
            onClick={() => mchcModal__.open('诊断历史', {
              modal_data: {
                pregnancyId: headerInfo?.id
              }
            })}>
            历史
          </OkButton>
          {
            (mchcEnv.in(['建瓯'])) ?
              <OkButton
                type='dashed'
                onClick={() =>
                  request
                    .get<IMchc_Doctor_Diagnoses[]>('/api/syncDiagnosis', { params: { ...getSearchParamsAll(), id: headerInfo?.id }, successText: '同步成功' })
                    .then((res => {
                      const arr = res.data ?? []
                      setDiagnosesList([...diagnosesList, ...arr])

                    }))
                }>
                同步
              </OkButton>
              : null
          }
          <OkButton
            type='dashed'
            // className="diag-btn"
            // icon={<SettingOutlined />} 
            onClick={handleBtnClick}>
            管理
          </OkButton>
        </Space.Compact>
      </div>
    )
  }
  const renderDiagnoses = () => {

    // 初诊孕周


    return (
      <div className="diagWrapper-new">
        {
          诊断管理按钮()
        }
        <DiagnosesWeek first={page !== 'return'} headerInfo={headerInfo} />
        {diagnosesList?.length
          ? diagnosesList.map((item: any, index: any) => {
            return (
              <DiagnosesItem
                edit={false}
                index={index}
                diagnose={item}
                key={`${get(item, 'id')}-false`}
                handleDelete={handleDelete}
                headerInfo={headerInfo}
                diagnosesList={diagnosesList}
                saveHeaderInfo={saveHeaderInfo}
                setDiagnosesList={setDiagnosesList}
                isShowDiagnosesTemplate={false}
              />
            )
          })
          : <Empty />
        }
      </div>
    );
  };

  return (
    <div>
      {renderDiagnoses()}
      {visible && (
        <DoctorEnd_DiagnosesTemplate
          isShowDiagnosesTemplate={visible}
          closeTemplate={closeTemplate}
          add_diag={add_diag}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          setDiagnosesList={setDiagnosesList}
          saveHeaderInfo={saveHeaderInfo}

        />
      )}
    </div>
  );
}
export default Diagnoses;
