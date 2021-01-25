// libraries
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require('body-parser')

const app = express();

// routes
const routes=require('./routes/index')

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// routes
app.use("/", routes);

// databases
require("./database");

// static files
app.use(express.static(path.join(__dirname, "public")));

// server at
app.listen(app.get("port"), () => {
  console.log("Server listening at port ", app.get("port"));
});

module.exports = app;