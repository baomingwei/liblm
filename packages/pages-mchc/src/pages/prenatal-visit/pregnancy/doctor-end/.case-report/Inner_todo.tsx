//  产科住院-入院登记-查看登记详情-护理文书
import React, { useRef } from 'react';

import { request } from '@lm_fe/utils';

import { TAppType } from '@/utils/appEnv';
import { CloseOutlined, DeleteOutlined, HolderOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Dropdown_L, MyIcon } from '@lm_fe/components';
import { IMchc_Admission_DocumentListItem, SLocal_SystemConfig } from '@lm_fe/service';
import { formatDate, isFunction } from '@lm_fe/utils';
import { Button, Empty, Menu, Space, Tag } from 'antd';
import { cloneDeep, get, includes, map, set } from 'lodash';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import store from 'store';
import { mchcUtils } from '@lm_fe/env';

interface IDoc {
  key: string;
  name: string;
  icon?: any;
  component: any;
  type: string;
  hide?: boolean | undefined;
  isCurrent?: boolean
}
const NurseTypesMapping: { [x: string]: IDoc } = {
  deliveryNursing: {
    key: 'deliveryNursing',
    name: '分娩记录',
    icon: <MyIcon value='PicLeftOutlined' />,

    component: () => <div>223</div>,
    type: '分娩',
  },
}
const { SubMenu } = Menu;
const DEFAULT_ACTIVE_TEMPLETE = 'firstNursing';
const OPEN_SIDERPANELS = 'OPEN_SIDERPANELS';
const typeArr = ['待产', '分娩', '产后']
type TItem = Partial<IMchc_Admission_DocumentListItem<TAppType>>
const MIN_KEY = 'MIN_KEY'

const NurseTypesMappingState = hideNurseTypesMapping().newNurseTypesMapping

export default function Nursing(props: any) {

  const { admissionData, reload, onRefreshData } = props as any;

  const preg_id = mchcUtils.single_id(props)



  const [siderPanels, set_siderPanels] = useState<TItem[]>([])
  const [open_siderPanels, set_open_siderPanels] = useState<IDoc[]>(store.get(OPEN_SIDERPANELS) ?? [])
  const [activeItem, set_activeItem] = useState<TItem>({})
  const [currentType, setCurrentType] = useState(typeArr[0])

  const el = useRef<PerfectScrollbar>(null)
  function safe_set_activeItem(params: TItem) {
    console.log('safe_set_activeItem', params)
    set_activeItem(params)

    if (params?.code) {
      const item = NurseTypesMapping[params.code]
      if (!item.type.includes(currentType)) {
        setCurrentType(item.type.split(',')[0])

      }
    }
  }

  useEffect(() => {

    preg_id && handleInit(true);

    return () => {

    }
  }, [preg_id])

  function safe_set_open_siderPanels(data: IDoc[]) {
    store.set(OPEN_SIDERPANELS, data)
    set_open_siderPanels(data)
  }







  async function handleInit(isInit = false) {

    const data: TItem[] = (await request.get(`/api/listNursingDocuments?id=${preg_id}&type=1`)).data;
    const oldUnsaved = siderPanels.filter(s => !s.id && !data.some(_ => _.code === s.code))
    let newSiderPanels = data.filter(_ => _.code).concat(...oldUnsaved);

    set_siderPanels(newSiderPanels)
    if (isInit) {
      const storeData: IDoc[] = store.get(OPEN_SIDERPANELS) ?? []
      const lastItem = storeData.find(_ => _.isCurrent)
      if (lastItem) {
        handleChooseTemplate(lastItem, newSiderPanels, storeData)
      }
    } else {
      const activeCode = activeItem.code
      const item = newSiderPanels.find(_ => _.code === activeCode)
      if (item) {
        set_activeItem(item)
      }
    }

  };

  async function handleDelete(item?: TItem) {
    if (!item) return

    const isOk = window.confirm(`确定要删除【${item.name}】吗?`)
    if (!isOk) return;

    if (!get(item, 'id')) {
      // 移除临时添加的护理文书
      let newSiderPanels = siderPanels.filter((panel, index) => {
        return panel.code !== item?.code
      });






      set_siderPanels([...newSiderPanels])

      return;
    } else {
      await request.get(`/api/deleteNursingDocument?id=${get(item, 'id')}`);


      await handleInit();
      onRefreshData && onRefreshData();
    }
    delOpenByKey(item.code)
    setActiveWhenDel(item.code)

  }
  function setActiveWhenDel(k?: string) {
    const isDelActive = k === activeItem.code
    const newActive = isDelActive ? {} : activeItem
    safe_set_activeItem(newActive)
  }
  function delOpenByKey(k?: string) {
    const new_open = open_siderPanels.filter(_ => _.key !== k)
    safe_set_open_siderPanels([...new_open])
  }
  function handleChooseTemplate(nurseType: IDoc, sideData = siderPanels, oepn = open_siderPanels) {

    const targetItem = sideData.find(_ => _.code === nurseType.key)
    if (targetItem) {
      safe_set_activeItem(targetItem)
    } else {

      const clickTempKey = get(nurseType, 'key');

      let newSiderPanels = cloneDeep(sideData);
      let newItem: IMchc_Admission_DocumentListItem<TAppType> = {
        code: clickTempKey,
        id: null!,
        type: 1,
        date: formatDate()!,
        name: nurseType.name,
        inEmrId: preg_id,
      };
      newSiderPanels.unshift(newItem);

      set_siderPanels(newSiderPanels)
      safe_set_activeItem(newItem)
    }
    const new_open = oepn.map(_ => ({ ..._, isCurrent: false }))
    const old = new_open.find(_ => _.key === nurseType.key)
    if (old) {
      old.isCurrent = true
      safe_set_open_siderPanels([...new_open])

    } else {
      nurseType.isCurrent = true
      safe_set_open_siderPanels([...new_open, nurseType])

      const _container: HTMLDivElement = el?.current?._container

      if (isFunction(_container?.scrollTo)) {
        _container.scrollTo(1920, 0)
      }
    }






  }
  function handleChangeActiveItemTempStroage(val: boolean) {
    let newItem = cloneDeep(activeItem);
    // newItem.isTempStroage = val;
    safe_set_activeItem(newItem)


  };




  function renderContent() {

    if (activeItem.code) {
      const Component = NurseTypesMappingState[activeItem.code]['component'];
      return (
        <Component
          {...props}
          handleChangeActiveItemTempStroage={handleChangeActiveItemTempStroage}
          activeItem={activeItem}
          onRefresh={() => handleInit()}
          admissionData={admissionData}
          reload={reload}
        />
      );
    } else {
      return <Empty description="请选择一个文书" />;
    }
  };

  function renderSavedList() {
    return <>
      {
        open_siderPanels.map((nurseType, key) => {
          const _nurseType = siderPanels.find(_ => _.code === nurseType.key) ?? {}
          const isCurrent = activeItem.code === nurseType.key
          const name = nurseType.name
          const len = nurseType.name?.length ?? 0

          return (
            <Tag

              style={{ cursor: 'pointer' }}
              key={key}
              onClick={() => {
                handleChooseTemplate(nurseType)
              }}
              closable
              color={_nurseType.id ? (isCurrent ? '#389e0d' : 'green') : (isCurrent ? '#d46b08' : 'orange')}
              onClose={(e) => {
                e.preventDefault();
                e.stopPropagation()
                setActiveWhenDel(nurseType.key)
                delOpenByKey(nurseType.key);


              }}>
              <span title={nurseType.name} >{(len <= 5) ? name : `${name?.slice(0, 5)}...`}</span>

            </Tag>

          );
        })
      }
      {
        open_siderPanels.length > (activeItem.code ? 1 : 0) ? <Tag
          style={{ cursor: 'pointer' }}
          icon={<CloseOutlined />}
          onClick={() => {
            const ok = confirm(`确定${closeText}吗？`)
            ok && safe_set_open_siderPanels(open_siderPanels.filter(nurseType => activeItem.code === nurseType.key))


          }}>{closeText}</Tag> : null
      }
    </>
  }
  const closeText = `关闭${activeItem.code ? '其他' : '全部'}`


  return (
    <div style={{ height: '100%' }}>

      <div style={{ position: 'relative', height: 40, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>


        <Space>
          {
            typeArr.map(type => {
              return <Dropdown_L
                overlay={<Menu>
                  {
                    map(NurseTypesMapping, (nurseType, key) => {
                      const nurseHide = SLocal_SystemConfig.get('nurseHide') ?? []
                      if (nurseHide.includes(nurseType.key) || nurseType.hide || !nurseType.type.includes(type)) {
                        return null
                      }
                      const targetItem = siderPanels.find(_ => _.code === nurseType.key)
                      return (
                        <Menu.Item
                          icon={nurseType.icon || <QuestionCircleOutlined />}
                          key={key}

                          onClick={() => {
                            handleChooseTemplate(nurseType)
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Tag
                              color={targetItem?.id ? ('green') : ('')}

                              title={nurseType.name} >{nurseType.name}</Tag>

                            {
                              targetItem?.id ? <Button
                                icon={<DeleteOutlined />}
                                onClick={e => {
                                  e.stopPropagation()
                                  handleDelete(targetItem)
                                }}
                                type='text'
                              // style={{
                              //   color: '#999',
                              //   cursor: 'pointer',
                              //   padding: 6,
                              //   // background: '#eee'
                              // }}
                              /> : <div style={{ width: 26 }}></div>
                            }


                          </div>
                        </Menu.Item>





                      );
                    })
                  }

                </Menu>} key={type}>
                <Button size='small' type='primary' icon={<HolderOutlined />}>
                  {type}
                </Button>

              </Dropdown_L>

            })
          }
        </Space>
        <div

          className='hide-scroll'
          style={{ overflowY: 'auto', maxWidth: 'calc(100% - 300px)', whiteSpace: 'nowrap', lineHeight: '32px', }}
        >
          {renderSavedList()}

        </div>


      </div>
      <div style={{ height: 'calc(100% - 40px)', overflowY: 'scroll' }}>
        {renderContent()}
      </div>

    </div >
  );
}


function hideNurseTypesMapping() {
  let activeTemplate = '';
  const newNurseTypesMapping = cloneDeep(NurseTypesMapping);
  map(newNurseTypesMapping, (item) => {
    const nurseHide = SLocal_SystemConfig.get('nurseHide') ?? []
    if (includes(nurseHide, item.key)) {
      set(item, 'hide', true);
    }
    if (!get(item, 'hide') && !activeTemplate) {
      activeTemplate = get(item, 'key');
    }
  });
  return { activeTemplate, newNurseTypesMapping };
}
