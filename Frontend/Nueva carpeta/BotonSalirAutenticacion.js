import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';



class BotonSalirAutenticacion extends React.Component{

    constructor(props) {

        super(props);
                
    }
             
    render() {
        return (   
             
            <>         
            <button onClick={this.props.funsalir} className="btn btn-primary btn-block">Salir Sesión</button>                            
            </>             
        );
    }
  }  

export default BotonSalirAutenticacion;