import React, { useState, useContext } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Layout, Form, Input, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

const RECAPTCHA_V2_SITE_KEY = process.env.RECAPTCHA_V2_SITE_KEY

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not validate email!',
    },
};

const Register = (props) => {
    const { setAuthData } = useContext(authContext);
    const { service } = useContext(serviceContext);
    const [message, setMessage] = useState("");

    const onFinish = data => service.send("create", "users", data)
        .then(res => service.send("create", "authentication", { strategy: 'local', email: data.email, password: data.password }))
        .then(res => setAuthData(res))
        .then(res => props.history.push("/profile"))
        .catch(e => setMessage("Username already exists"))

    const onChange = () => setMessage("");

    return (
        <Layout style={{ padding: '20px' }}>
            {message}
            <h1>Register</h1>
                    {message && <Alert
                        message={message}
                        type="warning"
                        closable
                    />}
            <Form 
                name="register" 
                onFinish={onFinish}
                onChange={onChange}
                validateMessages={validateMessages}
            >
                <Form.Item hasFeedback name="email" label="Email" rules={[{ required: true, type: 'email'}]}>
                    <Input type="email" id="email" maxLength="20" />
                </Form.Item>
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
                <Form.Item name="recaptcha" label="Recaptcha" rules={[{ required: true }]}>
                    <ReCAPTCHA
                        id="recaptcha"
                        sitekey={RECAPTCHA_V2_SITE_KEY}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button block type="link">
                        <Link to="/login">Already have an account? Login here.</Link>
                    </Button>
                </Form.Item>
            </Form>
        </Layout>
    );
}

export default Register;