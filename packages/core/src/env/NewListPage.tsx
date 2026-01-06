import { MyIcon, OkButton } from "@lm_fe/components_m";
import { mchcEnv } from "@lm_fe/env";
import { mchcModal__, safe_navigate } from "@lm_fe/pages";
import { AnyObject, request } from "@lm_fe/utils";
import React, { FC, useEffect } from "react";
export const NewListPage: FC = (props) => {


    useEffect(() => {

    }, [])
    return <OkButton
        btn_text="新增列表页"
        size='small'
        type='primary'
        onClick={() => {
            mchcModal__.open('modal_form', {
                width: '20vw',
                styles: { body: { height: '20vh', } },
                modal_data: {
                    targetLabelCol: 8,
                    async onSubmit({ key_name, parentid, ...others }: any, old_data: any) {
                        const key = `/happy/config-table/list2/${key_name}`
                        const res = await request.get<AnyObject[]>('/api/permissions', { params: { 'key.equals': key } })
                        if (res.data.length) {
                            mchcEnv.warning('已存在')
                            return
                        }
                        await request.post<AnyObject[]>('/api/permissions', { key, parentid: parentid ?? 0, type: 'route', ...others })
                        safe_navigate(key)


                    },

                    formDescriptions: [
                        {
                            inputType: 'MA',
                            name: 'key_name',
                            label: '配置标识',
                            required: true,
                            layout: '1'
                        },
                        {
                            inputType: 'MA',
                            name: 'name',
                            label: '菜单标题',
                            required: true,
                            layout: '1'

                        },
                        {
                            inputType: 'MS',
                            name: 'parentid',
                            label: '菜单父级',
                            layout: '1',
                            inputProps: {
                                marshal: 0,
                                fetch_options: { url: '/api/permissions?size=999&parentid.equals=0&active.equals=true&type.equals=menu', valueKey: 'id', labelKey: 'name' }
                            }
                        },



                    ]
                }
            })
        }}

        icon={<MyIcon value='SettingOutlined' />} />



}