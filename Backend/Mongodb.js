// configuracion de la base de datos en MongoDb

var mongoose = require('mongoose');

// datos de conexion con la BD
var mongoDB = 'mongodb://127.0.0.1/WsG';
mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Esquemas
var muestraSchema = new mongoose.Schema({  //Esquema para la coleccion muestras en BD
    
    examen_id: String,
    muestra: String,
    est_tiempo: String,

  });

var examenSchema = new mongoose.Schema({  //Esquema para la coleccion examenes en BD
    
    examen_id: String,
    usuario_id: String,   
    Freq_Muestro: String,
    Periodo_de_Obs: String, 
    est_tiempo: String,

  });


var usuariosSchema = new mongoose.Schema({  //Esquema para la coleccion usuarios en BD
    
    usuario_id: String,
    Tipo: String,
    Doctor_id: String,
    Usuario: String,
    Pass: String,
    Nombre: String,
    Apellidos: String,
    Correo: String,
    Edad: String,
    Genero: String,
    Estado_de_TX: String,
    Freq_Muestro: String,
    Periodo_de_Obs: String,
    Observaciones: String,
    Ultimo_Contacto: String,

  });

// Fin Esquemas

// Modelos

var muestra_bd = mongoose.model('muestra', muestraSchema);  // Modelo para la coleccion muestras en BD
var usuarios_bd = mongoose.model('usuarios', usuariosSchema);  // Modelo para la coleccion usuarios en BD
var examen_bd = mongoose.model('examen', examenSchema);  // Modelo para la coleccion examen en BD

// Fin Modelos


// Exportando modelos a utilizar
module.exports = {
  "usuarios_bd": usuarios_bd,
  "muestra": muestra_bd,
  "examen_bd": examen_bd
}

//var tmp_muestra = new muestra({ usuario_id: uid,muestra:m,est_tiempo:et});
//var tmp_muestra = new muestra({ usuario_id: '123',muestra:'111',est_tiempo:'111'});
//console.log(tmp_muestra); // 'muestra'

//tmp_muestra.save(function (err, tmp_muestra) {
//    if (err) return console.error(err);
//  });


// buscar con mongoose en bd
/*
muestra.find({ 'usuario_id': '123' }, 'muestra ', function (err, mmuestra) {
    if (err) return handleError(err);
    //mmuestra=mmuestra.slice(10,20);
    console.log(mmuestra.length);    
    // 'mmuestra' contains the list of muestra that match the criteria.
  }).skip(3990).limit(200);
 
*/
/*
 muestra.countDocuments({ 'usuario_id': '123' }, function (err, mconteo) {
    if (err) return handleError(err);
    console.log(mconteo);
    // 'mmuestra' contains the list of muestra that match the criteria.
  });

  */