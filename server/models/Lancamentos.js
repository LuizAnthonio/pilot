const mongoose = require("mongoose");
const User = require("../models/User")
const Empresas = require("../models/Empresas")

const Schema = mongoose.Schema;

const lancamentos_Schema = new Schema({
    nome: { type: String, required: true }, 
    data: { type: Date, required: true }, 
    valor: { type: Number, required: true }, 
    tipo: { type: String, required: true }, 
    isParcelado: { type: Boolean, required: true }, 
    qtdParcela: { type: Number, default: 1 }, 
    isRecorrente: { type: Boolean, required: true },
    quemLancou: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresas', required: true } 

}, { collection: "lancamentos" }); 

const Lancamentos = mongoose.model("Lancamentos", lancamentos_Schema);

module.exports = Lancamentos;
