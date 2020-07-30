import React, { useContext, useState, useEffect } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { serviceContext } from "../../contexts/ServiceContext";
import { Tag, Tooltip, Avatar, Input, Layout, Space, Alert } from 'antd';
import { InfoCircleOutlined, NumberOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Search } = Input;


const CreatePrivateRoom = (props) => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    const [notification, setNotification] = useState('');
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    let { handleOk, handleCancel, setModal, type, setRoom, visibility, getRooms } = props;

    const onChange = async => {
        setNotification("");
        if (query === "") return;
        service.send("find", "users", {email: { $search: query }}).then(res => res.data).then(users => users.filter(user => user._id !== auth.data.user._id)).then(setUsers);
    }

    const onSearch = () => {
        console.log(query, users);
        if(query === "") {
            return
        } else if(users.length > 1) {
            setNotification('Too many users found.');
        } else if(users.length === 1) {
            onFinish(users[0])
        } else {
            setNotification('No users.');
        }
    }

    const onFinish = async user => {
        if(user) {
            let rooms = await service.send("find", "rooms", { "$or": [{ members: [auth.data.user._id, user._id] },{ members: [user._id, auth.data.user._id]}], private: true })
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
    
    useEffect(() => {
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
        <h1>{(notification.length ? notification : 'Who do you want to message?')}</h1>

            <Search
                size="large"
                value={query}
                enterButton="Search"
                placeholder="@username"
                onSearch={e => onSearch(query)}
                onChange={e => setQuery(e.target.value)}
                prefix={
                    <Tooltip title='Enter a username to get started.'>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
            />

            {query.length > 3 && users.length > 0 && (
                <div className="chat__create-results" style={{ width: '100%' }}>
                    {users.map(user => (
                        <Tag icon={<Avatar size={16} src={user.avatar} alt={user.email} style={{ marginRight: '4px' }} />} key={user._id} className={(user.email === query.toLowerCase().split(" ").join("-") ? 'match' : '' )}>
                            {user.email}
                        </Tag>
                    ))}
                </div>
            )}
        </Content>
    )
}

export default CreatePrivateRoom;