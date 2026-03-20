import { OkButton } from '@lm_fe/components_m';
import { BF_Wrap2, mchcModal__, MyBaseList } from '@lm_fe/pages';
import { message } from "antd";
import React from "react";

export default function BreastCancerDataReport(props: {}) {
	const form_fn = () => import('./form_config')
	const { config, Wrap } = BF_Wrap2({
		default_conf: {
			name: "/api/disease-screenings",
			title: `产科住院-新生儿疾病筛查记录`,
			tableColumns: form_fn,
			searchParams: {
				sort: 'deliveryTime,id,desc',
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
					resource: 'diseaseScreening',
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

