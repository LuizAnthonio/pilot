import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/index.jsx';
import { Lancar } from './pages/Cadastrar/Lancar.jsx';
import { Detalhado } from './pages/Relatorio/Detalhado.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './contexts/PrivateRoute'; // ajuste o caminho conforme necessário

function App() {
    const { auth, logout, isAuthenticated } = useAuth();
    

    return (
        <>
        
        

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/lancar" element={<PrivateRoute><Lancar /></PrivateRoute>} />
              <Route path="/relatorio" element={<PrivateRoute><Detalhado /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>

                            </>
        
    );
}

export default App;





/*

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/index.jsx';
import { Lancar } from './pages/Cadastrar/Lancar.jsx';
import { Detalhado } from './pages/Relatorio/Detalhado.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './contexts/PrivateRoute'; // ajuste o caminho conforme necessário


function App() {
  const { auth, logout } = useAuth();
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  
  const empresas = [
    { id: '1', nome: 'Empresa A' },
    { id: '2', nome: 'Empresa B' },
    { id: '3', nome: 'Empresa C' }
  ];
  
  let cargo;
  let dadosUser;

  useEffect(() => {
    if (auth) {
      console.log("Usuário logado");
    }
  }, [auth]);

  const handleEmpresaClick = () => {
    setMostrarOpcoes(!mostrarOpcoes);
  };

  const handleSelecionarEmpresa = (empresa) => {
    setEmpresaSelecionada(empresa);
    setMostrarOpcoes(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
  };

  



  let parsedData;
  let data = localStorage.getItem('token');

  if (data) {
    // Apenas analise se 'data' é uma string
    if (typeof data === 'string') {
      data = JSON.parse(data); // Aqui você verifica se data é uma string JSON válida
    } else {
      data = {}; // Define um valor padrão caso não haja dados no localStorage
    }
  } else {
    data = {}; // Define um valor padrão caso não haja dados no localStorage
  }

  if (auth) {
    dadosUser = auth; // Atribua diretamente auth
    cargo = dadosUser.grauH === 0 ? "Desenvolvedor" : dadosUser.grauH === 1 ? "Administrador" : "Integrante";
  } else {
    console.log("Não está logado");
  }

  return (
    <Router>
      <div className="menu">
        <nav className='lista'>
          <ul>
            {!auth && <li><Link to="/login">Login</Link></li>}
            {auth && (
              <>
                <li><Link to="/">Painel</Link></li>
                <li><Link to="/relatorio">Relatório</Link></li>
                <li><Link to="/lancar">Lançar</Link></li>
                <li><p onClick={logout}>Sair</p></li>
              </>
            )}
          </ul>
        </nav>

        {auth && (
          <div className="header-menu">
            <div className="perfil">
              <div className="foto"></div>
              <div className="dados-perfil">
                <p>Nome</p>
                <h4 className='sub-title'>{dadosUser?.nome}</h4>
                <p>{cargo}</p>
              </div>
            </div>

            <div className="dados-perfil perfil-empresa">
              <p>Conta da Empresa</p>
              <h4 
                style={{ cursor: 'pointer' }} 
                className='sub-title' 
                onClick={handleEmpresaClick}
              >
                {empresaSelecionada ? empresaSelecionada.nome : "Selecionar Empresa"}
              </h4>
            </div>
          </div>
        )}

        <div className="lista-select">
          {mostrarOpcoes && (
            <div className="lista-empresas">
              {empresas.map((empresa) => (
                <p
                  key={empresa.id}
                  onClick={() => handleSelecionarEmpresa(empresa)}
                  style={{ cursor: 'pointer', margin: '5px 0', color: '#ffff' }}
                >
                  {empresa.nome}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/lancar" element={<PrivateRoute element={<Lancar />} auth={auth} />} />
        <Route path="/relatorio" element={<PrivateRoute element={<Detalhado />} auth={auth} />} />
        <PrivateRoute path="/">
                        <Dashboard />
        </PrivateRoute>
      </Routes>

    </Router>
  );
}


export default App;


*/



/*
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import { useNavigate } from 'react-router-dom';
import './index.css'
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/index.jsx';
import { Lancar } from './pages/Cadastrar/Lancar.jsx';
import { Detalhado } from './pages/Relatorio/Detalhado.jsx';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  const { auth, logout } = useAuth();
  //const [aunte,setAuth] = useState(false)
  //const [count, setCount] = useState(0)

 // let auth = localStorage.getItem('token');
  //const navigate = useNavigate();
  let cargo;
  let dadosUser;


  useEffect(() => {
    // Verifica o auth sempre que ele muda
    if (auth) {
      setAuth(auth)
      //navigate("/login");
    }
  }, [auth]);

  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [empresas] = useState([
    { id: '1', nome: 'Empresa A' },
    { id: '2', nome: 'Empresa B' },
    { id: '3', nome: 'Empresa C' },
  ]);
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

  const handleEmpresaClick = () => {
    setMostrarOpcoes(!mostrarOpcoes);
  };

  const heandleLogout = () => {
    //alert("saindo")
    localStorage.removeItem("token")

    //window.location.href("/login")
   
  }

  const handleSelecionarEmpresa = (empresa) => {
    setEmpresaSelecionada(empresa);
    setMostrarOpcoes(false);
  };

  

    if (!auth) {
      //navigate('/login');
     console.log("não tá logado")
    }else{

      dadosUser = JSON.parse(auth)
  
      if(dadosUser.grauH == 0 ){
        cargo = "Desenvolvedor"
      }else if(dadosUser.grauH == 1){
        cargo = "Administrador"
      }else{
        cargo = "Integrante"
      }

    }

    console.log("authhh",auth)

  return (
    

    
<Router>

    <div className="menu">
      <nav className='lista'>
        <ul>
          <AuthProvider>

          {!auth && <li><Link to="/login">Login</Link></li>}
          {auth && (
            <>
            <li><Link to="/">Painel</Link></li>
            <li><Link to="/relatorio">Relatorio</Link></li>
            <li><Link to="/lancar">Lançar</Link></li>
            <li><p  onClick={heandleLogout}>Sair</p></li>
            </>

)}
            
</AuthProvider>
            
         
        </ul>
      </nav>


      {aunte && (

      <div className="header-menu">
      

      <div className="perfil">
        <div className="foto"></div>
        <div className="dados-perfil">
          <p>nome</p>
          <h4 className='sub-title'>{dadosUser.nome}</h4>
          <p>{cargo}</p>
        </div>
      </div>

    
    
              <div className="dados-perfil perfil-empresa">
                  <p>Conta da Empresa</p>
                  <h4 style={{ cursor: 'pointer'}} className='sub-title' onClick={handleEmpresaClick} > {empresaSelecionada ? empresaSelecionada.nome : "Selecionar Empresa"}</h4>
                </div>
      

      </div>



)}
</div>

<div className="lista-select">
{mostrarOpcoes && (
  <div className="lista-empresas">
    {empresas.map((empresa) => (
      <p
        key={empresa.id}
        onClick={() => handleSelecionarEmpresa(empresa)}
        style={{ cursor: 'pointer', margin: '5px 0', color: '#ffff' }}
      >
        {empresa.nome}
      </p>
    ))}
  </div>
)}
          <br /> 

</div>

          <br /> 
          <br /> 


      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lancar" element={<Lancar />} />
        <Route path="/relatorio" element={<Detalhado />} />
        
      </Routes>
    </Router>

  


    


  )
}

export default App
*/