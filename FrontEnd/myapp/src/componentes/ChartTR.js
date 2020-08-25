import React from 'react';
import {Line} from 'react-chartjs-2';
import RRInfo from './RRInfo';

// Componentes del ReactBoostrap

import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

//const wsChartTR = new WebSocket('ws://localhost:2000');

class ChartTR extends React.Component{
      
    constructor(props) {
        super(props);
        
        this.state = {
            
            rr_info_state: { 
                lat: 0,
                rr: 0,
                rr_med: 0,
                fc_med: 0,
                des_rr: 0,
                ritmo:  0
            },            
            datos: { },
            datos2:{ },                        
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
                            labelString: 'Tiempo (s)',
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
                            labelString: 'Tensión (mV)',
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

            },
            opciones2: {           // Opciones de la grafica 2

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
                responsive: true,                
                legend: { display: true },
                maintainAspectRatio: true,                 
                scales: {
                    xAxes: [{

                        scaleLabel: {
                            display: true,
                            labelString: 'Latidos',
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
                            labelString: 'Tiempo entre latidos (ms)',
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
    y2 =[];
    sol_ack=false;
    rr_info=[];

    arr3= [];
    x_rr= [];
    y_rr= [];
    latidos=0;
    rr_ant=0;
    diff_rr=0;

    fact_aj=0;
    s_ini=0;
    s_fin=0;
    s_max=0;
    s_pos=0; 
    pos_Pto=0;
    tam_ant=0;

    
  
    componentDidMount() {
    
    // Inicializacion de correccion de visualizacion
    if (Number(this.props.fmTR)===100) {this.fact_aj=28;}
    else if (Number(this.props.fmTR)===200) {this.fact_aj=46;}
    else if (Number(this.props.fmTR)===250) {this.fact_aj=58;}    //51
    // Fin inicializacion de correccion de visualizacion    

    this.wsChartTR.onopen = () => {
                   
        console.log('wsChartTR conectado con el Backend WsG')
        }

    this.wsChartTR.onmessage = evt => {
         

        const message = JSON.parse(evt.data) 

        if (message.type==='sol_paciente_rt_ack'){

            this.sol_ack=true;
            this.rr_info= message.rrinfo;
        }
                 
        if (message.type==='msg_TR'){

            this.tam_ant=this.y.length;                   
            message.data.forEach(element => {    //para senal

                var tmpx=(element.time/this.props.fmTR);
                this.x.push(tmpx.toFixed(3)); 
                //var tmpy= ((element.valor)*3.3)/1024; 
                var tmpy= (((element.valor*3.3)/1024)/100)*1000;    
                var tmpy= element.valor;               
                //var tmpy= (element.valor*10);                         
                //this.y.push(tmpy.toFixed(4));
                this.y.push(tmpy);
                     
            }); 

            message.data2.forEach(elementoRR => {

                //var tmpy2=(elementoRR.valor*1); 
                var tmpy2= (((elementoRR.valor*3.3)/1024)/100)*1000;                             
                this.y2.push(tmpy2);
            });

            // Corregir desfasaje

            for (var b=this.tam_ant; b<(this.y2.length-1); b++){
                
                if (this.y2[b]>0){                    
                    this.y2[b]=0;
                    this.pos_Pto=b-this.fact_aj;
                    this.s_max=this.y[this.pos_Pto];
                    this.s_pos=this.pos_Pto; 
                    this.s_ini=this.pos_Pto-10;
                    this.s_fin=this.pos_Pto+10;                                            
                    for (var ss=this.s_ini; ss<=this.s_fin; ss++){                            
                        if ((ss>=0) && (ss<(this.y2.length-1))){                            
                            if (this.y[ss]>this.s_max){
                                this.s_max=this.y[ss];
                                this.s_pos=ss;                                                              
                            }
                        }
                    }
                    this.y2[this.s_pos]=this.s_max;
                                       
                }                               
            }
            
            // fin corregir desfasaje

            var ttt=(this.props.fmTR/2);

            if (this.x.length>(ttt*8)){

                this.x.splice(0,ttt);    
                this.y.splice(0,ttt);  
                this.y2.splice(0,ttt);                  

            }

            this.rr_info= message.rrinfo;
   
            if (Number(this.rr_info.lat)>this.latidos){

                this.latidos=Number(this.rr_info.lat);
                this.x_rr.push(this.latidos);
                this.y_rr.push(Number(this.rr_info.rr)*(1000/this.props.fmTR));
                /*this.diff_rr=this.rr_ant-Number(this.rr_info.rr);
                if (this.diff_rr<0){this.diff_rr=this.diff_rr*(-1);}
                this.rr_ant=Number(this.rr_info.rr);
                this.y_rr.push(this.diff_rr*(1000/this.props.fmExamen));*/
                
            }
            // Configurando los datos para la grafica

            this.arr2= {  

                labels: this.x,
                datasets: [{
                    label: 'ECG_TR',
                    data: this.y,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(230, 0, 0, 1)',
                    pointRadius: 0
                                                                                  
                },{

                    label: 'Ptos_R',
                    data: this.y2,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 255, 0, 1)',
                    pointRadius: 2

                }]                                                            
            }

            this.arr3= {  

                labels: this.x_rr,
                datasets: [{
                    label: 'Serie Temporal RR',
                    data: this.y_rr,
                    fill:false,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 100, 230, 1)',
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
        150
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
                
            datos: this.arr2,
            datos2: this.arr3,
            rr_info_state: this.rr_info                      

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
                <Container >
                    <Row className="justify-content-md-center">                                                                                                                            
                        <Line data={this.state.datos} options={this.state.opciones}  width="960px" height="250px" redraw/>                                                                                     
                        <Line data={this.state.datos2} options={this.state.opciones2}  width="960px" height="250px" redraw/>                                                                                     
                    </Row >
                    <Row className="justify-content-md-center">
                        <RRInfo  rrinfo={this.state.rr_info_state} FM={this.props.fmTR}/>
                    </Row>
                </Container>
            </>             
        );
    }
  }  

export default ChartTR;