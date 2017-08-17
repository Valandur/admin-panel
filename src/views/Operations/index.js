import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Modal, Header, Table, Icon, 
	Button, Form, Label, Dropdown, Progress, 
} from "semantic-ui-react"
import _ from "lodash"
import moment from "moment"

import {
	requestOperation,
	requestOperations,
	requestCreateOperation,
	requestPause,
	requestStop
} from "../../actions/operations"
import { requestCatalog } from "../../actions"
import { requestWorlds } from "../../actions/world"

const BLOCK_TYPES = "block.BlockType"

class Operations extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modal: false,
		};

		this.create = this.create.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.showDetails = this.showDetails.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.props.requestOperations();
		this.props.requestWorlds();
		this.getCatalogValues();

		this.interval = setInterval(this.props.requestOperations, 2000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	getCatalogValues() {
		this.props.requestCatalog(BLOCK_TYPES);
	}

	handleChange(event, data) {
		let value = null;
		let name = null;

		if (data) {
			name = data.name ? data.name : data.id;
			value = data.value;
		} else {
			const target = event.target;
			value = target.type === 'checkbox' ? target.checked : target.value;
			name = target.name ? target.name : target.id;
		}

		this.setState({
			[name]: value
		});
	}

	create() {
		this.props.requestCreateOperation({
			type: this.state.type,
			world: this.state.world,
			min: {
				x: this.state.minX,
				y: this.state.minY,
				z: this.state.minZ,
			},
			max: {
				x: this.state.maxX,
				y: this.state.maxY,
				z: this.state.maxZ,
			},
			block: {
				type: this.state.block,
			},
		})
	}

	canCreate() {
		return !_.isEmpty(this.state.type) && !_.isEmpty(this.state.world) &&
			(this.state.type !== "CHANGE" || this.state.block);
	}

	showDetails(operation) {
		this.props.requestOperation(operation.uuid);
		this.setState({
			modal: true,
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	render() {
		return (
			<Segment basic>

				<Segment>
					<Header>
						<Icon name="plus" fitted /> Start an operation
					</Header>

					<Form loading={this.props.creating}>

						<Form.Group widths="equal">
							<Form.Field id="type" label="Type" control={Dropdown} placeholder="Type"
								required fluid selection search onChange={this.handleChange}
								options={this.props.types}
							/>

							<Form.Field id="world" label="World" control={Dropdown} placeholder="World"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.worlds, w => 
									({ value: w.uuid, text: w.name + " (" + w.dimensionType.name + ")" })
								)}
							/>

							<Form.Field id="block" label="Block" control={Dropdown} placeholder="Block"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.blockTypes, block => 
									({ value: block.id, text: block.name + " (" + block.id + ")" })
								)}
								disabled={this.state.type !== "CHANGE"}
							/>
						</Form.Group>

						<Form.Group inline>
							<label>Min</label>
							<Form.Input width={6} name="minX" placeholder="X" onChange={this.handleChange} />
							<Form.Input width={6} name="minY" placeholder="Y" onChange={this.handleChange} />
							<Form.Input width={6} name="minZ" placeholder="Z" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group inline>
							<label>Max</label>
							<Form.Input width={6} name="maxX" placeholder="X" onChange={this.handleChange} />
							<Form.Input width={6} name="maxY" placeholder="Y" onChange={this.handleChange} />
							<Form.Input width={6} name="maxZ" placeholder="Z" onChange={this.handleChange} />
						</Form.Group>

						<Form.Button color="green" onClick={this.create} disabled={!this.canCreate()}>
							Create
						</Form.Button>

					</Form>
				</Segment>

				<Header>
					<Icon className="fa-th-large" fitted /> Block Operations
				</Header>

				<Table striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Type</Table.HeaderCell>
							<Table.HeaderCell>UUID</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Progress</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(this.props.operations, op => {
							const statusColor = op.status === "DONE" ? "blue" :
								op.status === "PAUSED" ? "yellow" : 
								op.status === "ERRORED" ? "red" : 
								op.status === "RUNNING" ? "green" : "gray";

							return <Table.Row key={op.uuid}>
								<Table.Cell collapsing>{op.type}</Table.Cell>
								<Table.Cell collapsing>{op.uuid}</Table.Cell>
								<Table.Cell collapsing>
									<Label color={statusColor}>
										{op.status}
									</Label>
									{op.status === "ERRORED" ? " " + op.error : null}
								</Table.Cell>
								<Table.Cell>
									<Progress
										progress color={statusColor} active={op.status === "RUNNING"}
										percent={(op.progress * 100).toFixed(1)}
									>
										{op.status === "RUNNING" || op.status === "PAUSED" ? 
											moment().add("second", op.estTimeRemaining).fromNow(true) + " remaining"
										: 
											"Done"
										}
									</Progress>
								</Table.Cell>
								<Table.Cell collapsing>
									{op.status === "RUNNING" || op.status === "DONE" || op.status === "PAUSED" ? 
										<Button color="blue" onClick={e => this.showDetails(op)}>
											Details
										</Button>
									: null }
									{" "}
									{op.status === "RUNNING" || op.status === "PAUSED" ?
										<Button color={op.status === "RUNNING" ? "yellow" : "green"}
												onClick={e => this.props.requestPause(op, op.status === "RUNNING")}>
											<Icon name={(op.status === "RUNNING" ? "pause" : "play")} />
											{" "}
											{op.status === "RUNNING" ? "Pause" : "Resume"}
										</Button>
									: null}
									{" "}
									{op.status === "RUNNING" || op.status === "PAUSED" ? 
										<Button color="red" onClick={e => this.props.requestStop(op)}>
											<Icon name="stop" /> Stop
										</Button>
									: null}
								</Table.Cell>
							</Table.Row>
						})}
					</Table.Body>
				</Table>

				{this.props.operation ? 
					<Modal open={this.state.modal} onClose={this.toggleModal}>
						<Modal.Header>
							Operation {this.props.operation.uuid}
						</Modal.Header>
						<Modal.Content>
							<div><b>Status:</b> {this.props.operation.status}</div>
							{this.props.operation.error &&
								<div><b>Error:</b> {this.props.operation.error}</div>
							}
							{this.props.operation.blocks &&
								<div>
									<b>Blocks:</b><br />
									{JSON.stringify(this.props.operation.blocks)}
								</div>
							}
						</Modal.Content>
					</Modal>
				: null}

			</Segment>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.operations

	return {
		operation: state.operation,
		operations: state.operations,
		worlds: _state.world.worlds,
		blockTypes: _state.api.types[BLOCK_TYPES],
		types: [{
			text: "Get",
			value: "GET",
		}, {
			text: "Change",
			value: "CHANGE",
		}]
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestOperation: (uuid) => dispatch(requestOperation(uuid)),
		requestOperations: () => dispatch(requestOperations()),
		requestCreateOperation: (op) => dispatch(requestCreateOperation(op)),
		requestPause: (op, pause) => dispatch(requestPause(op, pause)),
		requestStop: (op) => dispatch(requestStop(op)),
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestCatalog: (type) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Operations);
