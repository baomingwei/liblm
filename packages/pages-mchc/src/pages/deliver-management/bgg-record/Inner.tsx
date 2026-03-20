import { OkButton } from '@lm_fe/components_m';
import { BF_Wrap2, mchcModal__, MyBaseList } from '@lm_fe/pages';
import { message } from "antd";
import React from "react";
import { TType } from './types';
// import { form_config } from './form_config';
// import { modalFormConfig } from './modalForm_config';
const type_map: { [x in TType]: { title: string, type: number } } = {
	bgg: { title: '卡介苗接种记录', type: 3 },
	hbvac: { title: '乙肝疫苗接种记录', type: 1 },
	hbig: { title: '乙肝免疫球蛋白接种记录', type: 2 },
}
export default function BreastCancerDataReport(props: { type: TType }) {
	const { type } = props
	const page_type = type_map[type]
	const form_fn = () => import('./form_config').then(mod => mod.default(type))
	const { config, Wrap } = BF_Wrap2({
		default_conf: {
			name: "/api/hep-bs",
			title: `产科住院-${page_type.title}`,
			tableColumns: form_fn,
			searchParams: {
				sort: 'deliveryTime,id,desc',
				'type.in': page_type.type,
			},
			searchConfig: () => import('./search_config')
		}
	})
	function print(q: any) {

		if (!q['labourDate.greaterOrEqualThan']) return message.info('请选择分娩日期')
		mchcModal__.open('print_modal', {
			// footer: <div><Button onClick={() => alert(222)}>aaa</Button></div>,
			modal_data: {
				requestData: {
					...q,
					url: '/api/pdf-preview-all',
					resource: 'hepB',
					type: page_type.type,
				}
			}
		})
	}
	return <Wrap>
		<MyBaseList
			renderBtns={ctx => <OkButton onClick={() => print(ctx.getSearchParams())}>打印</OkButton>}
			searchParams={config?.searchParams}
			name={config?.name}
			useListSourceCount
			searchConfig={config?.searchConfig}
			showAdd={false}
			tableColumns={__DEV__ ? form_fn : config?.tableColumns}
		/>
	</Wrap >
}

