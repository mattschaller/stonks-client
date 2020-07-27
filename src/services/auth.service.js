
import axios from "axios";
import { Component } from 'react';

class AuthService extends Component {
    login = (email, password) => axios.post('/authentication', { email, password, strategy: 'local' })
            .then(res => res.data);
            
    loginByToken = accessToken => axios.post('/authentication', { strategy: 'jwt', accessToken })
            .then(res => res.data);

    register = opts => axios.post('/users', opts)
            .then(res => res.data);

    getCurrentUser = () => localStorage.getItem('token');
    getToken = () => localStorage.getItem('token');
    getCurrentProfile = () => JSON.parse(localStorage.getItem('profile'));
}

export default new AuthService();
