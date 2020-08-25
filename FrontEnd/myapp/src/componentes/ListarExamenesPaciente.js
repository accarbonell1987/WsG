import React from 'react';
import moment from 'moment';
import '../css/bootstrap/dist/css/bootstrap.min.css';

import DatosPaciente from './DatosPaciente';


// Componentes del ReactBoostrap

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import CardGroup from 'react-bootstrap/CardGroup'; 



class ListarExamenesPaciente extends React.Component{

    
    constructor(props) {

        super(props);
        this.state = {  
            
            Examenes: [],                              // Arreglo con todos los examenes que pertenecen a este Paciente.
            tmpPaciente: this.props.datosPaciente,     // Datos del Paciente.  
            estadoRender:0                             // 0-- Listar   1--Actualizar despues de eliminar. 
        
        };    
        
        this.selVerExamen= this.selVerExamen.bind(this);
        this.selEliminarExamen= this.selEliminarExamen.bind(this);
        
    }

    wsLisExPaciente = new WebSocket(window.$WebsocketsIp);       // Crea una cnx ws con servidor


    componentDidMount () {             // Esto se ejecuta despues que se monto el componente.

        this.wsLisExPaciente.onopen = () => {
                       
            console.log('wsLisExPaciente........Conectado')
            } 

        this.wsLisExPaciente.onmessage = evt => {
        
            const message = JSON.parse(evt.data)
            if (message.type==='examenes_server'){

                if ((message.data===null)||(message.data===undefined)){
                   
                   alert ('No hay Examenes disponibles');

                } else {
     
                    this.setState({

                        Examenes: message.data  // guardo los pacientes en el estado
                    });

                }

            }

            if (message.type==='eliminar_examen_server'){  // mensaje de confirmacion del server que elimino el examen.

                if (message.data==='ok'){

                    this.setState({                                    
                        estadoRender: 1
                    });
                    this.solExamenesBd();
                    alert('Exámen Eliminado con exito');
                    
                }else if (message.data==='err'){
                   
                    alert('Error al eliminar Exámen');
                }


            }
        }

        this.wsLisExPaciente.onclose = () => {
            console.log('wsLisExPaciente desconectado con el Backend WsG')

             }     
    
         // Esto es para la temporizacion.
        this.timerID = setTimeout(
            () => this.solExamenesBd(),
            150
        );
        // Fin de temporizacion

    }

    componentDidUpdate(){

        this.solExamenesBd();

    }

    componentWillUnmount() {

        this.wsLisExPaciente.close();
    }

    solExamenesBd = () => {            // Solicitar los pacientes a la bd. 
        
        if (this.wsLisExPaciente.readyState===1){

            this.wsLisExPaciente.send(JSON.stringify({ type:'lista_examenes', data: this.state.tmpPaciente.usuario_id}));
            //console.log('tmp doctor: '+this.state.tmpDoctor[0].usuario_id);

        }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}
             

    }

    agregarfila = (examen,i) => {
         
        return (   
             
            <>            
             <tr>
              <th scope="row">{i+1}</th>
               <td align="center">{examen.examen_id}</td>
               <td align="center">{examen.Periodo_de_Obs}</td>                
               <td align="center" >{examen.Freq_Muestro}</td>               
               <td align="center">{moment(Number(examen.est_tiempo)).format("DD-MM-YYYY h:mm:ss")}</td>
               <td align="center">
                    <table>
                        <tr >
                            <th>
                                <img onClick={(e)=>this.selVerExamen(examen)} src={process.env.PUBLIC_URL + '/examenIcon2.png'} />
                                <span>Ver</span>
                            </th>
                            <th> 
                                <img onClick={(e)=>this.selEliminarExamen(examen)} src={process.env.PUBLIC_URL + '/eliminarExamenIcon.png'} />                                
                                <span>Eliminar</span>
                            </th>
                        
                        </tr >
                    </table>               
               </td>
             </tr>               
           </>             
        );
    }

    examenes_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();
        
        // Solicitar a la bd la lista de pacientes.
        this.solExamenesBd();
    };

    selVerExamen = (vExamen) => {  // Procede a ver un examen  de un Paciente

        this.props.mExamen(vExamen,3);

    }

    selEliminarExamen = (eExamen) => {  // Procede a eliminar un examen  de un Paciente

        if (window.confirm ('Esta seguro que desea eliminar este exámen?') == true) {

            if (this.wsLisExPaciente.readyState===1){

                this.wsLisExPaciente.send(JSON.stringify({ type:'eliminar_examen', data: eExamen.examen_id}));
    
            }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}

        } else {
           
        }


    }

    render() {
        
        return (
                       
            <>
                <div className="mainDiv" style={{ width: '90%' }}> 
                    <Alert  variant='secondary'>                                                     
                        <h1 className='centrado'>Exámenes del Paciente  {this.state.tmpPaciente.Nombre}  {this.state.tmpPaciente.Apellidos}</h1>
                        <p className='centrado'>
                            En la siguiente Tabla se relacionan todos los exámenes del paciente.                           
                        </p>                                                       
                    </Alert>
                    <table >
                        <tr >
                            <td>  
                                <DatosPaciente  paciente={this.state.tmpPaciente}/>                        
                            </td>
                            <Alert className="alertmargin" variant='secondary'>                                                   
                                <table className="alingTablasCentro2" >
                                    <tr >
                                        <th >   
                                            <div  style={{ height: '70px'}} className="btn btn-dark btn-block">                        
                                                <img className="alingTablasfilas" onClick={this.examenes_submit} src={process.env.PUBLIC_URL + '/ActualizarIcon.png'} />
                                                <span className="alingTablasfilas" onClick={this.examenes_submit} >Actualizar</span>    
                                            </div> 
                                        </th>
                                        <th >   
                                            <div  style={{ height: '70px'}} className="btn btn-dark btn-block">                        
                                                <img className="alingTablasfilas" onClick={(e)=>this.props.funCancelar()} src={process.env.PUBLIC_URL + '/AtrasIcono.png'} />
                                                <span className="alingTablasfilas"onClick={(e)=>this.props.funCancelar()} >Volver</span>     
                                            </div> 
                                        </th>                    
                                    </tr >
                                </table> 
                            </Alert>
                            <Table className="tablamargin" striped bordered hover size="sm" >
                                <thead>
                                    <tr >
                                        <th className="centrado">#</th>                            
                                        <th className="centrado">Id_Examen</th>                                                       
                                        <th className="centrado"> Período de Observación (min)</th>
                                        <th className="centrado">Frecuencia de Muestreo (Hz)</th>
                                        <th className="centrado">Inicio del Exámen</th>
                                        <th className="centrado">Opciones</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    <>                                                                                     
                                        {this.state.Examenes.map(this.agregarfila)}                                                                                                                             
                                    </> 
                                </tbody>
                            </Table>                   
                        </tr >
                    </table>                    
                </div>           
            </>      
        );
    }
  }  

export default ListarExamenesPaciente;