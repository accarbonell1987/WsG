import React from 'react';

class ModificarUsuario extends React.Component{


    constructor(props) {

        super(props);
        this.state = {  
            
            mUsuario: this.props.mUsuario,            
        };        
        
    }
    
    wsModificarUsuario = new WebSocket(window.$WebsocketsIp);
    
    
    componentDidMount() {

        this.renderDatosUsuario();     // Visualiza los datos desdes la BD.
        
        this.wsModificarUsuario.onopen = () => {
        
        console.log('wsModificarUsuario.....conectado')

        }

        this.wsModificarUsuario.onmessage = evt => {
       
            const message = JSON.parse(evt.data)
            
            if (message.type==='modificar_Usuario_server'){

                if (message.data===0){

                    alert('Revisar');

                } else
                if (message.data===1){

                    alert('Advertencia: No puede dejar datos en blanco');


                } else
                if (message.data===2){

                    alert('Advertencia: Las contraseñas no coinciden');

                } else 
                if (message.data===3){

                    alert('Advertencia: El tipo de usuario (rol) no es adecuado');

                }else 
                if (message.data===4){

                    alert('Advertencia: El Usuario no existe en la base de datos');

                }else
                if (message.data===5){

                    alert('Usuario modificado correctamente');
                    this.props.cambiarRender(0);
                

                }else {alert('upss error');}
                

            }                       

        }

        this.wsModificarUsuario.onclose = () => {

        console.log('wsModificarUsuario....desconectado')        

        }

    }

    componentWillUnmount() {

        this.wsModificarUsuario.close();

    }

    modificarPaciente_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();

        var modificarUsuariojson = {    // Creando el json con las caracteristicas del Paciente.

            usuario_id: this.state.mUsuario.usuario_id,
            Tipo: this.tipo_Usuario.value,
            Doctor_id: this.state.mUsuario.Doctor_id,
            Usuario: this.login_Usuario.value,
            Pass: this.pass_Usuario.value,
            Repass: this.repass_Usuario.value,
            Nombre: this.nombre_Usuario.value,
            Apellidos: this.apellidos_Usuario.value,
            Correo: this.correo_Usuario.value,
            Edad: this.state.mUsuario.Edad,
            Genero: this.state.mUsuario.Genero,
            Estado_de_TX: this.state.mUsuario.Estado_de_TX,
            Freq_Muestro: this.state.mUsuario.Freq_Muestro,
            Periodo_de_Obs: this.state.mUsuario.Periodo_de_Obs,
            Observaciones: this.state.mUsuario.Observaciones,
            Ultimo_Contacto: (new Date()).getTime(),

        }                    

        if (this.wsModificarUsuario.readyState===1){
            
            this.wsModificarUsuario.send(JSON.stringify({ type:'modificar_usuario', data: modificarUsuariojson }));           

        } else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}               

    };

    renderDatosUsuario = () => {

        this.nombre_Usuario.value=this.state.mUsuario.Nombre;
        this.apellidos_Usuario.value=this.state.mUsuario.Apellidos;
        this.correo_Usuario.value=this.state.mUsuario.Correo;
        this.tipo_Usuario.value=this.state.mUsuario.Tipo;
        this.login_Usuario.value=this.state.mUsuario.Usuario;        
         
    }
    
    render() {

        return (
            
            <div className=" contenedor">

                <form className="form-group" onSubmit={this.modificarPaciente_submit}>
                    <h3 className=" centrado">Modificar Usuario con ID:{this.state.mUsuario.usuario_id}</h3>

                    <div className="form-group">
                        <label>Nombre</label>
                        <input ref={(nombreUsuario) => this.nombre_Usuario = nombreUsuario} type="text" className="form-control" placeholder="Introduzca el Nombre del Usuario" />                        
                    </div>

                    <div className="form-group">
                        <label>Apellidos</label>
                        <input ref={(apellidosUsuario) => this.apellidos_Usuario = apellidosUsuario} type="text" className="form-control" placeholder="Introduzca los Apellidos del Usuario" />
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
                    
                    <button type="submit" className="btn btn-primary btn-block">Modificar Usuario</button>
                    <button onClick={(e)=>this.props.cambiarRender(0)} className="btn btn-primary btn-block">Cancelar</button>                    
                </form>
            </div>
        );
    }
  }  

export default ModificarUsuario;