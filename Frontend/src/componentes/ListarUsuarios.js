import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';
import InsertarUsuario from './InsertarUsuario';
import ModificarUsuario from './ModificarUsuario';
import moment from 'moment';


class ListarUsuarios extends React.Component{


    constructor(props) {

        super(props);
        this.state = {  
            
            usuarios: [],           // Usuario Obtenidos desde la BD.
            estadoRender: 0,        // 0-Listar Usuarios...1-Insertar Usuario....2 Modificar Usuario
            miUsuarioId: this.props.miUsuario[0] ,  // El usuario en que estoy logueado. 
            tmpUsuario: null,
            filtroUsuarios:3        //3--Todos, 0--Admin, 1--doctores, 1--Pacientes              
        
        };  
              
        this.selVerModificarUsuario= this.selVerModificarUsuario.bind(this);
        this.selEliminarUsuario= this.selEliminarUsuario.bind(this);
        
    }
    
    // Creando la Instancia de Websoket para poder comunicar mas tarde  
    wsLisUsuarios = new WebSocket(window.$WebsocketsIp);       // Crea una cnx ws con servidor
    contUsuarios=0;


    componentDidMount () {             // Esto se ejecuta despues que se monto el componente.

        this.wsLisUsuarios.onopen = () => {
                       
            console.log('wsLisUsuarios........Conectado')
            } 

        this.wsLisUsuarios.onmessage = evt => {
        
            const message = JSON.parse(evt.data)
            if (message.type==='usuarios_server'){

                if ((message.data===null)||(message.data===undefined)){
                   // Este caso no debe darse pero hay que contemplarlo
                   alert ('No hay datos');
                } else {
     
                    this.setState({

                        usuarios: message.data  // guardo los usuarios en el estado
                    });

                }

            }

            if (message.type==='eliminar_usuario_server'){  // mensaje de confirmacion del server que elimino el usuario.

                if (message.data==='ok'){

                    this.setState({                                    
                        estadoRender: 0
                    });
    
                    alert('Advertencia: Usuario eliminado con exito');
                    
                }else if (message.data==='err'){
                   
                    alert('Advertencia: Error al eliminar usuario');
                }


            }

        }

        

         // Esto es para la temporizacion.
        this.timerID = setTimeout(
            () => this.solUsuariosBd(),
            20
        );
        // Fin de temporizacion

    }

    componentWillUnmount() {

        this.wsLisUsuarios.close();
    }

    solUsuariosBd = () => {            // Solicitar los usuarios a la bd. 
        
        if (this.wsLisUsuarios.readyState===1){

            this.wsLisUsuarios.send(JSON.stringify({ type:'lista_usuarios', data: "Todos" }));

        }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}
             

    }

    renderUsuarioTipo = (tipo) =>  {
                 
        if (tipo==="0"){   //admin
 
            return ("Admin")
 
        }else if (tipo==="1"){   // Doctor
 
            return ("Doctor")
 
        } else if (tipo==="2"){  // Paciente
 
            return ("Paciente")
 
        }else {return ("Indefinido")}
 
     }

    agregarfila = (usuario,i) =>{

        var hab=false;
        console.log('new_fila');
        if (Number(this.state.filtroUsuarios)===3){

            this.contUsuarios++;
            hab=true;

        }else {
            
            if (Number((usuario.Tipo))===Number(this.state.filtroUsuarios)){

                this.contUsuarios++;
                hab=true; 

            }
        }        

        if (hab){

            return (   
             
                <>            
                 <tr>
                  <th scope="row">{this.contUsuarios}</th>
                   <td align="center">{usuario.usuario_id}</td>
                   <td>{usuario.Usuario}</td>
                   <td>{usuario.Nombre}</td>
                   <td>{usuario.Apellidos}</td>   
                   <td>{usuario.Correo}</td>             
                   <td>{this.renderUsuarioTipo(usuario.Tipo)}</td>
                   <td>{moment(Number(usuario.Ultimo_Contacto)).format("DD-MM-YYYY h:mm:ss")}</td>   
                   <td align="center">                                                                  
                        <table>
                            <tr >
                                <th>                                
                                    <img onClick={(e)=>this.selVerModificarUsuario(usuario)} src={process.env.PUBLIC_URL + '/EditarUsuariok.png'} /> 
                                    <span>Modificar</span>
                                </th>
                                <th>                                
                                    <img onClick={(e)=>this.selEliminarUsuario(usuario)} src={process.env.PUBLIC_URL + '/eliminar usuario.png'} />  
                                    <span>Eliminar</span>                                
                                </th>                        
                            </tr >
                        </table>
                   </td>
                 </tr>               
               </>   
    
            )
        }

         
     /*   return (

            <FilaUsuarios key={i} fil= {i} usuario={usuario}/>
          ) */

    }

    selVerModificarUsuario = (tmpUsuario) => {

        this.setState({            
            tmpUsuario: tmpUsuario,
            estadoRender: 2
        });

    }

    selEliminarUsuario = (tmpusuario) => {

        if (window.confirm ('Esta seguro que desea eliminar el Usuario: '+tmpusuario.Nombre+' ?') == true) {

            if (this.wsLisUsuarios.readyState===1){

                this.wsLisUsuarios.send(JSON.stringify({ type:'eliminar_usuario', data: tmpusuario.usuario_id, tipoUsuario:tmpusuario.Tipo}));            
    
            }else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}
            
        } else {
           
        }
    }

    cambiarRender = (estado) => {
        
        this.setState({                        
            estadoRender: estado
        });

    }

    actFiltro = (filtro) => {

        this.setState({                        
            filtroUsuarios: filtro
        });        

    }

    render() {

        this.contUsuarios=0;
        console.log('entro a render');
        if (this.state.estadoRender===0){
            return (
                     
                <>
                    <table>
                      <tr >
                          <th>   
                            <img onClick={(e)=>this.solUsuariosBd()} src={process.env.PUBLIC_URL + '/ActualizarIcon.png'} />
                            <span onClick={(e)=>this.solUsuariosBd()}>Actualizar Usuarios</span>                                                     
                          </th>
                          <th>
                            <button  onClick={(e)=>this.cambiarRender(1)} className="btn btn-primary btn-block">Insertar Usuario</button>
                          </th>
                          <th>
                            <button  onClick={(e)=>this.props.salir()} className="btn btn-primary btn-block">Salir {this.state.miUsuarioId.Usuario} ...</button>
                          </th>
                      
                      </tr >
                    </table>
    
                    <h3>Usuarios del Sistema</h3>  
                    <div className="form-group">
                        <table>
                            <th>
                                <label for="pet-select">Filtrar por:</label>                                
                            </th>
                            <th>
                                <select ref={(tipoFiltro) => this.tipo_Filtro = tipoFiltro}  onChange={(e)=>{this.actFiltro(this.tipo_Filtro.value)}} className="form-control">
                                    <option className="form-control" value="3">--Todos--</option>
                                    <option className="form-control" value="0">Administrador</option>
                                    <option className="form-control" value="1">Doctor</option>   
                                    <option className="form-control" value="2">Paciente</option>                                                   
                                </select>
                            </th>
                        </table>
                    
                    </div>   
                         
                    <table classname="table ">
    
                        <thead class="thead-light">
                            <tr >
                                <th scope="col">#</th>                            
                                <th scope="col">  Id de Usuario</th>
                                <th scope="col">  Login</th>
                                <th scope="col">  Nombre</th>
                                <th scope="col">  Apellidos</th>  
                                <th scope="col">  Correo</th>                                                         
                                <th scope="col">  Privilegio</th>
                                <th scope="col">  Ultimo Contacto</th>
                                <th scope="col">  Opciones</th>
    
                            </tr>
                        </thead> 
    
                        <tbody>  
                            <>                                                                                 
                                {this.state.usuarios.map(this.agregarfila)}                                                                       
                            </>  
                        </tbody>                   
                    </table>
                    
                </>    
                
            );

        } else if (this.state.estadoRender===1){

            return (<InsertarUsuario cambiarRender= {this.cambiarRender}/>)

        } else if (this.state.estadoRender===2){

            return (<ModificarUsuario cambiarRender= {this.cambiarRender} mUsuario= {this.state.tmpUsuario}/>)
            
        }
    }
  }  

export default ListarUsuarios;