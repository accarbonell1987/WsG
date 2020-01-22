
/*.....................................DECLARACION DE BIBLIOTECAS..............................*/

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>

/*...................................FIN DECLARACION DE BIBLIOTECAS............................*/

/*.................................DECLARACION DE VARIABLES GLOBALES..........................*/

#define USE_SERIAL Serial              // Definir el puerto serie 0 a utilizar.
ESP8266WiFiMulti WiFiMulti;            // Definir instancia de la clase wifi.
WebSocketsClient webSocket;            // Definir instancia de la clase websocket.

String data;
String ws_id="123";
String inputString = "";         
boolean stringComplete = false;  

short a=1;
String s_test = "D&";

bool w_estado=false;
bool ws_estado=false;

/*.................................FIN DECLARACION DE VARIABLES GLOBALES..........................*/


/*.................................FUNCION MANEJADORA DE EVENTOS WEBSOCKET..........................*/

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {
    
    case WStype_DISCONNECTED:
    
      USE_SERIAL.printf("[WSc]: desconectado !!!!!\n");
      ws_estado=false;
      
      break;
    case WStype_CONNECTED: {
      
      USE_SERIAL.printf("[WSc]: conectado !!!!!\n");
      ws_estado=true; 
      webSocket.sendTXT(ws_id);   
      
    }
      break;
      
    case WStype_TEXT:
    
      USE_SERIAL.printf("[WSc]: %s\n", payload);
   
      break;
      
    case WStype_BIN:
    
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      
      break;
  }

}

/*................................. FIN FUNCION MANEJADORA DE EVENTOS WEBSOCKET..........................*/


/*....................................... DEFINICIONES E INICIALIZACIONES...............................*/
void setup() {

 /*................ PUERTOS...........*/
 
  pinMode(4, INPUT); // Setup for leads off detection LO +
  pinMode(5, INPUT); // Setup for leads off detection LO -


/*................ PUERTO SERIE...........*/
  USE_SERIAL.begin(9600);  
  USE_SERIAL.setDebugOutput(true);
  
/*..................... WIFI.............*/

  WiFiMulti.addAP("WIFI_KRATOS", "Accp2017/*");
  //WiFiMulti.addAP("Legolas", "legolas*12345");
  //WiFiMulti.addAP("Extender", "taller108");

  //WiFi.disconnect();
  while(WiFiMulti.run() != WL_CONNECTED) {
    w_estado=false;
    delay(100);
  }

  w_estado=true;
  
/*................. WEBSOCKET...............*/
  
  webSocket.begin("192.168.0.101", 1337, "/");

  // Manejador de eventos
  webSocket.onEvent(webSocketEvent);
  
  // tiempo de reconexion con el servidor websoket
  webSocket.setReconnectInterval(5000);

}
/*..................................... FIN DEFINICIONES E INICIALIZACIONES...............................*/

/*................................... FUNCIONES AUXILIARES..............................................*/


   
/*..................................... FIN FUNCIONES AUXILIARES...............................*/

/*.......................................... FUNCION BUCLE ..................................*/

void loop() {
 
   
  webSocket.loop();
  
  /*if((digitalRead(4) == 1)||(digitalRead(5) == 1)){
    Serial.println('!');
   }

   else {
    
       Serial.println(analogRead(A0));
       data = String(analogRead(A0));
       webSocket.sendTXT(data);
       
    }

  delay (1);*/


       //Serial.println(analogRead(A0));
       //data = String(analogRead(A0));
       webSocket.sendTXT("kratos pato");
       delay (1000);
   
}

/*..................................... FIN FUNCION BUCLE...............................*/
