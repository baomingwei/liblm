// import React from 'react';
// import { Modal, Button, Form, Input, Row, Col } from 'antd';
// // import ReactMarkdown from 'react-markdown';
// import { request } from '@lm_fe/utils';
// const Item = Form.Item;
// const formLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 14 },
// };
// const MAPS = [
//   { label: '分支', value: 'git.branch' },
//   { label: '版本号', value: 'git.closest.tag.name' },
//   { label: '打包时间', value: 'git.build.time' },
//   { label: '打包作者', value: 'git.build.user.name' },
//   { label: '最后一次提交时间', value: 'git.commit.time' },
//   { label: '最后一次提交作者', value: 'git.commit.user.name' },
//   { label: '是否有未提交的commit', value: 'git.dirty' },
// ];
// interface IProps {
//   id?: string;
//   type?: 'primary' | 'link' | 'default' | 'text' | 'dashed' | 'ghost';
//   children?: React.ReactNode;
// }
// export default function VersionModal({ id, type = 'default', children }: IProps) {
//   const [form] = Form.useForm();
//   const [visible, setVisible] = React.useState(false);
//   const [changeLog, setChangeLog] = React.useState('');

//   React.useEffect(() => {
//     visible && queryVersion();
//   }, [visible]);

//   const queryVersion = async () => {
//     // 请求版本信息
//     const version = await request.get('/api/version');
//     form.setFieldsValue(version.data);
//     const changelog = await request.get('/api/version-release-notes');
//     setChangeLog(changelog.data);
//   };

//   const showVersionModal = async () => {
//     setVisible(true);
//   };

//   const handleVersionCancel = () => {
//     setVisible(false);
//   };

//   return (
//     <div id={id}>
//       <Button onClick={showVersionModal}>{children}</Button>
//       <Modal
//         destroyOnClose
//         title="后台版本信息"
//         width={960}
//         open={visible}
//         onCancel={handleVersionCancel}
//         footer={
//           <Button type="primary" onClick={handleVersionCancel}>
//             确定
//           </Button>
//         }
//       >
//         <Row gutter={12}>
//           <Col span={12}>
//             <Form autoComplete="off" form={form} className="version-Form" {...formLayout}>
//               {MAPS.map(({ label, value }) => (
//                 <Item key={value} label={label} name={value}>
//                   <Input />
//                 </Item>
//               ))}
//             </Form>
//           </Col>
//           <Col span={12} style={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
//             {/* <ReactMarkdown>{changeLog}</ReactMarkdown> */}
//           </Col>
//         </Row>
//       </Modal>
//     </div>
//   );
// }
