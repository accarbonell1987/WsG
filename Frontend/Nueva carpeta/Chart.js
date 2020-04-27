import React from 'react';

import {Line} from 'react-chartjs-2';
import RRInfo from './RRInfo';

//const wsChart = new WebSocket('ws://localhost:2000');

class ChartJs extends React.Component{
      
    constructor(props) {
        super(props);
        
        this.state = {
            
            rr_info_state: {},
            finTX: false,
            datos: { },                        
            opciones: {

                tooltips: {
                    mode: 'index',                    
                    intersect: false,
                    //position: 'nearest'
                   
                },

                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                
                animation: {
                    duration: 0 // general animation time
                },
         /*       hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },*/
                //responsiveAnimationDuration: 0, // animation duration after a resize                             
                responsive: true,
                legend: { display: true },
                maintainAspectRatio: true,                 
                scales: {
                    xAxes: [{

                        scaleLabel: {
                            display: true,
                            labelString: 'Tiempo (S)',
                            fontSize: 15,
                            fontColor: '#ff0000',
                        },
                        
                        ticks: {
                            //reverse:true
                            //autoSkip: true
                           
                        },
                               
                        gridLines: {
                            display: true
                        }
                    }],
                    yAxes: [{

                        scaleLabel: {                            
                            display: true,
                            labelString: 'Tensión (V)',
                            fontSize: 15,
                            fontColor: '#ff0000',
                        },

                        ticks: {
                            beginAtZero:true
                           
                        },

                        gridLines: {
                            display: true
                        }
                    }]
                }

            }
              
        };        
        
      }

    wsChart = new WebSocket(window.$WebsocketsIp);  

    arr2 =[];  
    x = [];
    y =[];
    y2 = [];
    rr_info=[];
    fTx=false;
    posLectura=0;    

    componentDidMount() {
   

    this.wsChart.onopen = () => {
                   
        console.log('wsChart conectado con el Backend WsG')
        }

    this.wsChart.onmessage = evt => {
         

        const message = JSON.parse(evt.data) 
        
        if (message.type==='msg_bd_fin'){

            this.fTx=message.fin_tx;
            this.posLectura=0;  
            this.props.modificarEstado();         
            this.setState({
                
                finTX: this.fTx

            });

        }
            
        if (message.type==='msg_bd'){
                   
            message.data.forEach(element => {    //para senal

                var tmpx=(element.time*5)/1000;
                this.x.push(tmpx.toFixed(2)); 
                //var tmpy= (element.valor*3.3)/1024;                  
                var tmpy= (element.valor*1);                             
                this.y.push(tmpy.toFixed(1));
                     
            }); 

            message.data_rr.forEach(elementoRR => {

                var tmpy2=(elementoRR.valor*1);                             
                this.y2.push(tmpy2.toFixed(1));
            });

            var ttt=(this.props.tambloque/2);
            console.log(ttt);

            if (this.x.length>(ttt*8)){

                console.log('entro');

                this.x.splice(0,ttt);    
                this.y.splice(0,ttt);  
                this.y2.splice(0,ttt);                  

            }

            this.rr_info= message.rrinfo;

            // Configurando los datos para la grafica

            this.arr2= {  

                labels: this.x,
                datasets: [{
                    label: 'ECG Examen_ID:'+this.props.examen_id,
                    data: this.y,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(230, 0, 0, 1)',
                    pointRadius: 0
                                                                                  
                },{

                    label: 'Serie RR: '+this.props.examen_id,
                    data: this.y2,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 255, 0, 1)',
                    pointRadius: 3

                }]                                                            
            }

            this.setState({
                
                datos: this.arr2,
                rr_info_state: this.rr_info,
                finTX: this.fTx

            });
                                                                           
        }
                   
    }
    
    this.wsChart.onclose = () => {

        console.log('wsChart desconectado con el Backend WsG')
        
    
         } 

        

     // Esto es para la temporizacion.
    this.timerID = setInterval(
        () => this.tick(),
         500
    );
     // Fin de temporizacion
           

     }
    
    componentWillUnmount() {

          this.wsChart.close();
      }  
      
    tick() {    
        
        if ((this.props.estadoGrafica===true)&&(this.state.finTX===true)) {

            this.arr2 =[];  
            this.x = [];
            this.y =[];
            this.rr_info=[];
            this.fTx=false;
            this.posLectura=0;

            this.setState({  

                finTX: false
    
            });
            //this.props.autoLLamado(this.props.examen_id,3);
    
        }

        if ((this.wsChart.readyState===1)&&(this.props.estadoGrafica)&&(this.state.finTX===false)){
           
            this.wsChart.send( JSON.stringify({ type:'Enviar_BD', examen_id: this.props.examen_id, pos: this.posLectura , tbloque: this.props.tambloque/2})); 
            this.posLectura++;           

        } else {console.log('wsChart:Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');} 
        
    } 
            
    render() {
      
        return (   
          
            <>    
                <h3 position="center"> Grafica ECG Paciente</h3> 
                <table >
                    <tr >
                        <th>                                
                            <div  style={{ position: "relative", width: "100%", height: "320px" }}>                                               
                                <Line data={this.state.datos} options={this.state.opciones}  width="1200px" height="300px" redraw/>                   
                            </div> 
                        </th>
                        <th>                                
                            <div style={{ padding:"20px", width: "100%", height: "320px" }} ><RRInfo rrinfo={this.state.rr_info_state} FM={this.props.tambloque}/> </div>    
                        </th>                        
                    </tr >
                </table>
                                       
            </>             
        );
    }
  }  

export default ChartJs;
