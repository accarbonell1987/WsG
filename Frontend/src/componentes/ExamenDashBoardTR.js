
import React from 'react';
import ChartJs from './Chart';
import DatosPaciente from './DatosPaciente';
import DatosExamen from './DatosExamen';
import ChartTR from './ChartTR';

import '../css/ecg.css';



class ExamenDashBoardTR extends React.Component{

    constructor(props) {

        super(props);  
        this.state = {              
            estadoGrafica: true        
        };        
        
    }

    modificarEstadoGrafica = () => {     // cambia grafica al estado opuesto PLAY/PAUSE

        if (this.state.estadoGrafica) {

           this.setState({            
               estadoGrafica: false,                
           });

        } else {

           this.setState({            
               estadoGrafica: true,                
           });

        }

    }

    
    renderBoton = () => {

        if (this.state.estadoGrafica){

            return ("Detener")

        } else {

            return ("Comenzar")

        }

    }

    render () {

        return (

            <>

                <h1> Datos en Tiempo Real de: {this.props.epaciente.Nombre} con ID: {this.props.examen.examen_id} </h1>                              
                <ChartTR  pacienteTR={this.props.epaciente} tambloque={this.props.epaciente.Freq_Muestro} />                                  
                <button onClick={(e)=>this.props.funCancelar()} className="btn btn-primary btn-block">Volver</button> 
                <DatosPaciente paciente={this.props.epaciente}/>        
        
            </>

        )
    }
}

export default ExamenDashBoardTR;