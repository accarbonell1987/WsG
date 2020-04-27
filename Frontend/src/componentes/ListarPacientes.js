import React from 'react';
import moment from 'moment';

//CSS
import '../css/bootstrap/dist/css/bootstrap.min.css';


// Componentes mios

import InsertarPaciente from './InsertarPaciente';
import ModificarPaciente from './ModificarPaciente';
import DatosDoctor from './DatosDoctor';



// Componentes del ReactBoostrap

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import CardGroup from 'react-bootstrap/CardGroup'; 


import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

class ListarPacientes extends React.Component{

    
    constructor(props) {

        super(props);
        this.state = {  
            
            Pacientes: [],                          // Arreglo con todos los pacientes que pertenecen a este Doctor.
            tmpDoctor: this.props.datosDoctor,      // Datos del Doctor. 
            estadoRender: 0,                         // 0-Listar Pacientes...1-Insertar Paciente....2 Modificar Paciente
            tmpPaciente: null
        
        };  
        
        this.selEliminarPaciente= this.selEliminarPaciente.bind(this);
        this.selModificarPaciente= this.selModificarPaciente.bind(this);
        this.selVerExamenesPaciente= this.selVerExamenesPaciente.bind(this);
        
    }

    wsLisPacientes = new WebSocket(window.$WebsocketsIp);       // Crea una cnx ws con servidor


    componentDidMount () {             // Esto se ejecuta despues que se monto el componente.

        this.wsLisPacientes.onopen = () => {
                       
            console.log('wsLisPacientes........Conectado')
            } 

        this.wsLisPacientes.onmessage = evt => {
        
            const message = JSON.parse(evt.data)
            if (message.type==='pacientes_server'){

                if ((message.data===null)||(message.data===undefined)){
                   
                   alert ('Advertencia: No hay pacientes disponibles');

                } else {
     
                    this.setState({

                        Pacientes: message.data  // guardo los pacientes en el estado
                    });

                }

            }

            if (message.type==='eliminar_pacientes_server'){  // mensaje de confirmacion del server que elimino el paciente.

                if (message.data==='ok'){

                    this.setState({                                    
                        estadoRender: 0
                    });
    
                    alert('Advertencia: Paciente eliminado con exito');
                    
                }else if (message.data==='err'){
                   
                    alert('Advertencia: Error al eliminar paciente');
                }


            }
        }
    
         // Esto es para la temporizacion.
        this.timerID = setTimeout(
            () => this.solPacientesBd(),
            150
        );
        // Fin de temporizacion

    }

    componentWillUnmount() {

        this.wsLisPacientes.close();
    }

    solPacientesBd = () => {            // Solicitar los pacientes a la bd. 
        
        if (this.wsLisPacientes.readyState===1){

            this.wsLisPacientes.send(JSON.stringify({ type:'lista_pacientes', data: this.state.tmpDoctor[0].usuario_id}));

        }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}
             

    }

    //<FilaPacientes key={i} fil= {i} paciente={paciente}/>
    agregarfila =(paciente,i) =>{
         
        return (
            
            <>                 

              <tr>
               <th>{i+1}</th>
                <td align="center" >{paciente.usuario_id}</td>
                <td>{paciente.Nombre}</td>                
                <td align="center">{paciente.Apellidos}</td>
                <td align="center">{paciente.Genero}</td>
                <td>{this.renderEstadoTX(paciente.Estado_de_TX)}</td>
                <td align="center">{paciente.Freq_Muestro}</td>
                <td align="center">{paciente.Periodo_de_Obs}</td>
                <td align="center" >{moment(Number(paciente.Ultimo_Contacto)).format("DD-MM-YYYY h:mm:ss")}</td>
                <td >
                    <table>
                        <tr >
                            <td>                                
                                <img onClick={(e)=>this.selVerExamenesPaciente(paciente)} src={process.env.PUBLIC_URL + '/listarExamenIcon.png'} />
                                Exámenes
                            </td>
                            <td>                                
                                <img onClick={(e)=>this.selModificarPaciente(paciente)} src={process.env.PUBLIC_URL + '/EditarUsuariok.png'} />
                                Modificar
                            </td>
                            <td>                                
                                <img onClick={(e)=>this.selEliminarPaciente(paciente)} src={process.env.PUBLIC_URL + '/eliminar usuario.png'} />
                                <span>Eliminar</span>
                            </td>
                            <td>                                
                                <img onClick={(e)=>this.selVistaTR(paciente)} src={process.env.PUBLIC_URL + '/RTExamen.png'} />
                                <span>Vista TR</span> 
                            </td>                        
                        </tr >
                    </table>            
                </td>
              </tr>               
            </>     
          ) 
    }

    pacientes_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();
        
        // Solicitar a la bd la lista de pacientes.
        this.solPacientesBd();
        

    };

    renderEstadoTX = (Estado_de_TX) =>{
         
        if (Estado_de_TX==="0"){   //Tx no hab
 
            return ("No Habilitado")
 
        }else if (Estado_de_TX==="1"){   // Tx hab
 
            return ("Habilitado")
 
        } else {return ("Indefinido")}   // Valor no esperado
 
    }

    selEliminarPaciente = (epaciente) => {         // procede a eliminar paciente del doctor xx.

        if (window.confirm ('Esta seguro que desea eliminar el Paciente?') == true) {

            if (this.wsLisPacientes.readyState===1){

                this.wsLisPacientes.send(JSON.stringify({ type:'eliminar_pacientes', data: epaciente.usuario_id}));            
    
            }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}
            
        } else {
           
        }
                
    } 

    selModificarPaciente = (mpaciente) => {         // procede a modificar paciente del doctor xx.
        
        this.setState({            
            tmpPaciente: mpaciente,
            estadoRender: 2
        });

    } 

    selVerExamenesPaciente = (vpaciente) => {     // procede a ver los examenes de un paciente del doctor xx.

        this.props.mExamenes(vpaciente,2);

    } 

    cambiarRender = (estado) => {
        
        this.setState({                        
            estadoRender: estado
        });

    }

    selVistaTR = (trpaciente) =>{

        this.props.mTR(trpaciente,4);

    }

    noHayPacienetes = () => {

        if (this.state.Pacientes.length===0){
            return (
                <>
                    <Alert variant='danger' className="centrado"> 
                        <h5>
                            Lo sentimos no hay pacientes disponibles. 
                        </h5>
                    </Alert>                 
                </>
            )
        }
    }

    render() {

        if (this.state.estadoRender===0){  // Listar

            return (
                       
                <>                        
                    <div className="mainDiv" style={{ width: '90%' }}>
                        <Jumbotron  style={{ height: '200px'}}>
                                                     
                            <h1 className='centrado'>Bienvenido Dr. {this.state.tmpDoctor[0].Nombre}  {this.state.tmpDoctor[0].Apellidos} </h1>
                            <p className='centrado'>
                                En la siguiente Tabla se relacionan todos sus pacientes.                           
                            </p>
                              
                        </Jumbotron>
                        <table >
                            <tr >
                                <td>  
                                    <DatosDoctor doctor={this.state.tmpDoctor[0]}/>                        
                                </td>
                                
                                    <Alert className="alertmargin" variant='secondary'>                                                   
                                        <table className="alingTablasCentro" >
                                            <tr >
                                                <th >   
                                                    <div  style={{ height: '70px'}} className="btn btn-success btn-block">                        
                                                    <img  onClick={(e)=>this.solPacientesBd()} src={process.env.PUBLIC_URL + '/ActualizarIcon.png'} />
                                                    <span className="alingTablasfilas" onClick={(e)=>this.solPacientesBd()}>Actualizar Pacientes</span>  
                                                    </div> 
                                                </th>
                                                <th >
                                                    <div style={{ height: '70px'}} className="btn btn-success btn-block"> 
                                                    <img  className="alingTablasfilas" onClick={(e)=>this.cambiarRender(1)} src={process.env.PUBLIC_URL + '/InsertarPacienteIcono.png'} />
                                                    <span className="alingTablasfilas" onClick={(e)=>this.cambiarRender(1)}>Insertar Paciente</span>                             
                                                    </div>
                                                </th>
                                                <th>  
                                                    <div style={{ height: '70px'}} className="btn btn-success btn-block">                         
                                                    <img className="alingTablasfilas" onClick={(e)=>this.props.salir()} src={process.env.PUBLIC_URL + '/logout2.png'} />
                                                    <span className="alingTablasfilas" onClick={(e)=>this.props.salir()}>Salir Sesión</span>  
                                                    </div>
                                                </th>                                            
                                            </tr >
                                        </table> 
                                    </Alert>
                                    <Table striped bordered hover size="sm" >
                                        <thead>
                                            <tr>
                                                <th className="centrado">#</th>
                                                <th className="centrado">Id_Paciente</th>
                                                <th className="centrado">Nombre</th>
                                                <th className="centrado">Apellidos</th>
                                                <th className="centrado">Genero (F/M)</th>
                                                <th className="centrado">Estado_TX</th>
                                                <th className="centrado">FM(Hz)</th>
                                                <th className="centrado">Observación (min)</th>
                                                <th className="centrado">Último Registro</th>
                                                <th className="centrado">Opciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <>                                                                                     
                                                {this.state.Pacientes.map(this.agregarfila)}                                                                                                                            
                                            </> 
                                        </tbody>
                                    </Table>  

                                    {this.noHayPacienetes()}
                                                    
                            </tr >
                        </table>                                                                      
                    </div>  
                </>    
                
            );

        }else if (this.state.estadoRender===1){  // Insertar

            return (<InsertarPaciente fun= {this.cambiarRender} doctorid= {this.state.tmpDoctor[0].usuario_id} doctor={this.state.tmpDoctor[0]}/>)

        }else if (this.state.estadoRender===2){   // Modificar

            return (<ModificarPaciente fun= {this.cambiarRender} modPaciente= {this.state.tmpPaciente}/>)

        }else {

            alert ('Error');

        }                

    }
}  

export default ListarPacientes;