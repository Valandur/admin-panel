import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Table, Card, CardHeader, CardBlock } from 'reactstrap'
import _ from 'lodash'

import { requestPlugins } from "../../actions/plugin"

class Plugins extends Component {

  constructor(props) {
    super(props);

    this.state = {};
    this.props.requestPlugins();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>

          <Col xs={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-plug"></i>
                Plugins
              </CardHeader>
              <CardBlock>
                <Table striped={true}>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.map(this.props.plugins, plugin =>
                      <tr key={plugin.id}>
                        <td>{plugin.id}</td>
                        <td>{plugin.name}</td>
                        <td>{plugin.version}</td>
                      </tr>
                    )}
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
	const state = _state.plugin

	return {
		plugins: state.plugins,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestPlugins: () => dispatch(requestPlugins(true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
