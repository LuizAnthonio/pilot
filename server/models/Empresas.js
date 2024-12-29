const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const empresa_Schema = new Schema({

        nomeEmpresa: String
       
 
},{collection:"empresas"});

const Empresas = mongoose.model("Empresas",empresa_Schema);

module.exports = Empresas;


