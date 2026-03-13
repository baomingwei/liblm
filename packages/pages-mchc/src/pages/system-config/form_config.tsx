import { Select_L } from '@lm_fe/components'
import { OkButton } from '@lm_fe/components_m'
import { getSameOptions, mchcDriver, mchcEnv, rt_ctx } from '@lm_fe/env'
import { default_primary, peek_provoke } from '@lm_fe/provoke'
import { defineFormConfig } from '@lm_fe/service'
import { lm_pdfjs_info } from '@lm_fe/static'
const my_colors = [
    default_primary,
    '#009174',
    '#0181a1',
    '#ae4804',
    '#0051a7',
    '#6107a1',
    '#008b1e',
    '#a68a00',
    '#b42f7d',
]
const React = rt_ctx.React
// c: "devlopment" | "test" | "production"
// systemTheme: string
// expireTime: number
// openWebsocket: boolean
// websocketAddress: "ws://127.0.0.1:8087/Laputa",
// auditRestriction: boolean
// openIntro: boolean
// fetalMonitor: string
// openHighriskSign: boolean
// highriskVersion: number
// curveVersion: "nichd",
// prenatalDiagnosis: boolean
// CaseReport: boolean
// FetalMonitor: boolean
// InformedConsent: boolean
// pregnancyInitial: 'tab' | 'vertical'
// isOpenDiabetes: boolean
// diagnosisStyle: "tab",
// diagnosisFollowUpRecord: boolean
// diagnosisLaboratoryReport: boolean
// diagnosisPrenatalVisit: boolean
// tablePrintBtn: boolean
// homeStatistics: boolean
// highriskStatistics: boolean
// customerService: true
// highriskType: string
// 禁止编辑高危等级: boolean
// 系统环境: any
// 护士端_禁止编辑高危因素_传染病: boolean
// 医生端_模块隐藏: string[]
// doctorOpenWebsocket: boolean
// VTE预防用药筛查表: string
// nurseHide: string[],
// medicalHide: string[]
// PDF预览组件版本?: string
const switchOptions = mchcEnv.get_options('yesOrNoMapping')

export default defineFormConfig(
    [
        {
            label: '系统配置',
            children: [
                {
                    label: 'id',
                    name: 'id',
                    layout: '1/3',
                    inputProps: { disabled: true },
                },
                {
                    label: '系统环境',
                    name: '系统环境',
                    inputType: 'MS',
                    inputProps: { options: getSameOptions(mchcEnv.all_env as any as string[]), marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '系统名称',
                    name: 'systemName',
                    inputType: 'Input',
                    layout: '1/3',
                },
                {
                    label: '系统模式',
                    name: 'systemMode',
                    inputType: 'MS',
                    inputProps: {
                        options: [
                            { value: 'production', label: '生产模式' },
                            { value: 'devlopment', label: '开发模式' },
                            { value: 'test', label: '测试模式' },
                        ],
                        marshal: 0,
                    },
                    layout: '1/3',
                },
                {
                    label: '加密登录',
                    name: '加密登录',
                    inputType: 'MSW',
                    inputProps: {
                    },
                    layout: '1/3',
                },
                {
                    label: '本地数据存储',
                    name: '本地数据存储',
                    inputType: 'MS',
                    inputProps: {
                        marshal: 0,
                        options: getSameOptions('Local,Session'),
                    },
                    layout: '1/3',
                },

                {
                    label: 'PDF预览组件版本',
                    name: 'PDF预览组件版本',
                    inputType: 'MS',
                    inputProps: {
                        options: Object.keys(lm_pdfjs_info.dirs).map((value) => ({ label: value, value })),
                        marshal: 0,
                    },
                    layout: '1/3',
                },

                {
                    label: '登录过期时间(秒)',
                    name: 'expireTime',
                    inputType: 'Input',
                    inputProps: { type: 'number' },
                    layout: '1/3',
                },

                {
                    label: 'websocket服务',
                    name: 'openWebsocket',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: 'websocket服务地址',
                    name: 'websocketAddress',
                    inputType: 'Input',
                    disabledDeps: {
                        openWebsocket: [false],
                    },
                    layout: '1/3',
                },
                {
                    label: '老人模式',
                    name: '老人模式',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '列表一页显示条数',
                    name: '列表一页显示条数',
                    inputType: 'Input',
                    inputProps: { type: 'number' },
                    layout: '1/3',
                },
                {
                    label: 'OBIS外设驱动下载',
                    name: 'OBIS外设驱动下载',
                    inputType: 'node',
                    inputProps: { node: <OkButton onClick={mchcDriver.download}>下载</OkButton> },
                    layout: '1/3',
                },
                {
                    label: '顶部工具栏隐藏',
                    name: '顶部工具栏隐藏',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '模板编辑器',
                    name: '模板编辑器',
                    inputType: 'MC',
                    inputProps: { options: getSameOptions('SDE,XEMR'), marshal: 0 },
                    layout: '1/3',
                },
            ],
        },
        {
            label: '产科门诊配置',
            children: [
                {
                    label: '医生端',
                    children: [
                        {
                            label: '模块隐藏(可以手输拓展)',
                            name: '医生端_模块隐藏',
                            inputType: 'MS',
                            inputProps: {
                                marshal: 3,
                                type: 'tags',
                                options: getSameOptions('产前诊断,孕妇学校预约,助产士预约,产前诊断病历'),
                            },
                            layout: '2/3',
                        },
                        {
                            label: '检验检查时间轴隐藏',
                            name: '医生端_检验检查时间轴隐藏',
                            inputType: 'MS',
                            inputProps: { options: switchOptions, marshal: 0 },
                            layout: '1/3',
                        },
                        {
                            label: '复诊按钮浮动',
                            name: '医生端_复诊按钮浮动',
                            inputType: 'MS',
                            inputProps: { options: switchOptions, marshal: 0 },
                            layout: '1/3',
                        },
                        {
                            label: '复诊左侧隐藏',
                            name: '医生端_复诊左侧隐藏',
                            inputType: 'MySwitch',
                            inputProps: {},
                            layout: '1/3',
                        },
                        {
                            label: '复诊编辑控制',
                            name: '医生端_复诊编辑控制',
                            inputType: 'MS',
                            inputProps: { options: switchOptions, marshal: 0 },
                            layout: '1/3',
                        },

                        {
                            label: '看诊审核限制',
                            name: 'auditRestriction',
                            inputType: 'MS',
                            inputProps: { options: switchOptions, marshal: 0 },

                            layout: '1/3',
                        },

                        {
                            label: '操作引导提示',
                            name: 'openIntro',
                            inputType: 'MS',
                            inputProps: { options: switchOptions, marshal: 0 },

                            layout: '1/3',
                        },

                        {
                            label: '胎监报告服务地址',
                            name: 'fetalMonitor',
                            inputType: 'Input',
                            inputProps: { options: switchOptions, marshal: 0 },

                            layout: '1/3',
                        },



                        {
                            label: 'VTE预防用药筛查表',
                            name: 'VTE预防用药筛查表',
                            inputType: 'MS',
                            inputProps: {
                                options: getSameOptions([
                                    '《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录1',
                                    '《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录3(广三用)',
                                    '《妊娠期及产褥期静脉血栓栓塞症预防和诊治专家共识》2021中文共识(越秀妇幼用)',
                                ]),
                                marshal: 0,
                            },
                            layout: '1/3',
                        },
                        {
                            label: '胎儿生长曲线版本',
                            name: 'curveVersion',
                            inputType: 'MS',
                            inputProps: {
                                options: [
                                    { value: 'southChina', label: '中国南方人群' },
                                    { value: 'nichd', label: 'NICHD亚裔人群' },
                                ],
                                marshal: 0,
                            },
                            layout: '1/3',
                        },
                        {
                            label: 'BMI曲线类型',
                            name: '医生端_BMI曲线类型',
                            inputType: 'MC',
                            inputProps: {
                                options: [
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '产检记录' },
                                    { value: 2, label: '居家记录' },
                                ],
                                marshal: 0,
                            },
                            layout: '1/3',
                        },


                        {
                            label: '首检信息病历风格',
                            name: 'pregnancyInitial',
                            inputType: 'MS',
                            inputProps: {
                                options: [
                                    { value: 'tab', label: 'TAB风格' },
                                    { value: 'vertical', label: '垂直风格' },
                                ],
                                marshal: 0,
                            },
                            layout: '1/3',
                        },

                        {
                            label: '漏诊和高危因素标识提醒',
                            name: 'isOpenDiabetes',
                            inputType: 'MS',
                            inputProps: {
                                options: switchOptions,
                            },
                            layout: '1/3',
                        },
                        {
                            label: '专案管理-糖尿病专案',
                            name: 'isOpenDiabetes',
                            inputType: 'MS',
                            inputProps: {
                                options: switchOptions,
                            },
                            layout: '1/3',
                        },

                        {
                            label: '疤痕子宫评估孕周',
                            name: 'ScarredUterusGestationalWeek',
                            inputType: 'Input',
                            inputProps: {},
                            layout: '1/3',
                        },
                        {
                            label: '签名方式',
                            name: '签名方式',
                            inputType: 'MS',
                            inputProps: {
                                marshal: 0,
                                options: getSameOptions('CA签名并保存,CA签名'),
                                popupMatchSelectWidth: 300,
                                allowClear: true
                            },
                            layout: '1/3',
                        },
                    ],
                },

                {
                    label: '护士端',
                    children: [
                        {
                            label: '模块隐藏(可以手输拓展)',
                            name: '护士端_模块隐藏',
                            inputType: 'MS',
                            inputProps: {
                                options: getSameOptions('复诊管理,补助券管理,产后复诊管理'),
                                type: 'tags',
                                marshal: 3,
                            },
                            layout: '2/3',
                        },
                        // {
                        //     label: '补助券管理模块',
                        //     name: 'nurseDeskVoucher',
                        //     inputType: 'MS',
                        //     inputProps: { options: switchOptions, marshal: 0 },
                        //     layout: '1/3'
                        // },

                        {
                            label: '审核禁用保存',
                            name: '护士端_审核禁用保存',
                            inputType: 'MSW',
                            layout: '1/3',
                        },
                    ],
                },

                {
                    label: '头部信息拓展',
                    name: '头部信息拓展',
                    inputType: 'MyEditTable',
                    inputProps: {
                        marshal: 0,
                        formDescriptions: [
                            { label: '标题', name: 'label', inputType: 'MA' },
                            { label: '字段', name: 'value', inputType: 'MA' },
                        ],
                    },
                    layout: '1/3',
                },
                {
                    label: '头部专案',
                    name: '头部专案',
                    inputType: 'MSW',
                    layout: '1/3',
                },

                {
                    label: '量表拓展',
                    name: '量表拓展',
                    inputType: 'MyEditTable',
                    inputProps: {
                        marshal: 0,
                        formDescriptions: [
                            { label: '标题', name: 'label', inputType: 'MA' },
                            { label: '标识', name: 'value', inputType: 'MA', width: 100 },
                            { label: '禁用', name: 'disabled', inputType: 'MSW', width: 100 },
                        ],
                    },
                    layout: '2/3',
                },
                {
                    label: '禁用量表自动弹出',
                    name: '禁用量表自动弹出',
                    inputType: 'MSW',
                    layout: '1/3',
                },
                {
                    label: '旧版量表隐藏',
                    name: '旧版量表隐藏',
                    inputType: 'MS',
                    inputProps: {
                        options: getSameOptions('瘢痕子宫,子痫,VTE'),
                        type: 'tags',
                        marshal: 3,
                    },
                    layout: '1/3',
                },

                {
                    label: '病人标签多选',
                    name: '病人标签多选',
                    inputType: 'Switch',
                    layout: '1/3',
                },
            ],
        },
        {
            label: '高危管理配置',
            children: [
                {
                    label: '禁止编辑高危等级',
                    name: '禁止编辑高危等级',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '允许手输传染病',
                    name: '高危管理_允许手输传染病',
                    inputType: 'MSW',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '高危标记多选',
                    name: '高危标记多选',
                    inputType: 'Switch',
                    layout: '1/3',
                },
                {
                    label: '高危展示',
                    name: 'highriskType',
                    inputType: 'MS',
                    inputProps: {
                        options: [
                            { value: 'highRiskDiagnosis', label: '高危诊断' },
                            { value: 'highriskNote', label: '高危因素' },
                        ],
                        marshal: 0,
                    },
                    layout: '1/3',
                },
                {
                    label: '高危提醒功能',
                    name: 'openHighriskSign',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },

                    layout: '1/3',
                },
                {
                    label: '高危版本',
                    name: 'highriskVersion',
                    inputType: 'MS',
                    inputProps: { options: peek_provoke((s) => s.可选高危版本), marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '护士端_禁止打开高危管理',
                    name: '护士端_禁止编辑高危因素_传染病',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
            ],
        },
        {
            label: '统计管理配置',
            children: [
                {
                    label: '首页统计模块',
                    name: 'homeStatistics',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '高危统计-导出统计按钮',
                    name: 'highriskStatistics',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
                {
                    label: '建档统计搜索-客服专员',
                    name: 'customerService',
                    inputType: 'MS',
                    inputProps: { options: switchOptions, marshal: 0 },
                    layout: '1/3',
                },
            ],
        },
        {
            label: '产科住院配置',
            children: [
                {
                    label: '护理文书隐藏表单(可以手输拓展)',
                    name: 'nurseHide',
                    inputType: 'MS',
                    inputProps: {
                        options: getSameOptions('首次护理记录,待产记录'),
                        marshal: 3,
                        type: 'tags',
                    },
                    layout: '1/1',
                },
                {
                    label: '病历文书隐藏表单(可以手输拓展)',
                    name: 'medicalHide',
                    inputType: 'MS',
                    inputProps: {
                        marshal: 3,
                        options: getSameOptions('分娩记录,引产记录'),

                        type: 'tags',
                    },
                    layout: '1/1',
                },
            ],
        },
        {
            label: '系统样式',
            children: [
                // {
                //     label: '主题色',
                //     name: 'styles.colorPrimary',
                //     inputType: 'MyColor',
                //     inputProps: { disabled: location.port !== '8080' },
                //     layout: '1/3'
                // },
                {
                    label: '主题色',
                    name: 'styles.colorPrimary',
                    inputType: 'component',
                    inputProps: {
                        component: (props) => {
                            return (
                                <Select_L allowClear {...props}>
                                    {my_colors.map((color) => {
                                        return (
                                            <Select_L.Option key={color}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ minWidth: 60 }}>{color}</div>
                                                    <div
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginLeft: 12,
                                                            background: color,
                                                        }}
                                                    ></div>
                                                </div>
                                            </Select_L.Option>
                                        )
                                    })}
                                </Select_L>
                            )
                        },
                    },
                    layout: '1/3',
                },
                {
                    label: '边框颜色',
                    name: 'styles.colorBorder',
                    inputType: 'MyColor',
                    inputProps: {},
                    layout: '1/3',
                },

                {
                    label: '默认字号',
                    name: 'styles.fontSize',
                    inputType: 'input_number',
                    inputProps: { min: 14, max: 18 },
                    layout: '1/3',
                },
                {
                    label: '粗体',
                    name: 'styles.cus_fontBold',
                    inputType: 'MySwitch',
                    layout: '1/3',
                },
                {
                    label: '暗黑主题',
                    name: 'styles.darkTheme',
                    inputType: 'MySwitch',
                    layout: '1/3',
                },
                {
                    label: '紧凑模式',
                    name: 'styles.compact',
                    inputType: 'MySwitch',
                    layout: '1/3',
                },
                {
                    label: '表单',
                    children: [
                        {
                            label: 'placeholder 颜色',
                            name: 'styles.colorTextPlaceholder',
                            inputType: 'MyColor',
                            inputProps: {},
                            layout: '1/3',
                        },
                        {
                            label: 'disabled 颜色',
                            name: 'styles.colorTextDisabled',
                            inputType: 'MyColor',
                            inputProps: {},
                            layout: '1/3',
                        },

                        {
                            label: 'disabled 背景',
                            name: 'styles.colorBgContainerDisabled',
                            inputType: 'MyColor',
                            inputProps: {},
                            layout: '1/3',
                        },
                        {
                            label: '标签颜色',
                            name: 'styles.labelColor',
                            inputType: 'MyColor',
                            layout: '1/3',
                        },
                        {
                            label: '标签字号',
                            name: 'styles.labelFontSize',
                            inputType: 'input_number',
                            inputProps: { min: 12, max: 36 },
                            layout: '1/3',
                        },
                    ],
                },
                {
                    label: '表格',
                    children: [
                        {
                            label: 'hover颜色',
                            name: 'styles.rowHoverBg',
                            inputType: 'MyColor',
                            inputProps: {},
                            layout: '1/3',
                        },
                    ],
                },
            ],
        },
    ],
    { containerType: 'tabs' },
)
