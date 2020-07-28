import React, { useContext, useState, useEffect } from 'react';
import { serviceContext } from "../../contexts/ServiceContext";
import { Empty, Button, Layout } from 'antd';

import ChatMessage from './chatMessage'

const { Content } = Layout;

const ChatMessages = props => {
    const { service  } = useContext(serviceContext);
    const [messages, setMessages] = useState({});
    let { room } = props;

    const retrieveMessages = async room => {
        if(!room._id) return;
        let msg = await service.send("find", "messages", {
                roomId: room._id,
                $limit: 100,
                $sort: {
                    createdAt: 1
                }
            })
            .then(res => res.data).catch(e => console.log(e))

        console.log('messages: ', msg)
        if(msg) {
            setMessages(msg)
        }
    }

    const handleNewMessage = message => {
        if(message.roomId === room._id) {
            retrieveMessages(room)
        }
    }

    useEffect(() => {
        service.socket.removeAllListeners('messages created');
        service.socket.on('messages created', handleNewMessage);
        retrieveMessages(room);
        // getRooms();
        return () => service.socket.removeAllListeners('messages created');
    }, [room]);


    return (
        <Content className="messages hide-scroll">
            {!room._id && (
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                    height: '200px',
                    }}
                    description={
                    <span>
                        No messages. <a href="#S">Click</a> to get started! 🤠 
                    </span>
                    }
                >
                </Empty>
            )}
            {room._id && !messages.length && (<>Nothing do display.  Start talking!</>)}
            {room._id && messages.length > 0 && messages.map(message => (
                    <ChatMessage key={message._id} {...message} />
                ))}
        </Content>

    )
}

export default ChatMessages;