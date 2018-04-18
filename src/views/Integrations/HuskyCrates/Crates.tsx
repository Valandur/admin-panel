import * as _ from "lodash"
import * as moment from "moment"
import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Dropdown, DropdownProps, Form, Header, Icon, Label, Modal, Radio, Table } from "semantic-ui-react"

import { AppAction, CatalogRequestAction, requestCatalog } from "../../../actions"
import DataViewFunc from "../../../components/DataView"
import ItemStack from "../../../components/ItemStack"
import { handleChange, HandleChangeFunc } from "../../../components/Util"
import {
	CatalogType, HuskyCratesCommandReward, HuskyCratesCrate, HuskyCratesCrateReward,
	HuskyCratesCrateRewardObject, HuskyCratesItemReward
} from "../../../fetch"
import { AppState, CatalogTypeKeys, DataViewRef } from "../../../types"

import CrateReward from "./CrateReward"

const DataView = DataViewFunc("husky-crates/crate", "id")

interface Props extends reactI18Next.InjectedTranslateProps {
	objectTypes: { value: string, text: string }[]
	crateTypes: { value: string, text: string }[]
	itemTypes: CatalogType[]
	requestCatalog: (type: string) => CatalogRequestAction
}

interface OwnState {
	modal: boolean
	name?: string
	type?: HuskyCratesCrate.TypeEnum
	free?: boolean
	freeDelay?: number
	crate?: HuskyCratesCrate
	rewards: HuskyCratesCrateReward[]
}

class Crates extends React.Component<Props, OwnState> {

	handleChange: HandleChangeFunc
	save: () => void

	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false,
			rewards: [],
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.renderRewards = this.renderRewards.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.handleChange = handleChange.bind(this, null)

		this.addReward = this.addReward.bind(this)
		this.addRewardObject = this.addRewardObject.bind(this)
		this.removeReward = this.removeReward.bind(this)
		this.removeRewardObject = this.removeRewardObject.bind(this)
		this.handleRewardChange = this.handleRewardChange.bind(this)
	}

	componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Item)
	}

	handleEdit(crate: HuskyCratesCrate, view: DataViewRef<HuskyCratesCrate>) {
		this.save = () => {
			view.save(crate, {
				name: this.state.name,
				type: this.state.type,
				free: this.state.free,
				freeDelay: this.state.freeDelay,
				rewards: this.state.rewards,
			})
			this.setState({
				modal: false,
				crate: undefined,
			})
		}

		this.setState({
			modal: true,
			crate: crate,
			name: crate ? crate.name : undefined,
			type: crate ? crate.type : undefined,
			free: crate ? crate.free : undefined,
			freeDelay: crate ? crate.freeDelay : undefined,
			rewards: crate ? crate.rewards.map(r => _.assign({}, r)) : [],
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	handleRewardChange(
		reward: HuskyCratesCrateReward,
		event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {

		const cb = (name: string, value: string) => {
			const newReward = _.assign({}, reward)
			_.set(newReward, name, value)

			this.setState({
				rewards: this.state.rewards.map(r => r === reward ? newReward : r)
			})
		}
		handleChange.call(this, cb, event, data)
	}

	addReward() {
		const newReward: HuskyCratesCrateReward = {
			announce: true,
			name: "",
			chance: 0,
			objects: [],
			displayItem: {
				type: {
					id: "",
					name: "",
				},
				quantity: 1,
			},
		}

		const rewards = this.state.rewards ? this.state.rewards.concat(newReward) : [newReward]
		this.setState({
			rewards: rewards,
		})
	}

	removeReward(reward: HuskyCratesCrateReward) {
		this.setState({
			rewards: this.state.rewards.filter(r => r !== reward)
		})
	}

	addRewardObject(reward: HuskyCratesCrateReward, object: HuskyCratesCrateRewardObject) {
		this.setState({
			rewards: this.state.rewards.map(r => {
				if (r !== reward) {
					return r
				}
				return {
					...reward,
					objects: reward.objects.concat(object),
				}
			}),
		})
	}

	removeRewardObject(reward: HuskyCratesCrateReward, index: number) {
		this.setState({
			rewards: this.state.rewards.map(r => {
				if (r !== reward) {
					return r
				}
				return {
					...reward,
					objects: reward.objects.filter((__, i) => i !== index),
				}
			}),
		})
	}

	render() {
		const _t = this.props.t

		return (
			<div>
				<DataView
					canEdit
					canDelete
					icon="archive"
					title={_t("HuskyCrates")}
					filterTitle={_t("FilterCrates")}
					createTitle={_t("CreateCrate")}
					fields={{
						id: {
							label: _t("Id"),
							create: true,
							filter: true,
							required: true,
						},
						name: {
							label: _t("Name"),
							create: true,
							edit: true,
							filter: true,
							required: true,
						},
						type: {
							label: _t("Type"),
							create: true,
							edit: true,
							filter: true,
							required: true,
							options: this.props.crateTypes
						},
						free: {
							label: _t("Free"),
							view: (crate: HuskyCratesCrate) => <div>
								<Icon
									color={crate.free ? "green" : "red"}
									name={crate.free ? "check" : "remove"}
								/>
								{crate.free ?
									<div>
										<Icon name="repeat" />
										{moment.duration(crate.freeDelay, "second").humanize()}
									</div>
									: null}
							</div>,
						},
						rewards: {
							label: _t("Rewards"),
							wide: true,
							view: this.renderRewards,
						},
					}}
					onEdit={this.handleEdit}
				/>

				{this.renderModal()}
			</div>
		)
	}

	renderRewards(crate: HuskyCratesCrate) {
		const tc = _.sumBy(crate.rewards, "chance")
		const fmt = (chance: number) => ((chance / tc) * 100).toFixed(3) + "%"

		return (
			<Table compact size="small">
				<Table.Body>
					{crate.rewards.map((reward, i) =>
						<Table.Row key={i}>
							<Table.Cell collapsing>{fmt(reward.chance)}</Table.Cell>
							<Table.Cell collapsing>{reward.name}</Table.Cell>
							<Table.Cell collapsing>
								{reward.announce && <Icon name="bullhorn" />}
							</Table.Cell>
							<Table.Cell>
								{reward.objects.map((obj: HuskyCratesCrateRewardObject, j: number) => {
									if (obj.type === HuskyCratesCrateRewardObject.TypeEnum.COMMAND &&
										(obj as HuskyCratesCommandReward).command) {
										return <Label key={j} color="blue">/{(obj as HuskyCratesCommandReward).command}</Label>
									}
									if (obj.type === HuskyCratesCrateRewardObject.TypeEnum.ITEM && (obj as HuskyCratesItemReward).item) {
										return <ItemStack key={j} item={(obj as HuskyCratesItemReward).item} />
									}
									return null
								})}
							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table>
		)
	}

	renderModal() {
		const totalChance = _.sum(this.state.rewards.map(r => r.chance ? r.chance : 0))
		const _t = this.props.t

		return (
			<Modal open={this.state.modal} onClose={this.toggleModal} size="fullscreen">
				<Modal.Header>
					<Trans i18nKey="RewardsTitle">
						Edit '{this.state.name}' crate
					</Trans>
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Header>
							<Icon fitted name="info" /> {_t("General")}
						</Header>

						<Form.Group widths="equal">

							<Form.Input
								required
								fluid
								type="text"
								name="name"
								label={_t("Name")}
								placeholder={_t("Name")}
								onChange={this.handleChange}
								value={this.state.name}
							/>

							<Form.Field
								required
								fluid
								selection
								control={Dropdown}
								name="type"
								label={_t("Type")}
								placeholder={_t("Type")}
								onChange={this.handleChange}
								options={this.props.crateTypes}
								value={this.state.type}
							/>

						</Form.Group>

						<Form.Group widths="equal">

							<Form.Field
								toggle
								required
								control={Radio}
								label={_t("IsFree")}
								checked={this.state.free}
								onClick={() => this.setState({ free: !this.state.free })}
							/>

							<Form.Input
								fluid
								type="number"
								name="freeDelay"
								labelPosition="right"
								label={_t("FreeDelay")}
								placeholder={_t("FreeDelay")}
								onChange={this.handleChange}
								value={this.state.freeDelay}
								disabled={!this.state.free}
							>
								<input />
								<Label>{moment.duration(this.state.freeDelay, "second").humanize()}</Label>
							</Form.Input>

						</Form.Group>

						<Header>
							<Icon fitted name="trophy" /> {_t("Rewards")}
						</Header>

						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>{_t("Chance")}</Table.HeaderCell>
									<Table.HeaderCell>{_t("Name")}</Table.HeaderCell>
									<Table.HeaderCell>{_t("DisplayItem")}</Table.HeaderCell>
									<Table.HeaderCell>{_t("Objects")}</Table.HeaderCell>
									<Table.HeaderCell>{_t("Actions")}</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.state.rewards.map((reward, i) =>
									<CrateReward
										key={i}
										reward={reward}
										totalChance={totalChance}
										handleRewardChange={this.handleRewardChange}
										addRewardObject={this.addRewardObject}
										removeRewardObject={this.removeRewardObject}
										removeReward={this.removeReward}
										objectTypes={this.props.objectTypes}
										itemTypes={this.props.itemTypes}
										t={_t}
									/>
								)}
								<Table.Row>
									<Table.Cell colSpan="4" textAlign="center">
										<Button
											color="green"
											icon="plus"
											content={_t("Add")}
											onClick={this.addReward}
										/>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="blue" onClick={this.save}>{_t("Save")}</Button>&nbsp;
					<Button onClick={this.toggleModal}>{_t("Cancel")}</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		itemTypes: state.api.types[CatalogTypeKeys.Item],
		crateTypes: [{
			value: "Spinner",
			text: "Spinner",
		}, {
			value: "Roulette",
			text: "Roulette",
		}, {
			value: "Instant",
			text: "Instant",
		}, {
			value: "Simple",
			text: "Simple"
		}],
		objectTypes: [{
			value: "ITEM",
			text: "Item",
		}, {
			value: "COMMAND",
			text: "Command",
		}]
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.HuskyCrates")(Crates)
)
