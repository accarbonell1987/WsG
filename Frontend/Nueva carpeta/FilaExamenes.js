import React from 'react';
import '../css/bootstrap/dist/css/bootstrap.min.css';
//import img_user from '../imagenes/user.png';
//import '../css/App.css';
//import '../css/ecg.css';


class FilaExamenes extends React.Component{


    constructor(props) {
        super(props);
    }

    selEliminarExamen = () => {         // procede a eliminar el examen de un paciente.

        alert ('Entro a Elinar examen');


    } 

    selVerExamenPaciente = () => {         // procede a ver un examen de un paciente del doctor xx.

         alert ('Entro a ver examen');
    } 
                
    render() {
        return (   
             
             <>            
              <tr>
               <th scope="row">{this.props.fil+1}</th>
                <td align="center">{this.props.examen.examen_id}</td>
                <td>------</td>                
                <td >------</td>               
                <td align="center">{this.props.examen.est_tiempo}</td>
                <td align="center">

                 <button onClick="" className="btn btn-primary btn-block">Ver Exámen</button>
                 <button onClick="" className="btn btn-primary btn-block">Eliminar Exámen</button>

                </td>
              </tr>               
            </>             
        );
    }
  }  

export default FilaExamenes;