import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Grid, Header, Form, Modal, Menu, 
	Dropdown, Label, Table, Button, Radio, Icon 
} from "semantic-ui-react"
import _ from "lodash"

import { requestCatalog } from "../../actions"
import { requestWorlds, requestChangeWorld, requestCreateWorld, requestDeleteWorld } from "../../actions/world"

const DIM_TYPES = "world.DimensionType"
const GEN_TYPES = "world.GeneratorType"
const DIFF_TYPES = "world.difficulty.Difficulty"
const GM_TYPES = "entity.living.player.gamemode.GameMode"
const ITEMS_PER_PAGE = 20

class Worlds extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modal: false,
			page: 0,
			rules: null,
			rulesWorld: null,
			loadOnStartup: true,
			commandsAllowed: true,
			generateBonusChest: true,
			usesMapFeatures: true,
		};

		this.create = this.create.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.saveGameRules = this.saveGameRules.bind(this);
		this.changePage = this.changePage.bind(this);
	}

	componentDidMount() {
		this.props.requestWorlds();
		this.getCatalogValues();

		this.interval = setInterval(this.props.requestWorlds, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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

	getCatalogValues() {
		this.props.requestCatalog(DIM_TYPES);
		this.props.requestCatalog(GEN_TYPES);
		this.props.requestCatalog(DIFF_TYPES);
		this.props.requestCatalog(GM_TYPES);
	}

	create() {
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
	}

	toggleLoad(world, callback) {
		const newState = !world.isLoaded;

		this.props.requestChangeWorld(world.uuid, { loaded: newState }, newState ? "Loaded" : "Unloaded")
	}

	showGameRules(world) {
		this.setState({
			modal: true,
			rules: _.map(world.gameRules, (value, name) => ({ name: name, value: value })),
			rulesWorld: world,
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
		const world = this.state.rulesWorld;
		const rules = _.mapValues(_.keyBy(this.state.rules, "name"), "value");

		this.props.requestChangeWorld(world.uuid, { gameRules: rules }, "Change game rules for")
		this.toggleModal();
	}

	delete(world) {
		this.props.requestDeleteWorld(world.uuid);
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	canCreate() {
		return this.state.worldName && this.state.dimension && this.state.generator && 
			this.state.difficulty && this.state.gameMode;
	}

	render() {
		let worlds = _.filter(this.props.worlds, w => true);

		const maxPage = Math.ceil(worlds.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		worlds = worlds.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Segment>
					<Header>
						<Icon name="plus" fitted /> Create a world
					</Header>

					<Form loading={this.props.creating}>

						<Form.Group widths="equal">
							<Form.Input
								id="worldName" label="World name" placeholder="World name" 
								required onChange={this.handleChange}
							/>

							<Form.Field id="dimension" label="Dimension" control={Dropdown} placeholder="Dimension"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.dimTypes, dim =>
									({ value: dim.id, text: dim.name })
								)}
							/>

							<Form.Field id="generator" label="Generator" control={Dropdown} placeholder="Generator"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.genTypes, gen =>
									({ value: gen.id, text: gen.name })
								)}
							/>
						</Form.Group>

						<Form.Group widths="equal">
							<Form.Field id="difficulty" label="Difficulty" control={Dropdown} placeholder="Difficulty"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.diffTypes, diff =>
									({ value: diff.id, text: diff.name })
								)}
							/>

							<Form.Field id="gameMode" label="Game mode" control={Dropdown} placeholder="Game mode"
								required fluid selection search onChange={this.handleChange}
								options={_.map(this.props.gmTypes, gm =>
									({ value: gm.id, text: gm.name })
								)}
							/>

							<Form.Input id="seed" label="Seed" placeholder="Seed" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group inline>
							<label>Features:</label>
							<Form.Checkbox
								id="loadOnStartup" label="Load on startup"
								checked={this.state.loadOnStartup} onChange={this.handleChange}
							/>
							<Form.Checkbox
								id="keepSpawnLoaded" label="Keep spawn loaded"
								checked={this.state.keepSpawnLoaded} onChange={this.handleChange}
							/>
							<Form.Checkbox
								id="commandsAllowed" label="Commands allowed"
								checked={this.state.commandsAllowed} onChange={this.handleChange}
							/>
							<Form.Checkbox
								id="generateBonusChest" label="Generate bonus chest"
								checked={this.state.generateBonusChest} onChange={this.handleChange}
							/>
							<Form.Checkbox
								id="usesMapFeatures" label="Enable map features"
								checked={this.state.usesMapFeatures} onChange={this.handleChange}
							/>
						</Form.Group>

						<Form.Button color="green" onClick={this.create} disabled={!this.canCreate()}>
							Create
						</Form.Button>

					</Form>
				</Segment>

				<Header>
					<Icon name="globe" fitted /> Worlds
				</Header>

				<Table striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name / UUID</Table.HeaderCell>
							<Table.HeaderCell>Dimension<br />Generator</Table.HeaderCell>
							<Table.HeaderCell>Difficulty<br />Game Mode</Table.HeaderCell>
							<Table.HeaderCell>Time<br />Weather</Table.HeaderCell>
							<Table.HeaderCell>Seed</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(worlds, world =>
							<Table.Row key={world.uuid}>
								<Table.Cell>{world.name}<br />{world.uuid}</Table.Cell>
								<Table.Cell>
									{world.dimensionType ? world.dimensionType.name : "-"}<br />
									{world.generatorType ? world.generatorType.name : "-"}
								</Table.Cell>
								<Table.Cell>
									<Icon name="signal" /> {world.difficulty ? world.difficulty.name : "-"}<br />
									<Icon name="gamepad" /> {world.gameMode ? world.gameMode.name : "-"}
								</Table.Cell>
								<Table.Cell>
									<Icon name="clock" /> {world.time ? world.time : "-"}<br />
									<Icon name="cloud" /> {world.weather ? world.weather.name : "-"}
								</Table.Cell>
								<Table.Cell>
									{world.seed}
								</Table.Cell>
								<Table.Cell>
									{world ?
										<Label color={world.isLoaded ? "green" : "yellow"}>
											{world.isLoaded ? "Loaded" : "Unloaded"}
										</Label>
									: null}
								</Table.Cell>
								<Table.Cell>
									<Button
										type="button" color="blue" disabled={world.updating}
										onClick={() => this.showGameRules(world)}
									>
										Game Rules
									</Button>{" "}
									<Button
										type="button" color={world.isLoaded ? "yellow" : "green"}
										onClick={() => this.toggleLoad(world)} disabled={world.updating}
									>
										{world.isLoaded ? "Unload " : "Load "}
									</Button>{" "}
									{!world.isLoaded ?
										<Button
											type="button" color="red" disabled={world.updating}
											onClick={() => this.delete(world)}
										>
											Delete
										</Button>
									: null}
									{" "}
									{world.updating ?
										<Icon name="spinner" loading />
									: null}
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
				{ maxPage > 1 ?
					<Menu pagination>
						{ page > 4 ?
							<Menu.Item onClick={e => this.changePage(e, 0)}>
								1
							</Menu.Item>
						: null }
						{ page > 5 ?
							<Menu.Item onClick={e => this.changePage(e, page - 5)}>
								...
							</Menu.Item>
						: null }
						{ _.map(_.range(Math.max(0, page - 4), Math.min(maxPage, page + 5)), p => (
							<Menu.Item key={p} onClick={e => this.changePage(e, p)} active={p === page}>
								{p + 1}
							</Menu.Item>
						))}
						{ page < maxPage - 6 ?
							<Menu.Item onClick={e => this.changePage(e, page + 5)}>
								...
							</Menu.Item>
						: null }
						{ page < maxPage - 5 ?
							<Menu.Item onClick={e => this.changePage(e, maxPage - 1)}>
								{maxPage}
							</Menu.Item>
						: null }
					</Menu>
				: null }

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

								<Grid.Column>
									<Button color="blue" onClick={this.saveGameRules}>Save</Button>&nbsp;
									<Button onClick={this.toggleModal}>Cancel</Button>
								</Grid.Column>
							</Grid>
						</Modal.Content>
					</Modal>
				: null}

			</Segment>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.world

	return {
		worlds: state.worlds,
		dimTypes: _state.api.types[DIM_TYPES],
		genTypes: _state.api.types[GEN_TYPES],
		diffTypes: _state.api.types[DIFF_TYPES],
		gmTypes: _state.api.types[GM_TYPES],
		creating: state.creating,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestCatalog: type => dispatch(requestCatalog(type)),
		requestChangeWorld: (uuid, data, op) => dispatch(requestChangeWorld(uuid, data, op)),
		requestCreateWorld: data => dispatch(requestCreateWorld(data)),
		requestDeleteWorld: uuid => dispatch(requestDeleteWorld(uuid)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);
