
"use strict";
    
process.title = 'WsG_Backend';

// Puerto websocket
var webSocketsServerPort = 2000;  //1337

// websocket y servidor http
var webSocketServer = require('websocket').server;
var http = require('http');


//Declaraciones Globales Importantes

var clientes = [];  // todos los clientes conectados.
var cant_clientes_cnx=0;        //cantidad de clientes conectados en el momento.
var cant_clientes_total=0;      //cantidad de clientes totales conectador.


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
    httpServer: server
});


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
    

    cant_clientes_cnx++;     //Incremento la cantidad de usuario concurrentes en 1
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
           
//****************************************************************************************************************** */
    // Variables de Conexion
//**************************************************************************************************************** */
    // Variables para Clientes y TR

    var idCliente = 0;                // se asume que el usuario no tiene id en el sistema.
    var examen_id = 0;                // se crea un nuevo examen para registrar las muestras. 
    var total_muestras=0;             // Cantidad total de muestras de bd enviadas al usuario. 
    var data_bd = [];                 // almacena datos de la bd.
    var data_rr = [];                 // almacena datos de serie RR
    var rr_info = {};                 // Datos calculo de la serie RR
    var data_t_real = [];             // almacena datos en tiempo real.
    var data_t_real_rr = [];          // almacena datos en tiempo real del procesamiento de la serie rr.
    var cont_m_rt=0;                  // Contador de bloque de muestra en tiempo real.
    var contTR=0;                     // Contador de total de muestras enviadas en TR.

    var tmpFM=0;                      // Fm del Cliente. 
    var tmpPObs=0;                    // Periodo de Observacion del cliente.
    var tmpEstTX=0;                   // Estado de TX del Cliente.
    var ventana_TR = [];                 // Almacena la ventana de observacion.
    var tamVentana_TR                 // Ventana en TR.
    var tmpAhora_TR=0;                // valor temporal ahora ventana TR.                                  
    var pos_max_TR=0;                 // posicion del maximo temporal ventana TR.
    var max_ventana_TR=0;             // Maximo de la ventana TR.
    var val_ant_TR=0;                 // Valor Anterior de deteccion de punto RR (variable auxiliar) TR.
    var Der_ultima_muestra_TR=0;      // Derivada en TR.

    var latidos_TR=0;                 // Numero total de latido registrados TR
    var tmp_r_TR=0;                   // Valor de la muestra donde se detecto el punto R ahora TR
    var r_ant_TR=0;                   // Valor de la muestra anterior donde se registro RR TR.
    var tmp_rr_TR=0;                  // Serie RR Actual TR
    var rr_medio_TR=0;                // Valor de rr medio detectado TR.
    var rr_medio_sum_TR=0;            // Sumatoria de todos los rr se usa para buscar el promedio TR.
    var fc_medio_TR=0;                // Frecuencia cardiaca media detectada TR.
    var rr_max_TR=0;                  // Valor de RR maximo detectado TR.
    var rr_min_TR=20000;              // Valor RR minimo Detectado TR
    var desv_rr_TR=0;                // desviacion RR detectada TR.
    var rr_info_TR={};               // Datos RR en TR



    var s_ini=0;
    var s_fin=0;
    var s_max=0;
    var s_pos=0; 

    // var fil PA 1Hz

    var fPAYn1_TR=0;
    var fPAYn2_TR=0;
    var fPAXn_TR=0;
    var fPAXn1_TR=0;
    var fPAXn2_TR=0;
    var fPAB1_TR=0;
    var fPAB2_TR=0;
    var fPAB3_TR=0;
    var fPAA1_TR=1;
    var fPAA2_TR=0;
    var fPAA3_TR=0;
    var fPAYn_TR=0;
        
    //  fil PB 40Hz

    var fPBYn1_TR=0;
    var fPBYn2_TR=0;
    var fPBXn_TR=0;
    var fPBXn1_TR=0;
    var fPBXn2_TR=0;
    var fPBB1_TR=0;
    var fPBB2_TR=0;
    var fPBB3_TR=0;
    var fPBA1_TR=1;
    var fPBA2_TR=-0;
    var fPBA3_TR=0;
    var fPBYn_TR=0;

    // fil PBAN 5Hz-15Hz

    var PBAN_Yn_1_TR=0;
    var PBAN_Yn_2_TR=0;
    var PBAN_Yn_3_TR=0;
    var PBAN_Yn_4_TR=0;
    var PBAN_Xn_TR=0;
    var PBAN_Xn_1_TR=0;
    var PBAN_Xn_2_TR=0;
    var PBAN_Xn_3_TR=0;
    var PBAN_Xn_4_TR=0;
    var PBAN_B1_TR=0;
    var PBAN_B2_TR=0;
    var PBAN_B3_TR=-0;
    var PBAN_B4_TR=0;
    var PBAN_B5_TR=0;
    var PBAN_A1_TR=1.0000;
    var PBAN_A2_TR=0;
    var PBAN_A3_TR=0;
    var PBAN_A4_TR=0;
    var PBAN_A5_TR=0;
    var PBAN_Y_TR=0;

//********************************************************************************************************* */
    // Variables del calculo de la serie RR desde BD
  
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
    var ventana = [];                      // Almacena la ventana de observacion.
    var rrUmbral=50;                      // Humbral Inicial de deteccion de la serie rr.
    var tmp_max=0;                        // Valor del maximo temporal Ventana.
    var tmpAhora=0;                       // valor temporal ahora ventana.                                  
    var pos_max=0;                        // posicion del maximo temporal ventana.
    var maximo_total=0;                   // Maximo total
    var max_ventana=0;                    // Maximo de la ventana.
    var Der_ultima_muestra=0;             // Derivada en Reproduccion desde BD.
    var rr_valor=0;                       // Valor temporal del punto R


    
    var serie_r= [];                      // Arreglo con la serie R
    var serie_rr= [];                     // Arreglo con la serie RR  
    var desv_rr_tmp=0;                    // std temporal 
    var desv_rr_tmp_suma=0;               // suma de std parciales.

    // var fil PA 1Hz

    var fPAYn1=0;
    var fPAYn2=0;
    var fPAXn=0;
    var fPAXn1=0;
    var fPAXn2=0;
    var fPAB1=0;
    var fPAB2=0;
    var fPAB3=0;
    var fPAA1=1;
    var fPAA2=0;
    var fPAA3=0;
    var fPAYn=0;
      
    //  fil PB 40Hz

    var fPBYn1=0;
    var fPBYn2=0;
    var fPBXn=0;
    var fPBXn1=0;
    var fPBXn2=0;
    var fPBB1=0;
    var fPBB2=0;
    var fPBB3=0;
    var fPBA1=1;
    var fPBA2=0;
    var fPBA3=0;
    var fPBYn=0;

    // fil PBAN 5Hz-15Hz

    var PBAN_Yn_1=0;
    var PBAN_Yn_2=0;
    var PBAN_Yn_3=0;
    var PBAN_Yn_4=0;
    var PBAN_Xn=0;
    var PBAN_Xn_1=0;
    var PBAN_Xn_2=0;
    var PBAN_Xn_3=0;
    var PBAN_Xn_4=0;
    var PBAN_B1=0;
    var PBAN_B2=0;
    var PBAN_B3=0;
    var PBAN_B4=0;
    var PBAN_B5=0;
    var PBAN_A1=1.0000;
    var PBAN_A2=0;
    var PBAN_A3=0;
    var PBAN_A4=0;
    var PBAN_A5=0;
    var PBAN_Y=0;

//******************************************************************************************************** */
    // Fin declaracion de variables de conexion
//********************************************************************************************************* */

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
            }).limit(100);   // ojo aqui limito a 50 pueden ser mas.
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

        //.................................................Enviar Señal desde BD.............................................

        if (json_servidor.type === 'Enviar_BD'){

            total_muestras=(json_servidor.pos*json_servidor.tbloque); 

            //2. Inicializacion de los coeficientes de los filtros a utilizar.
            if (Number(json_servidor.tbloque*2)===100){
                // var fil PA 1Hz  TR
                    fPAB1=0.9565;
                    fPAB2=-1.9131;
                    fPAB3=0.9565;
                    fPAA1=1;
                    fPAA2=-1.9112;
                    fPAA3=0.9150;                         
                    //  fil PB 40Hz TR
                    fPBB1=0.6389;
                    fPBB2=1.2779;
                    fPBB3=0.6389;
                    fPBA1=1;
                    fPBA2=1.1430;
                    fPBA3=0.4128;
                    // fil PBAN 5Hz-15Hz TR
                    PBAN_B1=0.0675;
                    PBAN_B2=0;
                    PBAN_B3=-0.1349;
                    PBAN_B4=0;
                    PBAN_B5=0.0675;
                    PBAN_A1=1.0000;
                    PBAN_A2=-2.6736;
                    PBAN_A3=2.9924;
                    PBAN_A4=-1.6746;
                    PBAN_A5=0.4128;
                }else if (Number(json_servidor.tbloque*2)===200){
                    // var fil PA 1Hz
                    fPAB1=0.9777;
                    fPAB2=-1.9554;
                    fPAB3=0.9777;
                    fPAA1=1;
                    fPAA2=-1.9549;
                    fPAA3=0.9559;                         
                    //  fil PB 40Hz
                    fPBB1=0.2066;
                    fPBB2=0.4131;
                    fPBB3=0.2066;
                    fPBA1=1;
                    fPBA2=-0.3695;
                    fPBA3=0.1958;
                    // fil PBAN 5Hz-15Hz
                    PBAN_B1=0.0201;
                    PBAN_B2=0;
                    PBAN_B3=-0.0402;
                    PBAN_B4=0;
                    PBAN_B5=0.0201;
                    PBAN_A1=1.0000;
                    PBAN_A2=-3.4289;
                    PBAN_A3=4.5303;
                    PBAN_A4=-2.7383;
                    PBAN_A5=0.6414;
                }else if (Number(json_servidor.tbloque*2)===250){
                    // var fil PA 1Hz
                    fPAB1=0.9824;
                    fPAB2=-1.9648;
                    fPAB3=0.9824;
                    fPAA1=1;
                    fPAA2=-1.9645;
                    fPAA3=0.9651;                         
                    //  fil PB 40Hz
                    fPBB1=0.1453;
                    fPBB2=0.2906;
                    fPBB3=0.1453;
                    fPBA1=1;
                    fPBA2=-0.6710;
                    fPBA3=0.2523;
                    // fil PBAN 5Hz-15Hz
                    PBAN_B1=0.0134;
                    PBAN_B2=0;
                    PBAN_B3=-0.0267;
                    PBAN_B4=0;
                    PBAN_B5=0.0134;
                    PBAN_A1=1.0000;
                    PBAN_A2=-3.5609;
                    PBAN_A3=4.8389;
                    PBAN_A4=-2.9769;
                    PBAN_A5=0.7009;

                }        
            Bd_cnx.muestra.find({ 'examen_id': json_servidor.examen_id }, 'muestra est_tiempo', function (err, mmuestra) {
                if (err) return handleError(err);
                if (mmuestra.length>0){   // si hay disponibilidad de datos entonces enviar.  

                    // inicializando ventana                         
                    var tamVentana=Math.round((15*(json_servidor.tbloque*2))/100);
                    
                    for (var vv=0; vv<tamVentana; vv++){  //Inicializacion de la ventana                       
                        ventana.push(0);
                    }
                                             
                    for (var f=0; f<mmuestra.length; f++){

                        //PA

                        fPAXn=mmuestra[f].muestra;                        
                        fPAYn= ((fPAB1*fPAXn) + (fPAB2*fPAXn1) + (fPAB3*fPAXn2) - (fPAA2*fPAYn1) - (fPAA3*fPAYn2));                       
                        fPAXn2=fPAXn1;
                        fPAXn1=fPAXn;
                        fPAYn2=fPAYn1;
                        fPAYn1=fPAYn;

                        //PB

                        fPBXn=fPAYn;                        
                        fPBYn= ((fPBB1*fPBXn) + (fPBB2*fPBXn1) + (fPBB3*fPBXn2) - (fPBA2*fPBYn1) - (fPBA3*fPBYn2));                       
                        fPBXn2=fPBXn1;
                        fPBXn1=fPBXn;
                        fPBYn2=fPBYn1;
                        fPBYn1=fPBYn;

                        var tmp_m= (fPBYn);                     // Muestra   
                        var PB_tmp=0;                           // Muestra Filtrada PB
                        var Dif_tmp=0                           // Muestra Derivada
                        var Senal_cudratica=0;                  // Muestra x Muestra 
                        var Senal_Ventana=0;                    // Muestra de la señal ventaneada. 
                         
                        // Procesando señal para serie RR.......................................

                        PBAN_Xn=tmp_m;
                        PBAN_Y= ((PBAN_B1*PBAN_Xn) + (PBAN_B2*PBAN_Xn_1) + (PBAN_B3*PBAN_Xn_2) + (PBAN_B4*PBAN_Xn_3) + (PBAN_B5*PBAN_Xn_4) - (PBAN_A2*PBAN_Yn_1) - (PBAN_A3*PBAN_Yn_2) - (PBAN_A4*PBAN_Yn_3) - (PBAN_A5*PBAN_Yn_4));
                                
                        PBAN_Xn_4=PBAN_Xn_3;
                        PBAN_Xn_3=PBAN_Xn_2;
                        PBAN_Xn_2=PBAN_Xn_1;
                        PBAN_Xn_1=PBAN_Xn;
                        PBAN_Yn_4=PBAN_Yn_3;
                        PBAN_Yn_3=PBAN_Yn_2;
                        PBAN_Yn_2=PBAN_Yn_1;
                        PBAN_Yn_1=PBAN_Y;

                        PB_tmp=PBAN_Y;

                        // Derivando Señal
                        Dif_tmp=PB_tmp-Der_ultima_muestra;
                        Der_ultima_muestra=PB_tmp;

                        // Elevando la señal al cuadrado
                        Senal_cudratica=Dif_tmp*Dif_tmp;

                        /*/// Suprimiendo los transitorios iniciales del filtro. de 700ms +-
                        if (total_muestras<((1.68*json_servidor.tbloque))){  // estaba 0.24
                            Senal_cudratica=0;
                            fPBYn=0;
                        }*/

                        // Integrando Ventana
                        var resultVentana=0;
                        ventana.forEach(val=>{
                            resultVentana=resultVentana+val;
                        });
                        resultVentana=resultVentana/tamVentana;
                        
                        for (var mm=0; mm<(tamVentana-1); mm++){
                            ventana[mm]=ventana[mm+1];
                        }                        
                        ventana[tamVentana-1]=Senal_cudratica;                        
                        Senal_Ventana=(Senal_cudratica/tamVentana)+resultVentana;

                        // Fin Intengrando Ventana  

                        ////PROBANDOOOOOOOOOO
                        var tmp_val_senal=Senal_Ventana;
                        rr_valor=0;
                        tmpAhora=0;

                        if (tmp_val_senal>rrUmbral){ //Paso el Humbral
                            tmpAhora=1;                            
                            if (tmp_val_senal>max_ventana){ // Hay un nuevo Maximo
                                max_ventana=tmp_val_senal;
                                pos_max=total_muestras;
                            }
                        }

                        if (tmp_val_senal<rrUmbral){

                            if ((val_ant===1)&&(tmpAhora===0)){ //Salió de la Ventana
                                                                
                                rr_valor=max_ventana;
                                 // Calculo RR.
                                                                     
                                 if((total_muestras-r_ant)>(0.1*rr_medio)){

                                    latidos++;
                                    if (latidos>1){
                                    tmp_r= pos_max;                                    
                                    tmp_rr=tmp_r-r_ant;                                                                      
                                    r_ant=tmp_r;                                   
                                    rr_medio_sum=rr_medio_sum+tmp_rr;
                                    rr_medio=rr_medio_sum/(latidos-1);
                                    fc_medio=1/(rr_medio/(json_servidor.tbloque*2));

                                    // desviación estandart
                                    
                                    desv_rr_tmp=(tmp_rr-rr_medio);
                                    desv_rr_tmp=desv_rr_tmp*desv_rr_tmp;
                                    desv_rr_tmp_suma=desv_rr_tmp_suma+desv_rr_tmp;
                                    desv_rr=Math.sqrt(desv_rr_tmp_suma/(latidos-1)); 
                                                                              
                                    } else {
                                        r_ant=pos_max;
                                        latidos=1;
                                        tmp_rr=0;
                                        rr_medio=0;  
                                        fc_medio=0;
                                        desv_rr=0;                                        
                                    }
                                    
                                    // Fin Calculo RR. 
                                    rr_info = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.

                                        lat: latidos,
                                        rr: tmp_rr,
                                        rr_med: rr_medio.toFixed(3),  
                                        fc_med: fc_medio.toFixed(3),
                                        des_rr: desv_rr,
                                        ritmo:  (fc_medio*60).toFixed(3)                             
                
                                    };
                                    // transmision de datos RR.
                                    var rrjson = JSON.stringify({ type:'rr_info', rr_info:rr_info});  
                                    connection.sendUTF(rrjson);  
                                    

                                 }
                                 max_ventana=0;                                 
                                 pos_max=0;                              
                            }
                        }                        
                        val_ant=tmpAhora; 
                        ////FIN PROBANDOOOOOO

                        var mobj = { //Creo Objeto con las caracteristicas de la muestra.
                            time: total_muestras,
                            valor: fPBYn                            
                        };

                        var rr_obj = { //Creo Objeto con las caracteristicas de la muestra.
                            time: total_muestras,
                            valor: rr_valor                           
                        };

                        data_bd.push(mobj); 
                        data_rr.push(rr_obj);                          
                        total_muestras++; 

                    }

                    // Procesando Señal de Ventana

                /*    for (var crr=0; crr<data_rr.length; crr++){

                        var tmp_val_senal=data_rr[crr].valor;
                        data_rr[crr].valor=0;
                        tmpAhora=0;

                        if (tmp_val_senal>rrUmbral){ //Paso el Humbral
                            tmpAhora=1;                            
                            if (tmp_val_senal>max_ventana){ // Hay un nuevo Maximo
                                max_ventana=tmp_val_senal;
                                pos_max=data_rr[crr].time;
                            }
                        }

                        if (tmp_val_senal<rrUmbral){

                            if ((val_ant===1)&&(tmpAhora===0)){ //Salió de la Ventana
                                                                
                                data_rr[crr].valor=max_ventana;
                                 // Calculo RR.
                                                                     
                                 if((data_rr[crr].time-r_ant)>(0.1*rr_medio)){

                                    latidos++;
                                    if (latidos>1){
                                    tmp_r= pos_max;                                    
                                    tmp_rr=tmp_r-r_ant; 
                                    serie_rr.push({rr:tmp_rr,lat:(latidos)});                                   
                                    r_ant=tmp_r;                                   
                                    rr_medio_sum=rr_medio_sum+tmp_rr;
                                    rr_medio=rr_medio_sum/(latidos-1);
                                    fc_medio=1/(rr_medio/(json_servidor.tbloque*2));

                                    // desviación estandart
                                    
                                    desv_rr_tmp=(tmp_rr-rr_medio);
                                    desv_rr_tmp=desv_rr_tmp*desv_rr_tmp;
                                    desv_rr_tmp_suma=desv_rr_tmp_suma+desv_rr_tmp;
                                    desv_rr=Math.sqrt(desv_rr_tmp_suma/(latidos-1)); 
                                                                              
                                    } else {
                                        r_ant=pos_max;
                                        latidos=1;
                                        tmp_rr=0;
                                        rr_medio=0;  
                                        fc_medio=0;
                                        desv_rr=0;                                        
                                    }
                                    
                                    // Fin Calculo RR.  
                                    
                                    // transmision de datos RR.
                                    rr_info = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.

                                        lat: latidos,
                                        rr: tmp_rr,
                                        rr_med: rr_medio.toFixed(3),  
                                        fc_med: fc_medio.toFixed(3),
                                        des_rr: desv_rr,
                                        ritmo:  (fc_medio*60).toFixed(3)                             
                
                                    };
                                    var rrjson = JSON.stringify({ type:'rr_info', rr_info:rr_info});  
                                    connection.sendUTF(rrjson); 
                                 }
                                 max_ventana=0;                                 
                                 pos_max=0;                              
                            }
                        }                        
                        val_ant=tmpAhora;  
                    }  */                                             
                                                                 
                    var msgjson = JSON.stringify({ type:'msg_bd', data: data_bd, data2: data_rr, fin_tx:false});  
                    connection.sendUTF(msgjson);  
       

                    data_bd.splice(0,data_bd.length); // vaciando arreglo para proximo envio. 
                    data_rr.splice(0,data_rr.length); // vaciando arreglo para proximo envio.                    

                }else {

                    var msgjson = JSON.stringify({ type:'msg_bd_fin', fin_tx:true});  
                    connection.sendUTF(msgjson); 

                    // Inicializaciones   
                    
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
                    rrUmbral=50;                      // Humbral Inicial de deteccion de la serie rr.          
                    tmp_max=0;                        // Valor del maximo temporal Ventana.
                    tmpAhora=0;                       // valor temporal ahora ventana.                                  
                    pos_max=0;                        // posicion del maximo temporal ventana.
                    maximo_total=0;                   // Maximo total
                    max_ventana=0;                    // Maximo de la ventana.
                
                    Der_ultima_muestra=0;             // Derivada 
                    rr_valor=0;                       // Valor temporal del punto R                    

                    total_muestras=0;                  // Cantidad total de muestras de bd enviadas al usuario.  
                    data_bd = [];                      // almacena datos de la bd.
                    data_rr = [];                      // almacena datos de serie RR
                    ventana = [];                      // Almacena la ventana de observacion.
                    serie_r= [];                       // Arreglo con la serie R
                    serie_rr= [];                     // Arreglo con la serie RR 
                    desv_rr_tmp=0;                    // std temporal 
                    desv_rr_tmp_suma=0;               // suma de std parciales.

                    /// variables del filtro
                    fPAYn1=0;
                    fPAYn2=0;
                    fPAXn=0;
                    fPAXn1=0;
                    fPAXn2=0;
                    fPAB1=0.9777;
                    fPAB2=-1.9554;
                    fPAB3=0.9777;
                    fPAA1=1;
                    fPAA2=-1.9549;
                    fPAA3=0.9559;
                    fPAYn=0;


                    fPBYn1=0;
                    fPBYn2=0;
                    fPBXn=0;
                    fPBXn1=0;
                    fPBXn2=0;
                    fPBB1=0.2066;
                    fPBB2=0.4131;
                    fPBB3=0.2066;
                    fPBA1=1;
                    fPBA2=-0.3695;
                    fPBA3=0.1958;
                    fPBYn=0;


                    PBAN_Yn_1=0;
                    PBAN_Yn_2=0;
                    PBAN_Yn_3=0;
                    PBAN_Yn_4=0;
                    PBAN_Xn=0;
                    PBAN_Xn_1=0;
                    PBAN_Xn_2=0;
                    PBAN_Xn_3=0;
                    PBAN_Xn_4=0;
                    PBAN_B1=0.0201;
                    PBAN_B2=0;
                    PBAN_B3=-0.0402;
                    PBAN_B4=0;
                    PBAN_B5=0.0201;
                    PBAN_A1=1.0000;
                    PBAN_A2=-3.4289;
                    PBAN_A3=4.5303;
                    PBAN_A4=-2.7383;
                    PBAN_A5=0.6414;
                    PBAN_Y=0;

                }
            }).skip((json_servidor.tbloque*json_servidor.pos)).limit(json_servidor.tbloque);
        }
        //............................................ FIn Enviar Señal desde BD.....................................

        // ................... Mensaje de solicitud de paciente al cual se desea escuchar en tr.........................
        if (json_servidor.type === 'sol_paciente_rt'){
            var pos_cnx = clientes.findIndex(p => p.id_cnx == id_cnx_cliente);            
            clientes[pos_cnx].rt_sol= json_servidor.data; 
            var solrt_json = JSON.stringify({ type:'sol_paciente_rt_ack',rrinfo: {lat: 0,rr: 0,rr_med: 0,fc_med: 0,des_rr: 0,ritmo: 0}});
            connection.sendUTF(solrt_json);
        }
        // ................... Fin Mensaje de solicitud de paciente al cual se desea escuchar en tr.........................

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // Aqui cominezan los MSG de los Pacientes
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

         //........................ Paciente informa su ID............................

         if (json_servidor.type === 'paciente_id') {            
            idCliente=json_servidor.data;
            connection.sendUTF("OKR");  //Se le manda ack de conexion de registro de id.
         }
        //........................ fin Paciente informa su ID............................

        //........................ Paciente Solicita que se confirme que ya hay nuevo de exámen....................

        if (json_servidor.type === 'examen_id') {

            //1 ....hay que buscar los datos del paciente de FM y Periodo de Obs y luego crear el examen
            Bd_cnx.usuarios_bd.findOne({'usuario_id': idCliente},'Freq_Muestro Periodo_de_Obs Estado_de_TX', function (err, dUsuario){
                 if (err) return handleError(err);
                 tmpFM=dUsuario.Freq_Muestro;
                 tmpPObs=dUsuario.Periodo_de_Obs;
                 tmpEstTX=dUsuario.Estado_de_TX;
            }).then(()=>{                
                if (tmpEstTX==="1"){                    
                    examen_id=(new Date()).getTime(); 
                    contTR++;  // se reinicia el contador de muestras en TR.                                           
                    var examen_idjson = {                
                        examen_id: examen_id,
                        usuario_id: idCliente, 
                        Freq_Muestro:tmpFM,  
                        Periodo_de_Obs:tmpPObs, 
                        est_tiempo: (new Date()).getTime(),            
                    };
                }
                Bd_cnx.examen_bd.create(examen_idjson, function (err, bdexamen_id) {
                    if (err) return handleError(err);
                    connection.sendUTF("OKE");  //Se le manda ack de que ya tiene registro de examen.                                            
                });
            }).then(()=>{

                // Preparando las condiciones iniciales para la recoleccion de las muestras.
                // 1. Inicializando ventana para deteccion de Punto R en TR.                                        
                tamVentana_TR=Math.round((15*tmpFM)/100);
                for (var vv=0; vv<tamVentana_TR; vv++){  //Inicializacion de la ventana                       
                    ventana_TR.push(0);
                }
                
                //2. Inicializacion de los coeficientes de los filtros a utilizar.
                if (Number(tmpFM)===100){
                  // var fil PA 1Hz  TR
                    fPAB1_TR=0.9565;
                    fPAB2_TR=-1.9131;
                    fPAB3_TR=0.9565;
                    fPAA1_TR=1;
                    fPAA2_TR=-1.9112;
                    fPAA3_TR=0.9150;                         
                    //  fil PB 40Hz TR
                    fPBB1_TR=0.6389;
                    fPBB2_TR=1.2779;
                    fPBB3_TR=0.6389;
                    fPBA1_TR=1;
                    fPBA2_TR=1.1430;
                    fPBA3_TR=0.4128;
                    // fil PBAN 5Hz-15Hz TR
                    PBAN_B1_TR=0.0675;
                    PBAN_B2_TR=0;
                    PBAN_B3_TR=-0.1349;
                    PBAN_B4_TR=0;
                    PBAN_B5_TR=0.0675;
                    PBAN_A1_TR=1.0000;
                    PBAN_A2_TR=-2.6736;
                    PBAN_A3_TR=2.9924;
                    PBAN_A4_TR=-1.6746;
                    PBAN_A5_TR=0.4128;
                }else if (Number(tmpFM)===200){
                    // var fil PA 1Hz
                    fPAB1_TR=0.9777;
                    fPAB2_TR=-1.9554;
                    fPAB3_TR=0.9777;
                    fPAA1_TR=1;
                    fPAA2_TR=-1.9549;
                    fPAA3_TR=0.9559;                         
                    //  fil PB 40Hz
                    fPBB1_TR=0.2066;
                    fPBB2_TR=0.4131;
                    fPBB3_TR=0.2066;
                    fPBA1_TR=1;
                    fPBA2_TR=-0.3695;
                    fPBA3_TR=0.1958;
                    // fil PBAN 5Hz-15Hz
                    PBAN_B1_TR=0.0201;
                    PBAN_B2_TR=0;
                    PBAN_B3_TR=-0.0402;
                    PBAN_B4_TR=0;
                    PBAN_B5_TR=0.0201;
                    PBAN_A1_TR=1.0000;
                    PBAN_A2_TR=-3.4289;
                    PBAN_A3_TR=4.5303;
                    PBAN_A4_TR=-2.7383;
                    PBAN_A5_TR=0.6414;
                }else if (Number(tmpFM)===250){
                   // var fil PA 1Hz
                    fPAB1_TR=0.9824;
                    fPAB2_TR=-1.9648;
                    fPAB3_TR=0.9824;
                    fPAA1_TR=1;
                    fPAA2_TR=-1.9645;
                    fPAA3_TR=0.9651;                         
                    //  fil PB 40Hz
                    fPBB1_TR=0.1453;
                    fPBB2_TR=0.2906;
                    fPBB3_TR=0.1453;
                    fPBA1_TR=1;
                    fPBA2_TR=-0.6710;
                    fPBA3_TR=0.2523;
                    // fil PBAN 5Hz-15Hz
                    PBAN_B1_TR=0.0134;
                    PBAN_B2_TR=0;
                    PBAN_B3_TR=-0.0267;
                    PBAN_B4_TR=0;
                    PBAN_B5_TR=0.0134;
                    PBAN_A1_TR=1.0000;
                    PBAN_A2_TR=-3.5609;
                    PBAN_A3_TR=4.8389;
                    PBAN_A4_TR=-2.9769;
                    PBAN_A5_TR=0.7009;

                }

            });                                          
         }
        //........................ fin Paciente Solicita que se confirme que ya hay nuemro de examen...............


         //........................ Paciente Solicita Frecuencia de muestreo....................
         if (json_servidor.type === 'FM_ESTADO') {

            if (tmpFM==="100"){   //estado en bd de FM=100                                      
                connection.sendUTF("FM:100");  //Se le manda orden de muestrear a 100Hz.
            } else if (tmpFM==="200"){  //estado en bd de FM=200                    
                connection.sendUTF("FM:200");  //Se le manda orden de muestrear a 200Hz.
            } else if (tmpFM==="250"){ //estado en bd de FM=250                    
                connection.sendUTF("FM:250");  //Se le manda orden de muestrear a 250Hz.    
            }else if (tmpFM==="500"){ //estado en bd de FM=500                    
                connection.sendUTF("FM:500");  //Se le manda orden de muestrear a 500Hz.
            }else {        // revisar bd hay error en tipo de dato debe ser 100,200,250,500.
                console.log('Freq_Muestro en bd..... VALOR NO DEFINIDO------> ERROR');
            }
                         
         }
        //........................ fin Paciente Solicita Frecuencia de muestreo...............


        //........................ Paciente Solicita Periodo de observacion....................

         if (json_servidor.type === 'PERIODO_ESTADO') {

            if (tmpPObs==="1"){   //estado en bd de Periodo_de_Obs=1                   
                connection.sendUTF("T:1");  //Se le manda orden de muestrear durante 1 min.
            } else if (tmpPObs==="3"){   //estado en bd de Periodo_de_Obs=3                   
                connection.sendUTF("T:3");  //Se le manda orden de muestrear durante 3 min.
            } else if (tmpPObs==="15"){   //estado en bd de Periodo_de_Obs=15                   
                connection.sendUTF("T:15");  //Se le manda orden de muestrear durante 15 min.
            }else if (tmpPObs==="30"){   //estado en bd de Periodo_de_Obs=30                   
                connection.sendUTF("T:30");  //Se le manda orden de muestrear durante 30 min.
            }else if (tmpPObs==="0"){   //estado en bd de Periodo_de_Obs=0                  
                connection.sendUTF("T:CONT");  //Se le manda orden de muestrear CONTINUO.
            }else {        // revisar bd hay error en tipo de dato debe ser 0,1,3,15,30.
                console.log('Periodo_de_Obs en bd..... VALOR NO DEFINIDO------> ERROR');
            }
          
         }
        //........................ fin Paciente Solicita Periodo de observacion...............

        //........................ Paciente Solicita El estado de transmision....................

         if (json_servidor.type === 'TX_ESTADO') {

            if (tmpEstTX==="0"){   //estado en bd es no tx para este usuario                    
                connection.sendUTF("DET");  //Se le manda orden de detener tx de muestras al usuario emisor.
            } else if (tmpEstTX==="1"){  //estado en bd es si tx para este usuario
                connection.sendUTF("OKC");  //Se le manda orden de tx muestras al usuario emisor.
            } else {        // revisar bd hay error en tipo de dato debe ser 0 o 1.
                console.log('Estado de TX en bd.....VALOR NO DEFINIDO------> ERROR');
            }  
         }
        //........................ fin Paciente Solicita El estado de transmision...............

        //........................ Paciente Solicita El tamaño trama trasmnision....................

        if (json_servidor.type === 'TX_TRAMA') {

                              
            connection.sendUTF("TR:50");  //Se le manda orden de detener tx de muestras al usuario emisor.
          
        }
        //........................ fin Paciente Solicita El estado de transmision...............

        //........................ Paciente Envia muestra a salvar en bd y re-tx....................

            if (json_servidor.type === 'muestras') {

                // 1..Primero chequear que el usuario tenga Id, examen_id, FM registrados                
                
                if ((idCliente>0)&&(examen_id>0)&&(tmpFM!=0)){                                        
                    json_servidor.data.forEach(muestra=>{

                        // 2. Filtrar la señal

                        //PA

                        fPAXn_TR=Number(muestra/*json_servidor.data*/);                        
                        fPAYn_TR= ((fPAB1_TR*fPAXn_TR) + (fPAB2_TR*fPAXn1_TR) + (fPAB3_TR*fPAXn2_TR) - (fPAA2_TR*fPAYn1_TR) - (fPAA3_TR*fPAYn2_TR));                       
                        fPAXn2_TR=fPAXn1_TR;
                        fPAXn1_TR=fPAXn_TR;
                        fPAYn2_TR=fPAYn1_TR;
                        fPAYn1_TR=fPAYn_TR;

                        //PB

                        fPBXn_TR=fPAYn_TR;                        
                        fPBYn_TR= ((fPBB1_TR*fPBXn_TR) + (fPBB2_TR*fPBXn1_TR) + (fPBB3_TR*fPBXn2_TR) - (fPBA2_TR*fPBYn1_TR) - (fPBA3_TR*fPBYn2_TR));                       
                        fPBXn2_TR=fPBXn1_TR;
                        fPBXn1_TR=fPBXn_TR;
                        fPBYn2_TR=fPBYn1_TR;
                        fPBYn1_TR=fPBYn_TR;

                        var muestrajson = {   // Para la bd            
                            examen_id: examen_id,
                            muestra: Number(muestra/*json_servidor.data*/) /*Number(muestra)*//*fPBYn_TR*/,
                            est_tiempo: (new Date()).getTime(),                   
                        };

                        // 4 Salvar Datos en BD                    
                        Bd_cnx.muestra.create(muestrajson, function (err, bdmuestra) {
                            if (err) return handleError(err);                                                
                            });  

                        var tmp_m_TR= fPBYn_TR;                       // Muestra Pura  
                        var PB_tmp_TR=0;                           // Muestra Filtrada PB
                        var Dif_tmp_TR=0                           // Muestra Derivada
                        var Senal_cudratica_TR=0;                  // Muestra x Muestra 
                        var Senal_Ventana_TR=0;                    // Muestra de la señal ventaneada.

                        // Filtrado pasabanda                  
                        PBAN_Xn_TR=tmp_m_TR;
                        PBAN_Y_TR= ((PBAN_B1_TR*PBAN_Xn_TR) + (PBAN_B2_TR*PBAN_Xn_1_TR) + (PBAN_B3_TR*PBAN_Xn_2_TR) + (PBAN_B4_TR*PBAN_Xn_3_TR) + (PBAN_B5_TR*PBAN_Xn_4_TR) - (PBAN_A2_TR*PBAN_Yn_1_TR) - (PBAN_A3_TR*PBAN_Yn_2_TR) - (PBAN_A4_TR*PBAN_Yn_3_TR) - (PBAN_A5_TR*PBAN_Yn_4_TR));
                                
                        PBAN_Xn_4_TR=PBAN_Xn_3_TR;
                        PBAN_Xn_3_TR=PBAN_Xn_2_TR;
                        PBAN_Xn_2_TR=PBAN_Xn_1_TR;
                        PBAN_Xn_1_TR=PBAN_Xn_TR;
                        PBAN_Yn_4_TR=PBAN_Yn_3_TR;
                        PBAN_Yn_3_TR=PBAN_Yn_2_TR;
                        PBAN_Yn_2_TR=PBAN_Yn_1_TR;
                        PBAN_Yn_1_TR=PBAN_Y_TR;

                        PB_tmp_TR=PBAN_Y_TR;

                        // Derivando Señal
                        Dif_tmp_TR=PB_tmp_TR-Der_ultima_muestra_TR;
                        Der_ultima_muestra_TR=PB_tmp_TR;

                        // Elevando la señal al cuadrado
                        Senal_cudratica_TR=Dif_tmp_TR*Dif_tmp_TR;

                    /*  // Suprimiendo los transitorios iniciales del filtro. de 120ms +-
                        if (contTR<((0.12*tmpFM))){
                            Senal_cudratica_TR=0;
                            fPBYn_TR=0;
                        }*/

                        // Integrando Ventana
                        var resultVentana_TR=0;
                        ventana_TR.forEach(val=>{
                            resultVentana_TR=resultVentana_TR+val;
                        });
                        resultVentana_TR=resultVentana_TR/tamVentana_TR;
                        
                        for (var mm=0; mm<(tamVentana_TR-1); mm++){
                            ventana_TR[mm]=ventana_TR[mm+1];
                        }                        
                        ventana_TR[tamVentana_TR-1]=Senal_cudratica_TR;                        
                        Senal_Ventana_TR=(Senal_cudratica_TR/tamVentana_TR)+resultVentana_TR;

                        // Fin Intengrando Ventana 

                        // 3. Creao json de la muestra
                        
                        var rt_obj ={    //Creacion de la muestra en TR
                            time: contTR,
                            valor: /*Number(json_servidor.data)*/fPBYn_TR,                        
                        }; 

                        var rr_rt_obj ={    //Creacion de la serie RR en TR.
                            time: contTR,
                            valor: Senal_Ventana_TR,                        
                        }; 

                        contTR++;   // incremento el contador global de muestras recibidas.
                        cont_m_rt++;  // incremento el contador de bloque de muestras para rt.

                        // Retransmitir informacion para visualizar en tiempo real.                      
                        if(cont_m_rt<((tmpFM/2)-1)&& (contTR<(tmpPObs*60*tmpFM)-1)){
                            data_t_real.push(rt_obj);
                            data_t_real_rr.push(rr_rt_obj);        
                        }else {
                            data_t_real.push(rt_obj);
                            data_t_real_rr.push(rr_rt_obj);
                            cont_m_rt=0; 

                            //Procesando Bloque
                            for (var crr_TR=0; crr_TR<data_t_real_rr.length; crr_TR++){                            
                                var tmp_val_senal_TR=data_t_real_rr[crr_TR].valor;
                                data_t_real_rr[crr_TR].valor=0;
                                tmpAhora_TR=0;    
                                if (tmp_val_senal_TR>rrUmbral){ //Paso el Humbral                                
                                    tmpAhora_TR=1; 
                                                            
                                    if (tmp_val_senal_TR>max_ventana){ // Hay un nuevo Maximo
                                        max_ventana_TR=tmp_val_senal_TR;
                                        pos_max_TR=data_t_real_rr[crr_TR].time;
                                    }
                                }    
                                if (tmp_val_senal_TR<rrUmbral){                                                                                               
                                    if ((val_ant_TR===1)&&(tmpAhora_TR===0)){ //Salió de la Ventana                                                                     
                                        data_t_real_rr[crr_TR].valor=max_ventana_TR;
                                        // Calculo RR.                                                                         
                                        if((data_t_real_rr[crr_TR].time-r_ant_TR)>(0.1*rr_medio_TR)){    
                                            latidos_TR++;
                                            tmp_r_TR= pos_max_TR;
                                            tmp_rr_TR=tmp_r_TR-r_ant_TR;
                                            r_ant_TR=tmp_r_TR;
                                            if (latidos_TR===2){rr_medio_sum_TR=tmp_rr_TR;}
                                            rr_medio_sum_TR=rr_medio_sum_TR+tmp_rr_TR;
                                            rr_medio_TR=rr_medio_sum_TR/latidos_TR;
                                            fc_medio_TR=1/(rr_medio_TR/(tmpFM));
                                            if ((tmp_rr_TR>rr_max_TR)&&(latidos_TR>1)){
                                                rr_max_TR=tmp_rr_TR;
                                            }
                                            if ((tmp_rr_TR<rr_min_TR)&&(latidos_TR>1)){
                                                rr_min_TR=tmp_rr_TR;
                                            }
                                            desv_rr_TR=rr_max_TR-rr_min_TR;       
                                            // Fin Calculo RR.                                        
                                        }
                                        max_ventana_TR=0;                                 
                                        pos_max_TR=0;                              
                                    }
                                }                        
                                val_ant_TR=tmpAhora_TR;      
                            }
                            rr_info_TR = { //Creo Objeto con las caracteristicas de la informacion RR Solicitada.
                                lat: latidos_TR,
                                rr: tmp_rr_TR,
                                rr_med: rr_medio_TR,  
                                fc_med: fc_medio_TR,
                                des_rr: desv_rr_TR,
                                ritmo:  (fc_medio_TR*60)                                 
                            }; 
                            //Fin Procesando Bloque

                            // haciendo un broadcast a al doctor que solicita la vista en TR.
                            var rt_json = JSON.stringify({ type:'msg_TR', data: data_t_real, data2: data_t_real_rr, rrinfo: rr_info_TR });                        
                            for (var i=0; i < clientes.length; i++) { 
                            if (Number(clientes[i].rt_sol)===Number(idCliente)) {                                
                                    clientes[i].conexion.sendUTF(rt_json);                                                
                                }                            
                            }
                            data_t_real.splice(0,data_t_real.length); // vaciando arreglo para proximo envio.
                            data_t_real_rr.splice(0, data_t_real_rr.length); // vaciando arreglo para proximo envio.
                        }
                    
                    });
                   

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
