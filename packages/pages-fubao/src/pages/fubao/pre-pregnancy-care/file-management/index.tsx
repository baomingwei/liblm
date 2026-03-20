import { DeleteOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { BaseListOld, fubaoHistoryPush, OkButton, } from '@lm_fe/components_m';
import { BF_Wrap2, IdNOButton, mchcModal__, MyBaseList, useReadIdNO } from '@lm_fe/pages';
import { formatRangeDate, fubaoRequest as request } from '@lm_fe/utils';
import { Button, Divider, Form, message, Popconfirm } from 'antd';
import { get, isArray, isNil } from 'lodash';
import React, { useEffect } from 'react';
import Query from './components/Query';
import Table from './components/Table';
import { tableColumns } from './config/table';
import { ModelService } from '@lm_fe/service';


class List extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
    'deleteFlag.equals': 0,
  };
  static defaultProps = {
    baseUrl: '/api/progestation/check/getProgestationCheckArchives', request,
    baseTitle: '档案管理',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1298 },
    },
  };

  state = {
    total: 0,
    defaultQuery: this.staticDefaultQuery,
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    visible: false,
    editable: false,
    id: undefined,
    editKey: undefined,
    loading: false,
    isSearchColumnModal: false,
    printId: undefined,
    resource: '',
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '档案状态',
      dataIndex: 'fileStatus',
      width: 68,
      sortType: 'number',
      fixed: 'right',
      align: 'center',
      render: (fileStatus: any, rowData: any) => {
        if (fileStatus === 2) {
          return (
            <Button size="small" onClick={this.handleEdit(rowData)}>
              已审核
            </Button>
          );
        }
        //待审核 fileStatus===1
        return (
          <Button type="primary" size="small" onClick={this.handleEdit(rowData)}>
            待审核
          </Button>
        );
      },
    },
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 330,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon global-table-action-view" />}
              onClick={this.handleView(rowData)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<PrinterOutlined className="global-table-action-icon global-table-action-edit" />}
              onClick={this.handlePrint(rowData, 'progestationCheckPrint')}
            >
              打印<span style={{ color: '#6c6b6b' }}>(女方)</span>
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<PrinterOutlined className="global-table-action-icon global-table-action-edit" />}
              onClick={this.handlePrint(rowData, 'progestationCheckPrint')}
            >
              打印<span style={{ color: '#6c6b6b' }}>(男方)</span>
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除这个${get(this.props, 'baseTitle')}吗?`}
              onConfirm={this.handleDelete(rowData)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined className="global-table-action-icon global-table-action-delete" />}
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  async componentDidActivate() {
    this.handleSearch();
  }

  handleSearch = async () => {
    const { editKey, defaultQuery } = this.state;
    const { baseUrl } = this.props;
    if (!baseUrl) {
      return;
    }
    if (!isNil(editKey)) {
      message.error('请保存未保存的记录');
      return;
    }
    this.setState({ loading: true });
    let dataSource = [];
    let total = 0;
    const query = this.formatQuery(defaultQuery);
    const _res = await request.get(`${baseUrl}/page`, { params: query });
    const res = _res.data
    if (isArray(res.data.pageData)) {
      dataSource = res.data.pageData;
    }
    if (!isNaN(Number(res.data.totalElements))) {
      total = Number(res.data.totalElements);
    }
    this.setState({ dataSource, total, loading: false });
  };

  handleAdd = () => {
    const { history } = this.props as any;

    fubaoHistoryPush(`/pre-pregnancy-care/file-management/add`, this.props as any)

  };

  handleView = (rowData: any) => () => {
    const { id } = rowData;
    fubaoHistoryPush(`/pre-pregnancy-care/wife/wife-exam?id=${id}`, this.props as any)
  };

  handlePrint = (rowData: any, resource: string) => () => {
    const { id } = rowData;
    this.setState({ printId: id, resource });
    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestConfig: {
          url: "/api/progestationCheckPrint",
          data: {
            resource: resource,
            template: '',
            version: '',
            note: '',
            id: id,
          }
        }
      }
    })
    // mchcEnv.info('暂未开放此功能，敬请期待；');
  };

  handleEdit = (rowData: any) => () => {
    const { id } = rowData;
    const { history } = this.props as any;
    fubaoHistoryPush(`/pre-pregnancy-care/file-management/edit?id=${id}`, this.props as any);
  };

  handleDelete = (rowData: any) => async () => {
    const _res = await request.delete(`/api/progestation/check/deleteProgestationCheckArchives/${get(rowData, 'id')}`);
    const res = _res.data


    this.handleSearch();
  };

  renderSearchColumnModal = () => {
    const { printId, resource } = this.state;
    return null
  };
}

const s = new ModelService({
  n: 'ProgestationCheckArchives', prePath: '/progestation/check',
  //  apiPrefix: `/fb/api`,
  fuckPage: true
})
export default function FileManagementList(props: any) {

  const conf_fn = () => import('../../premarital-care/file-management/config/table').then(mod =>
    mod.default(true)
  )

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: `孕前检查-档案列表`,
      tableColumns: conf_fn,
      searchConfig: () => import('../../premarital-care/file-management/config/search')
    }
  })

  const [search_form] = Form.useForm()
  const { id_NO_msg } = useReadIdNO()
  useEffect(() => {

    if (id_NO_msg?.send_id === 'list')
      search_form.setFieldsValue({
        womanName: id_NO_msg.data.name
      })
  }, [id_NO_msg])

  const handlePrint = (rowData: any, resource: any) => () => {
    const { id } = rowData;

    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestData: {
          url: '/api/progestationCheckupsPrint',
          resource,
          id,
        }

      }
    })
    // mchcEnv.info('暂未开放此功能，敬请期待；');
  };

  function handleAdd() {
    fubaoHistoryPush(`/pre-pregnancy-care/file-management/add`, props)

  };




  return <Wrap>
    <MyBaseList tableColumns={__DEV__ ? conf_fn : config?.tableColumns}
      searchForm={search_form}
      renderBtns={() => <>
        <IdNOButton send_id='list' />
        <OkButton onClick={handleAdd}>新增</OkButton>
      </>}
      action_col={({ handleDelete }) => {
        return {
          title: '操作',
          showSorter: false,
          showFilter: false,
          fixed: 'right',
          width: 330,
          render: (value: any, rowData: any, index: number) => {
            return (
              <>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const { id } = rowData;

                    fubaoHistoryPush(`/pre-pregnancy-care/wife/wife-exam?id=${id}`, props)
                  }}
                >
                  查看
                </Button>
                <Divider type="vertical" />
                <Button
                  type="link"
                  size="small"
                  onClick={handlePrint(rowData, 'womanProgestationCheckupsPrint')}
                >
                  打印<span style={{ color: '#6c6b6b' }}>(女方)</span>
                </Button>
                <Divider type="vertical" />
                <Button
                  type="link"
                  size="small"
                  onClick={handlePrint(rowData, 'manProgestationCheckupsPrint')}
                >
                  打印<span style={{ color: '#6c6b6b' }}>(男方)</span>
                </Button>
                <Divider type="vertical" />
                <Button
                  onClick={() => handleDelete(rowData)}
                  type="link"
                  size="small"
                >
                  删除
                </Button>
              </>
            );
          },

        }
      }}
      customModelService={s}
      showRowDelBtn
      baseTitle='档案管理'
      showAdd={false}
      fuckPage

      beforeSearch={(v) => {
        const { filingDay, ...others } = v
        const rangeData = formatRangeDate({ filingDay })
        const res = {

          ...rangeData,
          ...others,
        }
        return res
      }}
      beforeSubmit={v => {
        const { configurationValue, configurationReplenishExplain, } = v
        let configurationState = v.configurationState
        if (configurationValue && configurationReplenishExplain) {
          configurationState = 1
        }
        if (!configurationValue && !configurationReplenishExplain) {
          configurationState = 0
        }
        v.configurationState = configurationState


        return v
      }}
      searchConfig={config?.searchConfig}

      searchParams={{ pageSize: 10 }}


    />
  </Wrap>
}



