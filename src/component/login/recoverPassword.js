import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not validate email!',
    },
};

const RecoverPassword = () => {
    const [message, setMessage] = useState("");
    const onFinish = data => setMessage("If an account exists with this email, a password reset has been sent.  Please check your email for the reset link.");
    return (
        <>
            <h1>Recover Password</h1>
            {message && <Alert
                        message={message}
                        type="warning"
                        closable
                    />}
            <Form
                name="recoverPassword"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item hasFeedback name="email" label="Email" rules={[{ required: true, type: 'email'}]}>
                    <Input type="email" id="email" maxLength="256" />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
};

export default RecoverPassword;