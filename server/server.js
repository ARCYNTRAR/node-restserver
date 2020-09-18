require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Configuracion global de rutas
app.use(require("./routes/index"));



app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});

mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (error, res) => {
    if (error) throw error;

    console.log("On tas Base que no te veo buguiarte!!!");
  }
);
