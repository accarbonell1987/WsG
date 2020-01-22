// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
    
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-middleman';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

/**
 * Global variables
 */
// latest 100 messages
//var history = [ ];
// list of currently connected clients (users)
//var clients = [ ];

var clientes_emisores = [ ]; //cliente que emiten datos (arduinos)
var logdatos = [ ]; //variable para almacenar todos los objetos de con la estructura (time, valor, id)

var clientes_receptores = [ ]; //clientes que reciven datos (web, apps...)
var relacion_emisorreceptor = [ ]; //almacena una relación entre emisor-receptor para saber a quien enviar los datos

var http_files = {};
[
    ["/jquery.min.js","application/javascript"],
    ["/frontend.js","application/javascript"],
    ["/amchart/amcharts.js","application/javascript"],
    ["/amchart/serial.js","application/javascript"],
    ["/amchart/themes/light.js","application/javascript"],
    ["/frontend.html","text/html"]
].forEach(function(fn){
    http_files[fn[0]]={
        content : fs.readFileSync('.'+fn[0]).toString(),
        contentType : fn[1]
    };
});

http_files["/"]=http_files["/frontend.html"];
http_files["/index.html"]=http_files["/frontend.html"];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array with some colors
//var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
//colors.sort(function(a,b) { return Math.random() > 0.5; } );

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

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Conexión desde origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    //var index = clients.push(connection) - 1;
    var idCliente = false;

    console.log((new Date()) + ' Conexión aceptada.');

    // send back chat history
    //if (history.length > 0) {
      //  connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    //}
    
    // user sent some message
    connection.on('message', function(message) {
        //if (message.type === 'number') { // Aceptando solamente numeros
            if (idCliente === false) { // el primer mensaje enviado por el cliente es el IdCliente
                // remember user name
                idCliente = htmlEntities(message.utf8Data);
                connection.sendUTF(JSON.stringify({ type:'registro', data: idCliente }));
                console.log((new Date()) + ' Usuario conocido como: ' + idCliente + '.');

                //si el id es menor 1000 entonces es un cliente emisor sino es receptor
                if (idCliente < 1000) {
                    //si no exite un cliente emisor con ese id lo adiciono al arreglo y busco
                    //si existen datos de ese cliente en el logdatos los elimino
                    if (!clientes_emisores.find(element => element == idCliente)){
                        clientes_emisores.push(idCliente);
                        console.log((new Date()) + ' Cliente adicionado, '+ idCliente + ' tipo: Emisor.');
                        connection.sendUTF(JSON.stringify({ type:'validacion', data: 'OK' })); //envia confirmacion de conexion
                    }
                    console.log((new Date()) + ' Eliminando registros de log de datos. ');
                    //recorrer el logdatos eliminando los datos pertenecientes a un cliente con ese mismo id
                    logdatos.forEach(elemento => {
                        //elimino el elemento si pertenece al id del cliente
                        if (elemento.id == idCliente) logdatos.pop(elemento);
                    });
                }else{
                    //si no exite un cliente receptor con ese id lo adiciono al arreglo y busco
                    if (!clientes_receptores.find(element => element.id == idCliente)){
                        //objeto que relaciona el id con la conexion
                        var datosCliente = {
                            id: idCliente, 
                            conexion: connection
                        };
                        clientes_receptores.push(datosCliente);
                        console.log((new Date()) +' Cliente adicionado, '+ idCliente + ' tipo: Receptor.');
                    }

                    console.log((new Date()) + ' Eliminando registros de relaciones con emisores. ');
                    //recorrer el relacion_emisorreceptor eliminando los datos pertenecientes a un cliente con ese mismo id
                    relacion_emisorreceptor.forEach(elemento => {
                        //elimino el elemento si pertenece al id del cliente
                        if (elemento.id == idCliente) logdatos.pop(elemento);
                    });
                }
                //connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
            } else { // log and broadcast the message
                console.log((new Date()) + ' Mensaje recibido desde '
                            + idCliente + ': ' + message.utf8Data);
                
                //adicionar el dato numerico a la session del cliente

                var obj = {
                    time: (new Date()).getTime(),
                    valor: htmlEntities(message.utf8Data),
                    id: idCliente
                };
                logdatos.push(obj);

                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });

                for (var i=0; i < clientes_receptores.length; i++) {
                    clientes_receptores[i].conexion.sendUTF(json);
                }
            }
        //}
    });

    // Desconexión
    connection.on('close', function(connection) {
        if (idCliente !== false) {
            console.log((new Date()) + " Cliente "
                + connection.remoteAddress + " desconectado.");

            if (idCliente < 1000) {
                var posicion = clientes_emisores.findIndex(p => p == idCliente);
                clientes_emisores.slice(posicion, 1);
            } else {
                var posicion = clientes_receptores.findIndex(p => p.id == idCliente);
                clientes_receptores.slice(posicion, 1);
            }
        }
    });

});