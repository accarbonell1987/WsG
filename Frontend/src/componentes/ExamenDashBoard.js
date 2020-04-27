
import React from 'react';
import ChartJs from './Chart';
import DatosPaciente from './DatosPaciente';
import DatosExamen from './DatosExamen';


import '../css/ecg.css';

// Componentes del ReactBoostrap

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron'; 
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import CardGroup from 'react-bootstrap/CardGroup'; 


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

            return ("||")

        } else {

            return ("I>")

        }

    }

    render () {

        return (

            <>
                <div className="mainDiv" style={{ width: '90%' }}>
                    <Jumbotron  style={{ height: '200px'}}>                                                     
                        <h1 className='centrado'>Examen del Paciente: {this.props.epaciente.Nombre}</h1>
                        <p className='centrado'>
                            A continuacion se muestran los datos registrados para este exámen.                           
                        </p>                                                       
                    </Jumbotron>
                    <Container style={{ width: '100%', paddingLeft:'0px', marginLeft:'0px', paddingRight: '0px', marginRight: '0px' }}>
                        <Row>
                            <Col md="auto">
                                <DatosExamen examen={this.props.examen}/>
                            </Col>
                            <Col >
                                <Container  style={{ width: '800px', paddingLeft:'0px', marginLeft:'0px', paddingRight: '0px', marginRight: '0px' }}>                                     
                                    <Row>
                                        <Alert className="alertmargin" variant='secondary' style={{ width: '100%', paddingLeft:'0px', marginLeft:'0px', paddingRight: '0px', marginRight: '0px' }}>   
                                        <h4 className='centrado'>ECG examen con ID:{this.props.examen.examen_id} </h4>                                                
                                        </Alert>
                                    </Row>
                                    <Row >
                                        <div>
                                            <ChartJs  modificarEstado={this.modificarEstadoGrafica}  estadoGrafica={this.state.estadoGrafica} examen_id={this.props.examen.examen_id} tambloque={this.props.epaciente.Freq_Muestro} />                                    
                                        </div>
                                    </Row>
                                    <Row>
                                        <Col >
                                            <button onClick={this.modificarEstadoGrafica} className="btn btn-success btn-block" style={{ width: '50%',float:'right' }}>{this.renderBoton()}</button>
                                        </Col>
                                        <Col>
                                            <button onClick={(e)=>this.props.listaExamenes(this.props.epaciente.usuario_id,2)} className="btn btn-dark btn-block" style={{ width: '50%',float:'left' }}>Volver</button>
                                        </Col>                                                                                      
                                    </Row>
                                </Container >                                                                 
                            </Col>
                        </Row>
                    </Container>
                </div>                                                               
            </>
        )
    }
}

export default ExamenDashBoard;