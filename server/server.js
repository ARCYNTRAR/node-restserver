// ===============================================
//                  REQUIRED
// ================================================
                   require("./config/config");
const express    = require("express");
const mongoose   = require("mongoose");
const path       = require("path");
const bodyParser = require("body-parser");

// ================================================
//                  Iniciar Express
// ================================================
const app = express();

// ================================================
//                  MiddleWares
// ================================================

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta publica para imprimir html
app.use( express.static( path.resolve(__dirname, '../public' ) ) );

// Configuracion global de rutas
app.use(require("./routes/index"));


// ================================================
//                Arrancar Servidor
// ================================================
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});


// =====================================================
//    				 Conectar Base de datos
// =====================================================
mongoose.connect( process.env.URLDB,

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
