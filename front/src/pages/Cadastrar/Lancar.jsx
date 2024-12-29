import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import "./index.css"

export function Lancar() {
    const [formDados, setFormDados] = useState({
        tipo:'',
        nome:'',
        data:'',
        valor:'',
        isAvista:'',
        qtdParcelas:1
    });

    const heandleChange = (e) => {
        const { name, value } = e.target;
        setFormDados((prevDados) => ({
            ...prevDados,
            [name]:value
        }));
    };

    const heandleSubmit = (e) => {
        e.preventDefault();
        formDados.qtdParcelas = parseInt(formDados.qtdParcelas)
        console.log(formDados);
        setFormDados({
            tipo:'',
            nome:'',
            data:'',
            valor:'',
            isAvista:'',
            qtdParcelas:1
        })
    };

    const [dados,setDados] = useState([])
    const [selectedOption, setSelectedOption] = useState(1);
    const [selectedTipo, setSelectedTipo] = useState(null);


    function cadastrar(e){

    }

    const handleTipo = (e) => {
        setSelectedTipo(e.target.value)
    }

    const handleOption = (e) => {
        setSelectedOption(e.target.value)
        formDados.isAvista = e.target.value
        if(formDados.isAvista == "true" && formDados.qtdParcelas > 1){
            formDados.qtdParcelas = 1
        }

        console.log(e.target.value);

    }


    return (
        <section>

            <h1 className='title'>Lançarr</h1>

            <form method="post" onSubmit={heandleSubmit}>

                <p className='sub-title'>tipo</p>
                <br />
                <div className="container-inputs">
                    
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="despesa" onChange={heandleChange} />
                    <p>Despesa</p>
                </label>
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="franquia" onChange={heandleChange}/>
                    <p>Franquia</p>
                </label>
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="receita" onChange={heandleChange}/>
                    <p>Receita</p>
                </label>
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="saqueDespesa" onChange={heandleChange}/>
                    <p>Saque Despesa</p>
                </label>
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="saqueFranquia" onChange={heandleChange}/>
                    <p>Saque Franquia</p>
                </label>
                <label className='radioLabel'>
                    <input type="radio" name="tipo" value="saqueReceita" onChange={heandleChange} />
                    <p>Saque Receita</p>
                </label>

                </div>
                <br />



                <label className='input-class'>
                <p>Titulo</p>
                <input type="text" className="input" placeholder='Nome do lancamento' value={formDados.nome} name='nome' onChange={heandleChange}/>
                </label>

                <div className="container-input">

                <label className='input-class'>
                <p>Data</p>
                <input type="date" className="input" placeholder='Nome do lancamento' value={formDados.data} name='data' onChange={heandleChange}/>
                </label>

                <label className='input-class' >
                <p>Valor</p>
                <input type="text" className="input" placeholder='Valor do lancamento' value={formDados.valor}  name='valor' onChange={heandleChange}/>
                </label>


                </div>

                <div className="container-inputs-2">
                    
                <label className='radioLabel'>
                    <input type="radio" name="isAvista" value="true" onChange={handleOption} />
                    <p>A vista</p>
                </label>


                <label className='radioLabel'>
                    <input type="radio" name="isAvista" value="false" onChange={handleOption} />
                    <p>Parcelado</p>
                </label>

               

                </div>

                {selectedOption == "false" &&(
                <label className='container-inputs-2'>
                    <p>Quantidade de Parcelas</p>
                    <input type="number" name="qtdParcelas" className='input' min="2" onChange={heandleChange}/>
                </label>
                   
                )}
                <button className='btn-2'>Enviar</button>
                

            </form>

        </section>
    )

}