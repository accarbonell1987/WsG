
import React from 'react';
import ChartJs from './Chart';
import DatosPaciente from './DatosPaciente';
import DatosExamen from './DatosExamen';


import '../css/ecg.css';


class ExamenDashBoard extends React.Component{

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
                <h1> Examen del Paciente: {this.props.epaciente.Nombre} con ID: {this.props.examen.examen_id} </h1>
                <ChartJs  modificarEstado={this.modificarEstadoGrafica}  estadoGrafica={this.state.estadoGrafica} examen_id={this.props.examen.examen_id} tambloque={this.props.epaciente.Freq_Muestro} />
                <button onClick={this.modificarEstadoGrafica} className="btn btn-primary btn-block">{this.renderBoton()}</button> 
                <button onClick={(e)=>this.props.listaExamenes(this.props.epaciente.usuario_id,2)} className="btn btn-primary btn-block">Volver</button>    
                <DatosPaciente paciente={this.props.epaciente}/>
                <DatosExamen examen={this.props.examen}/>                                         
            </>

        )
    }
}

export default ExamenDashBoard;