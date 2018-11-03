const express = require('express')
const app = express()
const { verificaToken } = require('../middlewares/autenticacion')
const Producto = require('../models/producto')

const _ = require('underscore')

//Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => { 
    // Trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0
    desde = Number (desde)

    Producto.find({ disponible: true }, 'nombre precioUni descripcion disponible categoria usuario')
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec( (err, productos) => {
            if ( err ){
                res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productos,
                    cuantos: conteo
                })

            })

        })

})


//Obtener producto por ID
app.get('/productos/:id', verificaToken, (req, res) => { 
    // populate: usuario

    let id = req.params.id;
    let body = _.pick ( req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario'] );

    Producto.findById( id, body, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    } );

})


//Obtener producto por PARAMETRO
app.get('/productos/buscar/:termino', verificaToken, (req, res) => { 

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria')
        .exec( (err, productos) => {
            if ( err ){
                res.status(400).json({
                    ok: false,
                    err: err
                })
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productos,
                    cuantos: conteo
                })

            })

        })

})


//Crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar un producto del listado (asociar) a la categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save( (err, productoDB) => {

        if ( err ){
            res.status(500).json({
                ok: false,
                err: err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    })

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre del Producto es necesario'
        })
    }

})


//Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {    
    
    let id = req.params.id;
    let body = _.pick ( req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria'] );

    Producto.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    } );

})


//Eliminar un producto
app.delete('/productos/:id', verificaToken, (req, res) => { 
    // debe pasar la disponibilidad a falso
    let id = req.params.id;
    let body = { disponible: false };

    Producto.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    } );

})



module.exports = app