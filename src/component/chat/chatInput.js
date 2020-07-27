import React, { useContext, useState, useCallback } from 'react';
import { serviceContext } from "../../contexts/ServiceContext";
import { Input, Layout, Space, } from 'antd';
import { SmileOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { authContext } from "../../contexts/AuthContext";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import ChatUpload from './chatUpload'

const { Footer } = Layout;
const { Search } = Input;

const ChatInput = props => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    let { room } = props;
    const [message, setMessage] = useState("");
    const [modal, setModal] = useState(false);
    const [upload, setUpload] = useState(false);

    const sendMessage = async () => {
        console.log('rooms: ', room);
        if(!room._id) {
            return alert('Join a channel first')
        }
        if (message.length) {
            service.send("create", "messages", { text: message, roomId: room._id }).then(setMessage(""))
        }
    }
    
    return (
        <Footer className="chat__submit">
            {upload && (<ChatUpload />)}
            <Search
                placeholder={( !room._id ? 'Join a room to get started.' : 'Say something clever' )}
                enterButton="Send"
                size="large"
                className="chat__submit-btn"
                onChange={e => setMessage(e.target.value)}
                value={message}
                suffix={
                    <Space>
                        <SmileOutlined onClick={e => setModal(!modal)} /> 
                        <PlusCircleOutlined onClick={e => setUpload(!upload)} />
                    </Space>
                }
                onSearch={sendMessage} // {value => setMessage(value)}
            />
                {modal && (
                    <Picker 
                        title='Pick your emoji…'
                        emoji='point_up'
                        className="chat__submit-emoji"
                        onClick={(emoji, event) => setModal(false)}
                        onSelect={emoji => {
                            setMessage(message + emoji.native)
                            setModal(false)
                        }}
                        set='google'
                    />
                )}

        </Footer>
    )
}

export default ChatInput;