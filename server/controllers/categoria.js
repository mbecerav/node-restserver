const express = require('express')
const app = express()
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')
const Categoria = require('../models/categoria')

const _ = require('underscore')

//Mostrar Todas las Categorias
app.get('/categoria', (req, res) => {

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {
            if ( err ){
                res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias: categorias,
                    cuantos: conteo
                })

            })

        })
})


//Mostrar una Categoria por ID
app.get('/categoria/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick ( req.body, ['descripcion', 'usuario'] );

    Categoria.findById( id, body, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    } );

})


//Crear una Nueva Categoria por ID
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    //req.usuario._id  id de la persona
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save( (err, categoriaDB) => {

        if ( err ){
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

    if (body.descripcion === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'La descripción de la Categoria es necesaria'
        })
    }
})


//Actualizar el Nombre de una Categoria por ID
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick ( req.body, ['descripcion'] );

    Categoria.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    } );
    
})


//Eliminar una Categoria por ID
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    //Solo un administrador puede borrar categorias
    //categoria.FindByIdAndRemove
    let id = req.params.id

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Categoria.findByIdAndRemove( id, (err, resp) => {

        if ( err ){
            res.status(400).json({
                ok: false,
                err: err
            })
        }

        if ( !resp ){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        
        res.json({
            ok: true,
            resp: 'Categoria Eliminada Exitosamente!'
        })

    })
})

module.exports = app;