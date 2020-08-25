import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";


import NoPagina from './NoPagina';
import DoctorDashBoard from './DoctorDashBoard';
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