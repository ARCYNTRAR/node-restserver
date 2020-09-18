const jwt = require('jsonwebtoken');

// ============================
//      Verificar Token
// ============================

let verificaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, ( error, decoded ) => {

        if(error){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });


};

// ============================
//     Verificar AdminRole
// ============================

let verificaAdminRole = ( req, res, next ) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(403).json({
            ok: false,
            error: {
                message: 'No es un administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAdminRole
}