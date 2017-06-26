import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardHeader, CardBlock } from "reactstrap"
import { Table, Button, Input } from 'reactstrap'
import _ from "lodash"

import { editProperty, setProperty, requestSaveProperty, requestProperties } from "../../actions/settings"

class Settings extends Component {
	constructor(props) {
		super(props)

		this.handleEdit = this.handleEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount() {
		this.props.requestProperties();
	}

	handleEdit(prop) {
		this.props.editProperty(prop);
	}

	handleChange(event, prop) {
		this.props.setProperty(prop, event.target.value);
	}

	handleSave(prop) {
		this.props.requestSaveProperty(prop);
	}

  render() {
    return (
      <div className="animated fadeIn">
        <Row>

        	<Col xs={12}>
        		<Card>
        			<CardHeader>
        				<i className="fa fa-cog"></i>
        				Properties
        			</CardHeader>
        			<CardBlock>
								<Table striped={true}>
									<thead>
										<tr>
											<th>Name</th>
											<th>Value</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{_.map(this.props.properties, (prop) =>
											<tr key={prop.key}>
												<td>{prop.key}</td>
												<td>
													{ prop.edit ?
														<Input type="text" value={prop.value} disabled={prop.saving}
															onChange={e => this.handleChange(e, prop)}
														/>
													:
														prop.value
													}
												</td>
												<td>
													{ prop.edit ? [
														<Button key={1} type="button" color="success" 
															disabled={prop.saving} onClick={e => this.handleSave(prop)}>
															<i className="fa fa-save"></i> Save
														</Button>,
														" ",
														<Button key={2} type="button" color="warning"
															disabled={prop.saving} onClick={e => this.handleEdit(prop)}
														>
															Cancel
														</Button>
													] :
													<Button type="button" color="primary" 
														onClick={e => this.handleEdit(prop)}
													>
														<i className="fa fa-edit"></i> Edit
													</Button>
													}
													{" "}
													{ prop.saving ?
														<i className="fa fa-spinner fa-pulse"></i>
													: null}
												</td>
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
	const state = _state.settings

	return {
		properties: state.properties,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestProperties: () => dispatch(requestProperties()),
		editProperty: (prop) => dispatch(editProperty(prop)),
		setProperty: (prop, value) => dispatch(setProperty(prop, value)),
		requestSaveProperty: (prop) => dispatch(requestSaveProperty(prop)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
