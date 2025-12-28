# @lm_fe/components 1

## 安装

```bash
# 查看版本信息
yarn info @lm_fe/components

# 安装核心包 @lm_fe/core 即可获得所有功能
yarn add @lm_fe/core
```






## 组件

### MyAddress(兼容新旧地址组件)、MyAddressNew(新的地址组件)


```tsx

export interface IMyAddressProps {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  getPopupContainer?: any;
  bordered?: boolean;
  // 同上按钮需要用到
  form?: FormInstance
  // 同上按钮配置
  addressBtns?: { name: string, label: string, props: ButtonProps }[]
}

// 用法
<MyAddressNew form={form} addressBtns={[{ name: 'aa.bb', label: '同户籍地'}]}  />

```


## License

ISC
