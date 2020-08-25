import React from 'react';
import md5 from 'md5';

import DatosAdmin from './DatosAdmin';


import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



class InsertarUsuario extends React.Component{
    
    
    constructor(props) {

        super(props);
        this.state = {  
            
            miUsuario: 0,            
        };        
        
    }

    wsInsertarUsuario = new WebSocket(window.$WebsocketsIp);
    
    componentDidMount() {

        this.wsInsertarUsuario.onopen = () => {
        
        console.log('wsInsertarUsuario.....conectado')

        }

        this.wsInsertarUsuario.onmessage = evt => {
       
            const message = JSON.parse(evt.data)
            console.log('llego un paquete');
            
            if (message.type==='insertarUsuario_server'){

                if (message.data===0){

                    alert('Revisar');

                } else if (message.data===1){
                
                    alert('Advertencia: No puede dejar datos en blanco');

                } else
                if (message.data===2){

                    alert('Advertencia: Las contraseñas no coinciden');

                } else 
                if (message.data===3){

                    alert('Advertencia: El tipo de usuario (rol) no es adecuado');

                }else 
                if (message.data===4){

                    alert('Advertencia: El Usuario ya existe en la base de datos');

                }else
                if (message.data===5){

                    alert('Usuario insertado correctamente');
                    // redirigir la ruta
                    //this.props.history.push(`/ListarUsuarios`);
                    this.props.cambiarRender(0);

                }else {alert('upss error');}
                

            }
                

        }

        this.wsInsertarUsuario.onclose = () => {
        console.log('wsInsertarUsuario....desconectado')        

        }

    }

    componentWillUnmount() {

        this.wsInsertarUsuario.close();
    }



    nuevoUsuario_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();

        var nuevoUsuario_json = {    // Creando el jason con las caracteristicas del usuario.

            Nombre: this.nombre_Usuario.value,
            Apellidos: this.apellido_Usuario.value,
            Correo: this.correo_Usuario.value,
            Tipo: this.tipo_Usuario.value,
            Usuario: this.login_Usuario.value,
            Pass: md5(this.pass_Usuario.value),
            Repass: md5(this.repass_Usuario.value)

        }    
              

        if (this.wsInsertarUsuario.readyState===1){
            
            this.wsInsertarUsuario.send(JSON.stringify({ type:'insertar_usuario', data: nuevoUsuario_json }));
            console.log('mando el insertar usuario');
            

        } else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}               

    };

    render() {
        return (
            <>
                <div className="mainDiv" style={{ width: '90%' }}> 
                    <Alert className="alertmargin" variant='secondary'>   
                    <h1 className='centrado'>Insertar Usuario  </h1>
                        <p className='centrado'>
                            Inserte los datos del usuario en el siguiente formulario.                           
                        </p>                                               
                    </Alert>
                    <Container style={{ width: '100%' }}>
                        <Row>
                            <Col md="auto">
                                <DatosAdmin admin={this.props.admin}/>
                            </Col>
                            <Col md="auto">
                                <Alert className="alertmargin" variant='secondary'>   
                                    <h4 className='centrado'>Nuevo Usuario</h4>                                                
                                </Alert>
                                <div style={{ width: '830px'}}>                                                                        
                                    <form className="form-group" onSubmit={this.nuevoUsuario_submit}>                        
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input ref={(nombreUsuario) => this.nombre_Usuario = nombreUsuario} type="text" className="form-control" placeholder="Introduzca el Nombre del Usuario" />
                                        </div>

                                        <div className="form-group">
                                            <label>Apellidos</label>
                                            <input ref={(apellidoUsuario) => this.apellido_Usuario = apellidoUsuario} type="text" className="form-control" placeholder="Introduzca los Apellidos del Usuario" />
                                        </div>

                                        <div className="form-group">
                                            <label>Correo Electrónico</label>
                                            <input ref={(correoUsuario) => this.correo_Usuario = correoUsuario} type="email" className="form-control" placeholder="Introduzca el Correo Electrónico del Usuario" />
                                        </div>

                                        <div className="form-group">
                                            <label for="pet-select">Tipo de Usuario (Rol):</label>
                                            <select ref={(tipoUsuario) => this.tipo_Usuario = tipoUsuario} className="form-control">
                                                <option className="form-control" value="3">--Selecione un tipo--</option>
                                                <option className="form-control" value="0">Administrador</option>
                                                <option className="form-control" value="1">Doctor</option>                                                     
                                            </select>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Usuario</label>
                                            <input ref={(loginUsuario) => this.login_Usuario = loginUsuario}type="text" className="form-control" placeholder="introduzca el Nombre de Usuario para la Autenticación" />
                                        </div>

                                        <div className="form-group">
                                            <label>Contraseña</label>
                                            <input ref={(passUsuario) => this.pass_Usuario = passUsuario} type="password" className="form-control" placeholder="Introduzca la contraseña" />
                                        </div>

                                        <div className="form-group">
                                            <label>Contraseña Rectificada</label>
                                            <input ref={(repassUsuario) => this.repass_Usuario = repassUsuario} type="password" className="form-control" placeholder="Vuelva a escribir la contraseña" />
                                        </div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <button type="submit" className="btn btn-success btn-block">Insertar Usuario</button>
                                                </Col>
                                                <Col>
                                                    <button onClick={(e)=>this.props.cambiarRender(0)} className="btn btn-dark btn-block">Cancelar</button>
                                                </Col>
                                            </Row>
                                        </Container>                                                                                              
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>                   
            </>
        );
    }
  }  

export default InsertarUsuario;