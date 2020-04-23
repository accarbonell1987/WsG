function filt_PB_5_15(PB_muestra){

    // FIltro Pasa Banda
    
    var PB_Yn_1=0;
    var PB_Yn_2=0;
    var PB_Yn_3=0;
    var PB_Yn_4=0;
    var PB_Xn=0;
    var PB_Xn_1=0;
    var PB_Xn_2=0;
    var PB_Xn_3=0;
    var PB_Xn_4=0;
    var PB_B1=0.0201;
    var PB_B2=0;
    var PB_B3=-0.0402;
    var PB_B4=0;
    var PB_B5=0.0201;
    var PB_A1=1.0000;
    var PB_A2=-3.4289;
    var PB_A3=4.5303;
    var PB_A4=-2.7383;
    var PB_A5=0.6414;

    var PB_Y=0;

    PB_Xn=PB_muestra;
    PB_Y= PB_B1*PB_Xn + PB_B2*PB_Xn_1 + PB_B3*PB_Xn_2 + PB_B4*PB_Xn_3 + PB_B5*PB_Xn_4 - PB_A2*PB_Yn_1 - PB_A3*PB_Yn_2 - PB_A4*PB_Yn_3 - PB_A5*PB_Yn_4;
            
    PB_Xn_4=PB_Xn_3;
    PB_Xn_3=PB_Xn_2;
    PB_Xn_2=PB_Xn_1;
    PB_Xn_1=PB_Xn;
    PB_Yn_4=PB_Yn_3;
    PB_Yn_3=PB_Yn_2;
    PB_Yn_2=PB_Yn_1;
    PB_Yn_1=PB_Y;
   
    return PB_Y;
}

function filt_PA_1(PA_muestra){

        // Coeficientes del Filtro pasa altos Fc=1Hz.

    var Yn_1=0;
    var Yn_2=0;
    var Xn=0;
    var Xn_1=0;
    var Xn_2=0;
    var B1=0.9777;
    var B2=-1.9554;
    var B3=0.9777;
    var A1=1;
    var A2=-1.9549;
    var A3=0.9559;
    var Yn=0;

    // Filtrado pas alto
    Xn=PA_muestra;
    Yn= B1*Xn + B2*Xn_1 + B3*Xn_2 - A2*Yn_1 - A3*Yn_2;
                            
    Xn_2=Xn_1;
    Xn_1=Xn;
    Yn_2=Yn_1;
    Yn_1=Yn;

    // Fin Filtrado Pasa alto

    return Yn;


}

module.exports = {
    "filt_PB_5_15": filt_PB_5_15,
    "filt_PA_1": filt_PA_1
}