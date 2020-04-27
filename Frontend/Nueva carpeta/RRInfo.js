import React from 'react';
import moment from 'moment';
import '../css/ecg.css';


class RRInfo extends React.Component{

    constructor(props) {

        super(props);  
                
    }

    render () {

        return (
            
            <>
            
                <h5> Datos RR:</h5>   
                <h6> Latido: {this.props.rrinfo.lat}</h6> 
                <h6> RR: {Number(this.props.rrinfo.rr*(1000/this.props.FM)).toFixed(2)} ms</h6>  
                <h6> RR Medio: {Number(this.props.rrinfo.rr_med*(1000/this.props.FM)).toFixed(2)} ms</h6>
                <h6> Frecuencia cardíaca media: {Number(this.props.rrinfo.fc_med).toFixed(2)} Hz</h6>
                <h6> Desviacion RR: {Number(this.props.rrinfo.des_rr*(1000/this.props.FM)).toFixed(2)} ms</h6>
                <h6> Ritmo Cardíaco: {Number(this.props.rrinfo.ritmo).toFixed(2)} L/M</h6>

                                          
            </>

        )
    }
}

export default RRInfo;