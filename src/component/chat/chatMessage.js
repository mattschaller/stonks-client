import React from 'react';
import { Tooltip, Avatar } from 'antd';

import moment from 'moment';

const ChatMessage = (props) => {
    let { user, text, createdAt } = props
    return (
        <>
            <div className="chat__message">
                <span className="chat__message-avatar">
                    <Avatar
                        size="small"
                        src={user.avatar}
                        alt={user.email}
                        />
                </span>
                <span className="chat__message-user">{user.email}</span>
                <span className="chat__message-date">
                    <Tooltip title={moment(createdAt).format('dddd, MMMM Do, YYYY h:mm:ss A')}>
                        <span>({moment(createdAt).fromNow()})</span>
                    </Tooltip>
                </span>
                <span className="chat__message-body">{text}</span>
            </div>
        </>

    )
}

export default ChatMessage;