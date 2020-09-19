// =====================================================
//    				    Required
// =====================================================
const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
let Producto = require("../models/producto");

// =====================================================
//    				    Express
// =====================================================
let app = express();
// =====================================================
//    			    Metodos HTTP
//
//    			  Obtener Productos
// =====================================================

app.get("/productos", verificaToken, (req, res) => {

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({disponible: true})
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .limit(limite)
    .exec((error, productos) => {

      if (error) {
        return res.status(500).json({
          ok: false,
          error,
        });
      }

      if (!productos) {
        return res.status(500).json({
          ok: false,
          error: {
            message: "No se han encontrados productos",
          },
        });
      }

      res.json({
        ok: true,
        producto: productos,
      });
    });
});

// =====================================================
//    			 Obtener Productos ID
// =====================================================

app.get("/productos/:id", (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((error, productos) => {

        if (error) {
            return res.status(500).json({
              ok: false,
              error
            });
          }
    
          if (!productos) {
            return res.status(500).json({
              ok: false,
              error: {
                message: `No se ha encontrado el producto con id: ${id}`
              },
            });
          }
    
          res.json({
            ok: true,
            producto: productos
          });

        });
    });

// =====================================================
//    				 Buscar Producto
// =====================================================

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {

    let termino = req.params.termino;

    // =====================================================
    //    				 Importante, para encontrar un nombre con solo 1 letra
    // =====================================================
    
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
    .populate("categoria", "descripcion")
    .exec((error, producto) => {
        if (error) {
            return res.status(500).json({
              ok: false,
              error
            });
          }
    
          if (!producto) {
            return res.status(500).json({
              ok: false,
              error: {
                message: `No se ha encontrado el producto con termino: ${termino}`
              },
            });
          }
    
          res.json({
            ok: true,
            producto: producto
          });
    });

});

// =====================================================
//    		   Crear un Producto Nuevo
// =====================================================

app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;
  let usuario = req.usuario;

  let producto = new Producto({
    usuario: usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    disponible: body.disponible,
    categoria: body.categoria,
  });

  producto.save((error, productoDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

// =====================================================
//    			Actualizar un producto
// =====================================================

app.put("/productos/:id", verificaToken, (req, res) => {

    let body = req.body
    let id   = req.params.id;

    let productoNuevo = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, productoNuevo, { new: true, runValidators: true })
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((error, productos) => {

        if (error) {
            return res.status(500).json({
              ok: false,
              error
            });
          }
    
          if (!productos) {
            return res.status(500).json({
              ok: false,
              error: {
                message: `No se ha encontrado el producto con id: ${id}`
              },
            });
          }
    
          res.json({
            ok: true,
            producto: productos
          });

        });

});

// =====================================================
//    				 Borrar un Producto
// =====================================================

app.delete("/productos/:id", (req, res) => {
    let id   = req.params.id;

    let cambiarDisponible = {
        disponible: false
    }


    Producto.findByIdAndUpdate(id, cambiarDisponible, { new: true, runValidators: true })
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((error, productos) => {

        if (error) {
            return res.status(500).json({
              ok: false,
              error
            });
          }
    
          if (!productos) {
            return res.status(500).json({
              ok: false,
              error: {
                message: `No se ha encontrado el producto con id: ${id}`
              },
            });
          }
    
          res.json({
            ok: true,
            producto: productos
          });

        });
});

module.exports = app;
