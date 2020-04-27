import React from 'react';
//import '../css/bootstrap/dist/css/bootstrap.min.css';

// Importando librerias de la Grafica

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);


// componente Grafica
class Grafica extends React.Component{
     

    constructor(props) {

        super(props);
        this.state = {

            Data: this.props.datos,             
            divNombre: this.props.divNombre,
            lineaColor: this.props.lineaColor,    

        };        
        
    }

    componentDidMount() {
        
        // Inicializar la grafica con todos los parametros. 
        this.iniGrafica();   
             
            
    }


    componentDidUpdate(prevProps) {   // Maneja el refrescamiento de la grafica.

        console.log('Entro en grafica DID UPDATE');
        this.iniGrafica();
        
     /*   if(!(prevProps.datos === this.props.datos)) {

          if(this.chart._super) {

            this.chart.dispose();
          }

          this.iniGrafica();
          console.log('Entro en grafica DID UPDATE...condicion');

        }*/
    }

    
    componentWillUnmount() {

        if (this.chart) {

          this.chart.dispose();   // Elimando la grafica.

        }        

    }  
          
    iniGrafica () {   // Inicializa la gráfica con todos los parametros.

        // codigo de la grafica

        let chart = am4core.create(String (this.state.divNombre), am4charts.XYChart);

        chart.paddingRight = 20;
                
        let data = [];

        data.push({ 
                    ptoTiempo: 0,
                    valor: 0,

                 /*   rrptoTiempo: 0,
                    rrvalor: 0*/

                });
          
        chart.data = this.props.datos;
        //console.log('DATA tamaño: ', this.props.datos,length);      
        // mi configuracion

        chart.zoomOutButton.disabled = true; 

        let muestaAxis = chart.xAxes.push(new am4charts.ValueAxis());
        //muestaAxis.renderer.grid.template.location = 0;
        muestaAxis.title.text = "Tiempo (Seg)";
        muestaAxis.title.fontWeight = "bold";
        muestaAxis.tooltip.disabled = true;

        let valorAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valorAxis.title.text = "Tensión (V)";
        valorAxis.title.fontWeight = "bold";
        valorAxis.tooltip.disabled = true;
        valorAxis.renderer.interactionsEnabled =false;   ///Cojone esta es la propiedad.

       // valorAxis.max = 1;
       //valorAxis.min = 0;
       // valorAxis.strictMinMax = true;
        
      //  valorAxis.renderer.minWidth = 35;

        // serie ecg
        let ecg = chart.series.push(new am4charts.LineSeries());
        ecg.dataFields.valueX = "ptoTiempo";
        ecg.dataFields.valueY = "valor";        
        ecg.stroke = am4core.color("#ff0000");       // Rojo
        //ecg.strokeWidth = 1;

   /*     let rr = chart.series.push(new am4charts.LineSeries());
        rr.dataFields.valueX = "rrptoTiempo";
        rr.dataFields.valueY = "rrvalor";
        
        rr.stroke = am4core.color("#00ff00");            // verde
        //ecg.strokeWidth = 1;*/
               
        this.chart = chart;

     }  
            
    render() {
        
        return (   
             
            <>            
                <div id={String(this.state.divNombre)} style={{ width: "100%", height: "300px" }}></div>                              
            </>             
        );
    }

  }  

export default Grafica;

