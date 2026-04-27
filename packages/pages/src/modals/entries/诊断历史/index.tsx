import { IGlobalModalProps } from '@lm_fe/components';
import { IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { expect_array, get, request } from '@lm_fe/utils';
import { Button, Modal, Table } from 'antd';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { BF_Wrap2 } from 'src/components';

interface IProps {
    pregnancyId: TIdTypeCompatible
}
export default function Test({ modal_data, visible, onCancel, ...others }: IGlobalModalProps<IProps>) {
    const { pregnancyId, } = modal_data


    const [recordData, setRecordData] = useState([])
    const [headerInfo, set_headerInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()
    const printDiagRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (pregnancyId) {
            request.get(`/api/getDiagnosisHistories?pregnancyId=${pregnancyId}`).then(r => setRecordData(r.data))
            SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId).then(set_headerInfo)
        }

        return () => {

        }
    }, [pregnancyId])



    const renderTable = () => {
        return <RenderTable dataSource={recordData} headerInfo={headerInfo} ref={printDiagRef} />
    };



    const buttons = [
        <ReactToPrint
            trigger={() => <Button type="primary">打印最新诊断</Button>}
            content={() => printDiagRef.current}
        />,
    ];

    return (
        <Modal
            {...others}

            open={visible}
            width={'80%'}
            footer={buttons}
            onCancel={onCancel}
            style={{ top: '20px' }}
            bodyStyle={{ height: '80vh', overflowY: 'auto' }}
            destroyOnClose
            className="diag-record-modal"

            title="诊断历史"


        >
            {renderTable()}
        </Modal>
    );

};

const RenderTable = forwardRef<HTMLDivElement, { dataSource: any[], headerInfo: any }>(function RenderTable(props, ref) {
    const { dataSource, headerInfo } = props
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '门诊-诊断历史',
            tableColumns: [
                { title: '流水号', dataIndex: 'serialNo', key: 'serialNo', width: 150, align: 'center' as const },
                { title: 'ICD编码', dataIndex: 'diagnosisCode', key: 'diagnosisCode', width: 150, align: 'center' as const },
                {
                    title: '前备注',
                    dataIndex: 'preNote',
                    key: 'preNote',
                    align: 'center' as const,
                },
                {
                    title: '诊断',
                    dataIndex: 'diagnosis',
                    key: 'diagnosis',
                    align: 'center' as const,
                },
                {
                    title: '后备注',
                    dataIndex: 'note',
                    key: 'note',
                    align: 'center' as const,
                    },
                { title: '诊断医生', dataIndex: 'doctorName', key: 'doctorName', width: 150, align: 'center' as const },
                { title: '诊断日期', dataIndex: 'createDate', key: 'createDate', width: 200, align: 'center' as const },
            ]
        }
    })

    // {id: 4876, createDate: '2022-02-24', doctor: 'kevin', diagnosis: '涉及骨折板和其他内固定装置的随诊医疗'}
    return <Wrap>
        <div ref={ref}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontWeight: 700, fontSize: '18px', marginTop: '15px', marginLeft: '15px', marginBottom: '15px' }}>
                <span>姓名：{get(headerInfo, 'name')}</span>
                <span>就诊卡号：{get(headerInfo, 'outpatientNO')}</span>
                <span>年龄：{get(headerInfo, 'age')}</span>
            </div>
            <Table bordered columns={config?.tableColumns} dataSource={dataSource} pagination={false} />
        </div>
    </Wrap>
})