const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
const Usuario = require('../models/usuario')
const _ = require('underscore')
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

app.get('/', function (req, res) {
    
})

app.get('/usuario', verificaToken, function (req, res) {

    let desde = req.query.desde || 0
    desde = Number (desde)

    let limite = req.query.limite || 5
    limite = Number (limite)

    Usuario.find({estado: true}, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if ( err ){
                res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            Usuario.count({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })

            })

        })

})

app.post('/usuario', [verificaToken, verificaAdminRol], function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync ( body.password, 10 ),
        rol: body.rol
    })

    usuario.save( (err, usuarioDB) => {

        if ( err ){
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    }

})

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function (req, res) {

    let id = req.params.id;
    let body = _.pick ( req.body, ['nombre', 'email', 'img', 'rol', 'estado'] );

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    } );

})

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function (req, res) {

    let id = req.params.id

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate( id, {estado: false } , {new: true, runValidators: true}, (err, usuarioBorrado) => {

        if ( err ){
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        if ( !usuarioBorrado ){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

})

module.exports = app;