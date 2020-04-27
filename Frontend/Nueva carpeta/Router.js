import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginForm from './LoginForm';
import Inside from './Inside';
import NoPagina from './NoPagina';
import InsertarUsuario from './InsertarUsuario';
import ListarUsuarios from './ListarUsuarios';
import Grafica from './Grafica';
import Grafica2 from './Grafica2';
import DoctorDashBoard from './DoctorDashBoard';
import ListarPacientes from './ListarPacientes';
import InsertarPaciente from './InsertarPaciente';
import ModificarPaciente from './ModificarPaciente';
import AdminDashBoard from './AdminDashBoard';

const Router = () => (

    <BrowserRouter a="0">
        <Switch >
        
            <Route  exact path='/' component={DoctorDashBoard} />            
            <Route path="/Admin" component={AdminDashBoard} />
            <Route component={NoPagina} />
            
        </Switch>
    </BrowserRouter>

)

export default Router;