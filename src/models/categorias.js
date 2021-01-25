const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriasSchema = Schema({
order:Number,
category:String
});

module.exports = mongoose.model("data-categorias", CategoriasSchema);