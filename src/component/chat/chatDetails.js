import React, { useState } from 'react';
import { Button, Avatar, Layout, Space, Collapse, Popover } from 'antd';
import { QuestionCircleOutlined, BarsOutlined, TeamOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ChatModal from './chatModal'
import LeaveRoom from './leaveRoom'
import UserCard from './userCard'

const { Sider } = Layout;
const { Panel } = Collapse;

const ChatDetails = props => {
    const [showMenu, setShowMenu] = useState(true);
    const [modal, setModal] = useState(false);
    let { room } = props;

    const leaveRoom = () => setModal(true);

    const customExpandIcon = props => {
        let list = {
            "toggleRoomDetails": <MenuUnfoldOutlined />,
            "roomDetails": <QuestionCircleOutlined />,
            "roomMembers": <TeamOutlined />,
            "roomExtras": <BarsOutlined />, 
        };
        if(props.panelKey === 'toggleRoomDetails') {
            if (props.expanded) {
                return <MenuUnfoldOutlined />
            } else {
                return <MenuFoldOutlined />
            }
        } else {
            return list[props.panelKey]
        }
    }
    const toggleRoomDetails = event => {
        if(!showMenu) return setShowMenu(true)
        if(event.includes('toggleRoomDetails')){
            setShowMenu(!showMenu);
        }
    }



    return (
        <Sider
            style={{ display: ( room._id ? 'block' : 'none' )}}
            width={( showMenu ? 200 : 42)}
            className="room-details hide-scroll"
            trigger={null} 
            collapsible 
            collapsed={!showMenu}>
                <Collapse
                    ghost
                    activeKey={( !showMenu ? [] : ['roomDetails', 'roomMembers', 'roomExtras'] )}
                    // onChange={e => setShowMenu(!showMenu)}
                    onChange={toggleRoomDetails}
                    expandIcon={(props) => customExpandIcon(props)}
                    expandIconPosition={(showMenu ? 'left' : 'right')}
                >

                    <Panel className="room-details__panel-toggleRoomDetails" header={(showMenu ? '' : '')} key="toggleRoomDetails">
                    </Panel>
                    <Panel className="room-details__panel-roomDetails" header={(showMenu ? 'Details' : '')} key="roomDetails">
                        {showMenu && room._id && room.private && (
                            <p>Private message</p>
                        )}
                        {showMenu && room._id && !room.private && (
                            <>
                                <p>Public channel</p>
                                <p>name: {room.name}</p>
                            </>
                        )}
                    </Panel>
                    <Panel className="room-details__panel-roomMembers" header={(showMenu ? 'Members' : '')} key="roomMembers">
                        {showMenu && room._id && room.users.map((user, index) => (
                            <UserCard user={user} key={"roomMembers:" + index} />
                        ))}
                    </Panel>
                    <Panel className="room-details__panel-roomExtras" header={(showMenu ? 'Extra' : '')} key="roomExtras">
                        {showMenu && (
                            <Button type="link" key="roomExtras:1" onClick={setModal}>Leave chat</Button>
                        )}
                    </Panel>
                </Collapse>
                <ChatModal component={LeaveRoom} setModal={setModal} visibility={modal} {...props} />
        </Sider>
    )
}

export default ChatDetails;