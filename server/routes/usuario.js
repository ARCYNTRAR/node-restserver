const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuario");
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


const app = express();

app.get("/usuario", verificaToken , (req, res) => {

  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email
  // });

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado: true}, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      //Usuario.count
      Usuario.countDocuments({estado: true}, (error, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

app.post("/usuario", [verificaToken, verificaAdminRole], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((error, usuarioDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    // usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], function (req, res) {
  
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (error, usuarioDB) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], function (req, res) {

  let id = req.params.id;

  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true, runValidators: true },
    (error, usuarioDB) => {

      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });

    }
  );
});


module.exports = app;
