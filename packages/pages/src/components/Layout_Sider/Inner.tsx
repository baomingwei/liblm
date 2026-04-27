import { Layout, Menu } from 'antd';
import { debounce, get } from 'lodash';
import React, { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { use_provoke } from '@lm_fe/provoke';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { findIdsByChildId, use_perm_tree } from './utils';
export const collapsedWidth = 50;
export const width = 232;

interface IProps {
  collapsed: boolean;
  user?: any;
  tabs?: any;
  location?: any
  history?: any
  updateTabs?: any
}


export default function Layout_Sider_Inner(props: IProps) {
  const { collapsed } = use_provoke(s => s.sys_layout)

  const { permissions_tree, permissions } = use_perm_tree()
  const [activeKey, setActiveKey] = useState('')
  const [openKeys, setOpenKeys] = useState<any[]>([])

  const { location: { pathname }, } = props
  const { history, updateTabs, location } = props;


  useEffect(() => {


    const ids = findIdsByChildId(permissions_tree ?? [], pathname);
    setOpenKeys(ids)
    setActiveKey(pathname)

    return () => {

    }
  }, [pathname])

  async function handleMenuClick(e: any) {
    const { item, key, keyPath } = e
    if (key && key.indexOf('http') !== -1) {
      window.open(key);
      return;
    }
    const menu = permissions[key];
    console.log('click', { e, key, menu })

    updateTabs({
      title: get(menu, 'name'),
      key: get(menu, 'key'),
      path: get(menu, 'key'),
      search: get(location, 'search'),
      closable: true,
    });
    history.push(menu.key);
    setOpenKeys(keyPath)
    setActiveKey(key)
    // (document.getElementById(get(menu, 'key')) as HTMLElement).scrollIntoView();
  };



  function handleOpenChange(keys: string[]) {
    setOpenKeys(keys)
  };

  const handleSync = debounce((ps) => {
    ps.update();
  }, 600)

  if (collapsed) return null
  return (
    <Layout.Sider
      // collapsible
      theme="light"

      collapsed={collapsed}
      trigger={null}
      // width={width}
      collapsedWidth={1}
    // className={styles['layout-sider']}
    >
      <>


        <PerfectScrollbar
          style={{ height: 'calc(100vh - 48px)', overflowY: 'auto' }}
          options={{ suppressScrollX: true }} onSync={handleSync}>
          <Menu
            theme="light"
            mode="inline"
            inlineIndent={12}
            // expandIcon={({ isSubMenu, isOpen }) => {
            //   if (collapsed) {
            //     return <></>;
            //   }
            //   return isOpen ? (
            //     <DownOutlined style={{ fontSize: 12 }} />
            //   ) : (
            //     <RightOutlined style={{ fontSize: 12 }} />

            //   );
            // }}
            selectedKeys={[activeKey]}
            openKeys={openKeys}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
            items={permissions_tree}
          >
            {/* {generateMenus(permissions_tree)} */}
          </Menu>
        </PerfectScrollbar>


        <footer
        // className="sider-footer"
        >
          <div
          //  className="sider-footer-toggle"
          >
            {/* <Button
              type="text"
              size="large"
              icon={cc ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => setcc(!cc)}
            ></Button> */}
          </div>


        </footer>
      </>
    </Layout.Sider>
  );
}

