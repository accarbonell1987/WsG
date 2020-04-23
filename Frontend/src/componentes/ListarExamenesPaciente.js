import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';
import FilaExamenes from './FilaExamenes';
import moment from 'moment';



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
    
                    alert('Exámen Eliminado con exito');
                    
                }else if (message.data==='err'){
                   
                    alert('Error al eliminar Exámen');
                }


            }
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
                <table>
                    <tr >
                        <th>                           
                            <img onClick={(e)=>this.props.funCancelar()} src={process.env.PUBLIC_URL + '/AtrasIcono.png'} />
                            <span onClick={(e)=>this.props.funCancelar()} >Volver</span> 
                        </th>
                        <th>
                            <img onClick={this.examenes_submit} src={process.env.PUBLIC_URL + '/ActualizarIcon.png'} />
                            <span onClick={this.examenes_submit} >Actualizar</span>                             
                        </th>                        
                    </tr >
                </table> 

               
                <h3> Examenes del Paciente  {this.state.tmpPaciente.Nombre}  {this.state.tmpPaciente.Apellidos} </h3>           
                <table classname="table ">

                    <thead class="thead-light">
                        <tr >
                            <th scope="col">#</th>                            
                            <th scope="col">...Id_Examen...</th>                                                       
                            <th scope="col">...Periodo de Observación (min)...</th>
                            <th scope="col">...Freq. Muestreo (Hz)...</th>
                            <th scope="col">...Inicio del Exámen...</th>
                            <th scope="col">...OPCIONES...</th> 

                        </tr>
                    </thead> 

                    <tbody>  
                        <>    
                                                                             
                            {this.state.Examenes.map(this.agregarfila)}                                               
                        
                        </>  
                    </tbody>                   
                </table>             
            </>    
            
        );
    }
  }  

export default ListarExamenesPaciente;