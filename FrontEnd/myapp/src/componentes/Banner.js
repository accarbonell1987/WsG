import React from 'react';
import '../css/ecg.css';

//comentario para subir
class Banner extends React.Component{
    constructor(props) {
        super(props);
        this.state = {  
            texto: "Bienvenidos"         
        }; 
    }       
    render() {
        return (
            <>
                <div className="banner_ecg">
                    <img className="banner_ecg_img" src={process.env.PUBLIC_URL + '/ecggris.png'} /> 
                </div>            
            </>
        );
    } 
}
export default Banner;