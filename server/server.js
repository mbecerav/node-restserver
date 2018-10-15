require('./config/config')

const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose');

const app = express()

 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./controllers/index') )

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if( err ) throw err;

    console.log('Base de Datos Online!');
});


app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", 3000)
})