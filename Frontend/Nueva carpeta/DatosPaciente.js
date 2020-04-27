import React from 'react';
import moment from 'moment';
import '../css/ecg.css';
//import Top_img from '../imagenes/user.png';

class DatosPaciente extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (
            
            <>
            <div className="contenedor">
                <h4> Datos Paciente:</h4>   
                <h5> Identificador: {this.props.paciente.usuario_id}</h5> 
                <h5> Nombre: {this.props.paciente.Nombre}</h5>  
                <h5> Apellidos: {this.props.paciente.Apellidos}</h5>
                <h5> Genero: {this.props.paciente.Genero}</h5>
                <h5> Edad: {this.props.paciente.Edad}</h5>
                <h5> Correo: {this.props.paciente.Correo}</h5>
                <h5> Último Contacto: {moment(Number(this.props.paciente.Ultimo_Contacto)).format("DD-MM-YYYY h:mm:ss")}</h5>
                <h5> Observaciones: {this.props.paciente.Observaciones}</h5>
            </div>                                
            </>

        )
    }
}

export default DatosPaciente;