import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // ajuste o caminho conforme necessário

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Verifica se o usuário está autenticado

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
