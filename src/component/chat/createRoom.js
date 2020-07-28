import React, { useContext, useState, useEffect } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { serviceContext } from "../../contexts/ServiceContext";
import { Tag, Tooltip, Avatar, Input, Layout, Space, Alert } from 'antd';
import { InfoCircleOutlined, NumberOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Search } = Input;


const CreateRoom = (props) => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    const [notification, setNotification] = useState("");
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    let { handleOk, handleCancel, setModal, type, setRoom, visibility, getRooms } = props;

    const onChange = async => {
        if (query === "") return;
        if (type === 'new-rooms') {
            service.send("find", "rooms", {name: { $search: query.toLowerCase().split(" ").join("-") }}).then(res => res.data).then(users => users.filter(user => user._id !== auth.data.user._id)).then(setUsers);
        } else {
            service.send("find", "users", {email: { $search: query }}).then(res => res.data).then(users => users.filter(user => user._id !== auth.data.user._id)).then(setUsers);
        }
    }

    const onSearch = () => {
        if(query === "") return
        if(type === 'new-rooms'){
            let directMatch = users.filter(user => user.email === query)
            if(directMatch.length === 1){
                return onFinishRoom(query, users)
            } else {
                return onFinishRoom(query);
            }
        } else {
            if(users.length === 1) {
                return onFinishMessage(users[0])
            }
        }
        return;
    }

    const onFinishMessage = async user => {
        if(user) {
            console.log('user: ', user)
            let rooms = await service.send("find", "rooms", { members: { "$in": [auth.data.user._id, user._id] }, private: true })
            if(rooms.data.length > 0) {
                setRoom(await service.send("get", "rooms", rooms.data[0]._id))
                handleOk();
            } else {
                let room = await service.send("create", "rooms", { private: true, members: [auth.data.user._id, user._id] });
                if (room) {
                    setRoom(room)
                    handleOk();
                } else {
                    return false;
                }
            }
        }
    }
    
    const onFinishRoom = async (query, room) => {
        let name = query.toLowerCase().split(" ").join("-")
        if(room && room.length === 1) {
            console.log('room: ', room);
            console.log('query: ', query);
            room = room[0];
            if(room.members.includes(auth.data.user._id)){
                setRoom(await service.send("get", "rooms", room._id));
                handleOk();
                getRooms()
            } else {
                // User is must be added to channel.
                let user = await service.send("get", "users", auth.data.user._id)
                if(user){
                    let updatedRoom = await service.send("patch", "rooms", room._id, { members: [...room.members, user._id] })
                    let updatedUser = await service.send("patch", "users", user._id, { rooms: [...user.rooms, room._id] })
                    if(updatedRoom && updatedUser) {
                        setRoom(await service.send("get", "rooms", updatedRoom._id))
                        handleOk();
                        getRooms()
                    }
                }
            }
            // Check if user is part of room, if not, add, then return room.
        } else {
            let newRoom = await service.send("create", "rooms", { private: false, name, members: [auth.data.user._id] })
            if(newRoom){
                setNotification(`Channel created: ${newRoom._id}`);
                setRoom(newRoom)
                handleOk();
            }
        }
    }

    useEffect(() => {
        console.log('Modal toggled ', notification)
        setNotification("");
        setQuery("");
        setUsers([])
    }, [visibility]);

    useEffect(() => {
        onChange()
        setUsers([]);
    }, [query]);


    return (
        <Content className="chat__create-results">
            <h1>{ type === 'new-rooms' ? 'Enter a channel name.' : 'Enter a username.' }</h1>

            <Search
                size="large"
                value={query}
                enterButton="Search"
                placeholder={ type === 'new-rooms' ? '#channel-name' : '@username' }
                onSearch={onSearch}
                onChange={e => setQuery(e.target.value)}
                prefix={
                    <Tooltip title={ type === 'new-rooms' ? 'Enter a channel name to get started.' : 'Enter a username to get started.' }>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
            />

            {type === 'new-messages' && query.length > 3 && users.length > 0 && (
                <div className="chat__create-results" style={{ width: '100%' }}>
                    {users.map(user => (
                        <Tag icon={<Avatar size={16} src={user.avatar} alt={user.email} />} key={user._id} className={(user.name === query.toLowerCase().split(" ").join("-") ? 'match' : '' )} onClick={e => setQuery(e.target.innerHTML)}>
                            {user.email}
                        </Tag>
                    ))}
                </div>
            )}
            {type === 'new-rooms' && query.length > 3 && users.length > 0 && (
                <div className="chat__create-results" style={{ width: '100%' }}>
                    {users.filter(user => user._id !== auth.data.user._id).map(user => (
                        <Tag icon={<NumberOutlined/>} key={user._id} className={(user.name === query.toLowerCase().split(" ").join("-") ? 'match' : '' )} onClick={e => setQuery(e.target.innerHTML)}>
                            {user.name}
                        </Tag>
                    ))}
                    
                </div>
            )}
        </Content>
    )
}

export default CreateRoom;