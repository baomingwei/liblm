
import { formatTimeToStandard, MyIcon } from '@lm_fe/components_m';
import { SMchc_Doctor } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Divider, Input, Popover } from 'antd';
import classnames from 'classnames';
import { cloneDeep, get, map, set, size } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import requestMethods_further from '../../../.further/methods/request';
import './index.less';
import { IDiagnosesItem_Props } from './types';
export default function DiagnosesItem({
  updateNote,
  do_del_diagnose_item,
  diagnose,
  index,
  edit,
  headerInfo,
  saveHeaderInfo,
  diagnosesList,
  setDiagnosesList,
  isShowDiagnosesTemplate,
}: IDiagnosesItem_Props) {
  const [note, setNote] = useState(get(diagnose, `note`));
  const [preNote, setPreNote] = useState(get(diagnose, `preNote`));
  const [visibleId, setVisibleId] = useState(null);
  useEffect(() => {
    setNote(get(diagnose, `note`));
    setPreNote(get(diagnose, `preNote`));
  }, [diagnose]);
  function inputChange3(e: any) {
    setNote(e.target.value);
  }
  function inputChange2(e: any) {
    setPreNote(e.target.value);
  }
  function itemDelete() {
    const confirm = window.confirm('确定要删除该诊断吗？');
    if (!confirm) {
      return;
    }
    do_del_diagnose_item?.(diagnose, index);
  }
  function inputBlur(key: string) {
    return () => {
      updateNote && updateNote(key == 'note' ? note : preNote, index, key);
    };
  }
  const getTitle = useMemo(() => {
    const createdDate = diagnose.createdDate ? `诊断时间: ${formatTimeToStandard(diagnose.createdDate)}\n` : '';
    const diagnosis = diagnose.diagnosis ? `诊断全称: ${diagnose.diagnosis}\n` : '';
    const preNote = diagnose.preNote ? `前备注: ${diagnose.preNote}\n` : '';
    const note = diagnose.note ? `后备注: ${diagnose.note}\n` : '';
    const doctor = diagnose.doctor ? `诊断医生: ${diagnose.doctor}\n` : '';
    return `${createdDate}${diagnosis}${preNote}${note}${doctor}`;
    // return (
    //   <div className="diag-title-tip">
    //     {diagnose.createdDate && <span>{createdDate}</span>}
    //     {diagnose.diagnosis && <span>{diagnosis}</span>}
    //     {diagnose.preNote && <span>{preNote}</span>}
    //     {diagnose.note && <span>{note}</span>}
    //     {diagnose.doctor && <span>{doctor}</span>}
    //     <span></span>
    //   </div>
    // );
  }, [diagnose]);
  async function changeHeaderInfo() {
    const res = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(headerInfo, `id`));
    saveHeaderInfo(res.data);
  }
  function handleVisibleChange(visible: boolean, i: number) {
    const newList = cloneDeep(diagnosesList);
    const item = newList[i];
    map(newList, (it, ind) => {
      if (get(it, `visible`)) {
        set(it, `visible`, false);
      }
    });
    item.visible = visible;
    setDiagnosesList(newList);
  }
  const popoverContent = (item: any, i: number) => {

    const handleHighrisk = async () => {
      const newList = cloneDeep(diagnosesList);
      set(newList, `[${i}].highrisk`, newList[i].highrisk ? false : true);
      const postData = newList[i];
      await SMchc_Doctor.new_Diagnosis(postData);
      setDiagnosesList(newList);
      changeHeaderInfo();
    };

    const handleSortChange = async (n: number) => {
      const newList = cloneDeep(diagnosesList);
      item.visible = false;
      newList[i] = newList[i + n];
      newList[i + n] = item;
      // 对诊断进行排序，sort赋值
      newList.forEach((subItem: any, subIndex: number) => {
        subItem.sort = subIndex + 1;
      });
      // await api.updatePregnancy({ id: pregnancyId, diagnoses: newList });
      await requestMethods_further.sortDiagnoses(newList);
      setDiagnosesList(newList);
    };

    return (
      <div>
        <p>
          <span className="diagHandle" onClick={() => handleHighrisk()}>
            {item.highrisk === true ? '取消高危诊断' : '标记高危诊断'}
          </span>
        </p>
        {i ? (
          <p>
            <span className="diagHandle" onClick={() => handleSortChange(-1)}>
              上 移
            </span>
          </p>
        ) : null}
        {i + 1 < size(diagnosesList) ? (
          <p>
            <span className="diagHandle" onClick={() => handleSortChange(1)}>
              下 移
            </span>
          </p>
        ) : null}
      </div>
    );
  };
  function getPopupContainer() {
    return document.getElementById(`diag-content`);
  }
  const del_btn = <Button style={{}} shape='circle' onClick={() => itemDelete()} >
    <MyIcon className='item-icon' value='DeleteOutlined' />
    <span className="item-number">{index + 2}</span>

  </Button>
  return (
    // <Tooltip title={getTitle}>
    <div
      id={edit ? `edit${index}` : `noedit${index}`}
      className={classnames('diagnoses-container', { noedit: !edit })}
      title={getTitle}
    >
      {edit && (
        <div className="diagnoses-item">
          {del_btn}
          <div className="diagnoses-item-content">




            <div className="border"></div>
            <div className="input-conetnt">
              <Input
                placeholder="请输入前备注"
                onChange={inputChange2}
                onBlur={inputBlur('preNote')}
                className="my-input pre-input"
                value={preNote}
              ></Input>
            </div>
            <Popover
              className="diag-popover2"
              trigger="click"
              content={popoverContent(diagnose, index)} //
              // visible={!!diagnose.visible && edit}
              visible={get(diagnose, `id`) == visibleId}
              onVisibleChange={(visible) =>
                setTimeout(() => {
                  // handleVisibleChange(visible, index);
                  if (visible) {
                    setVisibleId(get(diagnose, `id`));
                  } else {
                    setVisibleId(null);
                  }
                }, 200)
              }
            // getPopupContainer={getPopupContainer}
            >
              <div className={classnames('diagnoses-val margin', { highrisk: get(diagnose, `highrisk`) })}>
                {get(diagnose, `diagnosis`)}
              </div>
            </Popover>

            <div className="input-conetnt">
              <Input
                placeholder="请输入后备注"
                onChange={inputChange3}
                onBlur={inputBlur('note')}
                className="my-input"
                value={note}
              ></Input>
            </div>
            <Divider size='small' />
          </div>
        </div>
      )}
      {!edit && (
        <div className="diagnoses-item" >
          {del_btn}
          <div className="diagnoses-item-content">
            {/* <span className="item-number">{index + 2}</span> */}
            {/* <div className="border"></div> */}

            <Popover
              className="diag-popover2"
              trigger="click"
              content={popoverContent(diagnose, index)}
              open={!isShowDiagnosesTemplate && !!diagnose.visible}
              onOpenChange={(visible) =>
                setTimeout(() => {
                  handleVisibleChange(visible, index);
                }, 200)
              }
            // getPopupContainer={getPopupContainer}
            >
              <div className={classnames('prenote-val-content', { highrisk: get(diagnose, `highrisk`) })}>
                {preNote && <div className="prenote">{preNote}</div>}
                <div className={classnames('diagnoses-val', { highrisk: get(diagnose, `highrisk`) })}>
                  {get(diagnose, `diagnosis`)}
                </div>
              </div>
            </Popover>

            {note && <div className="note-content">{note}</div>}
          </div>
        </div>
      )}


    </div>
    // </Tooltip>
  );
}
