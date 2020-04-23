import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';


class FilaUsuarios extends React.Component{


    constructor(props) {
        super(props);
    }
    
    renderUsuarioTipo (tipo) {
         
       if (tipo==="0"){   //admin

           return ("Admin")

       }else if (tipo==="1"){   // Doctor

           return ("Doctor")

       } else if (tipo==="2"){           // Paciente

           return ("Paciente")

       }else {return ("Indefinido")}

    }
            
    render() {
        return (   
             
             <>            
              <tr>
               <th scope="row">{this.props.fil+1}</th>
                <td align="center">{this.props.usuario.usuario_id}</td>
                <td>{this.props.usuario.Usuario}</td>
                <td>{this.props.usuario.Nombre}</td>
                <td>{this.props.usuario.Apellidos}</td>
                <td align="center">{this.props.usuario.Genero}</td>
                <td>{this.renderUsuarioTipo(this.props.usuario.Tipo)}</td>
                <td align="center">Estan por definir</td>
              </tr>               
            </>             
        );
    }
  }  

export default FilaUsuarios;