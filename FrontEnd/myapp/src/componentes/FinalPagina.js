import React from 'react';
import '../css/ecg.css';

class FinalPagina extends React.Component{
    render () {
        return (
            <div className="card-footer" style={{ position: 'absolute', marginBottom:'0', width:'100%' }}>
                {/*Los comentarios se ponen de esta manera*/}
                <h6 className="centrado"> SIME: Desarrollado por Ing. Ruben Cobo Alea-Copyright 2020</h6>
            </div>
        )
    }
}
export default FinalPagina;