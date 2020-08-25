import React from "react";

import { Line } from "react-chartjs-2";
import RRInfo from "./RRInfo";

// Componentes del ReactBoostrap

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

//const wsChart = new WebSocket('ws://localhost:2000');

class ChartJs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rr_info_state: {
        lat: 0,
        rr: 0,
        rr_med: 0,
        fc_med: 0,
        des_rr: 0,
        ritmo: 0,
      },
      finTX: false,
      datos: {},
      datos2: {},
      opciones: {
        // Opciones de la grafica principal

        /* tooltips: {
                    //mode: 'index',                    
                    //intersect: false,
                    //position: 'nearest'  // este estab quitado
                   
                },*/

        /*  hover: {
                    //mode: 'nearest',
                    //intersect: true
                },*/

        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        responsive: true,
        legend: { display: true },
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Tiempo (s)",
                fontSize: 15,
                fontColor: "#ff0000",
              },

              ticks: {
                //reverse:true
                //autoSkip: true
              },

              gridLines: {
                display: true,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Tensión (mV)",
                fontSize: 15,
                fontColor: "#ff0000",
              },

              ticks: {
                beginAtZero: true,
              },

              gridLines: {
                display: true,
              },
            },
          ],
        },
      },
      opciones2: {
        // Opciones de la grafica 2

        /*tooltips: {
                   // mode: 'index',                    
                   // intersect: false,
                    //position: 'nearest'// este estaba quitado
                   
                },*/

        /*hover: {
                    //mode: 'nearest',
                    //intersect: true
                },*/

        animation: {
          duration: 0, // general animation time
        },
        responsive: true,
        legend: { display: true },
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Latidos",
                fontSize: 15,
                fontColor: "#ff0000",
              },

              /* ticks: {
                            //reverse:true
                            //autoSkip: true
                           
                        },*/

              gridLines: {
                display: true,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Tiempo entre latidos (ms)",
                fontSize: 15,
                fontColor: "#ff0000",
              },

              ticks: {
                beginAtZero: true,
              },

              gridLines: {
                display: true,
              },
            },
          ],
        },
      },
    };
  }

  wsChart = new WebSocket(window.$WebsocketsIp);

  arr2 = [];
  x = [];
  y = [];
  y2 = [];

  arr3 = [];
  x_rr = [];
  y_rr = [];
  latidos = 1;
  rr_ant = 0;
  diff_rr = 0;

  fact_aj = 0;
  s_ini = 0;
  s_fin = 0;
  s_max = 0;
  s_pos = 0;
  pos_Pto = 0;
  tam_ant = 0;

  rr_info = [];
  fTx = false;
  posLectura = 0;

  componentDidMount() {
    // Inicializacion de correccion de visualizacion
    if (Number(this.props.fmExamen) === 100) {
      this.fact_aj = 28;
    } else if (Number(this.props.fmExamen) === 200) {
      this.fact_aj = 46;
    } else if (Number(this.props.fmExamen) === 250) {
      this.fact_aj = 58;
    } //51

    // Fin inicializacion de correccion de visualizacion

    this.wsChart.onopen = () => {
      console.log("wsChart conectado con el Backend WsG");
    };

    this.wsChart.onmessage = (evt) => {
      const message = JSON.parse(evt.data);

      if (message.type === "msg_bd_fin") {
        this.fTx = message.fin_tx;
        this.posLectura = 0;
        this.props.modificarEstado();
        this.setState({
          finTX: this.fTx,
        });
      }
      if (message.type === "msg_bd") {
        this.fTx = message.fin_tx;

        this.tam_ant = this.y.length;
        message.data.forEach((element) => {
          //para senal

          var tmpx = element.time / this.props.fmExamen;
          //var tmpx=(element.time);
          this.x.push(tmpx.toFixed(3));
          var tmpy = ((element.valor * 3.3) / 1024 / 100) * 1000;
          //var tmpy= (element.valor*1);
          this.y.push(tmpy);
          //this.y.push(tmpy.toFixed(4));
        });

        message.data2.forEach((elementoRR) => {
          //var tmpy2=(elementoRR.valor*1);
          var tmpy2 = ((elementoRR.valor * 3.3) / 1024 / 100) * 1000;
          this.y2.push(tmpy2);
        });

        message.rr_info.forEach((elemento) => {
          if (Number(elemento.lat) > this.latidos) {
            this.latidos = Number(elemento.lat);
            this.x_rr.push(this.latidos);
            this.y_rr.push(Number(elemento.rr) * (1000 / this.props.fmExamen));
            this.rr_info = elemento;
          }
        });

        // Corregir desfasaje

        for (var b = this.tam_ant; b < this.y2.length - 1; b++) {
          if (this.y2[b] > 0) {
            this.y2[b] = 0;
            this.pos_Pto = b - this.fact_aj;
            this.s_max = this.y[this.pos_Pto];
            this.s_pos = this.pos_Pto;

            this.s_ini = this.pos_Pto - 10;
            this.s_fin = this.pos_Pto + 10;
            for (var ss = this.s_ini; ss <= this.s_fin; ss++) {
              if (ss >= 0 && ss < this.y2.length - 1) {
                if (this.y[ss] > this.s_max) {
                  this.s_max = this.y[ss];
                  this.s_pos = ss;
                }
              }
            }
            this.y2[this.s_pos] = this.s_max;
          }
        }

        // fin corregir desfasaje

        var ttt = this.props.fmExamen / 2;

        if (this.x.length > ttt * 10) {
          this.x.splice(0, ttt);
          this.y.splice(0, ttt);
          this.y2.splice(0, ttt);
        }

        // Configurando los datos para las graficas

        this.arr2 = {
          labels: this.x,
          datasets: [
            {
              label: "Señal ECG ",
              data: this.y,
              fill: false,
              borderWidth: 1,
              borderColor: "rgba(230, 0, 0, 1)",
              pointRadius: 0,
            },
            {
              label: "Puntos R",
              data: this.y2,
              fill: false,
              borderWidth: 1,
              borderColor: "rgba(0, 255, 0, 1)",
              pointRadius: 2,
            },
          ],
        };

        this.arr3 = {
          labels: this.x_rr,
          datasets: [
            {
              label: "Serie Temporal RR",
              data: this.y_rr,
              fill: false,
              borderWidth: 1,
              borderColor: "rgba(0, 100, 230, 1)",
              pointRadius: 0,
            },
          ],
        };

        this.setState({
          datos: this.arr2,
          datos2: this.arr3,
          rr_info_state: this.rr_info,
          finTX: this.fTx,
        });
      }
    };

    this.wsChart.onclose = () => {
      console.log("wsChart desconectado con el Backend WsG");
    };

    // Esto es para la temporizacion.
    this.timerID = setInterval(() => this.tick(), 500);
    // Fin de temporizacion
  }

  componentWillUnmount() {
    this.wsChart.close();
  }

  tick() {
    if (this.props.estadoGrafica === true && this.state.finTX === true) {
      this.arr2 = [];
      this.x = [];
      this.y = [];
      this.y2 = [];
      this.rr_info = [];
      this.fTx = false;
      this.posLectura = 0;
      this.s_ini = 0;
      this.s_fin = 0;
      this.s_max = 0;
      this.s_pos = 0;
      this.pos_Pto = 0;
      this.arr3 = [];
      this.x_rr = [];
      this.y_rr = [];
      this.latidos = 1;

      /*this.setState({  

                finTX: false
    
            });  */
    }

    if (this.wsChart.readyState === 1 && this.props.estadoGrafica && this.state.finTX === false) {
      this.wsChart.send(JSON.stringify({ type: "Enviar_BD", examen_id: this.props.examen_id, pos: this.posLectura, tbloque: this.props.fmExamen / 2 }));
      this.posLectura++;
    } else {
      console.log("wsChart:Se ha perdido la conexion con el servidor..Por favor rectifique su estado en la red");
    }
  }

  render() {
    return (
      <>
        <Container>
          <Row className="justify-content-md-center">
            <Line data={this.state.datos} options={this.state.opciones} width="960px" height="250px" redraw />
            <Line data={this.state.datos2} options={this.state.opciones2} width="960px" height="250px" redraw />
          </Row>
          <Row className="justify-content-md-center">
            <RRInfo rrinfo={this.state.rr_info_state} FM={this.props.fmExamen} />
          </Row>
        </Container>
      </>
    );
  }
}
export default ChartJs;
