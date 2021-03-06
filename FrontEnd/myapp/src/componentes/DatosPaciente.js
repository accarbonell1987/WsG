import React from 'react';
import moment from 'moment';
import '../css/ecg.css';
//import Top_img from '../imagenes/user.png';

// Componentes del ReactBoostrap

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';


class DatosPaciente extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    renderEstadoTX = (Estado_de_TX) =>{
         
        if (Estado_de_TX==="0"){   //Tx no hab
 
            return ("No Habilitado")
 
        }else if (Estado_de_TX==="1"){   // Tx hab
 
            return ("Habilitado")
 
        } else {return ("Indefinido")}   // Valor no esperado
 
    }

    render () {
        return (

            <>
                <Card  style={{ width: '15rem'}}>                    
                    <Card.Img variant="top" style={{ width: '80%',  margin: '10%' }} src={process.env.PUBLIC_URL + '/user.png'} />
                    <Card.Header>Datos del Paciente</Card.Header>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><strong>Id: </strong> {this.props.paciente.usuario_id}</ListGroupItem>
                        <ListGroupItem><strong>Nombre: </strong> {this.props.paciente.Nombre}</ListGroupItem>                        
                        <ListGroupItem><strong>Apellidos: </strong> {this.props.paciente.Apellidos}</ListGroupItem>
                        <ListGroupItem><strong>Genero:</strong> {this.props.paciente.Genero}</ListGroupItem>
                        <ListGroupItem><strong>Edad: </strong> {this.props.paciente.Edad}</ListGroupItem>
                        <ListGroupItem><strong>Correo: </strong> {this.props.paciente.Correo}</ListGroupItem>
                        <ListGroupItem><strong>FM: </strong> {this.props.paciente.Freq_Muestro} Hz</ListGroupItem>
                        <ListGroupItem><strong>Periodo Obs.: </strong> {this.props.paciente.Periodo_de_Obs} min</ListGroupItem>
                        <ListGroupItem><strong>Estado de TX: </strong> {this.renderEstadoTX(this.props.paciente.Estado_de_TX)}</ListGroupItem>
                        <ListGroupItem><strong>Último Contacto:</strong> {moment(Number(this.props.paciente.Ultimo_Contacto)).format("DD-MM-YYYY h:mm:ss")}</ListGroupItem>
                        <ListGroupItem><strong>Observaciones: </strong> {this.props.paciente.Observaciones}</ListGroupItem>                                
                    </ListGroup>  
                    <Card.Footer className="text-muted">Paciente</Card.Footer>                  
                </Card>                                                         
            </>            
        )
    }
}

export default DatosPaciente;