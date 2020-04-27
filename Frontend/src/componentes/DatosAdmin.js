import React from 'react';
import moment from 'moment';

//CSS

import '../css/ecg.css';


// Componentes del ReactBoostrap

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';



class DatosAdmin extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (
            
            <>
                <Card style={{ width: '15rem'}}>
                    <Card.Img variant="top" style={{ width: '80%',  margin: '10%' }} src={process.env.PUBLIC_URL + '/DoctorLogin.png'} />
                    <Card.Body>
                        <Card.Title>Datos Admin</Card.Title>                       
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><strong>Id:</strong> {this.props.admin.usuario_id}</ListGroupItem>
                        <ListGroupItem><strong>Login:</strong> {this.props.admin.Usuario}</ListGroupItem>
                        <ListGroupItem><strong>Nombre:</strong> {this.props.admin.Nombre}</ListGroupItem>
                        <ListGroupItem><strong>Apellidos:</strong> {this.props.admin.Apellidos}</ListGroupItem>
                        <ListGroupItem><strong>Genero:</strong> {this.props.admin.Genero}</ListGroupItem>
                        <ListGroupItem><strong>Correo:</strong> {this.props.admin.Correo}</ListGroupItem>                                
                    </ListGroup>                    
                </Card>                                                         
            </>
        )
    }
}

export default DatosAdmin;