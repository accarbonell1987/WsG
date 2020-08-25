import React from "react";
import moment from "moment";
import "../css/ecg.css";

// Componentes del ReactBoostrap

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

class RRInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Table className="rrMargin" style={{ width: "90%" }} striped bordered hover size="sm">
          <thead style={{ backgroundColor: "grey" }}>
            <tr>
              <th className="centrado">Latidos</th>
              <th className="centrado">RR (ms)</th>
              <th className="centrado">RR Medio (ms)</th>
              <th className="centrado">FC media (Hz)</th>
              <th className="centrado">Desviacion RR (ms)</th>
              <th className="centrado">Ritmo Cardíaco (L/M)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="center">{this.props.rrinfo.lat}</td>
              <td align="center">{Number(this.props.rrinfo.rr * (1000 / this.props.FM)).toFixed(2)}</td>
              <td align="center">{Number(this.props.rrinfo.rr_med * (1000 / this.props.FM)).toFixed(2)}</td>
              <td align="center">{Number(this.props.rrinfo.fc_med).toFixed(2)}</td>
              <td align="center">{Number(this.props.rrinfo.des_rr * (1000 / this.props.FM)).toFixed(2)}</td>
              <td align="center">{Number(this.props.rrinfo.ritmo).toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
}

export default RRInfo;
