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
    const [rooms, setRooms] = useState([]);

    let { handleOk, handleCancel, setModal, type, setRoom, visibility, getRooms } = props;

    const onChange = async => {
        setNotification("")
        if (query === "") return;
        service.send("find", "rooms", { name: { $search: query.toLowerCase().split(" ").join("-") }}).then(res => res.data).then(setRooms);
    }

    const onSearch = async () => {
        console.log(query, rooms);
        if(query === "") return;
        let queryString = query.toLowerCase().split(" ").join("-")
        if(queryString[0] === '#') queryString = queryString.substr(1);
        let directMatch = rooms.filter(room => room.name === queryString)
        if(directMatch.length === 1){
            directMatch = directMatch[0]
            if(directMatch.members.includes(auth.data.user._id)){
                setRoom(await service.send("get", "rooms", directMatch._id));
                handleOk();
                getRooms()
            } else {
                let user = await service.send("get", "users", auth.data.user._id)
                if(user){
                    let updatedRoom = await service.send("patch", "rooms", directMatch._id, { members: [...directMatch.members, user._id] })
                    let updatedUser = await service.send("patch", "users", user._id, { rooms: [...user.rooms, directMatch._id] })
                    if(updatedRoom && updatedUser) {
                        setRoom(await service.send("get", "rooms", updatedRoom._id))
                        handleOk();
                        getRooms()
                    }
                }
            }
        } else {
            console.log('error')
            let newRoom = await service.send("create", "rooms", { private: false, name: queryString, members: [auth.data.user._id] })
            if(newRoom){
                setRoom(newRoom)
                handleOk();
            }
        }
    }


    useEffect(() => {
        setNotification("");
        setQuery("");
        setRooms([])
    }, [visibility]);

    useEffect(() => {
        onChange()
        setRooms([]);
    }, [query]);


    return (
        <Content className="chat__create-results">
        <h1>{(notification.length ? notification : 'Enter a channel name.')}</h1>

            <Search
                size="large"
                value={query}
                enterButton="Search"
                placeholder='#channel-name'
                onSearch={onSearch}
                onChange={e => setQuery(e.target.value)}
                prefix={
                    <Tooltip title='Enter a channel name to get started.'>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
            />

            {query.length > 3 && rooms.length > 0 && (
                <div className="chat__create-results" style={{ width: '100%' }}>
                    {rooms.filter(user => user._id !== auth.data.user._id).map(user => (
                        <Tag icon={<NumberOutlined/>} key={user._id} className={(user.name === query.toLowerCase().split(" ").join("-") ? 'match' : '' )} >
                            {user.name}
                        </Tag>
                    ))}
                    
                </div>
            )}
        </Content>
    )
}

export default CreateRoom;