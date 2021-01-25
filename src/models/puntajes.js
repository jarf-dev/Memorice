const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PuntajesSchema = Schema({
  name: String,
  category:Number,
  score: {type:Number, default:0},
  time: {type:Number, default:0}
});

module.exports = mongoose.model("data-puntajes", PuntajesSchema);
