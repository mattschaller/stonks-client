import React, { useState, useContext, useEffect } from 'react';
import { Layout, Form, Input, Button, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { GoogleCircleFilled, FacebookFilled, GithubFilled } from '@ant-design/icons';

import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

const REACT_APP_API_PATH = process.env.REACT_APP_API_PATH

const Login = (props) => {
    const { setAuthData, auth } = useContext(authContext);
    const { service } = useContext(serviceContext);
    const [message, setMessage] = useState("");

    const onFinish = data => service.send("create", "authentication", { strategy: 'local', ...data })
        .then(res => setAuthData(res))
        .then(res => props.history.push("/profile") && window.location.reload(false))
        .catch(e => setMessage("Login failed. Please try again."))
        
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not validate email!',
        },
    };

    const oauthToken = props.location.hash.split("=")[1];

    const checkForToken = async () => {
        if(oauthToken && typeof service.send === "function") {
            service.send("create", "authentication", { strategy: 'jwt', accessToken: oauthToken })
                .then(res => setAuthData(res))
                .then(res => props.history.push("/profile"))
                .catch(e => setMessage("Incorrect credentials.  Please try again or try the 'Forgot password' link below."))    
        }
    } 

    useEffect(() => {
        checkForToken()
    }, [props, service]);

    return (
        <Layout style={{ padding: '20px' }}>
            <h1>Login</h1>
            {message && <Alert
                    message={message}
                    type="warning"
                    closable
                />}
            <Form
                name="login"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item hasFeedback name="email" label="Email" rules={[{ required: true, type: 'email'}]}>
                    <Input type="email" id="email" maxLength="256" />
                </Form.Item>
                <Form.Item hasFeedback name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password id="password" maxLength="42" />
                </Form.Item>
                <Form.Item hasFeedback name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="link" href={REACT_APP_API_PATH + "/oauth/github"}>
                        <GithubFilled style={{ fontSize: '64px' }} />
                    </Button>
                    <Button type="link" href={REACT_APP_API_PATH + "/oauth/google"}>
                        <GoogleCircleFilled style={{ fontSize: '64px' }} />
                    </Button>
                    <Button type="link" href={REACT_APP_API_PATH + "/oauth/facebook"}>
                        <FacebookFilled style={{ fontSize: '64px' }} />
                    </Button>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="link">
                        <Link to="/recover">Forgot your password?</Link>
                    </Button>
                    <Button type="link">
                        <Link to="/register">Dont have an account?</Link>
                    </Button>
                </Form.Item>
            </Form>
        </Layout>
    );
}

export default Login;