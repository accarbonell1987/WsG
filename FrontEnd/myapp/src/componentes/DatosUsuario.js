import React from 'react';

//CSS

import '../css/ecg.css';


// Componentes del ReactBoostrap

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';



class DatosUsuario extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    renderUsuarioTipo = (tipo) =>  {
                 
        if (tipo==="0"){   //admin
 
            return ("Admin")
 
        }else if (tipo==="1"){   // Doctor
 
            return ("Doctor")
 
        } else if (tipo==="2"){  // Paciente
 
            return ("Paciente")
 
        }else {return ("Indefinido")}
 
     }

    render () {

        return (            
            <>
                <Card style={{ width: '15rem'}}>
                    <Card.Img variant="top" style={{ width: '80%',  margin: '10%' }} src={process.env.PUBLIC_URL + '/DoctorLogin.png'} />
                    <Card.Header>Datos Usuario</Card.Header>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><strong>Id:</strong> {this.props.usuario.usuario_id}</ListGroupItem>
                        <ListGroupItem><strong>Tipo:</strong> {this.renderUsuarioTipo(this.props.usuario.Tipo)}</ListGroupItem>
                        <ListGroupItem><strong>Login:</strong> {this.props.usuario.Usuario}</ListGroupItem>
                        <ListGroupItem><strong>Nombre:</strong> {this.props.usuario.Nombre}</ListGroupItem>
                        <ListGroupItem><strong>Apellidos:</strong> {this.props.usuario.Apellidos}</ListGroupItem>                        
                        <ListGroupItem><strong>Correo:</strong> {this.props.usuario.Correo}</ListGroupItem>                                
                    </ListGroup>   
                    <Card.Footer className="text-muted">Usuario</Card.Footer>                  
                </Card>                                                         
            </>
        )
    }
}

export default DatosUsuario;