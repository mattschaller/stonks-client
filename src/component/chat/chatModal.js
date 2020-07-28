import React from 'react';
import { Modal } from 'antd';

const ChatModal = ({ component: Component, ...props }) => {
    const handleOk = () => props.setModal(false)
    const handleCancel = handleOk;
    return (
        <Modal
            visible={props.visibility}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            className="chat__modal"
        >
            <Component handleOk={handleOk} handleCancel={handleCancel} {...props}/>
        </Modal>
    )
}

export default ChatModal;