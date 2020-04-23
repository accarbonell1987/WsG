import React from 'react';
import moment from 'moment';
import '../css/bootstrap/dist/css/bootstrap.min.css';
import InsertarPaciente from './InsertarPaciente';
import ModificarPaciente from './ModificarPaciente';

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
               <th scope="row">{i+1}</th>
                <td align="center">{paciente.usuario_id}</td>
                <td>{paciente.Nombre}</td>                
                <td >{paciente.Apellidos}</td>
                <td align="center">{paciente.Genero}</td>
                <td>{this.renderEstadoTX(paciente.Estado_de_TX)}</td>
                <td align="center">{paciente.Freq_Muestro}</td>
                <td align="center">{paciente.Periodo_de_Obs}</td>
                <td align="center">{moment(Number(paciente.Ultimo_Contacto)).format("DD-MM-YYYY h:mm:ss")}</td>
                <td align="center">
                    <table>
                        <tr >
                            <th>                                
                                <img onClick={(e)=>this.selVerExamenesPaciente(paciente)} src={process.env.PUBLIC_URL + '/listarExamenIcon.png'} />
                                <span>Exámenes</span>
                            </th>
                            <th>                                
                                <img onClick={(e)=>this.selModificarPaciente(paciente)} src={process.env.PUBLIC_URL + '/EditarUsuariok.png'} />
                                <span>Modificar</span>
                            </th>
                            <th>                                
                                <img onClick={(e)=>this.selEliminarPaciente(paciente)} src={process.env.PUBLIC_URL + '/eliminar usuario.png'} />
                                <span>Eliminar</span>
                            </th>
                            <th>                                
                                <img onClick={(e)=>this.selVistaTR(paciente)} src={process.env.PUBLIC_URL + '/RTExamen.png'} />
                                <span>Vista TR</span> 
                            </th>                        
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

    render() {

        if (this.state.estadoRender===0){  // Listar

            return (
                       
                <>

                    <table style={{ position: "relative", width: "50%", height: "100px" }}>
                    <tr >
                        <th>                            
                            <img onClick={(e)=>this.solPacientesBd()} src={process.env.PUBLIC_URL + '/ActualizarIcon.png'} />
                            <span onClick={(e)=>this.solPacientesBd()}>Actualizar Pacientes</span>  
                        </th>
                        <th>
                            <img onClick={(e)=>this.cambiarRender(1)} src={process.env.PUBLIC_URL + '/InsertarPacienteIcono.png'} />
                            <span onClick={(e)=>this.cambiarRender(1)}>Insertar Paciente</span>                             
                        </th>
                        <th>                           
                            <img onClick={(e)=>this.props.salir()} src={process.env.PUBLIC_URL + '/logout2.png'} />
                            <span onClick={(e)=>this.props.salir()}>Salir Sesión</span>  
                        </th>
                    
                    </tr >
                    </table>
                    
                    
                    <h3 className=" contenedor"> Pacientes del Dr. {this.state.tmpDoctor[0].Nombre}  {this.state.tmpDoctor[0].Apellidos} </h3>           
                    <table classname="table " >
    
                        <thead class="thead-light">
                            <tr >
                                <th scope="col">#</th>                            
                                <th scope="col">  Id_Paciente</th>                            
                                <th scope="col">  Nombre</th>
                                <th scope="col">  Apellidos</th>                            
                                <th scope="col">  Genero (F/M) </th>
                                <th scope="col">  Estado_TX</th>
                                <th scope="col">  Freq. Muestreo</th>
                                <th scope="col">  Periodo de Observacion</th>
                                <th scope="col">  Ultimo Registro</th>
                                <th scope="col" align="center">  Opciones</th>
    
                            </tr>
                        </thead> 
    
                        <tbody>  
                            <>    
                                                                                 
                                {this.state.Pacientes.map(this.agregarfila)}                                               
                            
                            </>  
                        </tbody>                   
                    </table>

                </>    
                
            );

        }else if (this.state.estadoRender===1){  // Insertar

            return (<InsertarPaciente fun= {this.cambiarRender} doctorid= {this.state.tmpDoctor[0].usuario_id}/>)

        }else if (this.state.estadoRender===2){   // Modificar

            return (<ModificarPaciente fun= {this.cambiarRender} modPaciente= {this.state.tmpPaciente}/>)

        }else {

            alert ('Error');

        }                

    }
}  

export default ListarPacientes;