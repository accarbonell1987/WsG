import React from 'react';
//import '../css/bootstrap/dist/css/bootstrap.min.css';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";

//am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_frozen);

const wsg2 = new WebSocket('ws://localhost:2000');

class Grafica2 extends React.Component{
      
    constructor(props) {
        super(props);
        this.state = {
            gData:[], 
            totalMuestras:0, 
            divNombre: this.props.divNombre,
            lineaColor: this.props.lineaColor,
            wsSol2:true
        };        
        
      }

    arr2 =[];  
    componentDidMount() {

      console.log('entro a component didmount');

      wsg2.onopen = () => {
                   
        console.log('WS conectado con el Backend WsG')
        }

    wsg2.onmessage = evt => {
         

        const message = JSON.parse(evt.data)
            
        if (message.type==='msg_bd'){

          console.log('llego paquete de bd');
            
            message.data.forEach(element => {

                
                this.arr2.push({         // Datos a plotear 
                    
                  date: element.time, 
                  name: "name"+element.time, 
                  value: element.valor

                });
                
            }); 

            if (this.arr2.length>1200){

                this.chart.data.splice(0,200);
                this.arr2.splice(0,200);
                
    
            }
            
            this.chart.data=this.arr2;
         
                                             
        }
                   
        }
    
    wsg2.onclose = () => {

        console.log('WS desconectado con el Backend WsG')
        // Se reconecta automaticamente en caso de perder la cnx
    
         } 



        
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;

    let data = [];
    let visits = 10;

     var datajson= {date: 0, name: "name"+0, value: 0}
     data.push(datajson);
    /*for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
    }*/

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    
    

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    

    
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";


     

    chart.zoomOutButton.disabled = true; 

    
   /* series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();*/

   /* let scrollbarY = new am4charts.XYChartScrollbar();
    scrollbarY.series.push(series);
    chart.scrollbarY = scrollbarY;*/

    this.chart = chart;
    console.log(this.chart);
    console.log('hizo el grafico');

     // Esto es para la temporizacion.
     this.timerID = setInterval(
        () => this.tick(),
        500
      );
    // Fin de temporizacion


      }

    componentDidUpdate() {    
      console.log('entro a component did update');   

    } 
    
    componentWillUnmount() {

      console.log('entro a component will unmount');
        if (this.chart) {
          this.chart.dispose();
        }
      }  
      
    tick() {

      console.log('entro a tick');

      if (wsg2.readyState){

        wsg2.send( JSON.stringify({ type:'Enviar', data: "null"}));
    }  
        
    } 
            
    render() {

      console.log('entro a render');
        return (   
          
            <>            
                <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>                              
            </>             
        );
    }
  }  

export default Grafica2;
