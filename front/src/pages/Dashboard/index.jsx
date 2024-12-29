import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./index.css";

// Registrar componentes para o gráfico
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Dashboard() {
  const navigate = useNavigate();
  const [empresaSelecionada, setEmpresaSelecionada] = useState("Empresa 1");
  const [empresas,setEmpresas] = useState([])
  const [dados,setDados] = useState([])
  const { auth, logout, isAuthenticated } = useAuth();


  useEffect(() => {

    async function consulta() {
      const response = await fetch("http://localhost:3000/empresas")
      const data = await response.json()
      const newData = data.map(e => e.nomeEmpresa)
    
      setEmpresas(newData)
    }

  

    

    consulta()


    
  },[])


  useEffect(() => {
    
    console.log("DADOS",{
      id: auth.id,
      empresa: auth.business,
      permissao:auth.grauH
      
    })

    console.log("dados do auth",auth)
    
    async function consultaDados() {
      try {
       
  
        const response = await fetch("http://localhost:3000/empresa/lanca", {
          method: "POST",
          credentials: "include",
          body:JSON.stringify({
            dados:{
              id: auth.id,
              empresa: auth.business._id,
              permissao:auth.grauH

            }
          }),
          headers: {
            
            
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        console.log("os dados de retorno",data)
        
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
  
    consultaDados();
    console.log("dos dados",dados)
    

    //setEscolhida(JSON.parse(localStorage.getItem("empresaSelec")))
    //console.log("o selec empresa import",empresaEscolhida)
    
  },[])

 
  //const empresas = ["Empresa A", "Empresa B", "Empresa C", "Empresa D"];

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai"];
  const ano = new Date().getFullYear();

  // Simulação de dados
  /*
  const dados = [
    { titulo: "Produto A", empresa: "Empresa 1", valor: "R$ 100,00", tipo: "Despesa" },
    { titulo: "Produto B", empresa: "Empresa 1", valor: "R$ 200,00", tipo: "Despesa" },
    { titulo: "Produto C", empresa: "Empresa 2", valor: "R$ 150,00", tipo: "Franquia" },
    { titulo: "Produto D", empresa: "Empresa 2", valor: "R$ 250,00", tipo: "Despesa" },
    { titulo: "Produto E", empresa: "Empresa 1", valor: "R$ 300,00", tipo: "Receita" },
  ];*/

  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (!auth) {
      navigate("/login");
      console.log("não tá logado");
    }
  }, [navigate]);

  // Função para converter string de valor em número
  console.log("empresa que foi selecionado",empresaSelecionada)
  const extrairValorNumerico = (valor) =>
    parseFloat(valor);

  // Filtrar dados pela empresa selecionada
  const dadosFiltrados = dados.filter((item) => item.empresa.nomeEmpresa === empresaSelecionada);

  console.log("os dados filtrados",dadosFiltrados)
  // Organizar dados por tipo
  const totaisPorTipo = dadosFiltrados.reduce(
    (acc, item) => {
      const valor = extrairValorNumerico(item.valor);
      acc[item.tipo] = (acc[item.tipo] || 0) + valor;
      return acc;
    },
    { Franquia: 0, Receita: 0, Despesa: 0 }
  );

  const { Franquia, Receita, Despesa } = totaisPorTipo;

  // Calcular saldo e lucro
  const saldo = Receita + Franquia - Despesa;
  const lucro = Receita - Despesa;

  // Preparar dados para o gráfico
  const tipos = [...new Set(dadosFiltrados.map((e) => e.tipo))];
  const cores = ["rgba(0, 168, 0, 0.8)", "rgba(233, 98, 0, 0.8)", "rgba(72, 164, 0, 0.8)"];
  const datasets = tipos.map((tipo, index) => ({
    label: tipo,
    data: dadosFiltrados
      .filter((item) => item.tipo === tipo)
      .map((item) => extrairValorNumerico(item.valor)),
    borderColor: cores[index],
    backgroundColor: cores[index],
  }));

  const data = {
    labels: meses.map((mes) => `${mes}/${ano}`),
    datasets,
  };

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  return (
    <section>
      <h1 className="title">Painel</h1>

      {/* Dropdown para seleção de empresa */}

      {auth.grauH < 2 && (

      <div className="empresa-select">
        <label htmlFor="empresa">Selecione a Empresa:</label>
        <select className="input"
          id="empresa"
          value={empresaSelecionada}
          onChange={(e) => setEmpresaSelecionada(e.target.value)}
        >
          {empresas.map((empresa) => (
            <option key={empresa} value={empresa}>
              {empresa}
            </option>
          ))}
        </select>
      </div>

      )}


      <Bar data={data} className="grafico" />

      {/* Painel com dados financeiros */}
      <div className="container-box">
        <div className="box-content">
          <div className="box-1">
            <p>FRANQUIA REAL</p>
            <h2>{formatarMoeda(Franquia)}</h2>
          </div>
          <div className="box-1">
            <p>Receita Real</p>
            <h2>{formatarMoeda(Receita)}</h2>
          </div>
          <div className="box-1">
            <p>DESPE. MENSAL REAL</p>
            <h2>{formatarMoeda(Despesa)}</h2>
          </div>
        </div>
        <div className="box-content">
          <div className="box-2">
            <p>Saldo Real</p>
            <h2>{formatarMoeda(saldo)}</h2>
          </div>
          <div className="box-2">
            <p>Lucro Real</p>
            <h2>{formatarMoeda(lucro)}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}


/*
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./index.css";

// Registrar componentes para o gráfico
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Dashboard() {
  const navigate = useNavigate();
  const [empresaSelecionada, setEmpresaSelecionada] = useState("Empresa A");
  const empresas = ["Empresa A", "Empresa B", "Empresa C", "Empresa D"];

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai"];
  const ano = new Date().getFullYear();

  // Simulação de dados
  const dados = [
    { titulo: "Produto A", empresa: "Empresa A", valor: "R$ 100,00", tipo: "Despesa" },
    { titulo: "Produto B", empresa: "Empresa B", valor: "R$ 200,00", tipo: "Despesa" },
    { titulo: "Produto C", empresa: "Empresa A", valor: "R$ 150,00", tipo: "Franquia" },
    { titulo: "Produto D", empresa: "Empresa C", valor: "R$ 250,00", tipo: "Despesa" },
    { titulo: "Produto E", empresa: "Empresa D", valor: "R$ 300,00", tipo: "Receita" },
  ];

  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (!auth) {
      navigate("/login");
      console.log("não tá logado");
    }
  }, [navigate]);

  // Função para soma
  const soma = (arr) => arr.reduce((acc, val) => acc + parseFloat(val), 0);

  // Filtrando dados por empresa
  const dadosFiltrados = dados.filter((item) => item.empresa === empresaSelecionada);

  // Extraindo valores para cálculos
  const valores = dadosFiltrados.map((item) =>
    parseFloat(item.valor.split("R$ ")[1].replace(",", "."))
  );

  const label = meses.map((mes) => `${mes}/${ano}`);

  const tipos = [...new Set(dadosFiltrados.map((e) => e.tipo))];
  const cores = ["rgba(0, 168, 0, 0.8)", "rgba(233, 98, 0, 0.8)", "rgba(72, 164, 0, 0.8)"];
  let databases = [];

  // Criar datasets para o gráfico
  for (let i in tipos) {
    const despesa = {
      label: tipos[i],
      data: dadosFiltrados
        .filter((e) => e.tipo === tipos[i])
        .map((val) => val.valor.split("R$ ")[1].replace(",", ".")),
      borderColor: cores[i],
      backgroundColor: cores[i],
    };
    databases.push(despesa);
  }

  // Dados para o painel
  let dadosPainel = [];
  for (let a in tipos) {
    let forma = {};
    forma.tipo = tipos[a];
    forma.total = soma(databases[a].data);
    dadosPainel.push(forma);
  }

  const saldo = dadosPainel[1]?.total + dadosPainel[2]?.total - dadosPainel[0]?.total;
  const lucro = dadosPainel[2]?.total - dadosPainel[0]?.total;

  const data = {
    labels: label,
    datasets: databases,
  };

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  return (
    <section>
      <h1 className="title">Painel</h1>

     
      <div className="empresa-select">
        <label htmlFor="empresa">Selecione a Empresa:</label>
        <select
          id="empresa"
          value={empresaSelecionada}
          onChange={(e) => setEmpresaSelecionada(e.target.value)}
        >
          {empresas.map((empresa) => (
            <option key={empresa} value={empresa}>
              {empresa}
            </option>
          ))}
        </select>
      </div>

      <Bar data={data} className="grafico" />

      <div className="container-box">
        <div className="box-content">
          <div className="box-1">
            <p>FRANQUIA REAL</p>
            <h2>{formatarMoeda(dadosPainel[1]?.total || 0)}</h2>
          </div>
          <div className="box-1">
            <p>Receita Real</p>
            <h2>{formatarMoeda(dadosPainel[2]?.total || 0)}</h2>
          </div>
          <div className="box-1">
            <p>DESPE. MENSAL REAL</p>
            <h2>{formatarMoeda(dadosPainel[0]?.total || 0)}</h2>
          </div>
        </div>
        <div className="box-content">
          <div className="box-2">
            <p>Saldo Real</p>
            <h2>{formatarMoeda(saldo || 0)}</h2>
          </div>
          <div className="box-2">
            <p>Lucro Real</p>
            <h2>{formatarMoeda(lucro || 0)}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
*/