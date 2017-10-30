import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Modal, Icon, Button, Form, Label, Dropdown, Progress, 
} from "semantic-ui-react"
import _ from "lodash"
import moment from "moment"

import { requestCatalog } from "../../actions"
import { requestWorlds } from "../../actions/world"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("block/op", "uuid", true)

const BLOCK_TYPES = "block.BlockType"

class Operations extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modal: false,
			operation: {},
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showDetails = this.showDetails.bind(this);
	}

	componentDidMount() {
		this.props.requestWorlds();
		this.props.requestCatalog(BLOCK_TYPES);
	}

	showDetails(operation, view) {
		view.details(operation);
		this.setState({
			modal: true,
			operation: operation,
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	getStatusColor(op) {
		return op.status === "DONE" ? "blue" :
			op.status === "PAUSED" ? "yellow" : 
			op.status === "ERRORED" ? "red" : 
			op.status === "RUNNING" ? "green" : "grey";
	}

	render() {
		return <div>
			<DataView
				title="Block Operations"
				icon="fa-th-large"
				createTitle="Start an operation"
				fields={{
					type: "Type",
					uuid: "UUID",
					create: {
						isGroup: true,
						view: false,
						create: (view) => {
							return <div>
								<Form.Group widths="equal">
									<Form.Field
										required fluid selection search
										name="type"
										label="Type"
										control={Dropdown}
										placeholder="Type"
										onChange={view.handleChange}
										value={view.state.type}
										options={this.props.types}
									/>
									<Form.Field
										required fluid selection search
										name="world"
										label="World"
										control={Dropdown}
										placeholder="World"
										onChange={view.handleChange}
										value={view.state.world}
										options={_.map(this.props.worlds, w => 
											({ value: w.uuid, text: w.name + " (" + w.dimensionType.name + ")" })
										)}
									/>
									<Form.Field
										required fluid selection search
										name="block"
										label="Block"
										control={Dropdown}
										placeholder="Block"
										onChange={view.handleChange}
										value={view.state.block}
										options={_.map(this.props.blockTypes, block => 
											({ value: block.id, text: block.name + " (" + block.id + ")" })
										)}
										disabled={view.state.type !== "CHANGE"}
									/>
								</Form.Group>

								<Form.Group width={1} inline>
									<label>Min</label>
									<Form.Input width={6} name="minX" placeholder="X" onChange={view.handleChange} />
									<Form.Input width={6} name="minY" placeholder="Y" onChange={view.handleChange} />
									<Form.Input width={6} name="minZ" placeholder="Z" onChange={view.handleChange} />
								</Form.Group>

								<Form.Group width={1} inline>
									<label>Max</label>
									<Form.Input width={6} name="maxX" placeholder="X" onChange={view.handleChange} />
									<Form.Input width={6} name="maxY" placeholder="Y" onChange={view.handleChange} />
									<Form.Input width={6} name="maxZ" placeholder="Z" onChange={view.handleChange} />
								</Form.Group>
							</div>
						},
					},
					status: {
						label: "Status",
						view: (op) => {
							return <Label color={this.getStatusColor(op)}>
								{op.status}
							</Label>
						},
					},
					progress: {
						label: "Progress",
						wide: true,
						view: (op) => {
							return <Progress
									progress
									color={this.getStatusColor(op)}
									active={op.status === "RUNNING"}
									percent={(op.progress * 100).toFixed(1)}>

								{op.status === "RUNNING" || op.status === "PAUSED" ? 
									moment().add(op.estimatedSecondsRemaining, "s").fromNow(true) + 
									" remaining"
								: 
									"Done"
								}
							</Progress>
						},
					},
				}}
				actions={(op, view) => <div>
					<Button color="blue" onClick={e => this.showDetails(op, view)}>Details</Button>
					{" "}
					{op.status === "RUNNING" || op.status === "PAUSED" ?
						<Button
								color={op.status === "RUNNING" ? "yellow" : "green"}
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
				</div>}
			/>
			{this.renderModal()}
		</div>
	}

	renderModal() {
		return <Modal open={this.state.modal} onClose={this.toggleModal}>
			<Modal.Header>
				Operation {this.state.operation.uuid}
			</Modal.Header>
			<Modal.Content>
				<div><b>Status:</b> {this.state.operation.status}</div>
				{this.state.operation.error &&
					<div><b>Error:</b> {this.state.operation.error}</div>
				}
				{this.state.operation.blocks &&
					<div>
						<b>Blocks:</b><br />
						{JSON.stringify(this.state.operation.blocks)}
					</div>
				}
			</Modal.Content>
		</Modal>
	}
}

const mapStateToProps = (_state) => {
	return {
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
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestCatalog: (type) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Operations);
