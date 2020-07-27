import React from 'react';
import { Layout, Space } from 'antd';

const { Header } = Layout;

const ChatHeader = props => {
    let { room } = props;
    return (
        <>
            {room._id && !room.private && (
                <Header>
                    <Space>
                        <strong>#{room.name}</strong>
                    </Space>
                </Header>
            )} 
        </>

    )
}

export default ChatHeader;