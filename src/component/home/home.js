import React, { useContext } from 'react';
import { authContext } from "../../contexts/AuthContext";

const Home = () => {
    const { setAuthData, auth } = useContext(authContext);
    const onLogOut = () => {
        setAuthData(null); // Clears context;
    }
    return (
        <div>{`Hello, ${auth.data}`}</div>
    )
};

export default Home;