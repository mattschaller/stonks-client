import React, { useContext } from 'react';
import { Layout } from 'antd';

import ChatHeader from './chatHeader'
import ChatMessages from './chatMessages'
import ChatDetails from './chatDetails'
import ChatInput from './chatInput'

const ChatWindow = (props) => {
    const { room } = props
    return (
        <Layout className="chat__main">
            <Layout>
                <Layout>
                    <ChatHeader room={room}/>
                    <ChatMessages room={room} />
                </Layout>
                <ChatDetails {...props} />
            </Layout>
            <ChatInput room={room} />
        </Layout>
    )
}

export default ChatWindow;