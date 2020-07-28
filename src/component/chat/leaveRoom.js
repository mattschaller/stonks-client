import React, { useContext, useState, useEffect } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { serviceContext } from "../../contexts/ServiceContext";
import { Tag, Tooltip, Avatar, Input, Layout, Alert } from 'antd';

const { Content } = Layout;
const { Search } = Input;


const LeaveRoom = (props) => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    const [result, setResult] = useState("");
    const [notification, setNotification] = useState("");

    let { room, setRoom, getRooms, handleOk, handleCancel, visibility } = props;

    const onSearch = async data => {
        if(data === room.name) {
            let updatedRoom = await service.send("patch", "rooms", room._id, { members: room.members.filter(id => id !== auth.data.user._id) })
            let updatedUser = await service.send("patch", "users", auth.data.user._id, { rooms: auth.data.user.rooms.filter(id => id !== room._id) })
            if(updatedRoom && updatedUser){
                setRoom({});
                getRooms();
                handleOk();
            }
        } 
    }

    useEffect(() => {
        setNotification("");
        setResult("");
    }, [visibility]);

    return (
        <Content className="leave-room">
            <h1>Confirm the channel name "<strong><em>{(room ? room.name : '')}</em></strong>" to leave.</h1>
            <Search
                enterButton="Leave channel"
                placeholder="Confirm the channel name in order to leave."
                value={result}
                onChange={e => setResult(e.target.value)}
                onSearch={onSearch}
                style={{ width: '100%' }} />
                
            {notification !== "" && (
                <Alert className="chat__notification" message={notification} type="warning" />
            )}
        </Content>
    )
}

export default LeaveRoom;