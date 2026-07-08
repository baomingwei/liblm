import { request } from '@lm_fe/utils';
import { get, isEmpty, isNil, keyBy, keys, map, set } from 'lodash';
import dayjs from 'dayjs';

/**
 * 获取所有资源，默认取999999位
 * @param url URL地址
 * @param others 其它查询条件
 * @param defaultSize 默认资源条数为999999
 */
export const getAllResources = async (url: string, others?: any, defaultSize?: number) => {
  let size = defaultSize || 999999;
  if (isEmpty(others) || isNil(others)) {
    return (await request.get(`${url}?size=${size}`)).data;
  }
  return (await request.get(`${url}`, {
    params: {
      size,
      ...others
    }
  })).data;
};

/**
 * 查询资源列表
 * @param url URL地址
 * @param others 其它查询条件
 * @param defaultSize 默认资源条数为999999
 */
export const getResources = async (url: string, others?: any, config?: any) => {
  if (isEmpty(others) || isNil(others)) {
    return (await request.get(url)).data;
  }
  const p = config ?? {}
  return (await request.get(`${url}`, {
    ...p,
    params: {
      ...others,
      ...(p.params ?? {})
    }
  })).data;
};

/**
 * 查询资源总数
 * @param url URL地址
 */
export const getResourcesTotal = async (url: string, others?: any) => {
  if (isEmpty(others) || isNil(others)) {
    return (await request.get(`${url}/count`)).data;
  }
  return (await request.get(`${url}/count`, { params: others })).data;
};

/**
 * 通过主键获取资源
 * @param url URL地址
 * @param id 主键ID
 */
export const getResourcesByID = async (url: string, id: any) => {
  if (id) {
    return (await request.get(`${url}/${id}`)).data;
  }

  return Promise.resolve();
};

/**
 * 新增资源
 * @param url URL地址
 * @param data 数据
 */
export const createResources = async (url: string, data: any) => {
  return (await request.post(url, data)).data;
};

/**
 * 修改资源
 * @param url URL地址
 * @param data 修改数据，必须包含主键ID
 */
export const updateResources = async (url: string, data: any) => {
  return (await request.put(url, data, { successText: '操作成功' })).data;
};

/**
 * 通过主键ID删除数据
 * @param url URL地址
 * @param id 主键
 */
export const deleteResourcesByID = async (url: string, id: any) => {
  return (await request.delete(`${url}/${id}`, { successText: '操作成功' })).data;
};

/**
 * 通过指定日期字段，自动转换按指定日期分组
 * @param data 数据
 * @param dateName date name
 */
export const transferDataByDate = (data: any[] = [], dateName = 'visitDate') => {
  const result = {};
  const newData = map(data, (item) => {
    return {
      ...item,
      [dateName]: dayjs(get(item, dateName)).format('YYYY-MM-DD'),
    };
  });
  map(keys(keyBy(newData, dateName)), (key) => {
    if (key && key !== 'null' && key !== 'undefined') {
      set(result, key, []);
    }
  });
  map(newData, (item: any) => {
    if (get(item, dateName)) {
      (result[get(item, dateName)] as Array<any>).push(item);
    }
  });
  return result;
};

/**
 * 如果是 data 是 null 或 undefined，返回空对象，否则返回自身
 * @param data
 */
export const expandObjectOrEmptyObj = (data: Object | null | undefined) => {
  return isNil(data) ? {} : data;
};

/**
 * 如果是 data 是 null 或 undefined，返回空数组，否则返回自身
 * @param data
 */
export const expandObjectOrEmptyArray = (data: any[] | null | undefined) => {
  return isNil(data) ? [] : data;
};

/**
 * 返回一个拥有 key 和 keyNote 的对象
 * @param data 数据对象
 * @param path 指定路径
 */
export const getKeyAndKeyNote = (data: Object, path: string) => {
  return {
    key: get(data, path),
    keyNote: get(data, `${path}Note`),
  };
};

/**
 * 通过拥有指定 key 和 keyNote 的对象
 * @param data 数据对象
 * @param name 名称
 * @param key key
 */
export const getObjByKeyAndKeyNote = (data: Object, name: string, key: string) => {
  return {
    [key]: get(data, `${name}.key`),
    [`${key}Note`]: get(data, `${name}.keyNote`),
  };
};

/**
 * @param rules 规则
 * @param title 名称
 */
export const getDefaultRequiredRules = (rules: any[], title: string) => {
  return map(rules, (rule) => {
    if (get(rule, 'required')) {
      return {
        required: true,
        message: `${title}是必填项`,
      };
    }
    return rule;
  });
};
