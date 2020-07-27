import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not validate email!',
    },
};


const ResetPassword = () => {
    const [message, setMessage] = useState("");
    const onFinish = data => setMessage("Made you look!")
    return (
        <>
            <h1>Reset Password</h1>
            {message}
            <Form
                name="recoverPassword"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item hasFeedback name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password id="password" maxLength="20" />
                </Form.Item>
                <Form.Item 
                    dependencies={['password']} 
                    name="password2" 
                    label="Confirm password"
                    hasFeedback
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password id="password2" maxLength="20" />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}


export default ResetPassword;