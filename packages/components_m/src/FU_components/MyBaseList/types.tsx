// import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, ModelService, T_GET_FUCK_PAGE, TIdTypeCompatible } from '@lm_fe/service';
// import { ModalProps } from 'antd/lib/modal';
// import { ColumnGroupType, ColumnType, TableProps } from 'antd/lib/table';
// import { FC, ReactNode } from 'react';
// import { IModalFormProps } from '../../modals/entries/modal_form';
// import { ILmFormItemConfigMixin } from '../SimpleForm/types/lmTypes';
// import { AnyObject, PartialSome } from '@lm_fe/utils';
// import { FormInstance } from 'antd';
// export interface IGlobalEnumItem<T = string> {
//   label: T
//   value: number
// }
// export type IMyBaseList_ColumnType<T = any> = Omit<ColumnGroupType<T>, 'children'> & {
//   dataIndex?: string | string[]
//   hidden?: boolean
//   enums?: IGlobalEnumItem[],
//   showSorter?: boolean,
//   showFilter?: boolean,
//   mode?: 'multiple' | '',
//   editable?: boolean,
//   // inputProps?: InputProps
//   rules?: any[],
//   sortType?: string
//   children?: (IMyBaseList_ColumnType | null)[]
// } & Omit<IMchc_FormDescriptions_Field, 'children'>
// type TMyBaseList_ColumnArr_nullable<T> = (IMyBaseList_ColumnType<T> | null)[]
// export interface ModalFromProps extends ModalProps { editable: boolean, id?: TIdTypeCompatible, extraModalData?: AnyObject, onCancel: () => void, onSearch: () => void }
// export interface IMyBaseList_ActionCtx<T> {
//   handleSearch(): void,
//   getSearchParams(isFuck?: boolean): any,
//   getCheckRows(): T[]
// }
// interface RenderColProps<T = any> {
//   createOrUpdate: (v: T) => Promise<void>,
//   handleEdit: (v: T) => void,
//   handleView: (v: T) => void,
//   handleDelete: (v: T) => void,
//   handleSearch: () => void,
//   setExtraModalData: (v: any) => void,
//   setVisible: (v: boolean) => void,
//   setEditable: (v: boolean) => void,
//   setId: (v?: number) => void,
// }

// type RenderColFn<T> = FC<RenderColProps<T> & { rowData: T, }>
// export interface MyBaseListProps<T extends { id?: any } = any> extends TableProps<T> {

//   dbg_dataSource?: any[];

//   effect_ctx?: any
//   // 接口 URL
//   // 左上角标题
//   baseTitle?: string;
//   // 列表配置
//   tableColumns?: TMyBaseList_ColumnArr_nullable<T> | (() => Promise<TMyBaseList_ColumnArr_nullable<T> | { default: { __lazy_config: TMyBaseList_ColumnArr_nullable<T> } }>);
//   // 继承自 BaseTable 的组件, 默认 BaseTable
//   // Table?: typeof MyBaseTable;
//   // 唯一 key，通常取 id
//   rowKey?: string;
//   // 是否需要分页
//   needPagination?: boolean;
//   // 需要 多选
//   needChecked?: boolean;
//   // 表格是否可编辑
//   needEditInTable?: boolean;
//   // 展示添加按钮
//   showAdd?: boolean;
//   showExport?: boolean;
//   showPrint?: boolean;
//   action_col?: (config: RenderColProps<T>) => IMyBaseList_ColumnType<T>;
//   // add文本
//   addText?: string;
//   editText?: string;
//   // 是否展示编辑列
//   showAction?: boolean;
//   // 当 BaseList 作为子组件的时候，可能需要使用，参考 nursing-record
//   // 展示搜索功能，如果为 true，则必须传 Query 组件

//   beforeSearch?(v: Partial<T>): Partial<T>
//   beforeSubmit?(v: any): Promise<Partial<T> | null>

//   // 其它表格属性
//   otherTableProps?: TableProps<T>;
//   initialSearchValue?: any;
//   [x: string]: any
//   // *************/
//   // 弹窗表单
//   ModalForm?: FC<ModalFromProps>,
//   name?: string
//   apiPrefix?: string
//   fuckPage?: boolean
//   get_fuck_page?: T_GET_FUCK_PAGE,

//   ignore_usr?: boolean
//   ignore_env?: boolean
//   searchParams?: any
//   useListSourceCount?: boolean
//   requestBeforeEdit?: boolean

//   handleClickRow?(record: T, event: any): void
//   handleDoubleClickRow?(record: T, event: any): void
//   create_or_update?(v: Partial<T>): Promise<void>,

//   genColumns?: (funcs: {
//     tableColumns: IMyBaseList_ColumnType<T>[];
//     actionCol: IMyBaseList_ColumnType<T>;
//     editKey: any
//     handleItemSave: (v: T) => Promise<void>,
//     handleItemCancel: (v: T) => void,
//     handleEdit: (v: T) => void,
//     handleDelete: (v: T) => void,
//     handleSearch: () => void
//     getSearchParams(isFuck?: boolean): any

//   }) => IMyBaseList_ColumnType<T>[]
//   ActionAddonBefore?: RenderColFn<T>
//   RenderAction?: RenderColFn<T>
//   actionAddonAfter?: ReactNode
//   renderBtns?: FC<IMyBaseList_ActionCtx<T>>
//   RenderSearchBtns?: FC<IMyBaseList_ActionCtx<T>>
//   searchSchema?: IBaseListSearchSchemaItem[]
//   searchConfig?: IMchc_FormDescriptions_Field_Nullable[]
//   showRowDelBtn?: boolean
//   showRowPrintBtn?: boolean
//   showRowEditBtn?: boolean
//   // rowPrintUrlSuffix?: string
//   onAdd?: () => void
//   onExport?: (ctx: IMyBaseList_ActionCtx<T>) => void
//   onPrint?: (ctx: IMyBaseList_ActionCtx<T>) => void
//   onModalOpen?: (v: { rowData?: T, handleSearch(): void, create_or_update(submitData: Partial<T>): Promise<void>, table_columns: IMyBaseList_ColumnType<T>[] }) => void
//   customModelService?: ModelService<T>
//   modalFormConfig?: PartialSome<IModalFormProps, 'modal_data'>
//   handleBeforePopup?: (rowData: T) => T
//   history?: any
//   searchForm?: FormInstance
// }
// export type IBaseListSearchSchemaItem = ILmFormItemConfigMixin

// // export const DEFAULT_HEADER_HEIGHT = 37;
// // export const SHOW_SERIAL = true;

