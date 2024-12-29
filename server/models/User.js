const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const user_Schema = new Schema({

        nome: String,
        email: String,
        senha: String,
        grauH: Number,
        business:Object
 
},{collection:"user"});

const User = mongoose.model("User",user_Schema);

module.exports = User;


