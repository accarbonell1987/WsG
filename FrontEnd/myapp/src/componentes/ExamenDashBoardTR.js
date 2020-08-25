
import React from 'react';
import ChartJs from './Chart';
import DatosPaciente from './DatosPaciente';
import DatosExamen from './DatosExamen';
import ChartTR from './ChartTR';

import '../css/ecg.css';

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


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
                <div className="mainDiv" style={{ width: '90%' }}>
                    <Alert variant='secondary'>                                                     
                        <h1 className='centrado'>ECG Tiempo Real</h1>
                        <p className='centrado'>
                            A continuacion se muestran los datos registrados para este paciente en tiempo real.                           
                        </p>                                                                             
                    </Alert>
                    <table >
                        <tr >
                            <td>  
                                <DatosPaciente paciente={this.props.epaciente}/>                        
                            </td>                                
                            <Alert className="alertmargin" variant='secondary' style={{ width: '100%'}}>   
                                <h4 className='centrado'>Paciente: {this.props.epaciente.Nombre} {this.props.epaciente.Apellidos}</h4>                                                
                            </Alert>
                            <ChartTR  pacienteTR={this.props.epaciente} fmTR={this.props.epaciente.Freq_Muestro} />
                            <Container>
                                <Row className="justify-content-md-center">                                                                                                
                                    <button onClick={(e)=>this.props.funCancelar()} className="btn btn-dark btn-block" style={{ width: '30%',float:'left' }}>Volver</button>                                                                                                                          
                                </Row>
                            </Container >                                                      
                        </tr >
                    </table>                                                                      
                </div>              
            </>
        )
    }
}

export default ExamenDashBoardTR;