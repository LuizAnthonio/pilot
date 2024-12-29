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



router.post("/lancamento", async (req,res) => {

    const {nome,data,valor,tipo,isParcelado,qtdParcela,isRecorrente,quemLancou,empresa} = req.body

    console.log(nome,data,valor,tipo,isParcelado,qtdParcela,isRecorrente,quemLancou,empresa)

    let dado = {nome,data,valor,tipo,isParcelado,qtdParcela,isRecorrente,quemLancou,empresa}

    await Lancamentos.create(dado)

    res.status(200).json({message:"Cadastrado", dado:dado})

})

module.exports = router;