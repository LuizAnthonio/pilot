import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('token')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Atualiza o estado de autenticação ao carregar o componente
        setIsAuthenticated(!!auth);
    }, [auth]);

    useEffect(() => {
        if (auth) {
            localStorage.setItem('token', JSON.stringify(auth));
        } else {
            localStorage.removeItem('token');
        }
    }, [auth]);

    const login = (userData) => {
        setAuth(userData);
        setIsAuthenticated(true);
        navigate('/'); // Redireciona para o Dashboard após o login
    };

    const logout = () => {
        setAuth(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        navigate('/login'); // Redireciona para a página de login após logout
    };

    return (
        <AuthContext.Provider value={{ auth, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



/*
import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
/*
    const PrivateRoute = ({ element, auth }) => {
        return auth ? element : <Navigate to="/login" />;
    };
    */
   /*

    useEffect(() => {
        // Aqui você pode verificar a autenticação (ex: checar um token no localStorage)
        const token = localStorage.getItem('token'); // exemplo
        if (token) {
            setIsAuthenticated(true); // Se um token existir, considere que o usuário está autenticado
        }
    }, []);

    useEffect(() => {
        if (auth) {
            localStorage.setItem('token', JSON.stringify(auth));
        } else {
            localStorage.removeItem('token');
        }
    }, [auth]);

    const navigate = useNavigate();
  
    const handleLogin = async () => {
    // Lógica de login aqui
    // Supondo que você tenha uma função de autenticação que retorna o usuário autenticado
    const user = await authenticateUser(username, password);
    
    if (user) {
      setAuth(user); // Atualiza o contexto de autenticação
      navigate('/'); // Redireciona para o Dashboard
    } else {
      // Trate falhas de login aqui
    }
}

    const login = (userData) => {

        setAuth(userData)
        localStorage.setItem('token', JSON.stringify(userData));

        
    };
    const logout = () => setAuth(null);
/*
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
   return (
       <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
           {children}
       </AuthContext.Provider>
   );
};
export const useAuth = () => useContext(AuthContext);

*/