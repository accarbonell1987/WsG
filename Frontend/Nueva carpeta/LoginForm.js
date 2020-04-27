import React from 'react';
//import '../css/bootstrap/dist/css/bootstrap.min.css';
//import img_user from '../imagenes/user.png';
//import '../css/App.css';
import '../css/ecg.css';

class LoginForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {  
            VistaAdmin: this.props.VistaAdmin         
        }; 
    }
       
    wsAuth = new WebSocket(window.$WebsocketsIp);
                    
    componentDidMount() {

        this.wsAuth.onopen = () => {     

            console.log('wsAuth....conectado')

        }

        this.wsAuth.onmessage = evt => {
        
            const message = JSON.parse(evt.data)
            
            if (message.type==='auth_server'){

                if (message.data.auth_code===0){

                    alert('Usuario Incorrecto');

                } else
                if (message.data.auth_code===1){

                    this.wsAuth.close();                    
                    this.props.autfun(message.data.auth_tipo,message.data.datosUsuario);
                    // redirigir la ruta
                    //this.props.history.push(`/InsertarUsuario`);                    
                } else
                if (message.data.auth_code===2){

                    alert('contraseña incorrecta');

                }else {alert('upss error');}
                

            }

        }

        this.wsAuth.onclose = () => {

            console.log('wsAuth.....desconectado')
       
        }

    }

    componentWillUnmount() {
         
        this.wsAuth.close();     // Cerrando conexion WS                                

    } 

    solAuthBd = () => {            // Solicitar autenticacion en bd.  
        
        var u_auth_json = {

            Usuario: this.sub_usuario.value,
            Pass: this.sub_pass.value,
        }
        
        if (this.wsAuth.readyState===1){

            this.wsAuth.send(JSON.stringify({ type:'auth_usuario', data: u_auth_json }));

        } else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}                       

    }

    auth_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();
        
        // Solicitar a la bd la autenticacion
        this.solAuthBd();

    };

    test = () => {

        if (this.wsAuth.readyState===1){

            this.wsAuth.send(JSON.stringify({ type:'test', data: null }));

        } else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}                       


    }

    AdminRender = () => {

        if (this.state.VistaAdmin) {

            return ("Admin")

        } else {

            return ("Doctor")

        }
    }

    vinculoRender = () => {

        if (this.state.VistaAdmin) {

            return (

                <p className="forgot-password text-right">
                    Ir a  <a href="/"> Login Doctor</a>
                </p>

            )

        } else {

            return (

                <p className="forgot-password text-right">
                    Ir a  <a href="/Admin"> Login Admin</a>
                </p>

            )

        }


    }

    imagenRender = () => {

        if (this.state.VistaAdmin) {

            return (

                <img src={process.env.PUBLIC_URL + '/adminIcon2.png'} />

            )

        } else {

            return (

                <img src={process.env.PUBLIC_URL + '/DoctorLogin.png'} /> 

            )

        }


    }

    render() {
        return (
            
            <div className=" contenedor">
                                                
                <form className="form-group" onSubmit={this.auth_submit}>
                                        
                    <div className=" centrado">

                        {this.imagenRender()}                        

                    </div>

                    <h3 className=" centrado">Login {this.AdminRender()}</h3>
                    
                    <div className="form-group">
                        <label>Usuario</label>
                        <input ref={(input1) => this.sub_usuario = input1} type="text" className="form-control" placeholder="Introduzca el Usuario" />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input ref={(input2) => this.sub_pass = input2}  type="password" className="form-control" placeholder="Introdusca la Contraseña" />
                    </div>

                    <div className="form-group">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label" htmlFor="customCheck1">Recordartorio</label>
                        </div>
                    </div>

                    <button  type="submit" className="btn btn-primary btn-block">Autenticar</button>
                    {this.vinculoRender()}

                </form>
            </div>
        );
    }
  }  

export default LoginForm;
