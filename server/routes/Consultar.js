const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Empresas = require("../models/Empresas");
const Lancamentos = require("../models/Lancamentos");


router.get("/",(req,res) => {



    res.json({result:"OK"})
});


router.get("/consulta", (req,res) => {
    const cookie = req.cookies['jwt']

      const requisicao = jwt.verify(cookie,"segredinho");

      res.json(requisicao)
})

router.get("/empresas", async (req,res) => {
    const empresas = await Empresas.find({})

    res.json(empresas)
})


router.get("/empresas/listar", async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];

        // Verifica se o cookie está presente
        if (!cookie) {
            return res.status(401).json({ message: "Token não encontrado. Por favor, faça login.", code: 401 });
        }

        // Verifica o token e faz a consulta das permissões
        const requisicao = jwt.verify(cookie, "segredinho");

        if (requisicao.permissao < 2) {
            const empresas = await Empresas.find({});
            return res.json(empresas);
        } else {
            return res.status(403).json({ message: "Permissão insuficiente para acessar empresas.", code: 111 });
        }
    } catch (error) {
        console.error("Erro na verificação do token:", error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido. Por favor, faça login novamente.", code: 401 });
        }

        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/*

router.get("/empresas/listar", async (req,res) => {
    const empresas = await Empresas.find({})

    const cookie = req.cookies['jwt']

    
    const requisicao = jwt.verify(cookie,"segredinho");
    console.log("requisição",requisicao)

    if(requisicao.permissao < 2){
        res.json(empresas)
    }else{
        res.status(200).json({message:"empresa selecioada",code:111})
    }

    

})
*/

router.post("/empresas/selec", async (req,res) => {
    const cookie = req.cookies['jwt']
    
    
    if(!cookie) return res.json({code:404, message:"Token não encontrado"});
    
    try{
        const token = jwt.verify(cookie,"segredinho");

        const empresaId = req.body.idEmp
        const empresa = await Empresas.find({id:empresaId})

        if(!empresa){
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        res.cookie("empresa",empresaId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({message:"Empresa selecionada com sucesso", empresaId});



    }catch(err){
        res.json({code:400, message:`Erro encontrado: ${err}`})
    }

})


router.post("/empresa/lanca", async (req,res) => {
    let empresaId;
    
    try {
    const dadoUser = req.body.dados
    

    const userId = dadoUser.id;
    const grau = dadoUser.permissao;

    console.log(dadoUser);
    

    if (grau < 2) {
        empresaId = true;
    } else {
        empresaId = dadoUser.empresa;
    }

    if (!empresaId) {
        return res.status(401).json({ message: "Empresa não encontrada!" });
    }

    let query;

    if (grau < 2) {
        query = {};
    } else if (grau > 1) {
        query = { empresa: empresaId };
        console.log(query);
    } else {
        return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
    }

    console.log("query",query)
    const lancamentos = await Lancamentos.find(query).populate("quemLancou").populate("empresa");

    console.log(lancamentos)
    res.json(lancamentos);
    
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado.",err:err });
    }

})

router.get("/empresas/lancamentos", async (req,res) => {
    const token = req.cookies["jwt"];
    const empresa = req.cookies["empresas"];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido!" });
    }
    
    
    let empresaId;

    try {
        const dadoUser = jwt.verify(token, "segredinho");
        const dadosEmpresa = jwt.verify(empresa, "segredinho");

        const userId = dadoUser.id;
        const grau = dadoUser.permissao;

        console.log(dadoUser);
        console.log("Dados empresa", dadosEmpresa);

        if (grau < 2) {
            empresaId = true;
        } else {
            empresaId = dadoUser.empresa;
        }

        if (!empresaId) {
            return res.status(401).json({ message: "Empresa não encontrada!" });
        }

        let query;

        if (grau < 2) {
            query = {};
        } else if (grau > 1) {
            query = { empresa: empresaId };
            console.log(query);
        } else {
            return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
        }

        const lancamentos = await Lancamentos.find(query).populate("quemLancou").populate("empresa");

        res.json(lancamentos);
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
    /*
    const token = req.cookies["jwt"];
    const empresa = req.cookies["empresas"]

    
    let empresaId;
    
    
    
    const dadoUser = jwt.verify(token,"segredinho");
    const dadosEmpresa = jwt.verify(empresa,"segredinho");
    const userId = dadoUser.id;
    const grau = dadoUser.permissao;


    console.log(dadoUser)
    console.log("Dados empresa",dadosEmpresa)


    if(grau < 2){
        empresaId = true;
    }else{
        empresaId  = dadoUser.empresa
    }

    


    if(!token || !empresaId){
        return res.status(401).json({ message: "Token ou Empresa não econtrados!" });
    }

    let query;

    if(grau < 2){
        query = {}

    }else if (grau > 1){
        query = {empresa:empresaId}
        console.log(query)
    }else{
        return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
    }

    const lancamentos = await Lancamentos.find(query).populate("quemLancou").populate("empresa");


    


    res.json(lancamentos)
    */

})

router.post("/login", async (req,res) => {


    try{
        let users = await User.findOne({email:req.body.email});
        let empresaSelec;


        if(users.grauH == 2){
            console.log(users.business)
            empresaSelec = await Empresas.findOne({_id:users.business})
            console.log("Empresa selec",empresaSelec)
            const tokenEmpresa = jwt.sign({id:empresaSelec._id,nomeEmpresa:empresaSelec.nomeEmpresa},"segredinho");

            res.cookie("empresas",tokenEmpresa,{
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000 // por um dia de cookie
            })

        }else{
            empresaSelec = "Geral"
        }
       
          
    
        if(users == null){
            res.status(404).json({message:"User não encontrado"});
        }
        
        if(users.senha != req.body.senha){
            res.status(404).json({message:"Senha invalida"});
    
        }
        
        const token = jwt.sign({id:users.id,permissao:users.grauH,empresa:users.business},"segredinho");
  
    res.cookie("jwt",token,{
      httpOnly:true,
      maxAge: 24 * 60 * 60 * 1000, // por um dia de cookie
      secure:false
    })

    const oUser = {
        token,
        id:users.id,
        nome:users.nome,
        grauH:users.grauH,
        business: empresaSelec

    }
        

        res.status(200).json(oUser);

    }catch(err){
        res.status(500).json({message:"Erro do servidor"})
    }



})


module.exports = router;