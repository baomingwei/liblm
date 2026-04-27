import { formatTimeToStandard, HighRiskGradeSelect, MyIcon } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, SLocal_State } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Col, Input, Modal, Row, Space, Spin, Tabs } from 'antd';
import { cloneDeep, filter, find, findIndex, get, isString, map, set, size, throttle } from 'lodash';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { api } from '../../../.api';
import requestMethods_further from '../../../.further/methods/request';
import DoctorEnd_TemplateTree from '../../TemplateTree';
import DiagnosesItem from './../diagnoses-item/diagnoses-item';
import DiagnosesWeek from './../diagnoses-week/diagnoses-week';
import './index.less';
import { IDiagnosesTemplate } from './types';
function DiagnosesTemplateOld(props: IDiagnosesTemplate) {

  const {
    isShowDiagnosesTemplate,

    diagnosesList,
    headerInfo,
    saveHeaderInfo,
    setDiagnosesList,
    closeTemplate,
    add_diag,
  } = props;

  const userid = SLocal_State.getUserData()?.id

  const [allDiagnosesTemplate, set_allDiagnosesTemplate] = useState<any[]>([])
  const [filterDiagnosesTemplate, set_filterDiagnosesTemplate] = useState<any[]>([])
  const [noteChange, set_noteChange] = useState(false)
  const [searchValue, set_searchValue] = useState('')
  const [activeKey, set_activeKey] = useState('1')
  const page = useRef(0)
  const loading = useRef(false)
  const empty = useRef(false)
  const timer = useRef<any>(null)

  useEffect(() => {


    getDiagnosesTemplate('');
  }, [])

  const scrollHandler = throttle((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (loading.current || empty.current) return

    const target = e.nativeEvent.target as HTMLDivElement
    const clientHeight = target.clientHeight;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;

    if (clientHeight + scrollTop > scrollHeight * .8 || scrollTop < 10)
      getDiagnosesTemplatePage(searchValue, ++page.current)

  }, 100)
  useEffect(() => {


    set_filterDiagnosesTemplate(filterDiagnoses(allDiagnosesTemplate, diagnosesList))
  }, [diagnosesList])

  function filterDiagnoses(remoteData: any, diagnoses: IMchc_Doctor_Diagnoses[]) {
    const newTemplate = filter(remoteData, (item) => {
      const ind = findIndex(diagnoses, (i: any) => i.diagnosis == item.val);
      return ind == -1 ? true : false;
    });
    return newTemplate;
  }

  async function getDiagnosesTemplate(value: string) {
    const res = await api.components.getDiagnosesTemplate(value);

    set_filterDiagnosesTemplate(filterDiagnoses(res, diagnosesList))
    set_allDiagnosesTemplate(res)
  };
  async function getDiagnosesTemplatePage(value: string, page = 0) {
    loading.current = true
    try {
      const res: any = await api.components.getDiagnosesTemplate(value, page);
      if (!res?.length)
        empty.current = true


      set_filterDiagnosesTemplate([...filterDiagnosesTemplate, ...filterDiagnoses(res, diagnosesList)])
    } finally {
      loading.current = false
    }
  };

  function handleChangeTab(activeKey: string) {
    set_activeKey(activeKey)
  };
  async function handleChange(value: string) {
    page.current = 0
    empty.current = false
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      set_searchValue(value)
      if (activeKey == '1') {
        getDiagnosesTemplate(value);
      }
    }, 500);
  };
  function findMaxSort() {
    let max: any = 0;
    map(diagnosesList, (item) => {
      const sort = get(item, `sort`);
      if (sort > max) {
        max = sort;
      }
    });
    return max + 1;
  }

  function handleSearch(item: any) {
    let postdata: any = {
      diagnosis: '',
      diagnosisCode: '',
      highrisk: false,
      note: '',
      sort: findMaxSort(),
      outEmrId: get(headerInfo, `id`),
      // createDate: formatTimeToStandard(new Date()),
    };
    if (item) {
      if (!isString(item) && size(item.children) > 0) return;
      if (isString(item)) {
        set(postdata, `diagnosis`, item);
        let itemObj = find(filterDiagnosesTemplate, (tem: any) => tem.val == item);
        if (itemObj) {
          set(postdata, 'diagnosisCode', get(itemObj, 'code'));
        }
      } else {
        set(postdata, 'diagnosis', get(item, 'val'));
        set(postdata, 'diagnosisCode', get(item, 'code'));
      }
      add_diag(postdata);
    }
  };

  function handleCancel() {


    closeTemplate();
  };

  async function handleAddIcon(item: any, type: number) {

    delete item.id;
    set(item, 'pid', 0);
    set(item, 'type', type);
    if (type === 2) {
      set(item, 'depid', type);
    } else {
      set(item, 'userid', userid);
    }
    await api.components.addTemplateTree(item);
    mchcEnv.info(`${get(item, `val`)}同步到${type == 2 ? '科室' : '个人'}`);
  };

  //#region  右边诊断操作
  async function changeHeaderInfo() {

    const res = (await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(headerInfo, `id`))).data;
    saveHeaderInfo(res);
  }
  function getTitle(item: any) {
    const createdDate = item.createdDate ? `诊断时间: ${formatTimeToStandard(item.createdDate)}\n` : '';
    const diagnosis = item.diagnosis ? `诊断全称: ${item.diagnosis}\n` : '';
    const preNote = item.preNote ? `前备注: ${item.preNote}\n` : '';
    const note = item.note ? `后备注: ${item.note}\n` : '';
    const doctor = item.doctor ? `诊断医生: ${item.doctor}\n` : '';

    return `${createdDate}${diagnosis}${preNote}${note}${doctor}`;
  };

  async function handleDelete(item: any, i: number) {

    const newList = cloneDeep(diagnosesList);
    const delArr = newList.splice(i, 1);
    await requestMethods_further.deleteDiagnosis(get(delArr, `[0].id`));
    mchcEnv.info('删除成功！');
    setDiagnosesList(newList);
    changeHeaderInfo();
  };



  function changeNote(v: string, i: number, key: string) {


    const newList = cloneDeep(diagnosesList);
    const item = newList[i];
    item[`${key}`] = v;
    // item['createDate'] = formatTimeToStandard(new Date());
    setDiagnosesList(newList);
  };

  function updateNote(value: any, i: number, key: string) {

    const newList = cloneDeep(diagnosesList);
    const item = newList[i];
    item[`${key}`] = value;
    setDiagnosesList(newList);
    requestMethods_further.newadd_diagnosis(item);
  }

  //#endregion


  const style: CSSProperties = { fontSize: '24px', marginRight: '0px', display: 'flex', alignItems: 'center' };
  return (
    <Modal
      centered
      title={'诊断管理页'}
      className="diag-template"
      footer={null}
      visible={isShowDiagnosesTemplate}
      onCancel={handleCancel}
    >
      <Row>
        <Col span={14}>

          <Space.Compact >
            <Input.Search
              placeholder="请输入诊断信息"
              enterButton="添加诊断"
              defaultValue={''}
              onChange={(e) => handleChange(e.target.value)}
              onSearch={handleSearch}
            />
            {!mchcEnv.is('郫都') && <HighRiskGradeSelect headerInfo={headerInfo} />}
          </Space.Compact>
          <Tabs activeKey={activeKey} onChange={handleChangeTab}>
            <Tabs.TabPane
              tab={
                <Button className="list-btn">
                  全部
                </Button>
              }
              key="1"
            >
              <div onScroll={scrollHandler} style={{ height: '100%', overflowY: 'auto', }}>
                {map(filterDiagnosesTemplate, (item) => (
                  <p className="diag-item">
                    <span onClick={() => handleSearch(item)}>
                      {get(item, 'code') ? '（icd）' : null}
                      {get(item, 'val')}
                    </span>
                    <MyIcon
                      value='EnterOutlined'
                      className="diag-icon"
                      title="同步到科室诊断"
                      onClick={() => handleAddIcon(item, 2)}
                      type="icon-department"
                    />
                    <MyIcon
                      value='EnterOutlined'

                      className="diag-icon"
                      title="同步到个人诊断"
                      onClick={() => handleAddIcon(item, 3)}
                      type="icon-individual1"
                    />
                  </p>
                ))}
              </div>
            </Tabs.TabPane>
            (
            <Tabs.TabPane
              tab={
                <Button className="list-btn" >
                  科室
                </Button>
              }
              key="2"
            >
              {activeKey === '2' && (
                <DoctorEnd_TemplateTree
                  type={2}
                  depid={2}
                  checkable={false}
                  onSelected={handleSearch}
                  editable={true}
                  showIcd={true}
                  searchValue={searchValue}
                />
              )}
            </Tabs.TabPane>
            ) (
            <Tabs.TabPane
              tab={
                <Button className="list-btn" >
                  个人
                </Button>
              }
              key="3"
            >
              {activeKey === '3' && (
                <DoctorEnd_TemplateTree
                  type={3}
                  userid={userid}
                  checkable={false}
                  onSelected={handleSearch}
                  editable={true}
                  showIcd={true}
                  searchValue={searchValue}
                />
              )}
            </Tabs.TabPane>
            )
          </Tabs>
        </Col>
        <Col span={10}>
          <div className="diag-title">已选诊断</div>
          <div id="diag-content" className="diag-content">
            <DiagnosesWeek first={false} headerInfo={headerInfo} />
            {diagnosesList ? (
              diagnosesList.map((item: any, i: number) => (
                <DiagnosesItem
                  key={`${get(item, 'id')}-true`}
                  diagnose={item}
                  changeNote={changeNote}
                  updateNote={updateNote}
                  index={i}
                  handleDelete={handleDelete}
                  edit={true}
                  headerInfo={headerInfo}
                  saveHeaderInfo={props.saveHeaderInfo}
                  diagnosesList={diagnosesList}
                  setDiagnosesList={props.setDiagnosesList}
                  isShowDiagnosesTemplate={true}
                />
              ))
            ) : (
              <Spin />
            )}
          </div>
        </Col>
      </Row>
    </Modal >
  );
}
export default DiagnosesTemplateOld