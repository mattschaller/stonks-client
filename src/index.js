import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/app/app';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './contexts/AuthContext';
import ServiceProvider from './contexts/ServiceContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <ServiceProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ServiceProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
