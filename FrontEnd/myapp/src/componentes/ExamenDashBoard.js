import React from "react";
import ChartJs from "./Chart";
import DatosPaciente from "./DatosPaciente";
import DatosExamen from "./DatosExamen";
import "../css/ecg.css";

// Componentes del ReactBoostrap
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class ExamenDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      estadoGrafica: true,
    };
  }

  modificarEstadoGrafica = () => {
    // cambia grafica al estado opuesto PLAY/PAUSE
    if (this.state.estadoGrafica) {
      this.setState({
        estadoGrafica: false,
      });
    } else {
      this.setState({
        estadoGrafica: true,
      });
    }
  };

  renderBoton = () => {
    if (this.state.estadoGrafica) {
      return "|| Pausar";
    } else {
      return " > Reproducir";
    }
  };

  volverAccion = () => {
    this.Grafica.wsChart.close();
    this.props.listaExamenes(this.props.epaciente.usuario_id, 2);
  };

  render() {
    return (
      <>
        <div className="mainDiv" style={{ width: "90%" }}>
          <Alert variant="secondary">
            <h1 className="centrado">Exámen del Paciente: {this.props.epaciente.Nombre}</h1>
            <p className="centrado">A continuacion se muestran los datos registrados para este exámen.</p>
          </Alert>
          <table>
            <tr>
              <td>
                <DatosExamen examen={this.props.examen} />
              </td>
              <Alert className="alertmargin" variant="secondary" style={{ width: "100%" }}>
                <h4 className="centrado">ECG exámen con ID:{this.props.examen.examen_id} </h4>
              </Alert>
              <ChartJs ref={(grafica) => (this.Grafica = grafica)} modificarEstado={this.modificarEstadoGrafica} estadoGrafica={this.state.estadoGrafica} examen_id={this.props.examen.examen_id} fmExamen={this.props.examen.Freq_Muestro} />
              <Container>
                <Row className="justify-content-md-center">
                  <Col>
                    <button onClick={this.modificarEstadoGrafica} className="btn btn-success btn-block" style={{ width: "50%", float: "right" }}>
                      {this.renderBoton()}
                    </button>
                  </Col>
                  <Col>
                    <button onClick={(e) => this.volverAccion()} className="btn btn-dark btn-block" style={{ width: "50%", float: "left" }}>
                      Volver
                    </button>
                  </Col>
                </Row>
              </Container>
            </tr>
          </table>
        </div>
      </>
    );
  }
}

export default ExamenDashBoard;
