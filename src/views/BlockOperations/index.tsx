import * as React from "react"
import { connect } from "react-redux"
import { Modal, Icon, Button, Form, Label, Dropdown, Progress } from "semantic-ui-react"
import { translate, Trans } from "react-i18next"
import * as moment from "moment"
import * as _ from "lodash"

import { requestCatalog, AppAction, CatalogRequestAction } from "../../actions"
import { requestList, ListRequestAction } from "../../actions/dataview"

import DataViewFunc from "../../components/DataView"
import { AppState, World, CatalogType, BlockOpType, BlockOp, DataViewRef, BlockOpStatus } from "../../types"
import { Dispatch } from "redux"
const DataView = DataViewFunc("block/op", "uuid", true)

const BLOCK_TYPES = "block.BlockType"

interface OwnProps {

}

interface StateProps {
	worlds: World[],
	blockTypes: CatalogType[],
	types: {
		text: string
		value: BlockOpType
	}[]
}

interface Props extends OwnProps, StateProps, reactI18Next.InjectedTranslateProps {}

interface DispatchProps {
	requestWorlds: () => ListRequestAction
	requestCatalog: (type: string) => CatalogRequestAction
}

interface FullProps extends Props, DispatchProps {}

interface OwnState {
	modal: boolean
	operation?: BlockOp
}

class BlockOperations extends React.Component<FullProps, OwnState> {

	constructor(props: FullProps) {
		super(props)

		this.state = {
			modal: false,
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.showDetails = this.showDetails.bind(this)
	}

	componentDidMount() {
		this.props.requestWorlds()
		this.props.requestCatalog(BLOCK_TYPES)
	}

	showDetails(operation: BlockOp, view: DataViewRef<BlockOp>) {
		view.details(operation)
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

	getStatusColor(op: BlockOp) {
		return op.status === BlockOpStatus.DONE ? "blue" :
			op.status === BlockOpStatus.PAUSED ? "yellow" :
			op.status === BlockOpStatus.ERRORED ? "red" :
			op.status === BlockOpStatus.RUNNING ? "green" : "grey"
	}

	render() {
		const _t = this.props.t

		return (
			<div>
				<DataView
					icon="block layout"
					title={_t("BlockOperations")}
					createTitle={_t("StartOperation")}
					fields={{
						type: _t("Type"),
						uuid: _t("UUID"),
						create: {
							isGroup: true,
							view: false,
							create: (view: DataViewRef<BlockOp>) => {
								return <div>
									<Form.Group widths="equal">
										<Form.Field
											required
											fluid
											selection
											search
											name="type"
											control={Dropdown}
											label={_t("Type")}
											placeholder={_t("Type")}
											onChange={view.handleChange}
											value={view.state.type}
											options={this.props.types}
										/>
										<Form.Field
											required
											fluid
											selection
											search
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
											required
											fluid
											selection
											search
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
							view: (op: BlockOp) => {
								return <Label color={this.getStatusColor(op)}>
									{_t(op.status.toString())}
								</Label>
							},
						},
						progress: {
							label: _t("Progress"),
							wide: true,
							view: (op: BlockOp) => {
								const time = moment().add(op.estimatedSecondsRemaining, "s").fromNow(true)

								return <Progress
									progress
									color={this.getStatusColor(op)}
									active={op.status === BlockOpStatus.RUNNING}
									percent={(op.progress * 100).toFixed(1)}
								>

									{op.status === BlockOpStatus.RUNNING || op.status === BlockOpStatus.PAUSED ?
										time + " remaining"
									:
										_t("Done")
									}
								</Progress>
							},
						},
					}}
					actions={(op: BlockOp, view: DataViewRef<BlockOp>) => <div>
						<Button color="blue" onClick={e => this.showDetails(op, view)}>
							{_t("Details")}
						</Button>
						{" "}
						{op.status === BlockOpStatus.RUNNING || op.status === BlockOpStatus.PAUSED ?
							<Button
								color={op.status === BlockOpStatus.RUNNING ? "yellow" : "green"}
								onClick={e => view.save(op, { pause: op.status === BlockOpStatus.RUNNING })}
							>
								<Icon name={(op.status === BlockOpStatus.RUNNING ? "pause" : "play")} />
								{" "}
								{op.status === BlockOpStatus.RUNNING ? _t("Pause") : _t("Resume")}
							</Button>
						: null}
						{" "}
						{op.status === BlockOpStatus.RUNNING || op.status === BlockOpStatus.PAUSED ?
							<Button color="red" onClick={e => view.delete(op)}>
								<Icon name="stop" /> {_t("Stop")}
							</Button>
						: null}
					</div>}
					onCreate={(obj: any, view: DataViewRef<BlockOp>) =>
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
		)
	}

	renderModal() {
		if (!this.state.operation) {
			return null
		}

		return (
			<Modal open={this.state.modal} onClose={this.toggleModal}>
				<Modal.Header>
					<Trans i18nKey="OperationTitle">
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
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list,
		blockTypes: state.api.types[BLOCK_TYPES],
		types: [{
			text: "Get",
			value: BlockOpType.GET,
		}, {
			text: "Change",
			value: BlockOpType.CHANGE,
		}]
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("BlockOperations")(BlockOperations))
