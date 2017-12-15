import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Grid, Modal, Label, Table, Button, Radio, Icon, Form
} from "semantic-ui-react"
import _ from "lodash"
import moment from "moment"

import { requestCatalog } from "../../actions"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("world", "uuid")

const DIM_TYPES = "world.DimensionType"
const GEN_TYPES = "world.GeneratorType"
const DIFF_TYPES = "world.difficulty.Difficulty"
const GM_TYPES = "entity.living.player.gamemode.GameMode"


class Worlds extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modal: false,
			rules: null,
			rulesWorld: null,
			rulesView: null,
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.saveGameRules = this.saveGameRules.bind(this);
	}

	componentDidMount() {
		this.props.requestCatalog(DIM_TYPES);
		this.props.requestCatalog(GEN_TYPES);
		this.props.requestCatalog(DIFF_TYPES);
		this.props.requestCatalog(GM_TYPES);
	}

	/*create() {
		this.props.requestCreateWorld({
			name: this.state.worldName,
			dimension: this.state.dimension,
			generator: this.state.generator,
			difficulty: this.state.difficulty,
			gameMode: this.state.gameMode,
			seed: this.state.seed,
			loadOnStartup: this.state.loadOnStartup,
			keepSpawnLoaded: this.state.keepSpawnLoaded,
			allowCommands: this.state.commandsAllowed,
			generateBonusChest: this.state.generateBonusChest,
			usesMapFeatures: this.state.usesMapFeatures,
		})
	}*/

	showGameRules(world, view) {
		this.setState({
			modal: true,
			rules: _.map(world.gameRules, (value, name) => ({ name: name, value: value })),
			rulesWorld: world,
			rulesView: view,
		});
	}

	toggleRule(name) {
		const rules = this.state.rules;
		const rule = _.find(rules, { name: name });
		rule.value = rule.value === "true" ? "false" : "true";

		this.setState({
			rules: rules,
		});
	}

	saveGameRules() {
		const rules = _.mapValues(_.keyBy(this.state.rules, "name"), "value");

		this.state.rulesView.save(this.state.rulesWorld, { gameRules: rules })
		this.toggleModal();
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	render() {
		return <div>
			<DataView
				title="Worlds"
				icon="paw"
				createTitle="Create a world"
				fields={{
					"name": {
						label: "Name",
						create: true,
						required: true,
						view: world => <div><b>{world.name}</b><br />{world.uuid}</div>,
					},
					"dimensionType.name": {
						label: "Dimension",
						create: true,
						createName: "dimensionType.id",
						required: true,
						options: _.map(this.props.dimTypes, dim =>
							({
								value: dim.id,
								text: dim.name + " (" + dim.id + ")",
							})
						),
					},
					"generatorType.name": {
						label: "Generator",
						create: true,
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
						label: "Difficulty",
						create: true,
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
						label: "Game Mode",
						create: true,
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
								<label>Features:</label>
								<Form.Checkbox
									name="loadOnStartup"
									label="Load on startup"
									checked={view.state.loadOnStartup}
									onChange={view.handleChange}
								/>
								<Form.Checkbox
									name="keepSpawnLoaded"
									label="Keep spawn loaded"
									checked={view.state.keepSpawnLoaded}
									onChange={view.handleChange}
								/>
								<Form.Checkbox
									name="commandsAllowed"
									label="Commands allowed"
									checked={view.state.commandsAllowed}
									onChange={view.handleChange}
								/>
								<Form.Checkbox
									name="generateBonusChest"
									label="Generate bonus chest"
									checked={view.state.generateBonusChest}
									onChange={view.handleChange}
								/>
								<Form.Checkbox
									name="usesMapFeatures"
									label="Enable map features"
									checked={view.state.usesMapFeatures}
									onChange={view.handleChange}
								/>
							</Form.Group>,
					},
					"info": {
						label: "Info",
						view: world =>
							<div>
								<div style={{display:"inline-block",marginRight:"1em"}}>
									<Icon name="signal" />
									{world.difficulty && world.difficulty.name}
									<br />
									<Icon name="gamepad" />
									{world.gameMode && world.gameMode.name}
									<br />
									<Icon name="cloud" />
									{world.weather && world.weather.name}
								</div>
								<div style={{display:"inline-block"}}>
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
						label: "Status",
						view: world =>
							<Label color={world.loaded ? "green" : "yellow"}>
								{world.loaded ? "Loaded" : "Unloaded"}
							</Label>,
					}
				}}
				actions={(world, view) =>
					<div>
						<Button
							type="button"
							color="blue"
							disabled={world.updating}
							onClick={() => this.showGameRules(world, view)}
						>
							Game Rules
						</Button>{" "}
						<Button
							type="button"
							color={world.loaded ? "yellow" : "green"}
							onClick={() => view.save(world, { loaded: !world.loaded })}
							disabled={world.updating}
						>
							{world.loaded ? "Unload " : "Load "}
						</Button>{" "}
						{!world.loaded ?
							<Button
								type="button"
								color="red"
								disabled={world.updating}
								onClick={() => view.delete(world)}
							>
								Delete
							</Button>
						: null}
						{" "}
						{world.updating ?
							<Icon name="spinner" loading />
						: null}
					</div>
				}
			/>

			{this.state.rules ?
				<Modal open={this.state.modal} onClose={this.toggleModal}>
					<Modal.Header>
						Game Rules for '{this.state.rulesWorld.name}'
						({this.state.rulesWorld.dimensionType.name})
					</Modal.Header>
					<Modal.Content>
						<Grid columns={2}>
							<Grid.Column>
								<Table>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Value</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{_.map(_.slice(this.state.rules, 0, this.state.rules.length / 2), rule =>
											<Table.Row key={rule.name}>
												<Table.Cell>{rule.name}</Table.Cell>
												<Table.Cell>
													{rule.value === "true" || rule.value === "false" ?
														<Radio
															toggle checked={rule.value === "true"}
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
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Value</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{_.map(_.slice(this.state.rules, this.state.rules.length / 2), rule =>
											<Table.Row key={rule.name}>
												<Table.Cell>{rule.name}</Table.Cell>
												<Table.Cell>
													{rule.value === "true" || rule.value === "false" ?
														<Radio 
															toggle checked={rule.value === "true"}
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
						<Button color="blue" onClick={this.saveGameRules}>Save</Button>&nbsp;
						<Button onClick={this.toggleModal}>Cancel</Button>
					</Modal.Actions>
				</Modal>
			: null}
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {
		dimTypes: _state.api.types[DIM_TYPES],
		genTypes: _state.api.types[GEN_TYPES],
		diffTypes: _state.api.types[DIFF_TYPES],
		gmTypes: _state.api.types[GM_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCatalog: type => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);
