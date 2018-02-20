import * as _ from "lodash"
import * as moment from "moment"
import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Form, Grid, Icon, Label, Modal, Radio, Table } from "semantic-ui-react"

import { AppAction, CatalogRequestAction, requestCatalog } from "../../actions"
import { CatalogType, WorldFull } from "../../fetch"
import { AppState, DataViewRef } from "../../types"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("world", "uuid")

const DIM_TYPES = "world.DimensionType"
const GEN_TYPES = "world.GeneratorType"
const DIFF_TYPES = "world.difficulty.Difficulty"
const GM_TYPES = "entity.living.player.gamemode.GameMode"

interface Props extends reactI18Next.InjectedTranslateProps {
	dimTypes: CatalogType[]
	genTypes: CatalogType[]
	diffTypes: CatalogType[]
	gmTypes: CatalogType[]
	requestCatalog: (type: string) => CatalogRequestAction
}

interface OwnState {
	modal: boolean
	rules?: { name: string, value: string }[]
	rulesWorld?: WorldFull
	rulesView?: DataViewRef<WorldFull>
}

class Worlds extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false,
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.saveGameRules = this.saveGameRules.bind(this)
	}

	componentDidMount() {
		this.props.requestCatalog(DIM_TYPES)
		this.props.requestCatalog(GEN_TYPES)
		this.props.requestCatalog(DIFF_TYPES)
		this.props.requestCatalog(GM_TYPES)
	}

	showGameRules(world: WorldFull, view: DataViewRef<WorldFull>) {
		this.setState({
			modal: true,
			rules: _.map(world.gameRules, (value, name) => ({ name: name, value: value })),
			rulesWorld: world,
			rulesView: view,
		})
	}

	toggleRule(name: string) {
		const rules = this.state.rules
		const rule = _.find(rules, { name: name })
		if  (!rule) {
			return
		}

		rule.value = rule.value === "true" ? "false" : "true"

		this.setState({
			rules: rules,
		})
	}

	saveGameRules() {
		if (!this.state.rulesView || !this.state.rulesWorld) {
			return
		}

		const rules = _.mapValues(_.keyBy(this.state.rules, "name"), "value")

		this.state.rulesView.save(this.state.rulesWorld, { gameRules: rules })
		this.toggleModal()
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	render() {
		const _t = this.props.t

		return (
			<div>
				<DataView
					icon="globe"
					title={_t("Worlds")}
					createTitle={_t("CreateWorld")}
					fields={{
						"name": {
							label: _t("Name"),
							create: true,
							required: true,
							view: (world: WorldFull) => <div><b>{world.name}</b><br />{world.uuid}</div>,
						},
						"dimensionType.name": {
							label: _t("Dimension"),
							create: true,
							createName: "dimension",
							required: true,
							options: _.map(this.props.dimTypes, dim =>
								({
									value: dim.id,
									text: dim.name + " (" + dim.id + ")",
								})
							),
						},
						"generatorType.name": {
							label: _t("Generator"),
							create: true,
							createName: "generator",
							view: false,
							required: true,
							options: _.map(this.props.genTypes, gen =>
								({
									value: gen.id,
									text: gen.name + " (" + gen.id + ")",
								})
							),
						},
						"difficulty.name": {
							label: _t("Difficulty"),
							create: true,
							createName: "difficulty",
							view: false,
							required: true,
							options: _.map(this.props.diffTypes, diff =>
								({
									value: diff.id,
									text: diff.name + " (" + diff.id + ")",
								})
							),
						},
						"gameMode.name": {
							label: _t("GameMode"),
							create: true,
							createName: "gameMode",
							view: false,
							required: true,
							options: _.map(this.props.gmTypes, gm =>
								({
									value: gm.id,
									text: gm.name + " (" + gm.id + ")",
								})
							),
						},
						create: {
							isGroup: true,
							view: false,
							create: (view) =>
								<Form.Group inline>
									<label>{_t("Features")}:</label>
									<Form.Checkbox
										name="loadOnStartup"
										label={_t("LoadOnStartup")}
										checked={view.state.loadOnStartup}
										onChange={view.handleChange}
									/>
									<Form.Checkbox
										name="keepSpawnLoaded"
										label={_t("KeepSpawnLoaded")}
										checked={view.state.keepSpawnLoaded}
										onChange={view.handleChange}
									/>
									<Form.Checkbox
										name="allowCommands"
										label={_t("CommandsAllowed")}
										checked={view.state.allowCommands}
										onChange={view.handleChange}
									/>
									<Form.Checkbox
										name="generateBonusChest"
										label={_t("GenerateBonusChest")}
										checked={view.state.generateBonusChest}
										onChange={view.handleChange}
									/>
									<Form.Checkbox
										name="usesMapFeatures"
										label={_t("EnableMapFeatures")}
										checked={view.state.usesMapFeatures}
										onChange={view.handleChange}
									/>
								</Form.Group>,
						},
						"info": {
							label: _t("Info"),
							view: (world: WorldFull) =>
								<div>
									<div style={{ display: "inline-block", marginRight: "1em" }}>
										<Icon name="signal" />
										{world.difficulty && world.difficulty.name}
										<br />
										<Icon name="gamepad" />
										{world.gameMode && world.gameMode.name}
										<br />
										<Icon name="cloud" />
										{world.weather && world.weather.name}
									</div>
									<div style={{ display: "inline-block" }}>
										<Icon name="calendar" />
										Day {Math.floor(world.time / 24000)}
										<br />
										<Icon name="clock" />
										{moment.unix(((world.time % 24000) / 1200) * 86400).format("HH:mm")}
										<br />
										<Icon name="leaf" />
										{world.seed}
									</div>
								</div>,
						},
						"status": {
							label: _t("Status"),
							view: (world: WorldFull) =>
								<Label color={world.loaded ? "green" : "yellow"}>
									{world.loaded ? _t("Loaded") : _t("Unloaded")}
								</Label>,
						}
					}}
					actions={(world: WorldFull, view) =>
						<div>
							<Button
								type="button"
								color="blue"
								disabled={(world as any).updating}
								onClick={() => this.showGameRules(world, view)}
							>
								{_t("GameRules")}
							</Button>{" "}
							<Button
								type="button"
								color={world.loaded ? "yellow" : "green"}
								onClick={() => view.save(world, { loaded: !world.loaded })}
								disabled={(world as any).updating}
							>
								{world.loaded ? _t("Unload") : _t("Load")}&nbsp;
							</Button>{" "}
							{!world.loaded ?
								<Button
									type="button"
									color="red"
									disabled={(world as any).updating}
									onClick={() => view.delete(world)}
								>
									{_t("Delete")}
								</Button>
							: null}
							{" "}
							{(world as any).updating ?
								<Icon name="spinner" loading />
							: null}
						</div>
					}
				/>

				{this.state.rules && this.state.rulesWorld ?
					<Modal open={this.state.modal} onClose={this.toggleModal}>
						<Modal.Header>
							<Trans i18nKey="GameRulesTitle">
								Game Rules for '{this.state.rulesWorld.name}'
							</Trans>
							&nbsp;
							({this.state.rulesWorld.dimensionType.name})
						</Modal.Header>
						<Modal.Content>
							<Grid columns={2}>
								<Grid.Column>
									<Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>{_t("Name")}</Table.HeaderCell>
												<Table.HeaderCell>{_t("Value")}</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{_.map(_.slice(this.state.rules, 0, this.state.rules.length / 2), rule =>
												<Table.Row key={rule.name}>
													<Table.Cell>{rule.name}</Table.Cell>
													<Table.Cell>
														{rule.value === "true" || rule.value === "false" ?
															<Radio
																toggle
																checked={rule.value === "true"}
																onClick={() => this.toggleRule(rule.name)}
															/>
														: rule.value}
													</Table.Cell>
												</Table.Row>
											)}
										</Table.Body>
									</Table>
								</Grid.Column>

								<Grid.Column>
									<Table>
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell>{_t("Name")}</Table.HeaderCell>
												<Table.HeaderCell>{_t("Value")}</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{_.map(_.slice(this.state.rules, this.state.rules.length / 2), rule =>
												<Table.Row key={rule.name}>
													<Table.Cell>{rule.name}</Table.Cell>
													<Table.Cell>
														{rule.value === "true" || rule.value === "false" ?
															<Radio
																toggle
																checked={rule.value === "true"}
																onClick={() => this.toggleRule(rule.name)}
															/>
														: rule.value}
													</Table.Cell>
												</Table.Row>
											)}
										</Table.Body>
									</Table>
								</Grid.Column>
							</Grid>
						</Modal.Content>
						<Modal.Actions>
							<Button color="blue" onClick={this.saveGameRules}>{_t("Save")}</Button>&nbsp;
							<Button onClick={this.toggleModal}>{_t("Cancel")}</Button>
						</Modal.Actions>
					</Modal>
				: null}
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		dimTypes: state.api.types[DIM_TYPES],
		genTypes: state.api.types[GEN_TYPES],
		diffTypes: state.api.types[DIFF_TYPES],
		gmTypes: state.api.types[GM_TYPES],
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Worlds")(Worlds))
