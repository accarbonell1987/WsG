import React from 'react';
import moment from 'moment';
import '../css/ecg.css';
//import Top_img from '../imagenes/user.png';

class DatosExamen extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (

            <>

            <div>
                <h4> Datos Exámen:</h4>   
                <h5> Identificador: {this.props.examen.examen_id}</h5> 
                <h5> Frecuencia de Muestreo: {this.props.examen.Freq_Muestro} Hz</h5>  
                <h5> Período de Observación: {this.props.examen.Periodo_de_Obs} min</h5>
                <h5> Hora Inicio: {moment(Number(this.props.examen.est_tiempo)).format("DD-MM-YYYY h:mm:ss")}</h5>                
            </div> 
                
                
            </>

        )
    }
}

export default DatosExamen;