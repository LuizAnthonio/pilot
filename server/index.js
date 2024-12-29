const fs = require("fs");
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
//const sql = require("sql");


app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: 'http://localhost:5173'
}))
app.use(express.json())     
app.use(bodyParser.urlencoded({     
    extended: true
  })); 

const connectDatabase = () =>{
    console.log('Esperando conexão');
    
    mongoose.connect("mongodb+srv://Zezin0001:yGEFbGDqtV4MzNFH@cluster0.o5bhl.mongodb.net/sistemais?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log('Mongo Conectado Com SUCESSO!')).catch((error)=> console.log(error))
}



connectDatabase();


const home = require("./routes/Consultar");
const cadastrar = require("./routes/Cadastrar");


app.use("/",home)
app.use("/cadastrar",cadastrar);

app.listen(3000, () =>{
    console.log("Rodando")
})


