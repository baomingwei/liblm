import { MyIcon, OkButton } from '@lm_fe/components_m';
import { SelectTip } from '@lm_fe/pages';
import { EventEmitter_Old, getSearchParamsValue, request, text_ellipsis } from '@lm_fe/utils';
import { Card, Col, Menu, message, Popconfirm, Row } from 'antd';
import { cloneDeep, find, findIndex, get, includes, isEmpty, map, set, } from 'lodash';
import React, { Component } from 'react';
import { ComponentPanl } from './ComponentPanl';
import { IIC, ITpl, ReporCardList, ReportCardEnum } from './constant_new';
import './index.less';
import { ICaseReport } from './types';
const { SubMenu } = Menu;



class CaseReport extends Component<ICaseReport, any> {
  state = {
    siderPanels: [] as IIC[], // 模板列表
    loading: true,
    template: null as ITpl | null,
    IC: null as IIC | null, // 当前选择的模板
    selectKey: '',

    datas: {},
    openKeys: [],
  };
  async componentDidMount() {
    this.newInitData();
    EventEmitter_Old.subscribe('updatasiderPanels', this.updatasiderPanels.bind(this));
  }


  async updatasiderPanels({ icId }: any) {
    const { id, caseType } = this.props;
    const pregnancyId = id || getSearchParamsValue('id');
    const res = await request.get('/api/ic/findPersonalPage', {
      params: { [caseType]: pregnancyId, page: 0, size: 100 },
    });
    this.setState({ siderPanels: res.data });
  }
  newInitData = async () => {
    const { id, caseType } = this.props;
    const pregnancyId = id || getSearchParamsValue('id');
    const res = await request.get('/api/ic/findPersonalPage', {
      params: { [caseType]: pregnancyId, page: 0, size: 100 },
    });
    this.setState({ siderPanels: res.data, loading: false });
  };

  handleDelete = (item) => async () => {
    await request.delete(`/api/ic/delete/${get(item, 'id')}`, { successText: '操作成功' });
    this.newInitData();
    this.setState({
      template: null,
    });
  };
  handleClickListItem = (item: IIC) => {
    const template = find(ReporCardList, (lItem) => lItem.code == item.code);

    this.setState({ template, IC: item });
  };

  selectHandleChange = async (value: string, option: ITpl) => {
    const { siderPanels } = this.state;

    const index = findIndex(siderPanels, (item) => item.code == value);
    if (index != -1) {
      message.error(`已存在${get(option, 'label')},不能再新增`);
      return;
    }
    const optionClone = cloneDeep(option);
    const list = [
      ReportCardEnum.hepatitispregnantbaby,
      ReportCardEnum.syphilisbabycard,
      ReportCardEnum.aidspregnantbabycard,
    ];
    if (includes(list, value)) {
      const label = get(optionClone, 'label') + `(B${1})`;
      set(optionClone, 'label', label);
    }


    this.setState({
      template: { ...optionClone, neonateOrder: 1, way: this.isAdmission() ? 2 : 1 },
      IC: null,
      selectKey: Math.random(),
    });
  };

  getpregnancyId() {
    const pregnancyId = this.props.id || getSearchParamsValue('id');
    return pregnancyId;
  }
  isAdmission() {
    return this.props.caseType == 'admissionId';
  }


  rendersiderPanels = () => {
    const { siderPanels, loading, IC } = this.state;
    if (isEmpty(siderPanels)) return null
    return (
      <Card
        loading={loading}
        size="small"
        style={{ marginTop: 12 }}
      // title="个案登记列表"
      // extra={<PlusCircleOutlined onClick={this.handleAdd} />}
      >
        {map(siderPanels, (item) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <OkButton
                title={item.name}

                type='text'
                primary={IC?.id === item.id}
                onClick={this.handleClickListItem.bind(this, item)}
                btn_text={text_ellipsis(item.name, 12)}
              />
              <Popconfirm
                title="确定要删除这个登记表么?"
                onConfirm={this.handleDelete(item)}
                okText="确定"
                cancelText="取消"
              >
                <MyIcon value='DeleteOutlined' />
              </Popconfirm>
            </div>
          );
        })}
      </Card>
    );
  };
  onOpenChange(keys: any) {
    this.setState({ openKeys: keys });
  }

  render() {
    const { selectKey, openKeys, datas, siderPanels } = this.state;
    return (
      <div style={{ overflow: 'hidden', height: '100%' }}>
        <Row gutter={8} style={{ height: "100%" }}>
          <Col span={4}>
            <Menu
              mode="inline"
              openKeys={openKeys}
              onOpenChange={this.onOpenChange.bind(this)}
              expandIcon={() => {
                if (openKeys.length != 0) {
                  return <span style={{ color: 'rgb(24,144,255)' }}>取消</span>;
                }
                return <MyIcon value='PlusCircleOutlined' />;
              }}
            >
              <SubMenu key="sub1" title="个案登记列表" style={{ paddingLeft: 0 }}>
                {map(ReporCardList, (nurseType, key) => {
                  const is_existed = siderPanels.some(s => s.code === nurseType.code)
                  return (
                    <OkButton
                      title={nurseType.name}
                      disabled={is_existed}
                      style={{ margin: 8, padding: 0, width: 'calc(100% - 16px)' }}
                      key={key}
                      onClick={this.selectHandleChange.bind(this, nurseType.code, nurseType)}
                      btn_text={text_ellipsis(nurseType.name, 12)}
                    />

                  );
                })}
              </SubMenu>
            </Menu>
            {this.rendersiderPanels()}
          </Col>
          <Col span={20} style={{ height: '100%', }}>
            {isEmpty(this.state.template) ? (
              <SelectTip />
            ) : (

              get(this.state, 'template') && (
                <ComponentPanl
                  datas={datas}
                  template={get(this.state, 'template')}
                  IC={this.state.IC}
                  pregnancyId={this.getpregnancyId()}
                  selectKey={selectKey}
                  cardType={this.props.caseType}
                  on_save={(data: IIC) => {
                    this.newInitData()
                    this.handleClickListItem(data);
                  }}
                />
              )
            )}
          </Col>

        </Row>
      </div>
    );
  }
}

// const Comp = connect(({ dictionaries, tabs }) => ({ dictionaries, tabs }))(CaseReport as any);

export default function CaseReport_Inner(props: any) {
  return <CaseReport {...props} />
}
