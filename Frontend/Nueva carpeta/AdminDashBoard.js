import React from 'react';
import LoginForm from './LoginForm';  // para autenticacion.
import ListarUsuarios from './ListarUsuarios';  // Gestionar Usuarios.


import '../css/bootstrap/dist/css/bootstrap.min.css';



class AdminDashBoard extends React.Component{


    constructor(props) {

        super(props);
        this.state = {  
            
            estaAutenticado:false,
            datosAdmin: [],
            datosPaciente: [],            
            datosExamen: [],
            etadoVisual: 1,            //1-->Listar Usuarios //            
        
        };        
        
    }

    modificarAutenticacion = (tipo,datosUsuario) =>{

        if (tipo==="0"){   // Si el usuario esta autenticado y es un Admin entonces muestro el dashboard de Admin.

            this.setState({            
                estaAutenticado: true,
                datosAdmin: datosUsuario
            });


        }else {  // sino autenticarse otra vez

            alert ('Rectifique sus permisos no tiene acceso a esta sesion');

            this.setState({            
                estaAutenticado: false,                
            })

        }

    }

    salirsesion = () => {        

        this.setState({            
            estaAutenticado: false,
            datosAdmin: []
        });

    }
             
    render() {
        
        if (!this.state.estaAutenticado){

            return (<LoginForm autfun={this.modificarAutenticacion} VistaAdmin={true} />);

        } else {


            if (this.state.etadoVisual===1) {  // Visualizar Listar Pacientes (Insertar/Modificar/Eliminar/Listar)

                return (               
                    <>   
                        <ListarUsuarios  salir={this.salirsesion} miUsuario= {this.state.datosAdmin}/>                                                                                                                       
                    </>             
                );

            }
                        
        }

    }
  }  

export default AdminDashBoard;