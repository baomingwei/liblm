import { MyIcon, validate_form } from '@lm_fe/components';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { formatDate, isMoment, request, Request } from '@lm_fe/utils';
import { Button, Divider, Form, message, Popconfirm } from 'antd';
import { FormInstance } from 'antd/lib/form';
import classnames from 'classnames';
import { get, isArray, isFunction, isNil, map } from 'lodash';
import React, { FC, lazy } from 'react';
import BaseFormComponent from '../BaseFormComponent';
import BaseTable from '../BaseTableOld';
import { getDefaultRequiredRules } from '../utils/defaultMethod';
import './index.less';
import { getDataSource } from './methods';
const BaseFormComponentDisplayFC = lazy(() => import('../BaseFormComponent/DisplayFC'))
export interface IProps {
  request?: Request,
  // 接口 URL
  baseUrl: string;
  // 唯一 key，通常取 id
  rowKey: string;
  // 左上角标题
  baseTitle: string;
  // 列表配置
  tableColumns?: any[];
  // Table 组件
  Table?: any;
  // 是否需要分页
  needPagination?: boolean;
  // 需要 多选
  needChecked?: boolean;
  // selectionType
  selectionType?: 'checkbox' | 'radio';
  // 表格是否可编辑
  needEditInTable?: boolean;
  // 展示添加按钮
  showAdd?: boolean;
  // add文本
  addText?: string;
  // 是否展示编辑列
  showAction?: boolean;
  // 当 BaseList 作为子组件的时候，可能需要使用，参考 nursing-record
  asChildComponentQueryLabel?: string;
  // 展示搜索功能，如果为 true，则必须传 Query 组件
  showQuery?: boolean;
  // 传入的 ID
  id?: string | number;
  // 从接口获取数据，过滤函数
  processFromApi?: (data: object[]) => object[];
  // 提交data时，处理过滤符合api接口的数据格式
  toApi?: (data: object) => object;
  // 其它表格属性
  otherTableProps?: any;
  // 弹窗表单
  ModalForm?: any;
  // 搜索组件
  Query?: any;
  // 页脚表单区域
  ExtraFooter?: any;
  // 新增、编辑、详情信息显示模式-->modal/drawer/inline
  editMode?: 'modal' | 'drawer' | 'inline';
  className?: any;
  ExtraButton?: FC<{ rowData: any }>

}
export interface IState {
  total: number;
  dataSource: any[];
  defaultQuery?: {
    page?: number;
    size?: number;
    sort?: string;
    [propName: string]: any;
  };
  visible: boolean;
  editable: boolean;
  loading: boolean;
  id: any;
  editKey: any;
  selectedRowKeys: any[];
  selectedRows?: any[];
  tableProps?: any;
  [propName: string]: any;
}
export const DEFAULT_HEADER_HEIGHT = 37;
export const SHOW_SERIAL = true;
export default class BaseListOld extends React.Component<IProps, IState> {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
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
  };
  _request!: Request
  ordinal = {
    title: 'No.',
    width: 40,
    align: 'center',
    className: 'ant-table-ordinal',
    render: (text, record, index) => `${index + 1}`,
    fixed: 'left',
  };
  handleDoubleClickRow = (record: any) => () => {
    this.handleEdit(record)();
  };
  /* istanbul ignore next */
  actionCol = {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 132,
    align: 'center',
    showSorter: false,
    showFilter: false,
    render: (value: any, rowData: any, index: number) => {
      const { needEditInTable, ExtraButton } = this.props;
      const editable = this.isEditing(rowData);
      console.log({ needEditInTable, editable });
      if (needEditInTable && editable) {
        return (
          <>
            <Button size="small" className="table-action-btn" onClick={this.handleItemSave(rowData)}>
              保存
            </Button>
            <Button size="small" className="table-action-btn" onClick={this.handleItemCancel(rowData)}>
              取消
            </Button>
          </>
        );
      }

      return (
        <>
          {
            ExtraButton ? <ExtraButton rowData={rowData} /> : null
          }
          <Button type="link" size="small" onClick={this.handleEdit(rowData)}>
            <MyIcon value='EditOutlined' className="global-table-action-icon global-table-action-view" />
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定要删除这个${get(this.props, 'baseTitle')}吗?`}
            onConfirm={this.handleDelete(rowData)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small">
              <MyIcon value='DeleteOutlined' className="global-table-action-icon" />
              删除
            </Button>
          </Popconfirm>
        </>
      );
    },
  };

  columns = !this.props.showAction ? [...this.props.tableColumns] : [...this.props.tableColumns, this.actionCol];

  form: FormInstance | null = null;

  componentDidMount() {
    const { showQuery } = this.props;
    this._request = this.props.request ?? request
    // mchcEnv.warning('BaseListOld 已废弃，请使用联系管理员升级');
    if (!showQuery) {
      console.log({ query: this.state.defaultQuery, staticDefaultQuery: this.staticDefaultQuery });
      this.handleSearch();
    }
  }

  isEditing = (rowData: any) => (get(rowData, 'editKey') || get(rowData, 'id')) === this.state.editKey;

  handleDelete = (rowData: any) => async () => {
    const { baseUrl, baseTitle } = this.props;
    await this._request.delete(`${baseUrl}/${get(rowData, 'id')}`);
    message.success(`删除${baseTitle}成功`);
    this.handleSearch();
  };

  handleItemSave = (rowData: any) => async () => {
    const { baseUrl, baseTitle, toApi, needEditInTable, showAdd } = this.props;
    const { id } = this.state;
    const form = this.form as FormInstance;
    const formData = await validate_form(form)

    if (!formData) return
    map(formData, (data, key) => {
      if (isMoment(data)) {
        formData[key] = formatDate(data);
      }
    });
    let method = 'put';
    let title = `编辑${baseTitle}成功`;
    if (!id && showAdd && needEditInTable) {
      method = 'post';
      title = `新增${baseTitle}成功`;
    }
    await this._request[method](
      baseUrl,
      isFunction(toApi)
        ? toApi({
          ...rowData,
          ...formData,
        })
        : {
          ...rowData,
          ...formData,
        },
    );
    form.resetFields();
    await this.setState({
      id: undefined,
      editKey: undefined,
    });
    message.success(title);
    await this.handleSearch();
  };

  handleItemCancel = (rowData: any) => () => {
    const { dataSource, editKey } = this.state;
    const form = this.form as FormInstance;
    form.resetFields();
    this.setState({
      id: undefined,
      editKey: undefined,
      dataSource: typeof editKey === 'string' ? dataSource.slice(1, dataSource.length) : dataSource,
    });
  };

  handleEdit = (record: any) => () => {
    const { needEditInTable, tableColumns } = this.props;
    if (needEditInTable) {
      const form = this.form as FormInstance;
      // TODO: 通过 tableColumns 判断字段是否为时间格式，如果是，需要转换为 dayjs()。(是否可以优化？)
      // map(rowData, (item, dataIndex) => {
      //   const inputType = get(keyBy(tableColumns, 'dataIndex'), `${dataIndex}.inputType`);
      //   if (['single_date_picker', 'single_time_picker'].indexOf(inputType) > -1) {
      //     set(rowData, dataIndex, dayjs()Date(item));
      //   }
      // });
      // map(tableColumns, (item) => {
      //   const inputType = get(item, 'inputType');
      //   if (['single_date_picker', 'single_time_picker'].indexOf(inputType) > -1) {
      //     const dataIndex = isArray(get(item, 'dataIndex'))
      //       ? join(get(item, 'dataIndex'), '.')
      //       : get(item, 'dataIndex');
      //     set(record, dataIndex, getMomentObj(get(record, dataIndex)));
      //   }
      // });

      form.setFieldsValue(record);
      this.setState({
        id: record.id,
        editKey: record.editKey || record.id,
      });
    } else {
      if (this.props.ModalForm) {
        this.setState({
          visible: true,
          editable: true,
          id: record.id,
        });
      } else {
        this._openModal(record)

      }
    }
  };
  _openModal = (rowData: any = {}) => {
    const id = rowData?.id
    const that = this
    const url = this.props.baseUrl
    window.mchc_modal.open('modal_form', {
      width: '80vw',

      modal_data: {
        targetLabelCol: 4,
        formDescriptions: Array.isArray(this.props.tableColumns) ? this.props.tableColumns.map(_ => ({ layout: '1/2', ..._ })) : this.props.tableColumns,
        onFieldsChange: async (changedFields, b, form) => {

        },
        async onSubmit(values) {


          const p = id ? request.put : request.post;
          await p(`${url}`, { ...rowData, ...values });
          that.handleSearch();

        },
        async getInitialData() {
          console.log('rowData', rowData)
          if (id) {
            return rowData

          } else {
            return {}
          }
        }

      }
    })
  }
  // 单击某条记录触发相应事件
  handleClickRow = (record: object, event: any) => { };


  handleAdd = (value?: any) => {
    const { needEditInTable, showAdd } = this.props;
    const { dataSource, editKey } = this.state;
    if (needEditInTable && showAdd) {
      if (!isNil(editKey)) {
        message.error('请先保存上一条记录');
        return;
      }
      const mockKey = new Date().toString();
      this.setState({
        editKey: mockKey,
        dataSource: [
          {
            editKey: mockKey,
          },
          ...dataSource,
        ],
      });
    } else {
      if (this.props.ModalForm) {
        this.setState({
          visible: true,
          editable: true,
        });
      } else {
        this._openModal()

      }
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      editable: false,
      id: undefined,
    });
  };

  handleFieldsChange = () => { };

  handleQuerySearch = async (data: object = {}) => {
    await this.setState({ defaultQuery: { ...this.staticDefaultQuery, ...data } });
    this.handleSearch();
  };

  formatQuery = () => {
    const queryParams = { ...this.staticDefaultQuery, ...this.state.defaultQuery }
    const { asChildComponentQueryLabel = '', id: propsId } = this.props;
    const { defaultQuery } = this.state;

    // TODO: 有可能作为页面的子组件， propsId 是 BaseList 作为子组件从 props 传入的
    const query: object = propsId
      ? {
        sort: 'id,desc',
        ...defaultQuery,
        [asChildComponentQueryLabel]: propsId,
        ...queryParams,
      }
      : {
        sort: 'id,desc',
        ...defaultQuery,
        ...queryParams,
      };

    return query;
  };

  handleSearch = async () => {
    const { editKey } = this.state;
    const { baseUrl, processFromApi } = this.props;
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
    const query = this.formatQuery();
    const { data, count } = await getDataSource(baseUrl, query, processFromApi, this._request);
    mchcLogger.log('handleSearch', data, count)
    if (data && isArray(data)) {
      dataSource = data;
    }
    if (count) {
      total = Number(count);
    }
    this.setState({ dataSource, total, loading: false });
    return dataSource;
  };

  handlePageChange = (page: any, pageSize: any) => {
    const { defaultQuery } = this.state;
    this.setState(
      {
        defaultQuery: {
          ...defaultQuery,
          page: page - 1,
          size: pageSize,
        },
      },
      () => {
        this.handleSearch();
      },
    );
  };

  handleRowSelected = (selectedRowKeys, selectedRows): any => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  getColumns = () => {
    const { needEditInTable } = this.props;
    const __columns = SHOW_SERIAL ? [...this.columns] : [...this.columns];
    return map(__columns, (col) => {
      if (col.children) {
        let childrenCell: any[] = [];
        col.children.map((child: any) => {
          childrenCell.push({
            width: 120,
            align: 'center' as const,
            ...child,
            onCell: (rowData: any) => {
              return {
                ...child,
                record: rowData,
                editing: this.isEditing(rowData),
              };
            },
          });
        });
        return {
          align: 'center' as const,
          ...col,
          children: childrenCell,
        };
      }
      return {
        align: 'center' as const,
        ...col,
        onCell: (rowData: any) => {
          return {
            ...col,
            record: rowData,
            editing: col.dataIndex === 'operation' ? false : this.isEditing(rowData),
          };
        },
      };

    });
  };

  renderEditableCell = (cell: any) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      inputProps,
      rules,
      record,
      index,
      render,
      children,
      inputConfig,
      editable,
      ...restProps
    } = cell;
    return (
      <td {...restProps}>
        {(editing && editable) ? (
          <Form.Item
            className="editing"
            name={dataIndex}
            style={{ margin: 0 }}
            rules={getDefaultRequiredRules(rules, title || dataIndex)}
          >
            <BaseFormComponent {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
          </Form.Item>
        ) : (
          isFunction(render) ? children : <BaseFormComponentDisplayFC {...inputProps} inputType={inputType} value={record?.[dataIndex]}>
            {
              children
            }
          </BaseFormComponentDisplayFC>
        )}
      </td>
    );
  };

  renderOthersModal = () => {
    const { ModalForm } = this.props;
    const { visible, editable, id } = this.state;
    if (!visible) {
      return;
    }
    return (
      <ModalForm
        visible={visible}
        editable={editable}
        id={id}
        onCancel={this.handleCancel}
        onSearch={this.handleSearch}
      />
    );
  };

  // 剩余react 都没渲染

  // 新增点击搜索列弹出Modal
  renderSearchColumnModal = () => { };

  searchColumnModalVisible = () => {
    this.setState({ isSearchColumnModal: true });
  };

  renderHiddenItem = () => <></>;
  setRowClassName = (record) => {
    return record.id === this.state.id ? 'clickRowStyl' : '';
  };
  mergerTableProps() {
    const { otherTableProps } = this.props;
    const { tableProps } = this.state;
    let mergeTablePros = { ...otherTableProps };
    if (tableProps) {
      mergeTablePros = {
        ...otherTableProps,
        ...tableProps,
      };
    }
    return mergeTablePros;
  }
  /* istanbul ignore next */
  render() {
    const {
      baseTitle,
      needPagination,
      rowKey,
      Query,
      ExtraFooter,
      Table = BaseTable,
      showQuery,
      showAdd,
      showTitle,
      otherTableProps,
      needEditInTable,
      needChecked = false,
      containerProps,
      history,
      addText,
      selectionType = 'checkbox',
      className,
    } = this.props;
    const { dataSource, total, defaultQuery, loading, visible, selectedRowKeys, selectedRows, editKey } = this.state;
    const mergedColumns = this.getColumns();
    const mergeTablePros = this.mergerTableProps();
    return (
      <div className={classnames('base-list', className)}>
        <Form
          ref={(formRef) => {
            this.form = formRef;
          }}
          component={false}
          onFieldsChange={this.handleFieldsChange}
        >
          {this.renderHiddenItem()}
          <Table
            onRow={(record: object) => {
              const canClick = !editKey;
              if (!canClick) {
                return {};
              }
              return {
                onClick: (event: any) => this.handleClickRow(record, event),
                onDoubleClick: !editKey ? this.handleDoubleClickRow(record) : () => { },
                onContextMenu: (event: any) => {
                  event.preventDefault();
                },
              };
            }}
            otherTableProps={mergeTablePros}
            containerProps={containerProps}
            // loading={loading} // TODO: 已经做全局 loading，表格内 loading 是否不再需要
            pagination={
              needPagination && {
                size: 'small',
                position: ['bottomCenter'],
                total,
                showTotal: () => {
                  const min = defaultQuery.page * defaultQuery.size + 1;
                  const max = (defaultQuery.page + 1) * defaultQuery.size;
                  return `第 ${min}~${max < total ? max : total} 条 / 共 ${total} 条`;
                },
                pageSize: defaultQuery.size,
                current: defaultQuery.page + 1,
                pageSizeOptions: [10, 20, 30, 40, 50, 100],
                onChange: this.handlePageChange,
                // onShowSizeChange: this.handlePageChange,
                showQuickJumper: true,
                showSizeChanger: true,
              }
            }
            components={
              needEditInTable || true
                ? {
                  body: {
                    cell: this.renderEditableCell,
                  },
                }
                : {}
            }
            columns={mergedColumns}
            dataSource={dataSource}
            defaultQuery={defaultQuery}
            onAdd={showAdd && this.handleAdd}
            addText={addText}
            baseTitle={baseTitle}
            rowKey={rowKey}
            onSearch={this.handleQuerySearch}
            showQuery={showQuery}
            toQueryMethods={this.searchColumnModalVisible}
            showTitle={showTitle}
            Query={Query}
            ExtraFooter={ExtraFooter}
            needChecked={needChecked}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            rowClassName={this.setRowClassName}
            rowSelection={
              needChecked && {
                type: selectionType,
                onChange: this.handleRowSelected,
              }
            }
            history={history}
          />
        </Form>
        {this.renderOthersModal()}
        {this.renderSearchColumnModal()}
      </div>
    );
  }
}
