// =====================================================
//    				           Required
// =====================================================
const express    = require("express");
const fileUpload = require("express-fileupload");
const Usuario    = require("../models/usuario");
const Producto   = require("../models/producto");
const fs         = require("fs");
const path       = require("path");
// =====================================================
//    				           Express
// =====================================================
const app        = express();
// =====================================================
//    				         Middlewares
// =====================================================
// default options
app.use(fileUpload());
// =====================================================
//    		      		 Métodos HTTP
//
//    		Subida de una imagen a un directorio
// =====================================================
app.put("/upload/:tipo/:id", (req, res) => {

  let tipo = req.params.tipo;
  let id   = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      error: {
        message: "No se ha seleccionado ningun archivo",
      },
    });
  }

  //Validar tipo
  let tiposValidos  = ['productos', 'usuarios'];

  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      error: {
        message: `Los tipos permitidos son: [${tiposValidos.join(', ')}]`
      },
      tipo
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo       = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension     = nombreCortado[nombreCortado.length - 1];

  // Extensiones Permitidas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  // Verifica que la extension sea valida
  if( extensionesValidas.indexOf(extension) < 0 ){
    return res.status(400).json({
      ok: false,
      error: {
        message: `Las extensiones permitidas son: [${extensionesValidas.join(', ')}]`
      },
      extension
    });
  }

  // Cambiar nombre al archivo
  // 454654561-321313213.jpg
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(error) => {

    if (error) return res.status(500).json({
        ok: false,
        error
    });

    // Imagen Cargada
    if(tipo === 'usuarios') imagenUsuario( id, res, nombreArchivo );
    else imagenProducto( id, res, nombreArchivo );

  });

});

// =====================================================
//    		Funciones para directorios de imagenes
// =====================================================


function imagenUsuario( id, res, nombreArchivo ){

  Usuario.findById( id, ( error, usuarioDB ) => {

    if( error ){

      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        error
      })

    }

    if( !usuarioDB ) {

      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        error: {
          message: 'El Usuario no existe'
        }
      }) 

    }

    borraArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save(( error, usuarioGuardado ) => {

      if( error ){

        return res.status(500).json({
          ok: false,
          error
        })
  
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });

    });

  });

};

function imagenProducto( id, res, nombreArchivo ){
  
  Producto.findById( id, ( error, productoDB ) => {

    if( error ){

      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        error
      })

    }

    if( !productoDB ) {

      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        error: {
          message: 'El Producto no existe'
        }
      }) 

    }

    borraArchivo(productoDB, 'productos');

    productoDB.img = nombreArchivo;

    productoDB.save(( error, productoGuardado ) => {

      if( error ){

        return res.status(500).json({
          ok: false,
          error
        })
  
      }

      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });

    });

  });

};

function borraArchivo( nombreImagen, tipo ){

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
  if( fs.existsSync(pathImagen) ){
    fs.unlinkSync(pathImagen);
  }

};

module.exports = app;