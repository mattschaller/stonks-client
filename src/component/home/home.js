import React, { useContext } from 'react';
import { authContext } from "../../contexts/AuthContext";
import { Empty, Button, Layout } from 'antd';

const Home = () => {
    const { setAuthData, auth } = useContext(authContext);
    const onLogOut = () => {
        setAuthData(null); // Clears context;
    }
    return (
        <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
            height: '200px',
            }}
            description={
            <span>
                So empty. 🤠 
            </span>
            }
        >
        </Empty>
    )
};

export default Home;