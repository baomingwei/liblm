import { AnyObject, EventEmitter, expect_array, IRequest_AxiosRequestConfig, request, } from '@lm_fe/utils';

import { mchcLogger } from '@lm_fe/env';
import { AxiosRequestConfig } from 'axios';
import { get, isNil, isNumber, isObject, set } from 'lodash';
import dayjs from 'dayjs';
import { IResponseDataType, TPageOption } from './common';
import { TIdTypeCompatible } from './types';

interface IConfig {
  ignore_usr?: boolean
  ignore_env?: boolean
  n?: string,
  prePath?: string,
  get_fuck_page?: T_GET_FUCK_PAGE,
  addictionalParams?: AnyObject,
  needTransferParams?: boolean,
  needTransferSourceData?: boolean,
  apiPrefix?: string,
  onErrMessage?: typeof ModelService['onErrMessage']
  useListSourceCount?: boolean
  fuckPage?: boolean
  useFuckHeader?: boolean
}

interface IBaseRequse<T> {
  page(options?: TPageOption): Promise<{
    data: T[];
    pagination: {
      total: number;
      current: any;
      size: any;
    };
  }>
  getList(options?: AxiosRequestConfig): Promise<T[]>
  getCount?(options?: AxiosRequestConfig): Promise<number>
  getOne(id: number | string, data?: AxiosRequestConfig): Promise<T>
  del(id?: number | string, data?: AxiosRequestConfig): Promise<IResponseDataType<boolean>>
  post(data: Partial<T>): Promise<T>
  put(data: Partial<T>): Promise<T>
  export?(data?: Partial<T>): Promise<any>
}

export class ModelService<T extends { id?: TIdTypeCompatible } = any> extends EventEmitter<{}> implements IBaseRequse<T> {
  ignore_usr?: boolean
  ignore_env?: boolean
  eventTypeStore: any;
  addictionalParams: AnyObject;
  name: string;
  needPageSuffix = false;
  needTransferParams = true;
  needTransferSourceData = true;
  useListSourceCount = false;
  fuckPage = false;
  get_fuck_page?: T_GET_FUCK_PAGE;
  prePath: string;
  preFix: string;
  static CONFIG = { successCode: [200, 1, 0] }
  static onErrMessage?: (r: { code: number, msg: string, res: any }) => void

  constructor(data: IConfig = {}) {
    let { n, prePath = '', addictionalParams = {}, apiPrefix = '/api', ...others } = data
    super();
    if (n?.startsWith('/api')) {
      n = n.slice(4)
      apiPrefix = '/api'
    }
    this.name = n!;
    this.addictionalParams = {
      ...addictionalParams, ...(prePath ? {
        // deleteFlag: 0
      } : {})
    };
    this.prePath = prePath;
    this.preFix = apiPrefix;
    Object.assign(this, others)
    // this.exceptionKeys.push(...Object.keys(addictionalParams))
  }



  async page(options: TPageOption = {}) {
    const params = options.params || { page: 1, size: 20 };
    const { current = 1, size = 20, ...otherParams } = params;

    if (this.fuckPage || this.get_fuck_page) {
      const fn = this.get_fuck_page || this.getFuckPage.bind(this)
      const result = await fn(options)
      mchcLogger.log('xxg', result)
      let data: T[] = get(result, 'pageData') ?? []
      return {
        data,
        pagination: {
          total: result.totalElements ?? data.length,
          current,
          size,
        },
      };
    }
    if (this.useListSourceCount) {
      // const result = await this._get<any>(`${this.name}`, this.tranferGetOption({ params }));
      mchcLogger.log('useListSourceCount', this)
      const result = await this._request<T[]>({ method: 'GET', url: this.getUrl(this.name, '/get'), ...this.tranferGetOption(options) });
      const list_data = expect_array(result.data)
      return {
        data: list_data,
        pagination: {
          total: result._XTotalCount ?? list_data.length ?? 0,
          current,
          size,
        },
      };
    }
    else {
      // const arr = await Promise.all([this.getList({ params }), this.getCount({ params })]);
      // return {
      //   data: arr[0],
      //   pagination: {
      //     total: arr[1],
      //     current,
      //     size,
      //   },
      // };
      const a1: any = await this.getList(options)
      if (isNumber(a1._XTotalCount))
        return {
          data: a1 as T[],
          pagination: {
            total: a1._XTotalCount,
            current,
            size,
          },
        };
      const a2 = await this.getCount(options);

      return {
        data: a1 as T[],
        pagination: {
          total: a2,
          current,
          size,
        },
      };
    }
  }
  async getFuckPage(options?: IRequest_AxiosRequestConfig) {
    const result = await this._get<{
      pageData: T[],
      pageNumber: number,
      size: number,
      totalElements: number,
      totalPages: number,
    }>(`${this.name}/page`, this.tranferGetOption(options));
    return result
  }
  async getList(options?: AxiosRequestConfig, listPath?: string) {
    let result = await this._get<T[]>(`${this.name}`, this.tranferGetOption(options));
    if (listPath) {
      result = get(result, listPath)
    }
    const arr = Array.isArray(result) ? result : []
    const res = arr.map((_) => this.transferSourceData(_));
    //@ts-ignore
    if (!isNil(arr._XTotalCount)) res._XTotalCount = arr._XTotalCount

    return res
  }
  async getCount(options?: AxiosRequestConfig) {
    const result = (await this._get<number>(`${this.name}/count`, this.tranferGetOption(options))) as any as number;
    return result;
  }
  async getOne(id: number | string, data?: AxiosRequestConfig) {
    const result = await this._get<T>(`${this.name}/${id}`, data);
    return this.transferSourceData(result);
  }
  async exportGet() {

    return null as any
  }
  async exportPost(data: Partial<T>) {

    const result = await this._export<T>(`${this.name}`, this.transferSubmitData(data));
    return result;
  }
  async export(data: Partial<T>) {
    const result = await this._export<T>(`${this.name}export`, data);
    return result.data
  }
  async row_export(data: AnyObject) {
    const r = await request
      .ins({ method: 'GET', url: this.getUrl(`${this.name}rowexport`, '/rowexport'), params: data, data, responseType: 'blob', });
    return r.data
  }
  async print(data: Partial<T>) {
    const result = await this._print<T>(`${this.name}export`, data);
    return result.data
  }
  async sync(data: any) {
    const result = await this._sync<T>(`${this.name}sync`, data);

    return result
  }

  async del(id?: number | string, data?: AxiosRequestConfig) {
    const result = await this._delete<any>(`${this.name}/${id}`, data);
    return result;
  }

  async post(data: Partial<T>, c?: IRequest_AxiosRequestConfig) {
    const result = await this._add<T>(`${this.name}`, this.transferSubmitData(data), c);
    return this.transferSourceData(result);
  }

  async put(data: Partial<T>, c?: IRequest_AxiosRequestConfig) {
    const result = await this._update<T>(`${this.name}`, this.transferSubmitData(data), c);
    return this.transferSourceData(result);
  }
  async postOrPut(data: Partial<T>) {
    return data.id ? this.put(data) : this.post(data)
  }
  tranferGetOption(options?: AxiosRequestConfig) {
    const _options = options || {};
    _options.params = _options.params || {};
    Object.assign(_options.params, this.addictionalParams);

    if (this.needTransferParams) {
      const { data, params } = _options;
      _options.params = this.transferParams(params);
    }
    return _options;
  }
  transferSubmitData(data: Partial<T>) {
    if (!data) return {};
    return Object.keys(data).reduce((a, k) => {
      const v = get(data, k)
      const value = this.transferParamsValue(k, v);
      return {
        ...a,
        [k]: value,
        // [`_${k}`]: v
      };
    }, {});
  }
  transferParams(data: any) {
    if (!data) return {};
    return Object.keys(data).reduce((a, k) => {
      const v = data[k]

      if (['sort', 'page', 'size'].includes(k)) {
        return { ...a, [k]: v }
      }
      const key = this.transferParamsKey(k, v);
      const value = this.transferParamsValue(k, v);
      return {
        ...a,
        [key]: value,
        // [`_${k}`]: v
      };
    }, {});
  }
  _transferParamsKeyAndValue(k: string, v: any) {
    const key = this.transferParamsKey(k, v);
    const value = this.transferParamsValue(k, v);
    if (Array.isArray(value)) {
      return {
        [`${k}.greaterOrEqualThan`]: value[0],
        [`${k}.lessOrEqualThan`]: value[1],
      }
    }
    return {
      [key]: value,
      // [`_${k}`]: v
    };
  }
  exceptionKeys = ['page', 'size', 'sort'];
  containsKeys: string[] = [];
  equalsKeys: string[] = ['id'];
  DateTimeKeys: string[] = [];
  jsonKeys: string[] = [];
  DateKeys: string[] = [];
  TimeKeys: string[] = [];
  DateMinute: string[] = ['signInTime'];
  transferParamsKey(key: string, value: any) {
    if (['contains', 'equals', 'greaterOrEqualThan', 'lessOrEqualThan'].some((_) => key.includes(_))) return key;
    if (this.exceptionKeys.includes(key)) return key;
    if (this.containsKeys.includes(key)) return `${key}.contains`;
    if (this.equalsKeys.includes(key)) return `${key}.equals`;
    if (typeof value === 'string') return `${key}.contains`;
    if (typeof value === 'number') return `${key}.equals`;
    return key;
  }
  transferParamsValue(key: string, value: any) {
    if (this.DateTimeKeys.includes(key)) {
      const result = dayjs(value);
      return result.isValid() ? result.format('YYYY-MM-DD HH:mm:ss') : value;
    }
    if (this.DateMinute.includes(key)) {
      const result = dayjs(value);
      return result.isValid() ? result.format('YYYY-MM-DD HH:mm') : value;
    }
    if (this.DateKeys.includes(key)) {
      const result = dayjs(value);
      return result.isValid() ? result.format('YYYY-MM-DD') : value;
    }
    if (this.TimeKeys.includes(key)) {
      const result = dayjs(value);
      return result.isValid() ? result.format('HH:mm:ss') : value;
    }
    if (this.jsonKeys.includes(key)) {
      return value === null ? null : JSON.stringify(value);
    }
    return value;
  }

  transferSourceData = <T = any>(data: T): T => {
    if (!data) return {} as T;
    if (!this.needTransferSourceData) return data;
    return Object.keys(data).reduce((a, k) => {
      const v = get(data, k)
      const value = this.getAdvancedValue(k, v);
      set(a as any, k, value);
      if (value !== v && !Number.isNaN(value)) {
        const backKey = `_${k}`;
        set(a as any, backKey, v);

      }
      return a;
    }, {} as T);
  }
  getAdvancedValue = (key: string, value: any) => {
    if (this.DateTimeKeys.includes(key) || this.DateKeys.includes(key) || this.DateMinute.includes(key)) {
      return value ? dayjs(value) : value;
    }
    if (this.jsonKeys.includes(key)) {
      let v: any;
      try {
        v = JSON.parse(value);
      } catch (e) {
        v = null;
      }
      return v;
    }
    if (this.TimeKeys.includes(key)) {
      return value ? dayjs(`1970-1-1 ${value}`) : value;
    }
    return value;
  }
  getPath(path: string = '') {
    return `/${this.name}${path}`;
  }
  async _request<T>(config: IRequest_AxiosRequestConfig) {
    // config.url = `${this.preFix}${this.prePath}${config.url}`
    config.ignore_usr = config.ignore_usr ?? this.ignore_usr
    config.ignore_env = config.ignore_env ?? this.ignore_env

    let res = await request.ins(config);
    let resData: IResponseDataType<T> = res?.data
    const headers = res.headers ?? {}
    const _XTotalCount = headers['X-Total-Count'] ?? headers['x-total-count'];
    const parse_x_count = _XTotalCount ? parseInt(_XTotalCount) : _XTotalCount
    if (isObject(resData) && !isNil(parse_x_count)) {
      resData._XTotalCount = parse_x_count
    }
    if (!resData?.data) {
      resData = { data: resData as T, code: 200, };
    }
    resData._XTotalCount = parse_x_count
    return resData as IResponseDataType<T>;
  }
  getDataArr<T = any>(res: IResponseDataType<T>) {
    const result: T = (res?.data ?? res) as any;
    return result;
  }
  getUrl(url: string, action = '') {
    const _action = this.prePath ? action : '';
    return `${this.preFix}${this.prePath}${_action}${url}`;
  }
  async _get<T>(path: string, config: AxiosRequestConfig = {}) {
    const r = await this._request<T>({ method: 'GET', url: this.getUrl(path, '/get'), ...config });
    return this.getDataArr(r);
  }
  async _delete<T>(path: string, config?: AxiosRequestConfig) {
    const r = await this._request<boolean>({ method: 'DELETE', url: this.getUrl(path, '/delete'), ...config });
    return r;
  }
  async _add<T>(path: string, data?: any, config?: AxiosRequestConfig) {
    const r = await this._request<T>({ method: 'POST', url: this.getUrl(path, '/add'), data, ...config });
    return this.getDataArr(r);
  }
  async _sync<T>(path: string, data?: any, config?: AxiosRequestConfig) {
    const r = await this._request<T>({ method: 'POST', url: this.getUrl(path, '/sync'), data, ...config });
    return this.getDataArr(r);
  }

  async _update<T>(path: string, data?: any, config?: AxiosRequestConfig) {
    const r = await this._request<T>({ method: 'PUT', url: this.getUrl(path, '/update'), data, ...config });
    return this.getDataArr(r);
  }

  async _export<T>(path: string, data?: any, config?: AxiosRequestConfig) {
    // const r = await request.ins({ method: 'POST', url: this.getUrl(path, '/export'), params: data, data, responseType: 'blob', ...config });
    const r = await request.ins({ method: 'GET', url: this.getUrl(path, '/export'), params: data, data, responseType: 'blob', ...config });
    return r
  }
  async _print<T>(path: string, data?: any, config?: AxiosRequestConfig) {
    const r = await request.ins({ method: 'POST', url: this.getUrl(path, '/print'), params: data, data, responseType: 'blob', ...config });
    return r
  }
}


export type T_GET_FUCK_PAGE<T = any> = (options?: IRequest_AxiosRequestConfig) => Promise<{
  pageData: T[];
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}>