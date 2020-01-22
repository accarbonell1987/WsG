$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    //var myColor = false;
    // my name sent to the server
    //var myName = false;

    //asignado por el servidor
    var idCliente = false;

    var primerPunto = true;
    var grafica = crearGrafica();

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Id del cliente (numero):');
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'registro') { // first response from the server with user's color
            idCliente = json.data;
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message

            var time = new Date(json.data.time);
            var valor = json.data.valor;

            addMessage(json.data.id, valor, time);

            if (primerPunto){
                grafica = crearGrafica(valor, time);
                primerPunto = false;
            }else{
                plotearEnGrafica(valor, time);
            }

        } else if (json.type === 'validacion') {

        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
        // } else if (json.type === 'history') { // entire message history
        //     // insert every single message to the chat window
        //     for (var i=0; i < json.data.length; i++) {
        //         addMessage(json.data[i].author, json.data[i].text,
        //                    json.data[i].color, new Date(json.data[i].time));
        //     }
        // } else 
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their id
            if (idCliente === false) {
                idCliente = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(id, valor, dt) {
        content.prepend('<p><span>' + id + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + valor + '</p>');
    }

    function plotearEnGrafica(v, dt) {
        var pdatos = grafica.dataProvider;

        if (pdatos.lenght >= 200) {
            pdatos = pdatos.splice(0,1); //eliminar el primer elemento
        }
        
        pdatos.push( {
            fecha: dt,
            valor: v
        } );

        grafica.dataProvider = pdatos;
        grafica.validateData();
    }

    function crearGrafica(v, dt){
        /**
         * Create the chart
         */
        var chartData = generateChartData();

        var chart = AmCharts.makeChart( "chartdiv", {
            "type": "serial",
            "theme": "light",
            "zoomOutButton": {
                "backgroundColor": '#000000',
                "backgroundAlpha": 0.15
            },
            "dataProvider": chartData,
            "categoryField": "fecha",
            "categoryAxis": {
                "parseDates": true,
                "minPeriod": "fff",
                "dashLength": 1,
                "gridAlpha": 0.15,
                "axisColor": "#DADADA"
            },
            "graphs": [ {
                "id": "g1",
                "valueField": "valor",
                "bullet": "round",
                "bulletBorderColor": "#FFFFFF",
                "bulletBorderThickness": 0,
                "lineThickness": 1,
                "lineColor": "#b5030d",
                "negativeLineColor": "#0352b5",
                "hideBulletsCount": 1
            } ],
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "chartScrollbar": {
                "graph": "g1",
                "scrollbarHeight": 40,
                "color": "#FFFFFF",
                "autoGridCount": false
            }
            } );

        /**
         * Function that generates random data
         */
        function generateChartData() {
            var chartData = [];
            chartData.push({
                fecha: dt,
                valor: v
                });
            return chartData;
        }

        return chart;
    }
});