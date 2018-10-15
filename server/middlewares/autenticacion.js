const jwt = require('jsonwebtoken');

// =======================
//  Verificar TOKEN
// =======================
let verificaToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify( token, process.env.SEED, (err, decode) =>{

        if ( err ){
            return res.status(401).json({
                ok: false,
                err: err
            })
        }

        req.usuario = decode.usuario

        next()

    })

}


// =======================
//  Verificar ROL ADMIN
// =======================
let verificaAdminRol = ( req, res, next ) => {

    let usuario = req.usuario

    if (usuario.rol != "ADMIN_ROLE" ){
        
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
        
    }

    next()

}


module.exports = {
    verificaToken,
    verificaAdminRol
}