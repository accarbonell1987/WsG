import React from 'react';
import {Line} from 'react-chartjs-2';
import RRInfo from './RRInfo';

//const wsChartTR = new WebSocket('ws://localhost:2000');

class ChartTR extends React.Component{
      
    constructor(props) {
        super(props);
        
        this.state = {
            
            rr_info_state: {},            
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

    wsChartTR = new WebSocket(window.$WebsocketsIp);  

    arr2 =[];  
    x = [];
    y =[];
    sol_ack=false;
  
    componentDidMount() {
   

    this.wsChartTR.onopen = () => {
                   
        console.log('wsChart conectado con el Backend WsG')
        }

    this.wsChartTR.onmessage = evt => {
         

        const message = JSON.parse(evt.data) 

        if (message.type==='sol_paciente_rt_ack'){

            this.sol_ack=true;

        }
                 
        if (message.type==='msg_TR'){

            console.log('bloque RT Recibido');
                   
            message.data.forEach(element => {    //para senal

                var tmpx=(element.time*5)/1000;
                this.x.push(tmpx.toFixed(2)); 
                //var tmpy= (element.valor*3.3)/1024;                  
                var tmpy= (element.valor*10);                         
                this.y.push(tmpy.toFixed(1));
                     
            }); 

            if (this.x.length>600){

                this.x.splice(0,100);    
                this.y.splice(0,100);                    

            }

            // Configurando los datos para la grafica

            this.arr2= {  

                labels: this.x,
                datasets: [{
                    label: 'ECG Tiempo Real :'+this.props.pacienteTR.Nombre,
                    data: this.y,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(230, 0, 0, 1)',
                    pointRadius: 0
                                                                                  
                }]                                                            
            }
                                                                          
        }
                   
        }
    
    this.wsChartTR.onclose = () => {

        console.log('wsChartTR desconectado con el Backend WsG')
        
    
         } 

    
    this.timerID = setInterval( // Esto es para la temporizacion.
        () => this.tick(),
         500
    );
     // Fin de temporizacion


    // Esto es para la temporizacion una sola vez.
    this.timerID = setTimeout(
        () => this.solPacienteTR(),
        20
    );
    // Fin de temporizacion
           

     }

    componentDidUpdate() {    

      //console.log('entro a component did update');   

    } 
    
    componentWillUnmount() {

          this.wsChartTR.close();
      }  
      
    tick() {   
                    
        this.setState({
                
            datos: this.arr2                      

        });  
        
    } 

    solPacienteTR = () => {

        if (this.wsChartTR.readyState===1){

            this.wsChartTR.send( JSON.stringify({ type:'sol_paciente_rt', data: this.props.pacienteTR.usuario_id}));
            console.log('paciente id : '+ this.props.pacienteTR.usuario_id);
         
        } else {console.log('wsChartTR:Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');} 
        

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

export default ChartTR;