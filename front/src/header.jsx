
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


export function Header(){
    const { auth, logout, isAuthenticated } = useAuth();
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [empresas,setEmpresas] = useState([])

    console.log("AUTH DO DASH",auth)
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:3000/empresas");
                const data = await response.json();
                const newData = data.map(e => ({id:e._id,nomeEmpresa:e.nomeEmpresa}))
                console.log("empresas", newData);
                setEmpresas(data);  // Armazena os dados diretamente no estado
                localStorage.setItem("empresas", JSON.stringify(newData));
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }

        console.log('Cookies antes da requisição:', document.cookie);



    
        if(auth){

            if(auth.grauH < 2){
                fetchData();
                console.log("Empresa selcioanada pelo chefe é ",empresaSelecionada)
    
            }else{
                setEmpresaSelecionada(`${auth.business}`)
                console.log("consulta pelo id qual empresa é",empresaSelecionada)
                
            }
        }



    }, []);

      //setEmpresas(JSON.parse(dadoEmp))

      useEffect(() => {
          console.log("Empresa selec",empresaSelecionada)
          //let novoToken = auth.business = empresaSelecionada

          localStorage.setItem("empresaSelec",JSON.stringify(empresaSelecionada))
          console.log("MUdado")

      },[empresaSelecionada])


    

    let cargo;
    

    useEffect(() => {
        if (auth) {
            console.log("Usuário logado",auth);

        }
    }, [auth]);

    const handleEmpresaClick = () => {
        if(auth.grauH < 2){
            setMostrarOpcoes(!mostrarOpcoes);
            
        }
    };

    const handleSelecionarEmpresa = (empresa) => {


        setEmpresaSelecionada(empresa);
        setMostrarOpcoes(false);
        console.log("selected Empresa ",empresa)
    };

    if(auth){
        if(auth.grauH == 0 ){
            cargo = "Desenvolvedor"
          }else if(auth.grauH == 1){
            cargo = "Administrador"
          }else{
            cargo = "Integrante"
          }

    }

    return(
        
        <div className="menu">
        <nav className='lista'>
            <ul>
                {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
                {isAuthenticated && (
                    <>
                        <li><Link to="/">Painel</Link></li>
                        <li><Link to="/relatorio">Relatório</Link></li>
                        <li><Link to="/lancar">Lançar</Link></li>
                        <li><p className='BtnSair' onClick={logout}>Sair</p></li>
                    </>
                )}
            </ul>
        </nav>
        {isAuthenticated && (
            <div className="header-menu">
                <div className="perfil">
                    <div className="foto"></div>
                    <div className="dados-perfil">
                        <p>Nome</p>
                        <h4 className='sub-title'>{auth.nome}</h4>
                        <p>{cargo}</p>
                    </div>
                </div>


            </div>
        )}


   

    </div>
    )

}