import React from 'react';
import moment from 'moment';
import '../css/ecg.css';
//import Top_img from '../imagenes/user.png';

// Componentes del ReactBoostrap

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

class DatosExamen extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (

            <>
                <Card style={{ width: '15rem'}}>
                    <Card.Img variant="top" style={{ width: '80%',  margin: '10%' }} src={process.env.PUBLIC_URL + '/Examen.png'} />
                    <Card.Header>Datos del Exámen:</Card.Header>
                    <ListGroup className="list-group-flush">                        
                        <ListGroupItem><strong>Identificador:</strong> {this.props.examen.examen_id}</ListGroupItem>
                        <ListGroupItem><strong>Frecuencia de Muestreo:</strong> {this.props.examen.Freq_Muestro} Hz</ListGroupItem>
                        <ListGroupItem><strong>Período de Observación:</strong> {this.props.examen.Periodo_de_Obs} min</ListGroupItem>
                        <ListGroupItem><strong>Hora Inicio:</strong> {moment(Number(this.props.examen.est_tiempo)).format("DD-MM-YYYY h:mm:ss")}</ListGroupItem>                                                       
                    </ListGroup>
                    <Card.Footer className="text-muted">Exámen</Card.Footer>                      
                </Card> 
            </>
        )
    }
}
export default DatosExamen;