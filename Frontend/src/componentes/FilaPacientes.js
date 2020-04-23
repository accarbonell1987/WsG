import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';
//import img_user from '../imagenes/user.png';
//import '../css/App.css';
//import '../css/ecg.css';


class FilaPacientes extends React.Component{


    constructor(props) {
        super(props);
    }

    renderEstadoTX (Estado_de_TX){
         
        if (Estado_de_TX==="0"){   //Tx no hab
 
            return ("No Habilitado")
 
        }else if (Estado_de_TX==="1"){   // Tx hab
 
            return ("Habilitado")
 
        } else {return ("Indefinido")}   // Valor no esperado
 
     }

    selEliminarPaciente = () => {         // procede a eliminar paciente del doctor xx.

        alert('Entro a eliminar Paciente');


    } 

    selModificarPaciente = () => {         // procede a modificar paciente del doctor xx.

        alert('Entró a Modificar Paciente');


    } 

    selVerExamenesPaciente = () => {         // procede a ver los examenes de un paciente del doctor xx.

        alert('Entro a ver examenes');


    } 
                
    render() {
        return (   
             
             <>            
              <tr>
               <th scope="row">{this.props.fil+1}</th>
                <td align="center">{this.props.paciente.usuario_id}</td>
                <td>{this.props.paciente.Nombre}</td>                
                <td >{this.props.paciente.Apellidos}</td>
                <td align="center">{this.props.paciente.Genero}</td>
                <td>{this.renderEstadoTX(this.props.paciente.Estado_de_TX)}</td>
                <td align="center">{this.props.paciente.Freq_Muestro}</td>
                <td align="center">{this.props.paciente.Periodo_de_Obs}</td>
                <td align="center">{this.props.paciente.Ultimo_Contacto}</td>
                <td align="center">

                   <button onClick={this.selVerExamenesPaciente} className="btn btn-primary btn-block">Exámenes</button>
                   <button onClick={this.selModificarPaciente} className="btn btn-primary btn-block">Modificar Paciente</button>
                   <button onClick={this.selEliminarPaciente} className="btn btn-primary btn-block">Eliminar Paciente</button>

                </td>
              </tr>               
            </>             
        );
    }
  }  

export default FilaPacientes;