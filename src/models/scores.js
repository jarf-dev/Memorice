const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoresSchema = Schema({
  name: String,
  category:Number,
  score: {type:Number, default:0},
  time: {type:Number, default:0}
});

module.exports = mongoose.model("data-scores", ScoresSchema);