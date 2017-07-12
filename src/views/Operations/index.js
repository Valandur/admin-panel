import React, { Component } from 'react'
import { connect } from "react-redux"
import {
  Row, Col, Button, Badge, Table, Progress,
  Card, CardHeader, CardBlock,
} from 'reactstrap'
import _ from 'lodash'
import moment from "moment"

import { requestOperations, requestPause, requestStop } from "../../actions/operations"

class Operations extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.requestOperations();

    this.interval = setInterval(this.props.requestOperations, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>

          <Col xs={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-th-large"></i>
                Block Operations
              </CardHeader>
              <CardBlock>
                <Table striped={true}>
                  <thead>
                    <tr>
                      <th>UUID</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Time Remaining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.map(this.props.operations, op => {
                      const statusColor = op.status === "DONE" ? "primary" :
                        op.status === "PAUSED" ? "warning" : 
                        op.status === "ERRORED" ? "danger" : 
                        op.status === "RUNNING" ? "success" : "info";

                      return <tr key={op.uuid}>
                        <td>{op.uuid}</td>
                        <td>
                          <Badge color={statusColor}>
                            {op.status}
                          </Badge>
                          {op.status === "ERRORED" ? " " + op.error : null}
                        </td>
                        <td>
                          {(op.progress * 100).toFixed(1) + " %"}
                          <Progress color={statusColor} value={op.progress*100}
                            animated={op.status === "RUNNING"} />
                        </td>
                        <td>
                          {op.status === "RUNNING" || op.status === "PAUSED" ?
                            "~ " + moment().add("second", op.estTimeRemaining).fromNow(true)
                          :
                            "-"
                          }
                        </td>
                        <td>
                          {op.status === "RUNNING" || op.status === "PAUSED" ?
                            <Button color={op.status === "RUNNING" ? "warning" : "success"}
                                onClick={e => this.props.requestPause(op, op.status === "RUNNING")}>
                              <i className={"fa fa-" + (op.status === "RUNNING" ? "pause" : "play")} />
                              {" "}
                              {op.status === "RUNNING" ? "Pause" : "Resume"}
                            </Button>
                          : null}
                          {" "}
                          {op.status === "RUNNING" || op.status === "PAUSED" ? 
                            <Button color="danger" onClick={e => this.props.requestStop(op)}>
                              <i className="fa fa-stop" /> Stop
                            </Button>
                          : null}
                          {op.status === "DONE" || op.status === "ERRORED" ? 
                            <Button color="primary">
                              <i className="fa fa-repeat" /> Restart
                            </Button>
                          : null}
                        </td>
                      </tr>
                    })}
                  </tbody>
                </Table>
              </CardBlock>
            </Card>
          </Col>

        </Row>
      </div>
    )
  }
}

const mapStateToProps = (_state) => {
	const state = _state.operations

	return {
		operations: state.operations,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    requestOperations: () => dispatch(requestOperations()),
    requestPause: (op, pause) => dispatch(requestPause(op, pause)),
		requestStop: (op) => dispatch(requestStop(op)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Operations);
