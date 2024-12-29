// index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Seu componente principal
import { AuthProvider } from './contexts/AuthContext'; // Seu contexto de autenticação
import { Header } from './header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>

        <AuthProvider>
          
          <Header/>
            <App />
        </AuthProvider>
    </Router>
);



/*



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Se você estiver usando um contexto

const root = ReactDOM.createRoot(document.getElementById('root')); // Seleciona o elemento root no HTML
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.jsx'
import Root from './App.jsx'
//import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
*/