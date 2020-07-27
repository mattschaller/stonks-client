
import React from 'react';
import { Button, Avatar, Space, Popover } from 'antd';

const UserCard = props => {
    const content = (
        <div>
            <Avatar
                size={48}
                src={props.user.avatar}
                alt={props.user.email}
                />
            <p>id: {props.user._id}</p>
            <p>Email: {props.user.email}</p>
            <p>Channels: {props.user.rooms.length}</p>
            <p><Button type="link">Send message.</Button></p>
        </div>
    );
    return (
        <Popover content={content} title={props.user.name} trigger={props.trigger}>
            <Space key={props.user._id} style={{ fontSize: 12, width: '100%' }}>
                <Avatar
                    size={16}
                    src={props.user.avatar}
                    alt={props.user.email}
                    />
                {props.user.email}
            </Space>
        </Popover>
    )
}


export default UserCard;