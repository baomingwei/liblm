import { Button, Form, Modal, Space, message } from 'antd';
import {
  cloneDeep,
  forEach,
  get,
  map,
  pick,
  set
} from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { MyForm, MyIcon, getBMI, getFormData, getGesWeek } from '@lm_fe/components_m';
import { mchcEnv, mchcUtils } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { SMchc_Doctor } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import classNames from 'classnames';
import { api } from '../.api';
import { filter_diagnoses } from '../.utils';
import { IDoctorEnd_InitialProps } from './DoctorEnd_Initial';
import JYJC from './components/JianYanJianCha';
import QTBS from './components/QiTaBingshi';
import TGJC from './components/TiGeJianCha';
import YBBS from './components/YiBanBingShi';
import XBS from './components/XianBingShi';
import YCS from './components/YunChanShi';
import ZDCL from './components/ZhenDuanChuLi';
import ZKJC from './components/ZhuanKeJianCha';
import { getRequiredForm, physicalKeys } from './func';
import { datatoApiKey, formTabKey } from './methods/config';
const single_id = mchcUtils.single_id
interface IndexState {
  tabs: any;
  step: string;
  visitData: any;
  analysisResult: any;
  isPost: boolean;
  formHandler: {
    [key: string]: any;
  };
  printModalVisible: boolean;
  updateGesweekModalVisible: boolean;
  updateGesweekTips: {};
  zdFormConfig: any;
  syncData: any;
  stepsEnabled: boolean;
  introStep: any[];
  [key: string]: any;
}
const tabContents = [XBS, YBBS, QTBS, YCS, TGJC, ZKJC, JYJC, ZDCL];
const allTabs = tabContents.map((tab, i) => ({
  key: `tab-${i}`,
  title: tab.Title,
  config: tab.Config,
  className: tab.ClassName,
  Content: tab,
  requestFrom: false,
  error: false
}));
function DoctorEnd_Initial_Vertical(props: IDoctorEnd_InitialProps) {

  const {
    id,
    headerInfo,
    formChange,
    updateHeaderInfo,
    setDiagnosesList,
    saveHeaderInfo,

    changePreeclampsia,
    changeSyphilis,
    diagnosesList,

  } = props;


  const $verticalFormHandler = useRef({})
  const [visitData, set_visitData] = useState({})
  const [analysisResult, set_analysisResult] = useState({})
  const [formHandler, set_formHandler] = useState({
    subscribe(a: string, b: string, c: (v: any) => void) { },
    listenFormData(v: () => any) { },
    submit() {
      return { validCode: null, res: null }
    },
    fieldChange: false

  })
  const [updateGesweekTips, set_updateGesweekTips] = useState({ sureEdd: '' })
  const [zdFormConfig, set_zdFormConfig] = useState([])
  const [syncData, set_syncData] = useState({})
  const [verticalFormHandler, set_verticalFormHandler] = useState({})
  const [newFormData, set_newFormData] = useState({})


  const [step, set_step] = useState(allTabs[0].key)
  const [tabs, set_tabs] = useState(allTabs)
  const [isPost, set_isPost] = useState(false)
  const [updateGesweekModalVisible, set_updateGesweekModalVisible] = useState(false)
  const [vertical, set_vertical] = useState(true)
  const [sureEddModify, set_sureEddModify] = useState(0)
  const [sureUpdateEdd, set_sureUpdateEdd] = useState<string>()
  const forms = useRef(Array(10).fill(0).map(_ => Form.useForm()[0]))

  const [printModalVisible, set_printModalVisible] = useState(false)
  const [allFormData, set_allFormData] = useState({})
  const [resource, set_resource] = useState('')
  const [printId, set_printId] = useState('')






  useEffect(() => {

    (async () => {

      const formConfig = await api.initial.getFormConfig(false);
      const cloneTabs = cloneDeep(tabs);
      cloneTabs[0].config = formConfig.formPresent.fields;
      cloneTabs[1].config = formConfig.formPast.fields;
      cloneTabs[2].config = formConfig.formOther.fields;
      cloneTabs[3].config = formConfig.formPregnancyHistory.fields;
      cloneTabs[4].config = formConfig.formPhysical.fields;
      cloneTabs[5].config = formConfig.formSpecial.fields;
      cloneTabs[6].config = formConfig.formSurvey.fields;
      getRequiredForm('tab-0', cloneTabs[0].config);
      getRequiredForm('tab-1', cloneTabs[1].config);
      getRequiredForm('tab-2', cloneTabs[2].config);
      getRequiredForm('tab-4', cloneTabs[4].config);
      getRequiredForm('tab-5', cloneTabs[5].config);
      getRequiredForm('tab-6', cloneTabs[6].config);
      getRequiredForm('tab-7', formConfig.formDiagnoses.fields);

      set_tabs(cloneTabs)
      set_zdFormConfig(formConfig.formDiagnoses.fields)
      verticalInitData();
      /**cjl---- */
    })()
    return () => {

    }
  }, [])
  useEffect(() => {

    const formHandler = $verticalFormHandler.current[step];

    const pregnancyId = id || getSearchParamsValue('id');

    if (formHandler && formHandler.listenFormData) {
      formHandler.listenFormData(() => handleFormChange(true));
    }
    const formhandler1 = $verticalFormHandler.current['tab-0'],
      formHandler4 = $verticalFormHandler.current['tab-4'],
      formHandler6 = $verticalFormHandler.current['tab-6'];
    if (formhandler1.subscribe) {
      formhandler1.subscribe('lmp', 'change', async (val: any) => {
        if (!val) return;
        const edd = await api.initial.calcEddByLmp(val);
        formhandler1.edd.actions.setValue(edd);
        formhandler1.sureEdd.actions.setValue(edd);

        const ntUltrasounds = cloneDeep(formhandler1.ntExams.actions.getValue().value);
        const nfUltrasounds = cloneDeep(formhandler1.nfExams.actions.getValue().value);
        forEach(ntUltrasounds, (item) => {
          if (item.checkdate) {
            item.menopause = getGesWeek(edd, item.checkdate);
          } else {
            item.menopause = '';
          }
        });
        forEach(nfUltrasounds, (item) => {
          if (item.checkdate) {
            item.menopause = getGesWeek(edd, item.checkdate);
          } else {
            item.menopause = '';
          }
        });
        formhandler1.ntExams.actions.setValue(ntUltrasounds);
        formhandler1.nfExams.actions.setValue(nfUltrasounds);

        const data = await api.initial.updateGesweekAlert(pregnancyId, edd);
        if (get(data, 'remind')) {

          set_updateGesweekTips({ ...data, sureEdd: edd })
          set_updateGesweekModalVisible(true)
        }
      });

      formhandler1.subscribe('sureEdd', 'change', async (val: any) => {
        if (!val) return;
        const data = await api.initial.updateGesweekAlert(pregnancyId, val);
        if (get(data, 'remind')) {

          set_updateGesweekTips({ ...data, sureEdd: val })
          set_updateGesweekModalVisible(true)
        }
      });

      formhandler1.subscribe('ntExams', 'change', (val: any) => {
        const newVal = cloneDeep(val);
        const sureEdd = formhandler1.sureEdd.actions.getValue().value || formhandler1.edd.actions.getValue().value;
        forEach(newVal, (item) => {
          if (item.checkdate && sureEdd) {
            item.menopause = getGesWeek(sureEdd, item.checkdate);
          } else {
            item.menopause = '';
          }
        });
        formhandler1.ntExams.actions.setValue(newVal);
      });

      formhandler1.subscribe('nfExams', 'change', (val: any) => {
        const newVal = cloneDeep(val);
        const sureEdd = formhandler1.sureEdd.actions.getValue().value || formhandler1.edd.actions.getValue().value;
        forEach(newVal, (item) => {
          if (item.checkdate && sureEdd) {
            item.menopause = getGesWeek(sureEdd, item.checkdate);
          } else {
            item.menopause = '';
          }
        });
        formhandler1.nfExams.actions.setValue(newVal);
      });
    }
    if (formHandler4 && formHandler4.subscribe) {
      formHandler4.subscribe('physicalBaseExam.preheight', 'change', (val: any) => {
        const preweight = formHandler4['physicalBaseExam.preweight'].actions.getValue().value;
        formHandler4['physicalBaseExam.bmi'].actions.setValue(getBMI(preweight, val));
      });

      formHandler4.subscribe('physicalBaseExam.preweight', 'change', (val: any) => {
        const preheight = formHandler4['physicalBaseExam.preheight'].actions.getValue().value;
        formHandler4['physicalBaseExam.bmi'].actions.setValue(getBMI(val, preheight));
      });
      formHandler4.subscribe('normalBtn', 'click', (val: any) => {
        if (val === '全部正常') {
          forEach(physicalKeys, (item) => {
            formHandler4[`physicalgeneralExam.${item}(Note)`].actions.setValue({ [item]: 1, [`${item}Note`]: '' });
          });
        } else {
          forEach(physicalKeys, (item) => {
            formHandler4[`physicalgeneralExam.${item}(Note)`].actions.setValue({ [item]: null, [`${item}Note`]: '' });
          });
        }
      });
    }
    if (formHandler6 && formHandler6.subscribe) {
      formHandler6.subscribe('syncBtn', 'click', async (val: any) => {
        const syncData = await api.further.syncPatientReport(pregnancyId!);
        await verticalInitData();
        mchcEnv.info('同步数据成功！');
        formHandler6['syncDate'].actions.setValue(get(syncData, 'syncDate'));
      });
    }
  }, [])

  /**纵向一览风格初始数据 */
  async function verticalInitData() {

    const pregnancyId = single_id();
    let res = await SMchc_Doctor.getFirstVisitInfoOfOutpatient(pregnancyId);

    const d = res.diagnosisAndAdvice.diagnoses

    const _diagnoses = filter_diagnoses(d)

    setDiagnosesList(_diagnoses);
    const obj = pick(res.pastmh, [
      'allergyDrug',
      'allergyDrugNote',
      'allergyFood',
      'allergyFoodNote',
      'allergyOther',
      'allergyOtherNote',
    ]);
    set(res, `pastmh.allergyHistory`, obj);

    set_allFormData(res)
  }


  function handleFormChange(bool: boolean) {
    formChange(bool);
  };

  /**判断是否同步孕妇数据 */
  function judgeRequest(data: any) {
    const weight = get(data, `physicalExam.weight`);
    const systolic = get(data, `physicalExam.systolic`);
    const diastolic = get(data, `physicalExam.diastolic`);
    if (weight || systolic || diastolic) {
      return false;
    } else {
      return true;
    }
  }

  function verticlaHandleSubmit() {
    let bool = false,
      formData = {},
      promise: any = [];
    map($verticalFormHandler, async (formHandler, key) => {
      promise.push(formHandler.submit());
    });
    Promise.all(promise).then((data) => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        console.log(item);
        if (!get(item, `validCode`)) {
          bool = true;
          break;
        }
        formData = { ...formData, [datatoApiKey[i]]: getFormData(get(item, `res`)) };
      }
      if (bool) {
        message.destroy();
        message.error('请完善表单项！');
        return;
      }
      let pastmh = cloneDeep(formData.pastmh);
      pastmh = {
        ...pastmh,
        ...pastmh.allergyHistory,
      };
      delete pastmh['allergyHistory'];
      handleSave({
        id: get(allFormData, `id`),
        ...formData,
        pregnancymh: get(formData, `pregnancymh.pregnancymh`, []),
        pastmh: pastmh,
      });
    });
  }

  async function handleSave(resData: any) {
    // console.log(resData);
    SMchc_Doctor.updateFirstVisitInfoOfOutpatient(resData).then((data) => {
      const pastmh = data.pastmh;
      set(
        data.pastmh,
        `allergyHistory`,
        pick(pastmh, [
          'allergyDrug',
          'allergyDrugNote',
          'allergyFood',
          'allergyFoodNote',
          'allergyOther',
          'allergyOtherNote',
        ]),
      );
      mchcEnv.success('信息保存成功');
      const id = single_id();
      updateHeaderInfo(id);
      set_allFormData(data)
      handleFormChange(false);
    });
  };

  function getTabData(step: string): any {
    if (step == 'tab-3') {
      return { pregnancymh: get(allFormData, `${formTabKey[step]}`) } || [];
    }
    let res = get(allFormData, `${formTabKey[step]}`, {});

    return res;
  };

  function handlePrint(resource: 'prenatalVisit' | 'prenatalVisit1') {
    let id = '';
    if (resource == 'prenatalVisit') {
      id = headerInfo?.id;
    } else {
      id = get(allFormData, `diagnosisAndAdvice.advice.id`)!;
      if (!id) {
        message.warning('请先保存');
      }
    }
    if (id) {



      mchcModal__.open('print_modal', {
        modal_data: {
          requestData: {
            url: '/api/pdf-preview',
            resource: resource || 'prenatalVisit',
            template: '',
            version: '',
            note: '',
            id,
          }
        }
      })
    }

  }



  async function handleUpdateGesweek() {
    const pregnancyId = id || getSearchParamsValue('id');
    await api.initial.updateGesweekBysureEdd({ pregnancyId, sureEdd: get(updateGesweekTips, 'sureEdd') });
    set_updateGesweekModalVisible(false)
  };

  function renderUpdateGesweekTips() {
    return (
      <Modal
        visible={updateGesweekModalVisible}
        onOk={handleUpdateGesweek}
        onCancel={() => set_updateGesweekModalVisible(false)}
      >
        <p>
          <MyIcon value='ExclamationCircleOutlined' />
          <span> 请注意：</span>
        </p>
        <p>{get(updateGesweekTips, 'remind')}</p>
      </Modal>
    );
  };
  function setverticalFormHandler(key, formHandler) {
    $verticalFormHandler.current = {
      ...$verticalFormHandler,
      [key]: formHandler,
    };
    // console.log({ verticalFormHandler: $verticalFormHandler });
  }
  function verticalRender() {
    return tabs.map(({ key, title, error, config, Content, className }: any) => {
      return (
        <div className={classNames(`${className} border`)}>
          <span className="border-form_section_title" key={'title' + key}>
            {title}
          </span>
          {key !== 'tab-7' ? (
            <MyForm
              config={config}
              activeKey={key}
              value={getTabData(key)}
              value2={getTabData(key)}
              getFormHandler={setverticalFormHandler.bind(this, key)}
              submitChange={false}
              key={key}
            />
          ) : (
            <ZDCL



              visitData={getTabData(key)}
              handleSave={handleSave}
              zdFormConfig={zdFormConfig}
              noShowBtn={true}
              getFormHandler={setverticalFormHandler.bind(this, key)}




              changePreeclampsia={changePreeclampsia}
              changeSyphilis={changeSyphilis}
              diagnosesList={diagnosesList}
              headerInfo={headerInfo}
              setDiagnosesList={setDiagnosesList}
              saveHeaderInfo={saveHeaderInfo}






            />
          )}
        </div>
      );
    });
  }

  return (
    <div className="prenatal-visit-main_initial">
      {verticalRender()}
      <Space className="prenatal-visit-main_initial-btns">
        <Button size="large" onClick={() => handlePrint('prenatalVisit')} icon={<MyIcon value='PrinterOutlined' />}>
          打印档案
        </Button>
        <Button size="large" onClick={() => handlePrint('prenatalVisit1')} icon={<MyIcon value='PrinterOutlined' />}>
          打印病历
        </Button>
        <Button size="large" type="primary" onClick={verticlaHandleSubmit.bind(this)}>
          <MyIcon value='SaveOutlined' /> 保存
        </Button>
      </Space>
      {renderUpdateGesweekTips()}
    </div>
  );
}
export default DoctorEnd_Initial_Vertical
