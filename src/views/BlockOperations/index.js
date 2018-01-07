import React, { Component } from "react"
import { connect } from "react-redux"
import { Modal, Icon, Button, Form, Label, Dropdown, Progress } from "semantic-ui-react"
import { translate, Trans } from "react-i18next"
import moment from "moment"
import _ from "lodash"

import { requestCatalog } from "../../actions"
import { requestList } from "../../actions/dataview"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("block/op", "uuid", true)

const BLOCK_TYPES = "block.BlockType"

class BlockOperations extends Component {

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
		const _t = this.props.t

		return <div>
			<DataView
				icon="fa-th-large"
				title={_t("BlockOperations")}
				createTitle={_t("StartOperation")}
				fields={{
					type: _t("Type"),
					uuid: _t("UUID"),
					create: {
						isGroup: true,
						view: false,
						create: (view) => {
							return <div>
								<Form.Group widths="equal">
									<Form.Field
										required fluid selection search
										name="type"
										control={Dropdown}
										label={_t("Type")}
										placeholder={_t("Type")}
										onChange={view.handleChange}
										value={view.state.type}
										options={this.props.types}
									/>
									<Form.Field
										required fluid selection search
										name="world"
										control={Dropdown}
										label={_t("World")}
										placeholder={_t("World")}
										onChange={view.handleChange}
										value={view.state.world}
										options={_.map(this.props.worlds, w => 
											({ value: w.uuid, text: w.name + " (" + w.dimensionType.name + ")" })
										)}
									/>
									<Form.Field
										required fluid selection search
										name="block"
										control={Dropdown}
										label={_t("Block")}
										placeholder={_t("Block")}
										onChange={view.handleChange}
										value={view.state.block}
										options={_.map(this.props.blockTypes, block => 
											({ value: block.id, text: block.name + " (" + block.id + ")" })
										)}
										disabled={view.state.type !== "CHANGE"}
									/>
								</Form.Group>

								<Form.Group width={1} inline>
									<label>{_t("Min")}</label>
									<Form.Input width={6} name="minX" placeholder="X" onChange={view.handleChange} />
									<Form.Input width={6} name="minY" placeholder="Y" onChange={view.handleChange} />
									<Form.Input width={6} name="minZ" placeholder="Z" onChange={view.handleChange} />
								</Form.Group>

								<Form.Group width={1} inline>
									<label>{_t("Max")}</label>
									<Form.Input width={6} name="maxX" placeholder="X" onChange={view.handleChange} />
									<Form.Input width={6} name="maxY" placeholder="Y" onChange={view.handleChange} />
									<Form.Input width={6} name="maxZ" placeholder="Z" onChange={view.handleChange} />
								</Form.Group>
							</div>
						},
					},
					status: {
						label: _t("Status"),
						view: (op) => {
							return <Label color={this.getStatusColor(op)}>
								{_t(op.status)}
							</Label>
						},
					},
					progress: {
						label: _t("Progress"),
						wide: true,
						view: (op) => {
							const time = moment().add(op.estimatedSecondsRemaining, "s").fromNow(true)

							return <Progress
									progress
									color={this.getStatusColor(op)}
									active={op.status === "RUNNING"}
									percent={(op.progress * 100).toFixed(1)}>

								{op.status === "RUNNING" || op.status === "PAUSED" ? 
									time + " remaining"
								: 
									_t("Done")
								}
							</Progress>
						},
					},
				}}
				actions={(op, view) => <div>
					<Button color="blue" onClick={e => this.showDetails(op, view)}>
						{_t("Details")}
					</Button>
					{" "}
					{op.status === "RUNNING" || op.status === "PAUSED" ?
						<Button
								color={op.status === "RUNNING" ? "yellow" : "green"}
								onClick={e => view.save(op, { pause: op.status === "RUNNING" })}>
							<Icon name={(op.status === "RUNNING" ? "pause" : "play")} />
							{" "}
							{op.status === "RUNNING" ? _t("Pause") : _t("Resume")}
						</Button>
					: null}
					{" "}
					{op.status === "RUNNING" || op.status === "PAUSED" ? 
						<Button color="red" onClick={e => view.delete(op)}>
							<Icon name="stop" /> {_t("Stop")}
						</Button>
					: null}
				</div>}
				onCreate={(obj, view) =>
					view.create({
						type: obj.type,
						world: obj.world,
						block: {
							type: obj.block,
						},
						min: {
							x: parseFloat(obj.minX),
							y: parseFloat(obj.minY),
							z: parseFloat(obj.minZ),
						},
						max: {
							x: parseFloat(obj.maxX),
							y: parseFloat(obj.maxY),
							z: parseFloat(obj.maxZ),
						},
					})
				}
			/>
			{this.renderModal()}
		</div>
	}

	renderModal() {
		return <Modal open={this.state.modal} onClose={this.toggleModal}>
			<Modal.Header>
				<Trans i18nKey="OperationTitle" uuid={this.state.operation.uuid}>
					Operation {this.state.operation.uuid}
				</Trans>
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
		worlds: _state.world.list,
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
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: (type) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("BlockOperations")(BlockOperations))
