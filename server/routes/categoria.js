// ========================================
//                REQUIRED
// ========================================

const express                            = require("express");
let { verificaToken, verificaAdminRole } = require("../middlewares/autenticacion");
let Categoria                            = require("../models/categoria");

// ========================================
//                Instancias
// ========================================
let app = express();


// ========================================
//               Metodos HTTP
// ========================================


// ========================================
//     Mostrar todas las catergorias
// ========================================

app.get("/categoria", (req, res) => {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((error, categorias) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

// ========================================
//     Mostrar categoria por ID
// ========================================

app.get("/categoria/:id", (req, res) => {
  let id = req.params.id;

  Categoria.findById(id).exec((error, categoria) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        error: {
          message: `No existe una categoria con el id: ${id}`,
        },
      });
    }

    res.json({
      ok: true,
      categoria,
    });
  });
});

// ========================================
//     Crear una nueva categoria
// ========================================

app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body; // obtiene los argumentos de postman
  let usuario = req.usuario; // Obtiene el usuario enviado por token

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuario._id,
  });

  categoria.save((error, categoriaDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ========================================
//     Actualizar una categoria por ID
// ========================================

app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  // Para cambiar la descripcion de la categoria con ese id

  let descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (error, categoria) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error,
        });
      }

      if (!categoria) {
        return res.status(400).json({
          ok: false,
          error: {
            message: `No existe una categoria con el id: ${id}`,
          },
        });
      }

      res.json({
        ok: true,
        categoria,
      });
    }
  );
});

// ========================================
//     Borrar una categoria mediante ID
// ========================================

app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (error, categoria) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    if (!categoria) {
      return res.status(400).json({
        ok: false,
        error: {
          message: `No existe una categoria con el id: ${id}`,
        },
      });
    }

    return res.json({
      ok: true,
      eliminado: true,
    });
  });
});

module.exports = app;
