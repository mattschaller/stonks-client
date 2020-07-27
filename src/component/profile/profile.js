import React, { Component, useContext, useState, useEffect } from 'react';
import { Avatar, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

const Profile = () => {

    const { auth } = useContext(authContext);
    const { service } = useContext(serviceContext);
    const [profile, setProfile] = useState({});
    const userId = auth.data.user._id
    
    const getProfile = async () => {
        let profile = await service.send("get", "users", userId)
        setProfile(profile)
    }
    const updatePassword = async data => console.log(data);

    useEffect(() => {
        getProfile()
    }, [auth]);

    return (
        <>
            <h1>My profile</h1>
            <Avatar src={profile.avatar} icon={<UserOutlined />} />
        
            <h1>Connect</h1>
            <Button href={"http://localhost:3030/oauth/github?feathers_token=" + auth.data.accessToken} type="link">Github</Button>
            <Button href={"http://localhost:3030/oauth/facebook?feathers_token=" + auth.data.accessToken} type="link">facebook</Button>
            <Button href={"http://localhost:3030/oauth/google?feathers_token=" + auth.data.accessToken} type="link">google</Button>
                
            <h2>Change password</h2>
            <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={updatePassword}
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

export default Profile;