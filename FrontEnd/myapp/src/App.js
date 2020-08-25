
// React
import React from 'react';

//<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico"></link>
//<img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
//esto es para acceder a public fuera de scr


// Css
import './css/bootstrap/dist/css/bootstrap.min.css';

//Componentes
import Banner from './componentes/Banner'; 
import Router from './componentes/Router';
import FinalPagina from './componentes/FinalPagina';


//const WebsocketsIp= 'ws://192.168.0.110:2000';
window.$WebsocketsIp= 'ws://127.0.0.1:2000';
//window.$WebsocketsIp= 'ws://192.168.43.121:2000';
//window.$WebsocketsIp= 'ws://192.168.0.140:2000';
//window.$WebsocketsIp= 'ws://192.168.0.110:2000';


class App extends React.Component{

    render () {

        return (           
            <>  
                {/*<Banner/>*/}
                <Router />
                <FinalPagina/>
            </>
        )
    }
}
export default App;


