import React from 'react';
//import '../css/bootstrap/dist/css/bootstrap.min.css';
//import img_user from '../imagenes/user.png';
//import '../css/App.css';
//import '../css/ecg.css';

// Componenetes Externos.

import ChartJs from './Chart';
import LoginForm from './LoginForm';  // para autenticacion.
import BotonSalirAutenticacion from './BotonSalirAutenticacion';  // para desautenticacion.
import ListarPacientes from './ListarPacientes';  // para listar los pacientes del doctor.
import ListarExamenesPaciente from './ListarExamenesPaciente';  // para listar los examenes de un pacientes del doctor.
import ExamenDashBoard from './ExamenDashBoard';  // DashBoard de un examen en especifico.
import ExamenDashBoardTR from './ExamenDashBoardTR';


class DoctorDashBoard extends React.Component{


    constructor(props) {

        super(props);
        this.state = {  
            
            estaAutenticado:false,
            datosDoctor: [],
            datosPaciente: [],            
            datosExamen: [],
            etadoVisual: 1,            //1-->Listar pacientes // 2-->Listar Examenes  // 3--> Ver Examen // 4-->TR           
        
        };        
        
    }

    modificarAutenticacion = (tipo,datosDoctor) =>{

        if (tipo==="1"){   // Si el usuario esta autenticado y es un doctor entonces muestro el dashboard

            this.setState({            
                estaAutenticado: true,
                datosDoctor: datosDoctor
            });


        }else {  // sino login otra vez

            alert ('Rectifique sus permisos no tiene acceso a esta sesion');

            this.setState({            
                estaAutenticado: false,                
            })

        }

    }

    salirsesion = () => {        

        this.setState({            
            estaAutenticado: false,
            datosDoctor: []
        });

    }

    modificarVisualListarExamenes = (nPaciente,eVisual) => { // muestra la lista de examenes.
        
        this.setState({   
            datosPaciente: nPaciente,                     
            etadoVisual: eVisual
        });

    }

    modificarVisualVerTR = (nPaciente,eVisual) => { // muestra dashboard de tiempo real.
        
        this.setState({   
            datosPaciente: nPaciente,                     
            etadoVisual: eVisual
        });

    }

    modificarVisualVerExamen = (nExamen,eVisual) => { // muestra un examen .
        
        this.setState({   
            datosExamen: nExamen,                     
            etadoVisual: eVisual
        });
    }

    modificarRenderCancelar = () => {

        this.setState({                                   
            etadoVisual: 1
        });

    }
                 
    render() {
        
        if (!this.state.estaAutenticado){

            return (<LoginForm autfun={this.modificarAutenticacion} VistaAdmin={false} />);

        } else {  // Si esta autenticado entonces mostrar el contenido.

            if (this.state.etadoVisual===1) {  // Visualizar Listar Pacientes (Insertar/Modificar/Eliminar/Listar)

                return (               
                    <>   
                    <ListarPacientes salir= {this.salirsesion} datosDoctor={this.state.datosDoctor} mExamenes={this.modificarVisualListarExamenes} mTR={this.modificarVisualVerTR}/>                                                                                                                       
                    </>             
                );

            } else if (this.state.etadoVisual===2) { // Visualizar Listar Examenes de un Paciente (Eliminar/Listar)

                return (               
                    <>   
                    <ListarExamenesPaciente datosPaciente={this.state.datosPaciente} mExamen={this.modificarVisualVerExamen} funCancelar={this.modificarRenderCancelar}/>                                                                                                                       
                    </>             
                );

            } else if (this.state.etadoVisual===3) {

                return (    
                    <>                      
                     <ExamenDashBoard  listaExamenes={this.modificarVisualVerExamen} epaciente={this.state.datosPaciente} examen={this.state.datosExamen} doctor={this.state.datosDoctor}/>                                         
                    </> 
                );


            } else if (this.state.etadoVisual===4) {  //Visualiz la tx en TR de un paciente especifico.

                return (    
                    <>                      
                     <ExamenDashBoardTR  funCancelar={this.modificarRenderCancelar} epaciente={this.state.datosPaciente} examen={this.state.datosExamen} doctor={this.state.datosDoctor}/>                                         
                    </> 
                );


            }         

        }
    }
  }  

export default DoctorDashBoard;