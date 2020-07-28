import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { authContext } from "../../contexts/AuthContext";

const { Header } = Layout;
const { SubMenu } = Menu;

const Nav = () => {
  const { setAuthData, auth } = useContext(authContext);
  const logOut = () => setAuthData(null)
  
  return (
    <Header>
      {/* <div className="logo"></div> */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['main-nav:1']} style={{ float: 'left' }}>
        <Menu.Item key="main-nav:1"><Link to='/'>Home</Link></Menu.Item>
        {!auth.data && <Menu.Item key="main-nav:2"><Link to='/login'>login</Link></Menu.Item>}
        {!auth.data && <Menu.Item key="main-nav:3"><Link to='/register'>register</Link></Menu.Item>}
        
        {/* {auth.data && <Menu.Item key="main-nav:4"><Link to='/stock'>stocks</Link></Menu.Item>}
        {auth.data && <Menu.Item key="main-nav:5"><Link to='/portfolio'>portfolio</Link></Menu.Item>} */}
        {auth.data && <Menu.Item key="main-nav:-6"><Link to='/chat'>chat</Link></Menu.Item>}

        {auth.data && 
          <SubMenu key="main-nav:sub1" icon={<SettingOutlined />} title={auth.data.user.email}>
            <Menu.ItemGroup title="Your profile">
              <Menu.Item key="main-nav:sub1:1"><Link to='/profile'>View Profile</Link></Menu.Item>
              <Menu.Item key="main-nav:sub1:2"><Link to='/' onClick={logOut} >Log Out</Link></Menu.Item>
            </Menu.ItemGroup>
            {/* <Menu.ItemGroup title="main-nav:sub2">
              <Menu.Item key="main-nav:sub2:1">Option 2</Menu.Item>
              <Menu.Item key="main-nav:sub2:2">Option 3</Menu.Item>
              <Menu.Item key="main-nav:sub2:3">Option 4</Menu.Item>
            </Menu.ItemGroup> */}
          </SubMenu>}

      </Menu>
    </Header>
  )
}

export default Nav;