import storage from '@/utils/storage';
import { Badge, Divider, Layout, Menu, Modal, Tooltip } from 'antd';
import { get, isUndefined } from 'lodash';
import React, { Component } from 'react';
import { APP_CONFIG, WEBSOCKET_STATUS, WEBSOCKET_STATUS_TEXT } from '../utils/constants';
import ClearCache from './components/ClearCache';
import PregnancyToolbar from './components/PregnancyToolbar';
import ResetPasswordModal from './components/ResetPasswordModal';
import BuildInfoModal from './components/build-info-modal/build-info-modal';

// websocket services
import protocolCheck, { getChromeVersion } from '@/utils/protocolCheck';
import { LazyAntd, MyIcon } from '@lm_fe/components';
import ReconnectingWebSocket from 'reconnecting-websocket';
import './header.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface IProps {
  collapsed: boolean;
  user?: any;
  location: any;
  history: any;
  socketState?: boolean;
  system?: {
    [propsName: string]: any;
  };
  [propsName: string]: any;
}
interface IState {
  [propsName: string]: any;
}
class Header extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      resetModalVisible: false,
      buildInfoModalVisible: false
    };
  }

  componentDidMount() {
    // 开启websocket
    setTimeout(() => {
      this.initWebsocket();
    }, 2000);
  }

  componentWillReceiveProps(nextProps) {
    const { openWebsocket } = this.props.system.config;
    const nextOpenWebsocket = nextProps.system.config?.openWebsocket;
    let websocketServices = window.websocketServices;
    if (nextOpenWebsocket !== openWebsocket) {
      if (!websocketServices) {
        // 初始化
        this.initWebsocket();
      } else {
        // 重新连接
        if (nextOpenWebsocket) {
          window.websocketServices.reconnect();
        }
        if (!nextOpenWebsocket) {
          window.websocketServices.close();
        }
      }
    }
  }

  initWebsocket = async () => {
    const { user, system, updateSocketState } = this.props;
    const { websocketAddress, openWebsocket } = system.config;
    if (!user.basicInfo?.id) {
      return;
    }
    // 默认不开启websocket
    if (!openWebsocket && user.basicInfo?.id) {
      return updateSocketState(0);
    }
    // 初始化websocket
    const options = {
      connectionTimeout: 10000, // 如果在10s之后没有连接，重试连接
      // maxRetries: 10, // 最大重试次数, 默认Infinity
    };
    const websocketServices = await new ReconnectingWebSocket(websocketAddress, [], options);
    websocketServices.addEventListener('open', (e: any) => {
      const state = e.target.readyState;
      updateSocketState(state);
    });
    // this.websocketServices.addEventListener('message', (e: any) => {
    //   console.log('-----------message ws信息-------------', e.data);
    // });
    websocketServices.addEventListener('error', (e: any) => {
      const state = e.target.readyState;
      updateSocketState(state);
    });
    window.websocketServices = websocketServices;
  };

  onConnectSocket = (event: any) => {
    // 1.打开socket服务
    // window.location.href = 'lmcs://';

    // 2. chrome85以上无效
    const chromeVersion = getChromeVersion();
    if (chromeVersion && chromeVersion > 84) {
      try {
        window.location.href = 'lmcs://';
      } catch (error) {
        console.log('---onConnectSocket error----', error);
      }
      return;
    }
    protocolCheck('lmcs://', function () {
      Modal.confirm({
        title: '未安装插件',
        icon: <MyIcon value='ExclamationCircleOutlined' />,
        content: '检测到您电脑OBIS外设驱动本地客户端未安装 请下载',
        onOk() {
          console.log('下载');
          // window.open('/OBDriver.msi');
          window.location.href = '/assets/OBDriver.msi';
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    });
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  };

  handleLogout = () => {
    const { history, deleteAllTabs } = this.props;

    history.push('/login');
    storage.clearApp();
    deleteAllTabs();
  };

  handleChangeTheme = (theme: string) => {
    this.props.updateTheme(theme);
  };

  render() {
    const { resetModalVisible, buildInfoModalVisible } = this.state;
    const { user, system } = this.props;
    const socketState = system.socketState;
    return (
      <Layout.Header className="global-container-layout_header">
        <div className="global-container-layout_header-left">
          <div className="global-container-layout_header-left-logo">
            <img alt="logo" src={APP_CONFIG.LOGO} />
          </div>
          <span className="global-container-layout_header-left-title">
            {get(system, 'config.systemName') || APP_CONFIG.SYSTEM_NAME}
          </span>
        </div>
        <div className="global-container-layout_header-right">
          <ClearCache />
          <PregnancyToolbar />
          {/* <FixedSearch type="link" title="快速查询" shape="round" size="middle" /> */}
          <Divider type="vertical" className="global-container-layout_header-right-divider" />
          {!isUndefined(get(user, 'basicInfo')) && (
            <Dropdown
              className="global-container-layout_header-right-dropdown"
              overlay={
                <Menu>
                  <Menu.Item>
                    <span>主题 - </span>
                    <Select
                      size="small"
                      showArrow={false}
                      bordered={false}
                      popupMatchSelectWidth={false}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                      onChange={this.handleChangeTheme}
                      value={system.theme}
                      options={colors}
                      className="global-container-layout_header-right-dropdown-select"
                    ></Select>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      this.setState({
                        resetModalVisible: true,
                      });
                    }}
                  >
                    修改密码
                  </Menu.Item>

                  <Menu.Item
                    onClick={() => {
                      this.setState({ buildInfoModalVisible: true })
                    }}
                  >
                    版本信息
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={this.handleLogout}>退出登录</Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <div>
                <div className="global-container-layout_header-right-dropdown-avatar">
                  {get(user, 'basicInfo.imageUrl') || ((get(user, 'basicInfo.firstName') || '') as string).slice(0, 1)}
                </div>
                <span className="global-container-layout_header-right-dropdown-name">
                  {get(user, 'basicInfo.firstName')}
                </span>
              </div>
            </Dropdown>
          )}
          {get(system, 'config.openWebsocket') && (
            <>
              <Divider type="vertical" className="global-container-layout_header-right-divider" />
              <div
                id="socket-state"
                className="global-container-layout_header-right-item"
                onClick={this.onConnectSocket}
              >
                <Tooltip
                  placement="topRight"
                  getPopupContainer={() => document.getElementById('socket-state')}
                  // title={`socket 连接状态 -- ${WEBSOCKET_STATUS_TEXT[socketState]}`}
                  title={
                    <div>
                      OBIS外设驱动--
                      <span style={{ color: ['#d9d9d9', '#52c41a', '#faad14', '#ff4d4f'][socketState] }}>
                        {WEBSOCKET_STATUS_TEXT[socketState]}
                      </span>
                    </div>
                  }
                >
                  <Badge dot status={socketState === WEBSOCKET_STATUS['OPEN'] ? 'success' : 'error'}>
                    <MyIcon value='NodeIndexOutlined' className="global-container-layout_header-right-dropdown-name" />
                  </Badge>
                </Tooltip>
              </div>
            </>
          )}
        </div>
        {resetModalVisible && (
          <ResetPasswordModal
            visible={resetModalVisible}
            primaryKey={get(user, 'basicInfo.login')}
            onCancel={() => {
              this.setState({
                resetModalVisible: false,
              });
            }}
          />
        )}
        {
          buildInfoModalVisible && <BuildInfoModal visible={buildInfoModalVisible} onCancle={() => { this.setState({ buildInfoModalVisible: false }) }} />
        }
      </Layout.Header>
    );
  }
}
export default Header
