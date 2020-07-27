import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom'
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { auth } = useContext(authContext);
    const { service } = useContext(serviceContext);

    if (auth.loading || service.loading) {
        return (
        <Route
            {...rest}
            render={() => {
            return <p>Loading...</p>;
            }}
        />
        );
    }

    return (
        <Route
        {...rest}
        render={(routeProps) => {
            return auth.data ? (
            <Component {...routeProps} />
            ) : (
            <Redirect to="/login" />
            )
        }} />
    );
}

export default ProtectedRoute;