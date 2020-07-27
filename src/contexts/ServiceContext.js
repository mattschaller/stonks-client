import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from "axios";
export const serviceContext = createContext({});

const AuthHeader = () => {
    let data = JSON.parse(window.localStorage.getItem('authData'));
    if (data && data.accessToken) {
        return { Authorization: `Bearer ${data.accessToken}` };
    } else {
        return {};
    }
}
const REACT_APP_API_PATH = process.env.REACT_APP_API_PATH
const config = {
    headers: AuthHeader()
}

const ServiceProvider = ({ children }) => {
    const [service, setService] = useState({ loading: true, socket: null, send: null });
    let socket;

    const send = (action, servicePath, payload, payload2) => {
        if(!socket && !socket.connected) {
            let { _id, ...body } = payload;
            let params = "?" + Object.keys(payload).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`).join('&');
            if(action === "find") return axios.get(servicePath + params, config).then(res => res.data)
            if(action === "create") return axios.post(servicePath, payload, config).then(res => res.data)
            if(action === "get") return axios.get([servicePath, payload].join("/"), config).then(res => res.data)
            if(action === "update") return axios.update([servicePath, _id].join("/"), payload2, config).then(res => res.data)
            if(action === "delete") return axios.delete([servicePath, _id].join("/"), body, config).then(res => res.data)
            return "something went wrong"
        } else {
            let fn = (res, rej) => socket.emit(action, servicePath, payload, (err, data) => (err ? rej(err) : res(data)));
            if(action === "update") fn = (res, rej) => socket.emit(action, servicePath, payload, payload2, (err, data) => (err ? rej(err) : res(data)));
            if(action === "patch") fn = (res, rej) => socket.emit(action, servicePath, payload, payload2, (err, data) => (err ? rej(err) : res(data)));
            return new Promise(fn)
        }
    };

    useEffect(() => {

        const opts = {
            transports: ['websocket'],
            reconnection: true,             // whether to reconnect automatically
            reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
            reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
            reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
            randomizationFactor: 0.5
        }
        socket = io(REACT_APP_API_PATH, opts);
        socket.on("connect", () => {
            let data = JSON.parse(window.localStorage.getItem('authData'));
            if(data) socket.emit("create", "authentication", { strategy: 'jwt', accessToken: data.accessToken }) // , (err, data) => console.log(err, data)
        });

        //
        setService({ loading: false, socket: socket, send });
        return () => socket.disconnect();
    }, []);


  return (
    <serviceContext.Provider value={{ service }}>
      {children}
    </serviceContext.Provider>
  );
};

export default ServiceProvider;