import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
//import { empresaSelec } from "../../header"

// Registrar os componentes para o gráfico
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export function Detalhado() {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const anos = ["2023", "2024"];
  const [dados,setDados] = useState([]);
  const { auth, logout, isAuthenticated } = useAuth();
  const [empresaEscolhida, setEscolhida] = useState(null)
  



  
  useEffect(() => {
    
    /*
    console.log("DADOS",{
      id: auth.id,
      empresa: auth.business._id,
      permissao:auth.grauH
      
    })
      */
    
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
        
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
  
    consultaDados();
    

    setEscolhida(JSON.parse(localStorage.getItem("empresaSelec")))
    console.log("o selec empresa import",empresaEscolhida)
    
  },[])

  useEffect(() => {
       // console.log("Dados recebidos:", newDATA); // Log dos dados recebidos
      
      console.log("TES",JSON.parse(localStorage.getItem("empresas")))

  },[])





  

  function formatarData(data) {
    const dia = (data.getDate()).padStart(2, '0'); // Adiciona '0' se o dia for menor que 10
    const mes = (data.getMonth() + 1).padStart(2, '0'); // Adiciona '1' porque os meses são indexados de 0
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  }
  

  const [anoFiltrado, setAnoFiltrado] = useState(null);
  const [mesFiltrado, setMesFiltrado] = useState(null);
  const [tipoFiltrado, setTipoFiltrado] = useState(null);
  const [tipoGrafico, setTipoGrafico] = useState('barra'); // Estado para alternar o gráfico


  
  const [empresas, setEmpresas] = useState([]);
const [empresaSelecionada, setEmpresaSelecionada] = useState(
  JSON.parse(localStorage.getItem("empresaSelec")) || null
);

useEffect(() => {
  // Busca as empresas do localStorage ao montar o componente
  const empresasSalvas = JSON.parse(localStorage.getItem("empresas")) || [];
  setEmpresas(empresasSalvas);
}, []);

const handleChangeEmpresa = (e) => {
  const novaEmpresa = empresas.find(emp => emp.id === e.target.value);
  setEmpresaSelecionada(novaEmpresa);
  localStorage.setItem("empresaSelec", JSON.stringify(novaEmpresa));
};
  





  // Obter tipos únicos
  const tipos = [...new Set(dados.map(item => item.tipo))];

  // Função para filtrar os dados com base no ano, mês e tipo selecionados
  const dadosFiltrados = dados.filter(item => {
    const [ano, mes] = item.data.split('-');
    const mesNome = meses[parseInt(mes) - 1]; // Ajusta o índice do mês
    return (
      (empresaSelecionada ? item.empresa._id === empresaSelecionada.id : true) &&
      (anoFiltrado ? ano === anoFiltrado : true) &&
      (mesFiltrado ? mesNome === mesFiltrado : true) &&
      (tipoFiltrado && tipoFiltrado !== 'Todos' ? item.tipo === tipoFiltrado : true) 
      //(empresaEscolhida.id = item.id)
      
    );
  });
  const dadosFiltradosAno = dados.filter(item => {
    const [ano, mes] = item.data.split('-');
    const mesNome = meses[parseInt(mes) - 1]; // Ajusta o índice do mês
    return (
      (anoFiltrado ? ano === anoFiltrado : true) &&
      (tipoFiltrado && tipoFiltrado !== 'Todos' ? item.tipo === tipoFiltrado : true)
    );
  });

  // Preparar dados para o gráfico
  const labels = dadosFiltrados.map(item => {
    const [ano, mes] = item.data.split('-');
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  });

  let margem;

  if(tipoFiltrado == "Despesa"){
    margem = 40/100
  }else if(tipoFiltrado == "Franquia"){
    margem = 3.62/100
  }else{
    margem = 56.38/100
  }
  
  let valoresTotaisAno;

  const valores = dadosFiltrados.map(item => parseFloat(item.valor));
  const valoresAno = dadosFiltradosAno.map(item => ({ano:item.data,valor:parseFloat(item.valor)}));
  const valorAnoFiltro = valoresAno.filter(item => item.ano === anoFiltrado)
  //console.log("valor filtro",valorAnoFiltro)

  let somaTotAno = 0;
  let valorTodosOsAnos = 0;

  if(tipoFiltrado == null){
    valoresTotaisAno = dados.map(item => parseFloat(item.valor))
  }else{
    valoresTotaisAno = dados.filter(e => e.tipo === tipoFiltrado).map(item => parseFloat(item.valor))

  }
  
  for(let a in valoresTotaisAno){
    valorTodosOsAnos+= valoresTotaisAno[a]

  }

  for(let j in valorAnoFiltro){
    somaTotAno+=valorAnoFiltro[j].valor

  }

  let margemTotal = somaTotAno * margem
  let saldo = somaTotAno - margemTotal

  //console.log(somaTotAno)
  let soma = 0;
  for (let i in valores) {
    soma += valores[i];
  }

 console.log("dados para filtrar",dados)
 console.log("empresa selec", empresaSelecionada)
 
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Valor dos Produtos',
        data: valores,
        borderColor: 'rgb(0, 168, 0)',
        backgroundColor: 'rgba(0, 168, 0, 0.8)',
      },
    ],
  };

  // Função para desfazer os filtros
  const resetarFiltros = () => {
    setAnoFiltrado(null);
    setMesFiltrado(null);
    setTipoFiltrado(null);
  };

  // Funções para selecionar/deselecionar ano, mês e tipo
  const selecionarAno = (ano) => {
    setAnoFiltrado(prev => (prev === ano ? null : ano));
  };

  const selecionarMes = (mes) => {
    setMesFiltrado(prev => (prev === mes ? null : mes));
  };

  const selecionarTipo = (tipo) => {
    setTipoFiltrado(prev => (prev === tipo ? null : tipo));
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  
  return (
    <section>
      <h1 className="title">Relatório</h1>
  
      <div className="container-filtro">
        {auth.grauH < 2 && (
          <select className="input"
            id="empresaSelect"
            value={empresaSelecionada ? empresaSelecionada.id : ""}
            onChange={handleChangeEmpresa}
          >
            {empresas.length > 0 ? (
              empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nomeEmpresa}
                </option>
              ))
            ) : (
              <option value="">Nenhuma empresa disponível</option>
            )}
          </select>

)}
</div>
  
      {/* Filtros de Tipo, Ano, Mês e Gráficos */}
      <div className="container-filtro">
        <div className="filtro-tipo">
          <p className="sub-title">Tipo</p>
          <div className="filtro-2">
            {tipos.map(tipo => (
              <p key={tipo} onClick={() => selecionarTipo(tipo)} className={tipoFiltrado === tipo ? 'selecionado' : ''}>
                {tipo}
              </p>
            ))}
          </div>
        </div>
  
        <p className="sub-title">Ano</p>
        <div className="filtro-2">
          {anos.map(ano => (
            <p key={ano} onClick={() => selecionarAno(ano)} className={anoFiltrado === ano ? 'selecionado' : ''}>
              {ano}
            </p>
          ))}
        </div>
  
        <p className="sub-title">Mês</p>
        <div className="filtro">
          {meses.map(mes => (
            <p key={mes} onClick={() => selecionarMes(mes)} className={mesFiltrado === mes ? 'selecionado' : ''}>
              {mes}
            </p>
          ))}
        </div>
      </div>
  
      <div className="grafic0">
        {tipoGrafico === 'linha' ? (<Line data={data} className="grafico" />) : (<Bar data={data} className="grafic" />)}
      </div>
  
      {/* Tabela de dados filtrados */}
      <table className="ski-tab-1">
        <thead>
          <tr className="cabecalho-tab">
            <th>Título da Página</th>
            <th>Data Cadastrada</th>
            <th>Quantidade de Parcelas</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item, index) => (
            <tr key={index} className="base-tab">
              <td>{item.nome}</td>
              <td>{item.data.split("T")[0]}</td>
              <td>{item.qtdParcela < 2 ? "À vista" : item.qtdParcela}</td>
              <td>{formatarMoeda(item.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <div className="box-content">
        <div className="box-1">
          <p>Total Geral</p>
          {anoFiltrado != null ? 
            
            <h2>{formatarMoeda(valorTodosOsAnos)}</h2> :
            <h2>{formatarMoeda(somaTotAno)}</h2> 

          }
        </div>
        <div className="box-1">
          <p>Total do Periodo Selecionado</p>
          <h2>{formatarMoeda(soma)}</h2>
        </div>
      </div>

    </section>
  );

  /*
  return (
    <section>
      <h1 className="title">Relatório</h1>
      <h1 className="title">{1}</h1>
      <div className="container-filtro">
      <label htmlFor="empresaSelect">Selecione uma empresa:</label>
      <select
        id="empresaSelect"
        value={empresaSelecionada ? empresaSelecionada.id : ""}
        onChange={handleChangeEmpresa}
      >
        {empresas.length > 0 ? (
          empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nomeEmpresa}
            </option>
          ))
        ) : (
          <option value="">Nenhuma empresa disponível</option>
        )}
      </select>
    </div>


      <div className="container-filtro">
        
        <div className="filtro-tipo">
          <p className="sub-title">Tipo</p>
          <div className="filtro-2">
            {tipos.map(tipo => (
              <p key={tipo} onClick={() => selecionarTipo(tipo)} className={tipoFiltrado === tipo ? 'selecionado' : ''}>
                {tipo}
              </p>
            ))}
          </div>
        </div>

        <p className="sub-title">Ano</p>
        <div className="filtro-2">
          {anos.map(ano => (
            <p key={ano} onClick={() => selecionarAno(ano)} className={anoFiltrado === ano ? 'selecionado' : ''}>
              {ano}
            </p>
          ))}
        </div>

        <div className="grafico0">
          {tipoGrafico === 'linha' ? (<Line data={data} className="grafic" />) : (<Bar data={data} className="grafic" />)}
        </div>
        <br />

        <p className="sub-title">Mês</p>
        <div className="filtro">
          {meses.map(mes => (
            <p key={mes} onClick={() => selecionarMes(mes)} className={mesFiltrado === mes ? 'selecionado' : ''}>
              {mes}
            </p>
          ))}
        </div>
      </div>
      <br />

      <div className="box-content">
        <div className="box-1">
          <p>Margem Total ({(margem*100).toFixed(2)}%)</p>
          <h2>{formatarMoeda(margemTotal)}</h2>
        </div>
        <div className="box-1">
          <p>Receita Real</p>
          <h2>{formatarMoeda(saldo)}</h2>
        </div>
      </div>

      <table className="ski-tab-1">
        <thead>
          <tr className="cabecalho-tab">
            <th>Título da Página</th>
            <th>Data Cadastrada</th>
            <th>Quatidade de Parcelas</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item, index) => (
            <tr key={index} className="base-tab">
              <td>{item.nome}</td>
              <td>{((item.data).split("T00:00:00.000Z"))}</td>
              <td>{item.qtdParcela < 2 ? "A vista" : item.qtdParcela }</td>
              <td>{formatarMoeda(item.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="box-content">
        <div className="box-1">
          <p>Total Geral</p>
          {anoFiltrado != null ? 
            
            <h2>{formatarMoeda(valorTodosOsAnos)}</h2> :
            <h2>{formatarMoeda(somaTotAno)}</h2> 

          }
        </div>
        <div className="box-1">
          <p>Total do Periodo Selecionado</p>
          <h2>{formatarMoeda(soma)}</h2>
        </div>
      </div>

    </section>
  );
  */
}
