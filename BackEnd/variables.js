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

    
    // estaban dentro del ws conection

    var idCliente = false;            // se asume que el usuario no tiene id en el sistema.
    var tipoCliente= false;           // se asume que el usuario no tiene tipo.
    var idClienteSolicitado=false;    // Se aume que todavia el usuario receptor no tiene id solicitado para escucha.
    var index_bd=0;                   // Indice de bloque de busqueda en bd.  
    var tam_bloque=100;               // tamaño del bloque de muestas que se van a buscar en bd.
    var total_muestras=0;             // Cantidad total de muestras de bd enviadas al usuario.  
    var data_bd = [];                 // almacena datos de la bd.
    var data_rr = [];                 // almacena datos de serie RR
    var data_t_real = [];             // almacena datos en tiempo real.
    var cont_m_rt=0;                  // Contador de bloque de muestra en tiempo real.



    // declaraciones globales

    var cont_senal_save=0;
var senal_save=[5.4435827e-02,
    4.8207368e-02,
    5.1666812e-02,
    5.1703877e-02,
    5.3790708e-02,
    6.1716229e-02,
    5.3753198e-02,
    5.7925667e-02,
    5.2519673e-02,
    5.4112042e-02,
    5.4782138e-02,
    5.6629556e-02,
    6.0327241e-02,
    6.3712543e-02,
    6.4224683e-02,
    5.6658649e-02,
    6.8919399e-02,
    6.1935117e-02,
    7.0581942e-02,
    7.4389930e-02,
    7.8244282e-02,
    8.1214453e-02,
    8.2527828e-02,
    8.9235935e-02,
    8.7901445e-02,
    9.5303292e-02,
    1.0074375e-01,
    1.0583958e-01,
    1.0391197e-01,
    1.1570038e-01,
    1.1179033e-01,
    1.0600322e-01,
    9.9757406e-02,
    8.7131440e-02,
    7.9124982e-02,
    6.8209617e-02,
    7.0428239e-02,
    6.5312976e-02,
    6.0568966e-02,
    6.0847400e-02,
    5.7873062e-02,
    4.6008625e-02,
    4.4501373e-02,
    4.6125174e-02,
    1.1849374e-01,
    2.7710602e-01,
    5.0673516e-01,
    7.4448575e-01,
    8.7777857e-01,
    8.1627884e-01,
    6.2408102e-01,
    4.0382301e-01,
    2.4232125e-01,
    1.4500637e-01,
    9.5365573e-02,
    7.2318917e-02,
    5.7419358e-02,
    3.9047394e-02,
    3.1338203e-02,
    3.4365197e-02,
    3.5431358e-02,
    3.0322568e-02,
    3.8524490e-02,
    4.0745513e-02,
    3.9424450e-02,
    3.5627062e-02,
    5.1299021e-02,
    5.4523341e-02,
    5.9491330e-02,
    6.5085748e-02,
    6.2249114e-02,
    6.3574939e-02,
    7.6056357e-02,
    8.1243583e-02,
    8.1694742e-02,
    8.7611267e-02,
    1.0710996e-01,
    1.0935444e-01,
    1.2206987e-01,
    1.3819969e-01,
    1.4693710e-01,
    1.6053860e-01,
    1.8710350e-01,
    2.0014723e-01,
    2.0907597e-01,
    2.2205846e-01,
    2.2519855e-01,
    2.3635178e-01,
    2.2933127e-01,
    2.3219432e-01,
    2.1504889e-01,
    1.9349562e-01,
    1.6586789e-01,
    1.5380696e-01,
    1.2875534e-01,
    1.0854871e-01,
    9.0962182e-02,
    8.0112322e-02,
    7.0794806e-02,
    5.8438819e-02,
    4.7666163e-02,
    4.8126805e-02,
    4.7901324e-02,
    4.9583761e-02,
    4.3092038e-02,
    4.5507935e-02,
    4.3454361e-02,
    4.7929504e-02,
    4.0951597e-02,
    4.0117660e-02,
    4.6990177e-02,
    4.6691604e-02,
    5.4486744e-02,
    5.0881184e-02,
    4.9566278e-02,
    5.7033012e-02,
 ];

 var max_senal=0;                        // Buscando maximo en señal
 var latidos=0;                          // Numero total de latido registrados
 var tmp_r=0;                            // Valor de la muestra donde se detecto el punto R ahora
 var r_ant=0;                           // Valor de la muestra anterior donde se registro RR.
 var tmp_rr=0;                          // Serie RR Actual
 var rr_medio=0;                        // Valor de rr medio detectado.
 var rr_medio_sum=0;                    // Sumatoria de todos los rr se usa para buscar el promedio.
 var fc_medio=0;                        // Frecuencia cardiaca media detectada.
 var rr_max=0;                          // Valor de RR maximo detectado.
 var rr_min=20000;                      // Valor RR minimo Detectado
 var desv_rr=0;                         // desviacion RR detectada.

// Declaraciones de variables globales de filtros
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
// Variable para la derivada

var Der_ultima_muestra=0;
