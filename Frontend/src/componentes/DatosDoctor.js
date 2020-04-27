import React from 'react';
import moment from 'moment';

//CSS

import '../css/ecg.css';


// Componentes del ReactBoostrap

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';



class DatosDoctor extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (
            
            <>
                <Card style={{ width: '15rem'}}>
                    <Card.Img variant="top" style={{ width: '80%',  margin: '10%' }} src={process.env.PUBLIC_URL + '/DoctorLogin.png'} />
                    <Card.Header>Datos del Doctor</Card.Header>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><strong>Id:</strong> {this.props.doctor.usuario_id}</ListGroupItem>
                        <ListGroupItem><strong>Login:</strong> {this.props.doctor.Usuario}</ListGroupItem>
                        <ListGroupItem><strong>Nombre:</strong> {this.props.doctor.Nombre}</ListGroupItem>
                        <ListGroupItem><strong>Apellidos:</strong> {this.props.doctor.Apellidos}</ListGroupItem>
                        <ListGroupItem><strong>Genero:</strong> {this.props.doctor.Genero}</ListGroupItem>
                        <ListGroupItem><strong>Correo:</strong> {this.props.doctor.Correo}</ListGroupItem>                                
                    </ListGroup>
                    <Card.Footer className="text-muted">Doctor</Card.Footer>                      
                </Card>                                                         
            </>
        )
    }
}

export default DatosDoctor;