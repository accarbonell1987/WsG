
"use strict";
    
process.title = 'WsG_Backend';

// Puerto Donde correra el websocket
var webSocketsServerPort = 2000;  //1337

// websocket y servidor http
var webSocketServer = require('websocket').server;
var http = require('http');


//Declaraciones importantes

var clientes_emisores = [ ]; //cliente que emiten datos (arduinos)
var clientes_receptores = [ ]; //clientes que reciven datos (web, apps...)
var clientes = [];  // todos los clientes conectados.

var cont_senal_save_TR=0;
var ndata_bd = [];
var cont_global =0;



// OTRAS DECLARACIONES 

  // estaban dentro del ws conection

  /*var idCliente = 0;                // se asume que el usuario no tiene id en el sistema.
  var examen_id = 0;                // se crea un nuevo examen para registrar las muestras.
  var tipoCliente= false;           // se asume que el usuario no tiene tipo.
  var idClienteSolicitado=false;    // Se aume que todavia el usuario receptor no tiene id solicitado para escucha.
  var index_bd=0;                   // Indice de bloque de busqueda en bd.  
  var tam_bloque=100;               // tamaño del bloque de muestas que se van a buscar en bd.
  var total_muestras=0;             // Cantidad total de muestras de bd enviadas al usuario.  
  var data_bd = [];                 // almacena datos de la bd.
  var data_rr = [];                 // almacena datos de serie RR
  var rr_info = 0;                  // Datos calculo de la serie RR
  var data_t_real = [];             // almacena datos en tiempo real.
  var cont_m_rt=0;                  // Contador de bloque de muestra en tiempo real.*/



  // declaraciones globales

var cont_senal_save=0;
//var cont_senal_save=115;
var senal_save=[5.4435827e-02,
  4.8207368e-02,
  5.1666812e-02,
  5.1703877e-02,
  5.3790708e-02,
  6.1716229e-02,
  5.3753198e-02,
  5.7925667e-02,
  5.2519673e-02,
  5.4112042e-02,
  5.4782138e-02,
  5.6629556e-02,
  6.0327241e-02,
  6.3712543e-02,
  6.4224683e-02,
  5.6658649e-02,
  6.8919399e-02,
  6.1935117e-02,
  7.0581942e-02,
  7.4389930e-02,
  7.8244282e-02,
  8.1214453e-02,
  8.2527828e-02,
  8.9235935e-02,
  8.7901445e-02,
  9.5303292e-02,
  1.0074375e-01,
  1.0583958e-01,
  1.0391197e-01,
  1.1570038e-01,
  1.1179033e-01,
  1.0600322e-01,
  9.9757406e-02,
  8.7131440e-02,
  7.9124982e-02,
  6.8209617e-02,
  7.0428239e-02,
  6.5312976e-02,
  6.0568966e-02,
  6.0847400e-02,
  5.7873062e-02,
  4.6008625e-02,
  4.4501373e-02,
  4.6125174e-02,
  1.1849374e-01,
  2.7710602e-01,
  5.0673516e-01,
  7.4448575e-01,
  8.7777857e-01,
  8.1627884e-01,
  6.2408102e-01,
  4.0382301e-01,
  2.4232125e-01,
  1.4500637e-01,
  9.5365573e-02,
  7.2318917e-02,
  5.7419358e-02,
  3.9047394e-02,
  3.1338203e-02,
  3.4365197e-02,
  3.5431358e-02,
  3.0322568e-02,
  3.8524490e-02,
  4.0745513e-02,
  3.9424450e-02,
  3.5627062e-02,
  5.1299021e-02,
  5.4523341e-02,
  5.9491330e-02,
  6.5085748e-02,
  6.2249114e-02,
  6.3574939e-02,
  7.6056357e-02,
  8.1243583e-02,
  8.1694742e-02,
  8.7611267e-02,
  1.0710996e-01,
  1.0935444e-01,
  1.2206987e-01,
  1.3819969e-01,
  1.4693710e-01,
  1.6053860e-01,
  1.8710350e-01,
  2.0014723e-01,
  2.0907597e-01,
  2.2205846e-01,
  2.2519855e-01,
  2.3635178e-01,
  2.2933127e-01,
  2.3219432e-01,
  2.1504889e-01,
  1.9349562e-01,
  1.6586789e-01,
  1.5380696e-01,
  1.2875534e-01,
  1.0854871e-01,
  9.0962182e-02,
  8.0112322e-02,
  7.0794806e-02,
  5.8438819e-02,
  4.7666163e-02,
  4.8126805e-02,
  4.7901324e-02,
  4.9583761e-02,
  4.3092038e-02,
  4.5507935e-02,
  4.3454361e-02,
  4.7929504e-02,
  4.0951597e-02,
  4.0117660e-02,
  4.6990177e-02,
  4.6691604e-02,
  5.4486744e-02,
  5.0881184e-02,
  4.9566278e-02,
  5.7033012e-02,
];

/*var max_senal=0;                        // Buscando maximo en señal
var latidos=0;                          // Numero total de latido registrados
var tmp_r=0;                            // Valor de la muestra donde se detecto el punto R ahora
var r_ant=0;                           // Valor de la muestra anterior donde se registro RR.
var tmp_rr=0;                          // Serie RR Actual
var rr_medio=0;                        // Valor de rr medio detectado.
var rr_medio_sum=0;                    // Sumatoria de todos los rr se usa para buscar el promedio.
var fc_medio=0;                        // Frecuencia cardiaca media detectada.
var rr_max=0;                          // Valor de RR maximo detectado.
var rr_min=20000;                      // Valor RR minimo Detectado
var desv_rr=0;                         // desviacion RR detectada.*/

// Declaraciones de variables globales de filtros

/*// Variable para la derivada

var Der_ultima_muestra=0;*/

// OTRAS DECLARACIONES



/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // this doubles as a way to serve the fies, and a connection for websocket to use
    var file = http_files[request.url];
    if (file) {
        response.writeHeader(200,{"content-type" : file.contentType});
        response.write(file.content);
        return response.end();
    }
    response.writeHeader(404,{"content-type" : "text/plain"});
    response.write("not found");
    return response.end();

});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Servidor escuchando en el puerto " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});


var cant_clientes_cnx=0;        //cantidad de clientes conectados en el momento.
var cant_clientes_total=0;      //cantidad de clientes totales conectador.


// Importacion de metodos y variables a utilizar
const Utilidades = require("./Utilidades");
const filtrado = require("./filtrado");
var Bd_cnx = require("./Mongodb");
//////////Utilidades.htmlEntities("test");


// Funcion callback que se lanza cada vez que alguien intenta conectarse por ws.
wsServer.on('request', function(request) {

    // Notificacion de nueva cnx.

    console.log((new Date()) + ' Conexión desde: ' + request.origin + '.');
    console.log((new Date()) + ' Conexión aceptada.');


    // Creando variables con datos de la cnx.

    cant_clientes_cnx++;     //Incremento la cantidad de usuario en 1
    cant_clientes_total++;   //Incremento la cantidad de usuario totales en 1    

    console.log('Cantidad de clientes concurrentes:  '+cant_clientes_cnx);

    var connection = request.accept(null, request.origin);
    var id_cnx_cliente= ((new Date()).getTime()+cant_clientes_total); 

    var datosCliente = { 
        id_cnx: id_cnx_cliente,
        rt_sol: 0,       
        conexion: connection
    };

    clientes.push(datosCliente);  // En este arreglo estan todos los datos de todos los clientes cnx en el instante.
           

    // Variables Utiles

    var idCliente = 0;                // se asume que el usuario no tiene id en el sistema.
    var examen_id = 0;                // se crea un nuevo examen para registrar las muestras.
    var tipoCliente= false;           // se asume que el usuario no tiene tipo.
    var idClienteSolicitado=false;    // Se aume que todavia el usuario receptor no tiene id solicitado para escucha.
    var index_bd=0;                   // Indice de bloque de busqueda en bd.  
    var tam_bloque=100;               // tamaño del bloque de muestas que se van a buscar en bd.
    var total_muestras=0;             // Cantidad total de muestras de bd enviadas al usuario. 
    var data_bd_tmp = [];             // almacena datos de la bd temporalmente. 
    var data_bd = [];                 // almacena datos de la bd.
    var data_rr = [];                 // almacena datos de serie RR
    var rr_info = 0;                  // Datos calculo de la serie RR
    var data_t_real = [];             // almacena datos en tiempo real.
    var cont_m_rt=0;                  // Contador de bloque de muestra en tiempo real.


    // Variables del calculo de la serie RR

    var max_senal=0;                        // Buscando maximo en señal
    var latidos=0;                          // Numero total de latido registrados
    var tmp_r=0;                            // Valor de la muestra donde se detecto el punto R ahora
    var r_ant=0;                           // Valor de la muestra anterior donde se registro RR.
    var tmp_rr=0;                          // Serie RR Actual
    var rr_medio=0;                        // Valor de rr medio detectado.
    var rr_medio_sum=0;                    // Sumatoria de todos los rr se usa para buscar el promedio.
    var fc_medio=0;                        // Frecuencia cardiaca media detectada.
    var rr_max=0;                          // Valor de RR maximo detectado.
    var rr_min=20000;                      // Valor RR minimo Detectado
    var desv_rr=0;                         // desviacion RR detectada.
    var val_ant=0;                         // Valor Anterior de deteccion de punto RR (variable auxiliar).

    // Variable para la derivada

    var Der_ultima_muestra=0;

    // Fin declaracion de variables de conexion


    // Cuando un Usuario envia algun Mensaje... callback de procesamiento de msg
    connection.on('message', function(message) {


        //  Parseando los datos a JSON
        try {
            var json_servidor = JSON.parse(message.utf8Data);            
        } catch (e) {
            console.log('JSON no valido: ', Utilidades.htmlEntities(message.utf8Data));
            return;
        }

        //........................ Mensajes Especificos........................................


        //........................ Mensajes de Autenticacion de Usuario........................
        if (json_servidor.type === 'auth_usuario'){
            
            console.log('loco');
            // buacar datos de usuario para comprobar autenticacion.
            Bd_cnx.usuarios_bd.find({ 'Usuario': json_servidor.data.Usuario }, function (err, bdUser) {
                if (err) return handleError(err);
                var auth_code=0;
                var auth_tipo=3;               
                                   
                if (bdUser.length>0){
                    if (json_servidor.data.Pass===bdUser[0].Pass){                       
                        auth_code=1;
                        auth_tipo=bdUser[0].Tipo;
                    } else {auth_code=2}                                      
                }else {                
                    auth_code=0;                    
                 }                                                               
                var auth_dat = {
                    auth_code: auth_code,     //0-no usuario...1-esta usuario y pass ok...2-esta usuario pero pass mal
                    auth_tipo: auth_tipo,     // 0-admin... 1-Doctor....2-Paciente..3-No Reconocido.
                    datosUsuario: bdUser      // Todos los datos del Usuario en BD.
                }
                var authjson = JSON.stringify({ type:'auth_server', data: auth_dat });  
                connection.sendUTF(authjson); 
            }).limit(1);
        }  
        //........................ Fin Mensajes de Autenticacion de Usuario........................

        //........................ Mensajes de Insertar un Usuario (Admin o Doctor)................
        if (json_servidor.type === 'insertar_usuario'){
            
            var valCodigo=0;             
            // primero hay que validar los datos enviados.

            if ((json_servidor.data.Nombre==="")||(json_servidor.data.Apellidos==="")||(json_servidor.data.Correo==="")||(json_servidor.data.Tipo==="")||(json_servidor.data.Usuario==="")||(json_servidor.data.Pass==="")||(json_servidor.data.Repass==="")){
                
                valCodigo=1;  // hay datos en blanco.
                var insertarUsuariojson = JSON.stringify({ type:'insertarUsuario_server', data: valCodigo });  
                connection.sendUTF(insertarUsuariojson);

            } else if (json_servidor.data.Pass!=json_servidor.data.Repass) {

                valCodigo=2;  // la contraseña y la repeticion de contraseña no son iguales.
                var insertarUsuariojson = JSON.stringify({ type:'insertarUsuario_server', data: valCodigo });  
                connection.sendUTF(insertarUsuariojson);

            } else if ((json_servidor.data.Tipo!=0)&&(json_servidor.data.Tipo!=1)) {
 
                valCodigo=3;  // El tipo de usuario no es adecuado.
                var insertarUsuariojson = JSON.stringify({ type:'insertarUsuario_server', data: valCodigo });  
                connection.sendUTF(insertarUsuariojson);

            } else {

                // Segundo hay que ver si el usuario ya existe en Bd.
                Bd_cnx.usuarios_bd.countDocuments({ 'Usuario': json_servidor.data.Usuario }, function (err, uconteo) {

                    if (err) return handleError(err);                    
                    if (uconteo===0){

                        // si pasa todas las validaciones entonces inserto el usuario
                        var usuariojson = {

                            usuario_id: (new Date()).getTime(),
                            Tipo: json_servidor.data.Tipo,
                            Doctor_id: null,
                            Usuario: json_servidor.data.Usuario,
                            Pass: json_servidor.data.Pass,
                            Nombre: json_servidor.data.Nombre,
                            Apellidos: json_servidor.data.Apellidos,
                            Correo: json_servidor.data.Correo,
                            Edad: null,
                            Genero: null,
                            Estado_de_TX: null,
                            Freq_Muestro: null,
                            Periodo_de_Obs: null,
                            Observaciones: null,
                            Ultimo_Contacto: (new Date()).getTime(),   

                        }

                        var tmp_usuario = new Bd_cnx.usuarios_bd(usuariojson);
                        tmp_usuario.save(function (err, tmp_usuario) {
                            if (err) {return console.error(err);}
                            else {

                                // codigo 5 equivale a que el usuario se insertó correctamente
                                valCodigo=5;
                                var insertarUsuariojson = JSON.stringify({ type:'insertarUsuario_server', data: valCodigo });  
                                connection.sendUTF(insertarUsuariojson); 

                            }

                        });
                        

                    } else {

                        // codigo 4 equivale a que el usuario ya existe.
                        valCodigo=4;
                        var insertarUsuariojson = JSON.stringify({ type:'insertarUsuario_server', data: valCodigo });  
                        connection.sendUTF(insertarUsuariojson); 

                    }
                });

            }            

        }
        //........................ Fin Mensajes de Insertar un Usuario (Admin o Doctor)............................


        //............................. Mensajes de Modificar Un Usuario (Admin o Doctor)................................

        if (json_servidor.type === 'modificar_usuario'){ 

            console.log('datos: '+ json_servidor.data);

            var valCodigo=0;             
            // primero hay que validar los datos enviados.

            if ((json_servidor.data.Nombre==="")||(json_servidor.data.Apellidos==="")||(json_servidor.data.Correo==="")||(json_servidor.data.Tipo==="")||(json_servidor.data.Usuario==="")||(json_servidor.data.Pass==="")||(json_servidor.data.Repass==="")){
                
                valCodigo=1;  // hay datos en blanco.
                var modificarUsuariojson = JSON.stringify({ type:'modificar_Usuario_server', data: valCodigo });  
                connection.sendUTF(modificarUsuariojson);

            } else if (json_servidor.data.Pass!=json_servidor.data.Repass) {

                valCodigo=2;  // la contraseña y la repeticion de contraseña no son iguales.
                var modificarUsuariojson = JSON.stringify({ type:'modificar_Usuario_server', data: valCodigo });  
                connection.sendUTF(modificarUsuariojson);

            } else if ((json_servidor.data.Tipo!=0)&&(json_servidor.data.Tipo!=1)) {
 
                valCodigo=3;  // El tipo de usuario no es adecuado.
                var modificarUsuariojson = JSON.stringify({ type:'modificar_Usuario_server', data: valCodigo });  
                connection.sendUTF(modificarUsuariojson);

            } else {  // Si pasa todas las validaciones entonces....

                // Verificar que  el Paciente ya existe en Bd.
                Bd_cnx.usuarios_bd.countDocuments({ 'usuario_id': json_servidor.data.usuario_id }, function (err, pconteo) {

                    if (err) return handleError(err);                                        
                    if (pconteo!=0){

                        // si pasa todas las validaciones entonces modifico el paciente
                        var modificarPaciente = {

                            usuario_id: json_servidor.data.usuario_id,
                            Tipo: json_servidor.data.Tipo,
                            Doctor_id: json_servidor.data.Doctor_id,
                            Usuario: json_servidor.data.Usuario,
                            Pass: json_servidor.data.Pass,
                            Nombre: json_servidor.data.Nombre,
                            Apellidos: json_servidor.data.Apellidos,
                            Correo: json_servidor.data.Correo,
                            Edad: json_servidor.data.Edad,
                            Genero: json_servidor.data.Genero,
                            Estado_de_TX: json_servidor.data.Estado_de_TX,
                            Freq_Muestro: json_servidor.data.Freq_Muestro,
                            Periodo_de_Obs: json_servidor.data.Periodo_de_Obs,
                            Observaciones: json_servidor.data.Observaciones,
                            Ultimo_Contacto: json_servidor.data.Ultimo_Contacto,                            

                        }
                        
                        Bd_cnx.usuarios_bd.findOneAndUpdate({ 'usuario_id': json_servidor.data.usuario_id },modificarPaciente, function (err, mPaciente) {
                            if (err) {return console.error(err);}                            
                           
                            // codigo 5 equivale a que el Paciente se modificó correctamente
                            valCodigo=5;
                            var modificarUsuariojson = JSON.stringify({ type:'modificar_Usuario_server', data: valCodigo });  
                            connection.sendUTF(modificarUsuariojson);                                                                    

                        });
                        

                    } else {

                        // codigo 4 equivale a que el paciente ya existe.
                        valCodigo=4;
                        var modificarUsuariojson = JSON.stringify({ type:'modificar_Usuario_server', data: valCodigo });  
                        connection.sendUTF(modificarUsuariojson);

                    }
                });

            }  

        }

        //............................ Fin Mensajes de Modificar Un Usuario (Admin o Doctor)................................




         //............................Mensajes de Eliminar Un Usuario (Admin o Doctor)................................

        
        
         if (json_servidor.type === 'eliminar_usuario'){ 

             // 1. saber que tipo de usuario es?
             // si es admin... solo borrarlo y listo
             // si es doctor.. hay que borrar todas las muestras de todos los examenes de todos los pacientes..
             // si es paciente.. hay que borrar las muestra de todos sus examenes y sus examenes.
             // serian muestras..examenes..pacientes..doctor..             

             if (json_servidor.tipoUsuario==='0') {   // caso usuario Admin.

                eError=0;
                Bd_cnx.usuarios_bd.findOneAndDelete({'usuario_id': json_servidor.data}, function (err,user){
                    if (err!=null) {
                        eError=1;
                    }

                    if (eError===0){  // chequear a ver si hay errores.

                        var eliminarUsuario = JSON.stringify({ type:'eliminar_usuario_server', data:'ok'});  
                        connection.sendUTF(eliminarUsuario);
        
                    }else {
        
                        var eliminarUsuario = JSON.stringify({ type:'eliminar_usuario_server', data:'err'});  
                        connection.sendUTF(eliminarUsuario);
                
                    }

                });

             } else if (json_servidor.tipoUsuario==='1') {  // caso usuario Doctor.

                var eError=0;                  
                var arrPaciente= [{usuario_id: null}];
                var arrExamenes= [{examen_id: null}];
                var arrMuestras= [{_id: null}];
                
                Bd_cnx.usuarios_bd.find({'Doctor_id': json_servidor.data },'usuario_id',function (err, ePaciente){

                    if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}
                    if (ePaciente.length>0){
                        
                        ePaciente.forEach(elementoPaciente=>{

                            var tmpPaciente = {

                                usuario_id: elementoPaciente.usuario_id

                            }
                            arrPaciente.push(tmpPaciente);

                        });
                    } 

                }).then(()=>{
                                            
                        Bd_cnx.examen_bd.find({ "$or":arrPaciente},'examen_id',function (err, eExamenes){

                            if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}
                            if (eExamenes.length>0){
                                
                                eExamenes.forEach(elementoExamen=>{

                                    var tmpExamenes = {

                                        examen_id: elementoExamen.examen_id
                                    }                                    
                                    arrExamenes.push(tmpExamenes);

                                });
    
                            }
    
                        }).then(()=>{                            

                                Bd_cnx.muestra.find({ "$or":arrExamenes},'_id',function (err, eMuestras){

                                    if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}
                                    if (eMuestras.length>0){

                                        hayMuestras=true;
                                        eMuestras.forEach(elementoMuestra=>{

                                            var tmpMuestra = {

                                                _id: elementoMuestra._id
                                            }                                            
                                            arrMuestras.push(tmpMuestra);

                                        });
            
                                    }

                                }).then(()=>{

                                    Bd_cnx.muestra.deleteMany({ "$or":arrMuestras}, function (err) { //Eliminando las muestras

                                        if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);} 

                                    }).then(()=>{

                                        Bd_cnx.examen_bd.deleteMany({ "$or":arrExamenes}, function (err) { //Eliminando examenes

                                            if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}

                                        }).then(()=>{

                                            Bd_cnx.usuarios_bd.deleteMany({ "$or":arrPaciente}, function (err) { //Eliminando Pacientes

                                                if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}

                                            }).then(()=>{

                                                Bd_cnx.usuarios_bd.findOneAndDelete({'usuario_id': json_servidor.data}, function (err,user){ //Eliminando al doctor

                                                    if (err!=null) {eError=1; console.log('error: '+err); return handleError(err);}
                                                    if (eError===0){  // chequear a ver si hay errores.
        
                                                        var eliminarDoctor = JSON.stringify({ type:'eliminar_usuario_server', data:'ok'});  
                                                        connection.sendUTF(eliminarDoctor);
                                        
                                                    }else {
                                        
                                                        var eliminarDoctor = JSON.stringify({ type:'eliminar_usuario_server', data:'err'});  
                                                        connection.sendUTF(eliminarDoctor);
                                                            
                                                    }
                                                    
                                                });

                                            });


                                        });

                                    });

                                });                            

                        });                                        
                });
             
             } else if (json_servidor.tipoUsuario==='2'){ // caso usuario Paciente.

                eUserTipo=2;
                var eError=0;           
                Bd_cnx.examen_bd.find({'usuario_id': json_servidor.data },'examen_id',function (err, eExamenes){
                  
                    if (err!=null) {merror=1; console.log('error: '+err); return handleError(err);}               
                    if (eExamenes.length>0){ // si hay examenes para este usuario entonces proceder a eliminar sus muestras.
                        
                        var arArr = [];
                       
                        eExamenes.forEach(eElemento=>{  // se eliminan todas las muestras de todos los examenes
    
                            var tmp= {
    
                                examen_id: eElemento.examen_id
                            }
    
                            arArr.push(tmp);
                                                                      
                        }); 
                        
                        Bd_cnx.muestra.deleteMany({ "$or":arArr}, function (err) {
                                
                            if (err!=null){
                                console.log('error: '+err);
                                eError=1;
                            }
                        }).then (Bd_cnx.examen_bd.deleteMany({'usuario_id': json_servidor.data }, function (err) {if (err!=null){eError=1;}}).then (()=>Bd_cnx.usuarios_bd.deleteMany({'usuario_id': json_servidor.data }, function (err) {if (err!=null){eError=1;}})).then (()=>{
    
                            if (eError===0){  // chequear a ver si hay errores.
            
                                var eliminarPaciente = JSON.stringify({ type:'eliminar_usuario_server', data:'ok'});  
                                connection.sendUTF(eliminarPaciente);
                
                            }else {
                
                                var eliminarPaciente = JSON.stringify({ type:'eliminar_usuario_server', data:'err'});  
                                connection.sendUTF(eliminarPaciente);
                                
                            }
            
                        })); 
                    } else {  // en este caso no hay examenes por tanto solo queda eliminar el usuario.
    
                            Bd_cnx.usuarios_bd.findOneAndDelete({'usuario_id': json_servidor.data}, function (err,user){
                                if (err!=null) {
                                    eError=1;
                                }
    
                                if (eError===0){  // chequear a ver si hay errores.
            
                                    var eliminarPaciente = JSON.stringify({ type:'eliminar_usuario_server', data:'ok'});  
                                    connection.sendUTF(eliminarPaciente);
                    
                                }else {
                    
                                    var eliminarPaciente = JSON.stringify({ type:'eliminar_usuario_server', data:'err'});  
                                    connection.sendUTF(eliminarPaciente);
                                        
                                }
    
                            });
    
                    }            
                });

             }
            
        }

        //............................Mensajes de Eliminar Un Usuario (Admin o Doctor)................................



        //........................ Mensajes de Listar los Usuarios de la BD............................
        if (json_servidor.type === 'lista_usuarios'){

            // primero hay buscar todo los usuario en la bd
            Bd_cnx.usuarios_bd.find(function (err, bdUsers) {
                if (err) return handleError(err);                                                  
                if (bdUsers.length>0){

                    var luserjson = JSON.stringify({ type:'usuarios_server', data: bdUsers }); 

                }else {  

                    var luserjson = JSON.stringify({ type:'usuarios_server', data: null });

                 }                                                               

                connection.sendUTF(luserjson);                
            }).limit(50);   // ojo aqui limito a 50 pueden ser mas.

        }
        //........................ Fin Mensajes de Listar un Usuario............................

        //........................ Mensajes de Listar Pacientes de un Doctor............................
        if (json_servidor.type === 'lista_pacientes'){

                      
            Bd_cnx.usuarios_bd.find({ 'Doctor_id': json_servidor.data }, function (err, Pacientes) {
                if (err) return handleError(err);                                                  
                if (Pacientes.length>0){
                    
                    var lpacientejson = JSON.stringify({ type:'pacientes_server', data: Pacientes }); 

                }else {  

                    var lpacientejson = JSON.stringify({ type:'pacientes_server', data: null });

                }                                                               

                connection.sendUTF(lpacientejson);                
            }).limit(50);   // ojo aqui limito a 50 pueden ser mas.

        }
        //........................ Fin Mensajes de Listar Pacientes de un Doctor............................


        //......................................... Mensajes de Insertar un Paciente ........................
        if (json_servidor.type === 'insertar_paciente'){
            
            var valCodigo=0;             
            // primero hay que validar los datos enviados.

            if ((json_servidor.data.usuario_id==="")||(json_servidor.data.Nombre==="")||(json_servidor.data.Apellido==="")||(json_servidor.data.Correo==="")||(json_servidor.data.Edad==="")||(json_servidor.data.Genero==="")||(json_servidor.data.Estado_de_TX==="")||(json_servidor.data.Freq_Muestro==="")||(json_servidor.data.Periodo_de_Obs==="")||(json_servidor.data.Observaciones==="")){
                
                valCodigo=1;  // hay datos en blanco.
                var insertarPaciente = JSON.stringify({ type:'insertar_Paciente_server', data: 1 });  
                connection.sendUTF(insertarPaciente);

            } else if ((Number(json_servidor.data.Edad)<1)||(Number(json_servidor.data.Edad)>110)) {

                valCodigo=2;  // validar la edad
                var insertarPaciente = JSON.stringify({ type:'insertar_Paciente_server', data: 2 });  
                connection.sendUTF(insertarPaciente);

            } else if (json_servidor.data.Observaciones.length>250) {

                valCodigo=3;  // validar campo de observaciones mayor 250 caracteres.
                var insertarPaciente = JSON.stringify({ type:'insertar_Paciente_server', data: 3 });  
                connection.sendUTF(insertarPaciente);

            } else {  // Si pasa todas las validaciones entonces....

                // Segundo hay que ver si el Paciente ya existe en Bd.
                Bd_cnx.usuarios_bd.countDocuments({ 'usuario_id': json_servidor.data.usuario_id }, function (err, pconteo) {

                    if (err) return handleError(err);                                        
                    if (pconteo===0){

                        // si pasa todas las validaciones entonces inserto el usuario
                        var pacientejson = {

                            usuario_id: json_servidor.data.usuario_id,
                            Tipo: json_servidor.data.Tipo,
                            Doctor_id: json_servidor.data.Doctor_id,
                            Usuario: json_servidor.data.Usuario,
                            Pass: json_servidor.data.Pass,
                            Nombre: json_servidor.data.Nombre,
                            Apellidos: json_servidor.data.Apellidos,
                            Correo: json_servidor.data.Correo,
                            Edad: json_servidor.data.Edad,
                            Genero: json_servidor.data.Genero,
                            Estado_de_TX: json_servidor.data.Estado_de_TX,
                            Freq_Muestro: json_servidor.data.Freq_Muestro,
                            Periodo_de_Obs: json_servidor.data.Periodo_de_Obs,
                            Observaciones: json_servidor.data.Observaciones,
                            Ultimo_Contacto: json_servidor.data.Ultimo_Contacto,                            

                        }

                        var tmp_paciente = new Bd_cnx.usuarios_bd(pacientejson);
                        tmp_paciente.save(function (err, bdtmp_paciente) {
                            if (err) {return console.error(err);}
                            else {

                                // codigo 5 equivale a que el Paciente se insertó correctamente
                                var insertarPaciente = JSON.stringify({ type:'insertar_Paciente_server', data: 5 });  
                                connection.sendUTF(insertarPaciente);

                            }

                        });
                        

                    } else {

                        // codigo 4 equivale a que el paciente ya existe.
                        var insertarPaciente = JSON.stringify({ type:'insertar_Paciente_server', data: 4 });  
                        connection.sendUTF(insertarPaciente);

                    }
                });

            }            

        }
        //......................................... Fin Mensajes de Insertar un Paciente ........................

        
        //............................. Mensajes de Eliminar Un Paciente................................

        if (json_servidor.type === 'eliminar_pacientes'){ // hay que eliminar las muestras los examnes y el paciente.

            var eError=0;           
            Bd_cnx.examen_bd.find({'usuario_id': json_servidor.data },'examen_id',function (err, eExamenes){
              
                if (err!=null) {merror=1; console.log('error: '+err); return handleError(err);}               
                if (eExamenes.length>0){ // si hay examenes para este usuario entonces proceder a eliminar sus muestras.
                    
                    var arArr = [];
                   
                    eExamenes.forEach(eElemento=>{  // se eliminan todas las muestras de todos los examenes

                        var tmp= {

                            examen_id: eElemento.examen_id
                        }

                        arArr.push(tmp);
                                                                  
                    }); 
                    
                    Bd_cnx.muestra.deleteMany({ "$or":arArr}, function (err) {
                            
                        if (err!=null){
                            console.log('error: '+err);
                            eError=1;
                        }
                    }).then (Bd_cnx.examen_bd.deleteMany({'usuario_id': json_servidor.data }, function (err) {if (err!=null){eError=1;}}).then (()=>Bd_cnx.usuarios_bd.deleteMany({'usuario_id': json_servidor.data }, function (err) {if (err!=null){eError=1;}})).then (()=>{

                        if (eError===0){  // chequear a ver si hay errores.
        
                            var eliminarPaciente = JSON.stringify({ type:'eliminar_pacientes_server', data:'ok'});  
                            connection.sendUTF(eliminarPaciente);
            
                        }else {
            
                            var eliminarPaciente = JSON.stringify({ type:'eliminar_pacientes_server', data:'err'});  
                            connection.sendUTF(eliminarPaciente);
            
            
                        }
        
                    })); 
                } else {  // en este caso no hay examenes por tanto solo queda eliminar el usuario.

                        Bd_cnx.usuarios_bd.findOneAndDelete({'usuario_id': json_servidor.data}, function (err,user){
                            if (err!=null) {
                                eError=1;
                            }

                            if (eError===0){  // chequear a ver si hay errores.
        
                                var eliminarPaciente = JSON.stringify({ type:'eliminar_pacientes_server', data:'ok'});  
                                connection.sendUTF(eliminarPaciente);
                
                            }else {
                
                                var eliminarPaciente = JSON.stringify({ type:'eliminar_pacientes_server', data:'err'});  
                                connection.sendUTF(eliminarPaciente);
                
                
                            }

                        });

                }            
            });
            

        }

        //............................ Fin Mensajes de Eliminar Un Paciente................................

        
        //............................. Mensajes de Modificar Un Paciente................................

        if (json_servidor.type === 'modificar_pacientes'){ 

            var valCodigo=0;             
            // primero hay que validar los datos enviados.

            if ((json_servidor.data.Nombre==="")||(json_servidor.data.Apellido==="")||(json_servidor.data.Correo==="")||(json_servidor.data.Edad==="")||(json_servidor.data.Genero==="")||(json_servidor.data.Estado_de_TX==="")||(json_servidor.data.Freq_Muestro==="")||(json_servidor.data.Periodo_de_Obs==="")||(json_servidor.data.Observaciones==="")){
                
                valCodigo=1;  // hay datos en blanco.
                var modificarPaciente = JSON.stringify({ type:'modificar_Paciente_server', data: 1 });  
                connection.sendUTF(modificarPaciente);

            } else if ((Number(json_servidor.data.Edad)<1)||(Number(json_servidor.data.Edad)>110)) {

                valCodigo=2;  // validar la edad
                var modificarPaciente = JSON.stringify({ type:'modificar_Paciente_server', data: 2 });  
                connection.sendUTF(modificarPaciente);

            } else if (json_servidor.data.Observaciones.length>250) {

                valCodigo=3;  // validar campo de observaciones mayor 250 caracteres.
                var modificarPaciente = JSON.stringify({ type:'modificar_Paciente_server', data: 3 });  
                connection.sendUTF(modificarPaciente);

            } else {  // Si pasa todas las validaciones entonces....

                // Verificar que  el Paciente ya existe en Bd.
                Bd_cnx.usuarios_bd.countDocuments({ 'usuario_id': json_servidor.data.usuario_id }, function (err, pconteo) {

                    if (err) return handleError(err);                                        
                    if (pconteo!=0){

                        // si pasa todas las validaciones entonces modifico el paciente
                        var modificarPaciente = {

                            usuario_id: json_servidor.data.usuario_id,
                            Tipo: json_servidor.data.Tipo,
                            Doctor_id: json_servidor.data.Doctor_id,
                            Usuario: json_servidor.data.Usuario,
                            Pass: json_servidor.data.Pass,
                            Nombre: json_servidor.data.Nombre,
                            Apellidos: json_servidor.data.Apellidos,
                            Correo: json_servidor.data.Correo,
                            Edad: json_servidor.data.Edad,
                            Genero: json_servidor.data.Genero,
                            Estado_de_TX: json_servidor.data.Estado_de_TX,
                            Freq_Muestro: json_servidor.data.Freq_Muestro,
                            Periodo_de_Obs: json_servidor.data.Periodo_de_Obs,
                            Observaciones: json_servidor.data.Observaciones,
                            Ultimo_Contacto: json_servidor.data.Ultimo_Contacto,                            

                        }
                        
                        Bd_cnx.usuarios_bd.findOneAndUpdate({ 'usuario_id': json_servidor.data.usuario_id },modificarPaciente, function (err, mPaciente) {
                            if (err) {return console.error(err);}                            
                           
                            // codigo 5 equivale a que el Paciente se modificó correctamente
                            var modificarPaciente = JSON.stringify({ type:'modificar_Paciente_server', data: 5 });  
                            connection.sendUTF(modificarPaciente);                                                                    

                        });
                        

                    } else {

                        // codigo 4 equivale a que el paciente ya existe.
                        var modificarPaciente = JSON.stringify({ type:'modificar_Paciente_server', data: 4 });  
                        connection.sendUTF(modificarPaciente);

                    }
                });

            }  

        }

        //............................ Fin Mensajes de Modificar Un Paciente................................


        //........................ Mensajes de Listar Examenes de un Paciente............................
        if (json_servidor.type === 'lista_examenes'){

            Bd_cnx.examen_bd.find({ 'usuario_id': json_servidor.data }, function (err, Examenes) {
                if (err) return handleError(err);                                                  
                if (Examenes.length>0){
                    
                    var lexamnesjson = JSON.stringify({ type:'examenes_server', data: Examenes }); 

                }else {  

                    var lexamnesjson = JSON.stringify({ type:'examenes_server', data: null });

                }                                                               

                connection.sendUTF(lexamnesjson);                
            }).limit(50);   // ojo aqui limito a 50 pueden ser mas.

        }
        //........................ Fin Mensajes de Listar Examenes de un Paciente............................

        //........................ Mensajes de Eliminar Examen de un Paciente............................

        if (json_servidor.type === 'eliminar_examen'){

            var eExamen=0;  

            // 1. Borrar todas las muestras que perteneces a este examen.
            // 2. Borrar el examen .

            Bd_cnx.muestra.deleteMany({'examen_id': json_servidor.data }, function (err) {
                if (err!=null){
                    eExamen=1;
                }
            }).then (

                Bd_cnx.examen_bd.findOneAndDelete({'examen_id': json_servidor.data}, function (err,Examen){

                    if (err!=null) {
                        eExamen=1;
                    }

                    if (eExamen===0){  // chequear a ver si hay errores.

                        var eliminarExamen = JSON.stringify({ type:'eliminar_examen_server', data:'ok'});  
                        connection.sendUTF(eliminarExamen);
        
                    }else {
        
                        var eliminarExamen = JSON.stringify({ type:'eliminar_examen_server', data:'err'});  
                        connection.sendUTF(eliminarExamen);

                    }

                })
            );
        }
        //........................ Fin Mensajes de Eliminar Examen de un Paciente............................



        //........................ Mensajes de Envio datos desde BD (Señal real adquirida)............................

        if (json_servidor.type === 'Enviar_BD'){

            total_muestras=(json_servidor.pos*json_servidor.tbloque);

            Bd_cnx.muestra.find({ 'examen_id': json_servidor.examen_id }, 'muestra est_tiempo', function (err, mmuestra) {
                if (err) return handleError(err); 

                if (mmuestra.length>0){   // si hay disponibilidad de datos entonces enviar.
                    
                    // enviando bloque de datos                                                                                     
                    mmuestra.forEach(elemento => {
                    
                        var tmp_m= (elemento.muestra*10);            // Muestra Pura  
                        var PB_tmp=0;                           // Muestra Filtrada PB
                        var Dif_tmp=0                           // Muestra Derivada
                        var Senal_cudratica=0;                  // Muestra x Muestra                            
                        

                        // Procesando señal para serie RR.......................................

                        // Filtrado pasabanda
                        PB_tmp=filtrado.filt_PB_5_15(tmp_m);

                        // Derivando Señal
                        Dif_tmp=PB_tmp-Der_ultima_muestra;
                        Der_ultima_muestra=PB_tmp;

                        // Elevando la señal al cuadrado
                        Senal_cudratica=Dif_tmp*Dif_tmp;

                        // Buscando maximos en señal
                        if (Senal_cudratica>max_senal){

                            max_senal=Senal_cudratica;

                        }

                        // fin Procesando señal para serie RR..................................

                        var mobj = { //Creo Objeto con las caracteristicas de la muestra.

                            time: total_muestras,
                            valor: tmp_m,
                            
                        };

                        var rr_obj = { //Creo Objeto con las caracteristicas de la muestra para procesar serie rr.

                            time: total_muestras,//elemento.est_tiempo,
                            valor: Senal_cudratica,//elemento.muestra,                           
            
                        };

                        data_bd.push(mobj);
                        data_rr.push(rr_obj);
                        total_muestras++;  
                                              
                    });

                    // Calculo serie RR
                    val_ant=0;
                    var tmp_max=0;                    // Valor del maximo temporal
                    var tmpAhora=0;                   // valor temporal ahora.
                    data_rr.forEach(element_rr => {   //Normalizando la señal
                            
                        tmp_max=element_rr.valor/max_senal;
                        
                        if (tmp_max>0.87){      //0.87
                            tmpAhora=1;                            
                        } else {
                            tmpAhora=0;                            
                        }
                         
                        element_rr.valor=0;

                        if ((val_ant===1)&&(tmpAhora===0)){

                            element_rr.valor=1; 
                            latidos++;                            
                            tmp_r= element_rr.time;
                            tmp_rr=tmp_r-r_ant;
                            r_ant=tmp_r;
                            rr_medio_sum=rr_medio_sum+tmp_rr;
                            rr_medio=rr_medio_sum/latidos;
                            fc_medio=1/(rr_medio/(json_servidor.tbloque*2));
                            if (tmp_rr>rr_max){
                                rr_max=tmp_rr;
                            }
                            if (tmp_rr<rr_min){
                                rr_min=tmp_rr;
                            }
                            desv_rr=rr_max-rr_min;                           

                        } 

                        val_ant=tmpAhora;

                    });  

                    for(var rr=0; rr<data_rr.length; rr++){

                        if (data_rr[rr].valor===1){

                            data_rr[rr].valor=data_bd[rr].valor;                            
                        }                        
                    }
                        
                    rr_info = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.

                        lat: latidos,
                        rr: tmp_rr,
                        rr_med: rr_medio,  
                        fc_med: fc_medio,
                        des_rr: desv_rr,
                        ritmo:  (fc_medio*60)                             
                
                    };                                
                                                 
                    var msgjson = JSON.stringify({ type:'msg_bd', data: data_bd, data_rr:data_rr, rrinfo: rr_info, fin_tx:false});  
                    connection.sendUTF(msgjson);                     
                    data_bd.splice(0,data_bd.length); // vaciando arreglo para proximo envio.  
                    data_rr.splice(0,data_rr.length); // vaciando arreglo para proximo envio.                               

                } else {

                    var msgjson = JSON.stringify({ type:'msg_bd_fin', fin_tx:true});  
                    connection.sendUTF(msgjson); 

                    // Inicializaciones   
                    
                    max_senal=0;                        // Buscando maximo en señal
                    latidos=0;                          // Numero total de latido registrados
                    tmp_r=0;                            // Valor de la muestra donde se detecto el punto R ahora
                    r_ant=0;                           // Valor de la muestra anterior donde se registro RR.
                    tmp_rr=0;                          // Serie RR Actual
                    rr_medio=0;                        // Valor de rr medio detectado.
                    rr_medio_sum=0;                    // Sumatoria de todos los rr se usa para buscar el promedio.
                    fc_medio=0;                        // Frecuencia cardiaca media detectada.
                    rr_max=0;                          // Valor de RR maximo detectado.
                    rr_min=20000;                      // Valor RR minimo Detectado
                    desv_rr=0;                         // desviacion RR detectada.   
                    val_ant=0;             
                
                    Der_ultima_muestra=0;

                    total_muestras=0;                  // Cantidad total de muestras de bd enviadas al usuario.  
                    data_bd = [];                      // almacena datos de la bd.
                    data_rr = [];                      // almacena datos de serie RR
                    
                }                                                                                 
                                                                    
            }).skip((json_servidor.tbloque*json_servidor.pos)).limit(json_servidor.tbloque);

        }                    

        //........................ Mensajes de Envio datos desde BD (Señal real adquirida)............................



        if (json_servidor.type === 'SAVE666'){

            var espera=true;

            for (var ppp=0; ppp<12000; ppp++){

                var tmp_m= senal_save[cont_senal_save]; // Muestra Pura 
                espera=true;
                var muestrajson = {
            
                    examen_id: 2222222,
                    muestra: tmp_m,
                    est_tiempo: (new Date()).getTime(),
               
                  };

                // 4 Salvar Datos en BD
                
                Bd_cnx.muestra.create(muestrajson, function (err, bdmuestra) {
                    if (err) return handleError(err);
                                            
                  });/*.then (()=>{

                      espera=false;
                    });*/

                  //while (espera===true) {}
                  cont_senal_save++;                  
                  if (cont_senal_save>115) {cont_senal_save=0;}    
                  console.log('muestra agregada: '+ppp);             
            }

        }



        //........................ Mensajes de Envio datos desde BD (Señal muestra Grabada)............................


        if (json_servidor.type === 'Enviar'){
          
         // probando senal grabada
         for (var pp=0; pp<100; pp++){


            var tmp_m= senal_save[cont_senal_save]; // Muestra Pura  
            var PB_tmp=0;                           // Muestra Filtrada PB
            var Dif_tmp=0                           // Muestra Derivada
            var Senal_cudratica=0;                  // Muestra x Muestra                            
            var tmp_max=0;                          // Valor del maximo temporal

            // Procesando señal para serie RR.......................................

            // Filtrado pasabanda
            PB_tmp=filtrado.filt_PB_5_15(tmp_m);

            // Derivando Señal
            Dif_tmp=PB_tmp-Der_ultima_muestra;
            Der_ultima_muestra=PB_tmp;

            // Elevando la señal al cuadrado
            Senal_cudratica=Dif_tmp*Dif_tmp;

            // Buscando maximos en señal
            if (Senal_cudratica>max_senal){

                max_senal=Senal_cudratica;

            }

            // fin Procesando señal para serie RR..................................


            var mobj = { //Creo Objeto con las caracteristicas de la muestra.

                time: total_muestras,//elemento.est_tiempo,
                valor: tmp_m.toFixed(2),//elemento.muestra,
                //id: idClienteSolicitado

            };

            var rr_obj = { //Creo Objeto con las caracteristicas de la muestra para procesar serie rr.

                time: total_muestras,//elemento.est_tiempo,
                valor: Senal_cudratica,//elemento.muestra,                

            };


            cont_senal_save++;
            if (cont_senal_save>115){cont_senal_save=0;} 
            //if (cont_senal_save<0){cont_senal_save=115;} 
            data_bd.push(mobj);
            data_rr.push(rr_obj);
            total_muestras++;   

         }


         //console.log('max_senal: ',max_senal);
         // Calculo serie RR
         var val_ant=0;
         data_rr.forEach(element_rr => {   //Normalizando la señal

            tmp_max=element_rr.valor/max_senal;
            if (tmp_max>0.65){
                element_rr.valor=1;
            } else {
                element_rr.valor=0;
            }
            
            if ((val_ant===1)&&(element_rr.valor===0)){

                latidos++;
                tmp_r= element_rr.time;
                tmp_rr=tmp_r-r_ant;
                r_ant=tmp_r;
                rr_medio_sum=rr_medio_sum+tmp_rr;
                rr_medio=rr_medio_sum/latidos;
                fc_medio=1/(rr_medio*0.005);
                if (tmp_rr>rr_max){
                    rr_max=tmp_rr;
                }
                if (tmp_rr<rr_min){
                    rr_min=tmp_rr;
                }
                desv_rr=rr_max-rr_min;

            }
            val_ant=element_rr.valor;

            });
        
         // Fin Calculo serie RR

         var msgjson = JSON.stringify({ type:'msg_bd', data: /*data_rr*/data_bd });  
         connection.sendUTF(msgjson);          
         data_bd.splice(0,data_bd.length); // vaciando arreglo para proximo envio.  
         data_rr.splice(0,data_rr.length); // vaciando arreglo para proximo envio. 
         // fin probando senal grabada
   
         // enviando informacion al cliente.


         /*console.log('. ');
            console.log('. ');
            console.log('latidos: ',latidos);
            console.log('Tmp_rr: ',tmp_rr*0.005,' ms');
            console.log('rr_medio: ',rr_medio*0.005,' ms');
            console.log('fc_medio: ',fc_medio,' Hz');
            console.log('desv_r: ',desv_rr*0.005,' ms');*/

        var rr_info = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.

            lat: latidos,
            rr: tmp_rr,
            rr_med: rr_medio,  
            fc_med: fc_medio,
            des_rr: desv_rr,                             

        };

        var rr_info_json = JSON.stringify({ type:'rr_info_json', data: rr_info });  
        //connection.sendUTF(rr_info_json);

    }
        //........................ Fin Mensajes de Envio datos desde BD (Señal muestra Grabada)............................


        // ................... Mensaje de solicitud de paciente al cual se desea escuchar en tr.........................

        if (json_servidor.type === 'sol_paciente_rt'){

            var pos_cnx = clientes.findIndex(p => p.id_cnx == id_cnx_cliente);            
            clientes[pos_cnx].rt_sol= json_servidor.data; 

            var solrt_json = JSON.stringify({ type:'sol_paciente_rt_ack'});
            connection.sendUTF(solrt_json);

        }

        // ................... Mensaje de solicitud de paciente al cual se desea escuchar en tr.........................


        //........................ Msg insertar examen prueba............................
        if (json_servidor.type === 'test'){            

        }


        //........................ fin insertar examen prueba............................
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // Aqui cominezan los MSG de los Pacientes
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

         //........................ Paciente informa su ID............................

         if (json_servidor.type === 'paciente_id') {

            console.log ('el paciente envio el id: '+ json_servidor.data);
            idCliente=json_servidor.data;
            connection.sendUTF("OKR");  //Se le manda ack de conexion de registro de id.

         }
        //........................ fin Paciente informa su ID............................

        //........................ Paciente Solicita que se confirme que ya hay nuevo de exámen....................

        if (json_servidor.type === 'examen_id') {

            //1 ....hay que buscar los datos del paciente de FM y Periodo de Obs y luego crear el examen

            var tmpFM=0;
            var tmpPObs=0;

            Bd_cnx.usuarios_bd.findOne({'usuario_id': idCliente},'Freq_Muestro Periodo_de_Obs', function (err, dUsuario){

                 if (err) return handleError(err);
                 tmpFM=dUsuario.Freq_Muestro;
                 tmpPObs=dUsuario.Periodo_de_Obs;

            }).then(()=>{

                examen_id=(new Date()).getTime(); 
                console.log ('el paciente solicito el examen id se le dio: '+examen_id);                            
                var examen_idjson = {
                
                    examen_id: examen_id,
                    usuario_id: idCliente, 
                    Freq_Muestro:tmpFM,  
                    Periodo_de_Obs:tmpPObs, 
                    est_tiempo: (new Date()).getTime(),
            
                };
                            
                Bd_cnx.examen_bd.create(examen_idjson, function (err, bdexamen_id) {

                    if (err) return handleError(err);
                    connection.sendUTF("OKE");  //Se le manda ack de que ya tiene registro de examen.
                                            
                });

            });
                                          
         }
        //........................ fin Paciente Solicita que se confirme que ya hay nuemro de examen...............

         //........................ Paciente Solicita Frecuencia de muestreo....................

         if (json_servidor.type === 'FM_ESTADO') {

            Bd_cnx.usuarios_bd.find({ 'usuario_id': idCliente }, 'Freq_Muestro', function (err, mFreq_Muestro) {
                if (err) return handleError(err);
                if (mFreq_Muestro[0].Freq_Muestro==="100"){   //estado en bd de FM=100                   
                    connection.sendUTF("FM:100");  //Se le manda orden de muestrear a 100Hz.
                } else if (mFreq_Muestro[0].Freq_Muestro==="200"){  //estado en bd de FM=200
                    connection.sendUTF("FM:200");  //Se le manda orden de muestrear a 200Hz.
                } else if (mFreq_Muestro[0].Freq_Muestro==="250"){ //estado en bd de FM=250
                    connection.sendUTF("FM:250");  //Se le manda orden de muestrear a 250Hz.    
                }else if (mFreq_Muestro[0].Freq_Muestro==="500"){ //estado en bd de FM=500
                    connection.sendUTF("FM:500");  //Se le manda orden de muestrear a 500Hz.
                }else {        // revisar bd hay error en tipo de dato debe ser 100,200,250,500.
                    console.log('Freq_Muestro en bd..... VALOR NO DEFINIDO------> ERROR');
                }
              }).limit(1);
            
         }
        //........................ fin Paciente Solicita Frecuencia de muestreo...............


        //........................ Paciente Solicita Periodo de observacion....................

         if (json_servidor.type === 'PERIODO_ESTADO') {

            Bd_cnx.usuarios_bd.find({ 'usuario_id': idCliente }, 'Periodo_de_Obs', function (err, mPeriodo_de_Obs) {
                if (err) return handleError(err);
                if (mPeriodo_de_Obs[0].Periodo_de_Obs==="1"){   //estado en bd de Periodo_de_Obs=1                   
                    connection.sendUTF("T:1");  //Se le manda orden de muestrear durante 1 min.
                } else if (mPeriodo_de_Obs[0].Periodo_de_Obs==="3"){   //estado en bd de Periodo_de_Obs=3                   
                    connection.sendUTF("T:3");  //Se le manda orden de muestrear durante 3 min.
                } else if (mPeriodo_de_Obs[0].Periodo_de_Obs==="15"){   //estado en bd de Periodo_de_Obs=15                   
                    connection.sendUTF("T:15");  //Se le manda orden de muestrear durante 15 min.
                }else if (mPeriodo_de_Obs[0].Periodo_de_Obs==="30"){   //estado en bd de Periodo_de_Obs=30                   
                    connection.sendUTF("T:30");  //Se le manda orden de muestrear durante 30 min.
                }else if (mPeriodo_de_Obs[0].Periodo_de_Obs==="0"){   //estado en bd de Periodo_de_Obs=0                  
                    connection.sendUTF("T:CONT");  //Se le manda orden de muestrear CONTINUO.
                }else {        // revisar bd hay error en tipo de dato debe ser 0,1,3,15,30.
                    console.log('Periodo_de_Obs en bd..... VALOR NO DEFINIDO------> ERROR');
                }
              }).limit(1); 
            
         }
        //........................ fin Paciente Solicita Periodo de observacion...............

        //........................ Paciente Solicita El estado de transmision....................

         if (json_servidor.type === 'TX_ESTADO') {

            Bd_cnx.usuarios_bd.find({ 'usuario_id': idCliente }, 'Estado_de_TX', function (err, mEstado_de_TX) {
                if (err) return handleError(err);
                if (mEstado_de_TX[0].Estado_de_TX==="0"){   //estado en bd es no tx para este usuario                    
                    connection.sendUTF("DET");  //Se le manda orden de detener tx de muestras al usuario emisor.
                } else if (mEstado_de_TX[0].Estado_de_TX==="1"){  //estado en bd es si tx para este usuario
                    connection.sendUTF("OKC");  //Se le manda orden de tx muestras al usuario emisor.
                } else {        // revisar bd hay error en tipo de dato debe ser 0 o 1.
                    console.log('Estado de TX en bd.....VALOR NO DEFINIDO------> ERROR');
                }
              }).limit(1);
            
         }
        //........................ fin Paciente Solicita El estado de transmision...............

        //........................ Paciente Envia muestra a salvar en bd y re-tx....................

            if (json_servidor.type === 'muestra') {

                // 1..Primero chequear que el usuario tenga Id y examen_id registrados

                if ((idCliente>0)&&(examen_id>0)){

                    
                    // 2. Filtrar la señal
                    var tmp_filtrado_1=filtrado.filt_PA_1(json_servidor.data);

                    // 3. Creao json de la muestra
                    
                    var muestrajson = {
            
                        examen_id: examen_id,
                        muestra: tmp_filtrado_1.toFixed(1),
                        est_tiempo: (new Date()).getTime(),
                   
                      };

                    // 4 Salvar Datos en BD
                    
                    Bd_cnx.muestra.create(muestrajson, function (err, bdmuestra) {
                        if (err) return handleError(err);
                                                
                      });

                    // Retransmitir informacion para visualizar en tiempo real.  

                    var rt_obj ={    //Creacion de la muestra en TR

                        time: muestrajson.est_tiempo,
                        valor: muestrajson.muestra,
                        
                    };  

                    cont_m_rt++;
                    if(cont_m_rt<tam_bloque){

                        data_t_real.push(rt_obj);

                    }else {

                        data_t_real.push(rt_obj);
                        cont_m_rt=0;   
                        
                        
                        //Procesando Bloque
                        data_t_real.forEach(elementoTR => {

                            var tmp_m= (elementoTR.valor);           // Muestra Pura  
                            var PB_tmp=0;                           // Muestra Filtrada PB
                            var Dif_tmp=0                           // Muestra Derivada
                            var Senal_cudratica=0;                  // Muestra x Muestra                            
                                
                            // Procesando señal para serie RR.......................................
    
                            // Filtrado pasabanda
                            PB_tmp=filtrado.filt_PB_5_15(tmp_m);
    
                            // Derivando Señal
                            Dif_tmp=PB_tmp-Der_ultima_muestra;
                            Der_ultima_muestra=PB_tmp;
    
                            // Elevando la señal al cuadrado
                            Senal_cudratica=Dif_tmp*Dif_tmp;
    
                            // Buscando maximos en señal
                            if (Senal_cudratica>max_senal){
    
                                max_senal=Senal_cudratica;
    
                            }
                            // fin Procesando señal para serie RR..................................
    
                            var rr_obj = { //Creo Objeto con las caracteristicas de la muestra para procesar serie rr.
    
                                time: elementoTR.time,
                                valor: Senal_cudratica,                          
                
                            };
                                
                            data_rr.push(rr_obj);                             

                        });

                        // Calculo serie RR
                        val_ant=0;
                        var tmp_max=0;                    // Valor del maximo temporal

                        data_rr.forEach(element_rr => {   //Normalizando la señal
                                
                            tmp_max=element_rr.valor/max_senal;
                            if (tmp_max>0.9){   
                                element_rr.valor=1;
                            } else {
                                element_rr.valor=0;
                            }                            
                                
                            if ((val_ant===1)&&(element_rr.valor===0)){

                                latidos++;
                                tmp_r= element_rr.time;
                                tmp_rr=tmp_r-r_ant;
                                r_ant=tmp_r;
                                rr_medio_sum=rr_medio_sum+tmp_rr;
                                rr_medio=rr_medio_sum/latidos;
                                fc_medio=1/(rr_medio/(json_servidor.tbloque*2));
                                if (tmp_rr>rr_max){
                                    rr_max=tmp_rr;
                                }
                                if (tmp_rr<rr_min){
                                    rr_min=tmp_rr;
                                }
                                desv_rr=rr_max-rr_min;

                            }

                            val_ant=element_rr.valor;

                        });  
                            
                        rr_info = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.

                            lat: latidos,
                            rr: tmp_rr,
                            rr_med: rr_medio,  
                            fc_med: fc_medio,
                            des_rr: desv_rr,
                            ritmo:  (fc_medio*60)                             

                        };

                        //Fin Procesando Bloque



                        // haciendo un broadcast a todos los clientes 
                        var rt_json = JSON.stringify({ type:'msg_bd', data: data_t_real, rrinfo: rr_info });
                        for (var i=0; i < clientes.length; i++) {

                            if (clientes[i].rt_sol===idCliente) {
 
                                clientes[i].conexion.sendUTF(rt_json);
                
                            }
                            
                        }

                        data_t_real.splice(0,data_t_real.length); // vaciando arreglo para proximo envio.
                        data_rr.splice(0, data_rr.length); // vaciando arreglo para proximo envio.
                    }

                }

             }
        //........................ fin Paciente Envia muestra a salvar en bd y re-tx...............


    });

    
    // Desconexión
    connection.on('close', function(connection) {

        var posicion = clientes.findIndex(p => p.id_cnx == id_cnx_cliente);
        clientes.slice(posicion, 1);
        cant_clientes_cnx--; 

        console.log((new Date()) + " Usuario : "
                + id_cnx_cliente + " desconectado.");
               
        console.log('Cantidad de clientes concurrentes:  '+cant_clientes_cnx);

    });

});

setInterval(function() {         // Probando tx en rt.
   
    for (var pppp=0; pppp<100; pppp++){

        var ntmp_m= senal_save[cont_senal_save_TR]; // Muestra Pura  
        var nmobj = { //Creo Objeto con las caracteristicas de la muestra.
            
            time: cont_global,
            valor: ntmp_m.toFixed(2),//elemento.muestra,           

        };

        cont_senal_save_TR++;
        if (cont_senal_save_TR>115){cont_senal_save_TR=0;}         
        ndata_bd.push(nmobj);
        cont_global++;               

     }

     var nrt_json = JSON.stringify({ type:'msg_TR', data: ndata_bd });
     for (var ii=0; ii < clientes.length; ii++) {

            if (clientes[ii].rt_sol==="123") {
 
                clientes[ii].conexion.sendUTF(nrt_json);

            }
            
        }

     ndata_bd.splice(0,ndata_bd.length); // vaciando arreglo para proximo envio.
   
}, 500);

