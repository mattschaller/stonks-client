import React, { useContext, useState, useEffect } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { serviceContext } from "../../contexts/ServiceContext";
import { Tag, Tooltip, Avatar, Input, Layout, Space, Alert } from 'antd';
import { InfoCircleOutlined} from '@ant-design/icons';

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
        if(query === "") setNotification('Please enter a value.')
        if (type === 'new-rooms') {
            service.send("find", "rooms", {name: { $search: query.toLowerCase().split(" ").join("-") }}).then(res => res.data).then(setUsers);
        } else {
            service.send("find", "users", {email: { $search: query }}).then(res => res.data).then(setUsers);
        }
    }

    const onSearch = () => {
        if(query === "") return setNotification('Please enter a value.')
        if(type === 'new-rooms'){
            if(users.length > 1) {
                return setNotification('Too many results.')
            } if(users.length === 1){
                return onFinishRoom(query, users)
            }else {
                return onFinishRoom(query); // Create new
            }
        } else {
            if(users.length > 1) {
                return setNotification('Too many results.')
            } else if(users.length === 0) {
                return setNotification('No results.')
            } else {
                onFinishMessage(users)
            }
        }
    }

    const onFinishMessage = async user => {
        if(user) {
            let rooms = await service.send("find", "rooms", { members: { "$in": [auth.data.user._id, user._id] }, private: true })
            if(rooms.data.length > 0) {
                console.log(`Room already exists: `, rooms.data)
                setRoom(await service.send("get", "rooms", rooms.data[0]._id))
                handleOk();
            } else {
                let room = await service.send("create", "rooms", { private: true, members: [auth.data.user._id, user._id] });
                if (room) {
                    console.log(`Room created: `, room)
                    setRoom(room)
                    handleOk();
                } else {
                    setNotification("Something went wrong.") 
                }
            }
        } else {
            setNotification("No user found.") 
        }
    }
    
    const onFinishRoom = async (query, room) => {
        let name = query.toLowerCase().split(" ").join("-")
        if(room && room.length === 1) {
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
            setNotification("Channel doesn't exist.  Lets create it.")
            let newRoom = await service.send("create", "rooms", { private: false, name, members: [auth.data.user._id] })
            if(newRoom){
                setNotification(`Channel created: ${newRoom._id}`);
                setRoom(newRoom)
                handleOk();
            }
        }
    }

    useEffect(() => {
        setQuery("");
    }, [visibility]);

    useEffect(() => {
        onChange()
        //setNotification("");
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


            {type === 'new-messages' && users.length > 0 && (
                <div className="chat__create-results">
                    <Space>
                        {users.length + ' results'} 
                        {users.map(user => (
                            <Tag key={user._id} className={(user.email === query ? 'match' : '' )} onClick={e => setQuery(e.target.innerHTML)}>
                                <Space className={'tag--' + user._id} key={user._id}>
                                    <Avatar
                                        size="small"
                                        src={user.avatar}
                                        alt={user.email}
                                        />
                                    {user.email}
                                </Space>
                            </Tag>
                        ))}
                    </Space>
                </div>
            )}
            {type === 'new-rooms' && users.length > 0 && (
                <div className="chat__create-results">
                    <Space>
                        {users.length + ' results'} 
                        {users.map(user => (
                            <Tag key={user._id} className={(user.name === query.toLowerCase().split(" ").join("-") ? 'match' : '' )} onClick={e => setQuery(e.target.innerHTML)}>
                                <Space className={'tag--' + user._id} key={user._id}>
                                    #{user.name}
                                </Space>
                            </Tag>
                        ))}
                    </Space>
                </div>
            )}

            {notification !== "" && (
                <Alert className="chat__notification" message={notification} type="warning" />
            )}
        </Content>
    )
}

export default CreateRoom;