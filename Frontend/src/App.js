
// React
import React from 'react';

//<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico"></link>
//<img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
//esto es para acceder a public fuera de scr


// Css
import './css/bootstrap/dist/css/bootstrap.min.css';

//Componentes
import Encabezado from './componentes/Encabezado';
import Router from './componentes/Router';
import FinalPagina from './componentes/FinalPagina';

window.$WebsocketsIp= 'ws://localhost:2000';

class App extends React.Component{
    render () {
        return (
            <>
            <Encabezado/>                      
            <Router />
            <FinalPagina/>
            </>
        )
    }
}

export default App;