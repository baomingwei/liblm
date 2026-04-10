import { BaseListOld } from '@lm_fe/components_m';
import { formatDate, request } from '@lm_fe/utils';
import { message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, isNil, set } from 'lodash';
import dayjs from 'dayjs';
import Table from './components/Table';
import { getFutureDate } from '@lm_fe/utils';

import { tableColumns } from './config/table';
import { mchcEnv } from '@lm_fe/env';
export default class List extends BaseListOld {
  staticDefaultQuery = {
    'type.equals': 2,
    page: 0,
    size: 20,
    sort: 'createDate,DESC',
  };

  static defaultProps = {
    baseUrl: '/api/measures',
    asChildComponentQueryLabel: 'outpatientNO.equals',
    baseTitle: '产后复诊记录',
    needPagination: true,
    needEditInTable: true,
    showQuery: false,
    showAdd: true,
    showAction: true,
    tableColumns,
    rowKey: 'id',
    Table,
    otherTableProps: {
      scroll: { x: 1278 },
    },
  };

  handleEdit = (rowData: any) => () => {
    const form = this.form as FormInstance;
    form.setFieldsValue({
      ...rowData,
      bloodPressure: {
        systolic: get(rowData, 'physicalExamMeasure.systolic'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic'),
      },
      bloodPressure2: {
        systolic: get(rowData, 'physicalExamMeasure.systolic2'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic2'),
      },
      bloodPressure3: {
        systolic: get(rowData, 'physicalExamMeasure.systolic3'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic3'),
      },
      createDate: dayjs(get(rowData, 'createDate')),
    });
    this.setState({
      editKey: get(rowData, 'editKey') || get(rowData, 'id'),
    });
  };

  handleAdd = async () => {
    const { user } = this.props;
    const { dataSource, editKey } = this.state;
    if (!isNil(editKey)) {
      message.error('请先保存上一条记录');
      return;
    }
    const mockKey = new Date().toString();
    const addData = {
      createDate: dayjs(getFutureDate(0)),
      createUser: { id: get(user, 'basicInfo.id') },
      editKey: mockKey,
    };
    const form = this.form as FormInstance;
    form.setFieldsValue(addData);

    await this.setState({
      dataSource: [addData, ...dataSource],
      editKey: mockKey,
    });
  };

  handleItemSave = (rowData: any) => async () => {
    const { baseUrl, head_info } = this.props;
    await this.form?.validateFields();
    const formData = this.form?.getFieldsValue();
    const physicalExamMeasure = {
      ...get(rowData, 'physicalExamMeasure'),
      ...get(formData, 'physicalExamMeasure'),
      systolic: get(formData, 'bloodPressure.systolic'),
      diastolic: get(formData, 'bloodPressure.diastolic'),
      systolic2: get(formData, 'bloodPressure2.systolic'),
      diastolic2: get(formData, 'bloodPressure2.diastolic'),
      systolic3: get(formData, 'bloodPressure3.systolic'),
      diastolic3: get(formData, 'bloodPressure3.diastolic'),
    };
    const data = {
      ...rowData,
      ...formData,
      createDate: formatDate(formData.createDate),
      physicalExamMeasure,
    };

    if (get(data, 'id')) {
      await request.put(baseUrl, data);
    } else {
      set(data, 'outpatientNO', get(head_info, 'outpatientNO'));
      set(data, 'name', get(head_info, 'name'));
      set(data, 'type', 2);
      await request.post(baseUrl, data);
    }
    this.form?.resetFields();
    mchcEnv.success('保存成功');
    await this.setState({
      editKey: undefined,
    });
    await this.handleSearch();
  };
}
