import React, { useContext, useState, useEffect } from 'react';
import { Layout, Space, Avatar, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';
const { Content, Footer } = Layout


const REACT_APP_API_PATH = process.env.REACT_APP_API_PATH

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
        <Layout style={{ padding: '20px' }}>
            <h1>My profile</h1>
            <Content>
                <Space>
                    <Avatar src={profile.avatar} icon={<UserOutlined />} />
                    <Button href={REACT_APP_API_PATH + "/oauth/github?feathers_token=" + auth.data.accessToken} type="link">Github</Button>
                    <Button href={REACT_APP_API_PATH + "/oauth/facebook?feathers_token=" + auth.data.accessToken} type="link">facebook</Button>
                    <Button href={REACT_APP_API_PATH + "/oauth/google?feathers_token=" + auth.data.accessToken} type="link">google</Button>
                </Space>
            </Content>
            <Footer>
                <h2>Change password</h2>
                <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={updatePassword}
                >
                    <Form.Item hasFeedback name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password id="password" maxLength="20" size="large" />
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
                        <Input.Password id="password2" maxLength="20"  size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit"  size="large" style={{ marginLeft: '240px'}}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Footer>

        </Layout>
    )
}

export default Profile;