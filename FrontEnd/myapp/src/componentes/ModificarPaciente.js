import React from 'react';
import DatosPaciente from './DatosPaciente';


import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



class ModificarPaciente extends React.Component{


    constructor(props) {

        super(props);
        this.state = {  
            
            modPaciente: this.props.modPaciente,            
        };        
        
    }
    
    wsModificarPaciente = new WebSocket(window.$WebsocketsIp);
    
    
    componentDidMount() {

        this.renderDatosPaciente();     // Visualiza los datos desdes la BD.
        
        this.wsModificarPaciente.onopen = () => {
        
        console.log('wsModificarPaciente.....conectado')

        }

        this.wsModificarPaciente.onmessage = evt => {
       
            const message = JSON.parse(evt.data)
            
            if (message.type==='modificar_Paciente_server'){

                if (message.data===0){

                    alert('Revisar');

                } else
                if (message.data===1){

                    alert('Advertencia: No puede dejar datos en blanco');


                } else
                if (message.data===2){

                    alert('Advertencia: El rango de la edad no es correcto');

                } else 
                if (message.data===3){

                    alert('Advertencia: El campo de observación no puede tener mas de 250 caracteres');

                }else 
                if (message.data===4){

                    alert('Advertencia: El paciente no existe en la base de datos');

                }else
                if (message.data===5){

                    alert('Paciente modificado correctamente');
                    this.props.fun(0);
                

                }else {alert('upss error');}
                

            }                       

        }

        this.wsModificarPaciente.onclose = () => {

        console.log('wsModificarPaciente....desconectado')        

        }

    }

    componentWillUnmount() {

        this.wsModificarPaciente.close();

    }

    modificarPaciente_submit = event => {
        
        // Esta linea detiene el submit del formulario
        event.preventDefault();

        var modificarPacientejson = {    // Creando el json con las caracteristicas del Paciente.

            usuario_id: this.state.modPaciente.usuario_id,
            Tipo: this.state.modPaciente.Tipo,
            Doctor_id: this.state.modPaciente.Doctor_id,
            Usuario: this.state.modPaciente.Usuario,
            Pass: this.state.modPaciente.Pass,
            Nombre: this.nombre_Paciente.value,
            Apellidos: this.apellido_Paciente.value,
            Correo: this.correo_Paciente.value,
            Edad: this.edad_Paciente.value,
            Genero: this.genero_Paciente.value,
            Estado_de_TX: this.Estado_de_TX_Paciente.value,
            Freq_Muestro: this.Freq_Muestro_Paciente.value,
            Periodo_de_Obs: this.Periodo_de_Obs_Paciente.value,
            Observaciones: this.observaciones_Paciente.value,
            Ultimo_Contacto: (new Date()).getTime(),

        }    
        
        if (this.wsModificarPaciente.readyState===1){
            
            this.wsModificarPaciente.send(JSON.stringify({ type:'modificar_pacientes', data: modificarPacientejson }));           
        } else {alert('Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red');}               

    };

    renderDatosPaciente = () => {

        this.nombre_Paciente.value=this.state.modPaciente.Nombre;
        this.apellido_Paciente.value=this.state.modPaciente.Apellidos;
        this.correo_Paciente.value=this.state.modPaciente.Correo;
        this.edad_Paciente.value=this.state.modPaciente.Edad;
        this.genero_Paciente.value=this.state.modPaciente.Genero;
        this.Estado_de_TX_Paciente.value=this.state.modPaciente.Estado_de_TX;
        this.Freq_Muestro_Paciente.value=this.state.modPaciente.Freq_Muestro;
        this.Periodo_de_Obs_Paciente.value=this.state.modPaciente.Periodo_de_Obs;
        this.observaciones_Paciente.value=this.state.modPaciente.Observaciones;
         
    }
    
    render() {

        return (

            <>    

                <div className="mainDiv" style={{ width: '90%' }}>    

                    <Alert variant='secondary'>                                                     
                        <h1 className='centrado'>Modificar Paciente {this.state.modPaciente.Nombre}</h1>
                        <p className='centrado'>
                            Modifique el siguiente formulario.                          
                        </p>                                                                             
                    </Alert>             


                </div>
                <div>
                    <Container style={{ width: '100%' }}>
                        <Row>
                            <Col md="auto">
                                <DatosPaciente paciente={this.state.modPaciente}/>
                            </Col>                            
                            <Col md="auto">
                            <Alert className="alertmargin" variant='secondary'>   
                                <h4 className='centrado'>Paciente con ID:{this.state.modPaciente.usuario_id} </h4>                                                
                            </Alert>
                            <div style={{ width: '830px'}}>
                                        <form className="form-group" onSubmit={this.modificarPaciente_submit}>
                                            <div className="form-group">
                                                <label>Nombre</label>
                                                <input ref={(nombrePaciente) => this.nombre_Paciente = nombrePaciente} type="text" className="form-control" placeholder="Introduzca el Nombre del Paciente" />                        
                                            </div>
                                            <div className="form-group">
                                                <label>Apellidos</label>
                                                <input ref={(apellidoPaciente) => this.apellido_Paciente = apellidoPaciente} type="text" className="form-control" placeholder="Introduzca los Apellidos del Paciente" />
                                            </div>
                                            <div className="form-group">
                                                <label>Correo Electrónico</label>
                                                <input ref={(correoPaciente) => this.correo_Paciente = correoPaciente} type="email" className="form-control" placeholder="Introduzca el Correo Electrónico del Paciente" />
                                            </div>
                                            <div className="form-group">
                                                <label>Edad </label>
                                                <input ref={(edadPaciente) => this.edad_Paciente = edadPaciente} type="text" className="form-control" placeholder="Introduzca los Apellidos del Paciente" />
                                            </div>
                                            <div className="form-group">
                                                <label for="pet-select">Género :</label>
                                                <select ref={(generoPaciente) => this.genero_Paciente = generoPaciente} className="form-control">
                                                    <option className="form-control" value="">--Selecione el Género--</option>
                                                    <option className="form-control" value="F">Femenino</option>
                                                    <option className="form-control" value="M">Masculino</option>                                                     
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label for="pet-select">Estado de Transimsión :</label>
                                                <select ref={(Estado_de_TXPaciente) => this.Estado_de_TX_Paciente = Estado_de_TXPaciente} className="form-control">
                                                    <option className="form-control" value="">--Selecione el Estado de la Transmisión--</option>                            
                                                    <option className="form-control" value="0">No Habilitado</option>  
                                                    <option className="form-control" value="1">Habilitado</option>                                                   
                                                </select>
                                            </div> 
                                            <div className="form-group">
                                                <label for="pet-select">Frecuencia de Muestreo de los Exámenes:</label>
                                                <select ref={(Freq_MuestroPaciente) => this.Freq_Muestro_Paciente = Freq_MuestroPaciente} className="form-control">
                                                    <option className="form-control" value="">--Selecione la Frecuencia de Muestreo--</option>
                                                    <option className="form-control" value="100">100 Hz</option>
                                                    <option className="form-control" value="200">200 Hz</option>  
                                                    <option className="form-control" value="250">250 Hz</option>                                                    
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label for="pet-select">Periodo de Observación de los examenes:</label>
                                                <select ref={(Periodo_de_ObsPaciente) => this.Periodo_de_Obs_Paciente = Periodo_de_ObsPaciente} className="form-control">
                                                    <option className="form-control" value="">--Selecione el Periodo de Observacion de los Examenes--</option>
                                                    <option className="form-control" value="1">1 min</option>
                                                    <option className="form-control" value="3">3 min</option>  
                                                    <option className="form-control" value="15">15 min</option>        
                                                    <option className="form-control" value="30">30 min</option>
                                                    <option className="form-control" value="0">Continuo</option>                                                
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Observaciones </label>
                                                <textarea ref={(observacionesPaciente) => this.observaciones_Paciente = observacionesPaciente} rows="3" cols="33" className="form-control" placeholder="Introduzca las observaciones del Paciente" />
                                            </div>  
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <button  type="submit" className="btn btn-success btn-block">Modificar Paciente</button>
                                                    </Col>
                                                    <Col>
                                                        <button onClick={(e)=>this.props.fun(0)} className="btn btn-secondary btn-block">Cancelar</button>
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

export default ModificarPaciente;