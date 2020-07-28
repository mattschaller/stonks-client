import React, { useContext, useState } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { Layout, Menu } from 'antd';
import { NumberOutlined, PlusOutlined, TeamOutlined, MessageOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import ChatModal from './chatModal'
import CreateRoom from './createRoom'
import CreatePrivateRoom from './createPrivateRoom'

const { Sider } = Layout;
const { SubMenu } = Menu;

const ChatNav = (props) => {
    const { auth } = useContext(authContext);
    const [showMenu, setShowMenu] = useState(false);
    const [modal, setModal] = useState({ visibility: false, type: null });

    const [createRoom, setCreateRoom] = useState(false);
    const [createPrivateRoom, setCreatePrivateRoom] = useState(false);

    const { room, getRoom, setRoom, rooms, setRooms, getRooms } = props
    
    return (
        <Sider 
            className="chat__sidebar hide-scroll"
            trigger={null} 
            collapsible 
            collapsed={showMenu}>
            <Menu
                mode="inline"
                theme="dark"
                inlineIndent={'16'}
                style={{ maxHeight: '100%', height: '100%', borderRight: 0 }}
                selectedKeys={[(props.room ? props.room._id : 0)]}
                defaultSelectedKeys={[(props.room ? props.room._id : 0)]}
            >
                <Menu.Item key="sidebar-left_toggle-menu" type="primary" onClick={e => setShowMenu(!showMenu)} style={{ marginBottom: 16 }}>
                    {React.createElement(showMenu ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Menu.Item>
                <SubMenu key="sub1" title="Messages" icon={<MessageOutlined />}>
                    {rooms.length > 0 && rooms.filter(room => room.private).map(room => (
                        <Menu.Item key={room._id} onClick={val => getRoom(room)}>
                            {room.users && room.users.filter(user => user._id !== auth.data.user._id).map(user => user.email).join(" + ")}
                        </Menu.Item>
                    ))}
                    <Menu.Item key="new-messages" className="chat__sidebar-create" onClick={e => setCreatePrivateRoom(true)} icon={<PlusOutlined />}>Send message</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title="Channels" icon={<TeamOutlined />}>
                    {rooms.length > 0 && rooms.filter(room => !room.private).map(room => (
                        <Menu.Item key={room._id} onClick={val => getRoom(room)} icon={<NumberOutlined />}>{room.name}</Menu.Item>
                    ))}
                    <Menu.Item key="new-rooms" className="chat__sidebar-create" onClick={e => setCreateRoom(true)} icon={<PlusOutlined />}>Join channel</Menu.Item>
                </SubMenu >
            </Menu>
            <ChatModal component={CreatePrivateRoom} setModal={setCreatePrivateRoom} setRoom={setRoom} getRooms={getRooms} visibility={createPrivateRoom} />
            <ChatModal component={CreateRoom} setModal={setCreateRoom} setRoom={setRoom} getRooms={getRooms} visibility={createRoom} />
        </Sider>
    )
}


export default ChatNav;