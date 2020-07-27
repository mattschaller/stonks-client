import React, { useContext, useState, useEffect } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { serviceContext } from "../../contexts/ServiceContext";
import { Layout } from 'antd';

import ChatNav from "./chatNav";
import ChatWindow from "./chatWindow";

import './chat.css';

const Chat = () => {
    const { auth } = useContext(authContext);
    const { service  } = useContext(serviceContext);
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState({});

    const getRoomsByUser = async user => setRooms(await Promise.all(user.rooms.map(room => service.send("get", "rooms", room))))

    const getRoom = async room => setRoom(await service.send("get", "rooms", room._id))
    const getRooms = async () => service.send("find", "rooms", { members: { "$in": [auth.data.user._id] } })
        .then(rooms => setRooms(rooms.data))

    const handleNewRoom = room => {
        console.log('handling new rooms');
        return getRooms()
    }
    const handleRoomsPatch = room => {
        console.log('handling new rooms');
        return getRooms()
    }
    useEffect(() => {
        service.socket.on('users patched', getRoomsByUser);
        return () => service.socket.removeAllListeners('rooms patched');
    }, [auth]);

    useEffect(() => {
        service.socket.on('rooms patched', getRoom);
        return () => service.socket.removeAllListeners('rooms patched');
    }, [room]);

    useEffect(() => {
        service.socket.on('rooms created', handleNewRoom);
        getRooms();
        return () => service.socket.removeAllListeners('rooms created');
    }, []);

    return (
        <Layout className="chat">
            <ChatNav room={room} getRoom={getRoom} setRoom={setRoom} rooms={rooms} getRooms={getRooms} setRooms={setRooms} />
            <ChatWindow room={room} getRooms={getRooms} setRoom={setRoom} />
        </Layout>
    )
};

export default Chat;