import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import './app.css';
import Login from '../login/login';
import RecoverPassword from '../login/recoverPassword';
import ResetPassword from '../login/resetPassword';
import Register from '../register/register';
import Nav from '../nav/nav';
import Home from '../home/home';
import Profile from '../profile/profile';
import Portfolio from '../portfolio/portfolio';
import ProtectedRoute from '../protectedRoute/protectedRoute';
import Stock from '../stock/stock';
import Chat from '../chat/chat';


const { Content } = Layout;

const App = () => {
    return (
        <Layout style={{height:"100vh"}}>
            <Nav />
            <Content>
                <Switch>
                    <Route exact path='/' component={Home} /> 
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/recover' component={RecoverPassword} />
                    <Route path='/recover/:token' component={ResetPassword} />
                    <Route exact path='/register' component={Register} />
                    <ProtectedRoute exact path='/stock' component={Stock} /> 
                    <ProtectedRoute path='/stock/:symbol' component={Stock} /> 
                    <ProtectedRoute path='/portfolio' component={Portfolio} /> 
                    <ProtectedRoute path='/profile' component={Profile} /> 
                    <ProtectedRoute path='/chat' component={Chat} /> 
                </Switch>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>©2020 Matthew Schaller</Footer> */}
        </Layout>
    );
}

export default App;