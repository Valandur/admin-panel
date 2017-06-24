import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardHeader, CardBlock, CardFooter, Button, FormGroup } from "reactstrap"
import { Label, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import Select from 'react-select'
import _ from 'lodash'

import { requestCatalog } from "../../actions"
import { requestWorlds, requestUpdateWorld, requestCreateWorld, requestDeleteWorld } from "../../actions/world"

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

	handleChange(event, newValue) {
		let value = null;
		let name = null;

		if (_.isObject(event)) {
			const target = event.target;
			value = target.type === 'checkbox' ? target.checked : target.value;
			name = target.name ? target.name : target.id;
		} else {
			if (!newValue)
				value = null;
			else if (_.isArray(newValue))
				value = _.map(newValue, "value");
			else
				value = newValue.value;
			name = event;
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

		this.props.requestUpdateWorld(world.uuid, { loaded: newState }, newState ? "Loaded" : "Unloaded")
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

		this.props.requestUpdateWorld(world.uuid, { gameRules: rules }, "Change game rules for")
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

	render() {
		let worlds = _.filter(this.props.worlds, w => true);

		const page = this.state.page;
		const maxPage = Math.ceil(worlds.length / ITEMS_PER_PAGE);

		worlds = worlds.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<div className="animated fadeIn">
				<Row>

					<Col xs={12}>
						<Card>
							<CardHeader>
								Create a world
							</CardHeader>
							<CardBlock>
								<Row>

									<Col lg={4} md={6} xs={12}>

										<FormGroup row>
											<Label md={3} for="world-name">Name</Label>
											<Col md={9}>
												<Input
													type="text"
													id="world-name"
													name="worldName"
													placeholder="World name"
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="dimension">Dimension</Label>
											<Col md={9}>
												<Select
													id="dimension"
													value={this.state.dimension}
													onChange={val => this.handleChange("dimension", val)}
													options={_.map(this.props.dimTypes, dim => ({ value: dim.id, label: dim.name }))}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="difficulty">Difficulty</Label>
											<Col md={9}>
												<Select
													id="difficulty"
													value={this.state.difficulty}
													onChange={val => this.handleChange("difficulty", val)}
													options={_.map(this.props.diffTypes, diff => ({ value: diff.id, label: diff.name }))}
												/>
											</Col>
										</FormGroup>

									</Col>

									<Col lg={4} md={6} xs={12}>

										<FormGroup row>
											<Label md={3} for="generator">Generator</Label>
											<Col md={9}>
												<Select
													id="generator"
													value={this.state.generator}
													onChange={val => this.handleChange("generator", val)}
													options={_.map(this.props.genTypes, gen => ({ value: gen.id, label: gen.name }))}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="game-mode">Game mode</Label>
											<Col md={9}>
												<Select
													id="gameMode"
													value={this.state.gameMode}
													onChange={val => this.handleChange("gameMode", val)}
													options={_.map(this.props.gmTypes, gm => ({ value: gm.id, label: gm.name }))}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="seed">Seed</Label>
											<Col md={9}>
												<Input
													type="text"
													id="seed"
													placeholder="Seed"
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>

									</Col>

									<Col lg={4} md={6} xs={12}>

										<FormGroup row>
											<Label md={2}>Features</Label>
											<Col md={10}>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															name="loadOnStartup"
															checked={this.state.loadOnStartup}
															onChange={this.handleChange}
														/>&nbsp;
														Load on startup
													</Label>
												</FormGroup>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															name="keepSpawnLoaded"
															checked={this.state.keepSpawnLoaded}
															onChange={this.handleChange}
														/>&nbsp;
														Keep spawn loaded
													</Label>
												</FormGroup>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															name="commandsAllowed"
															checked={this.state.commandsAllowed}
															onChange={this.handleChange}
														/>&nbsp;
														Allow commands
													</Label>
												</FormGroup>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															name="generateBonusChest"
															checked={this.state.generateBonusChest}
															onChange={this.handleChange}
														/>&nbsp;
														Generate bonus chests
													</Label>
												</FormGroup>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															name="usesMapFeatures"
															checked={this.state.usesMapFeatures}
															onChange={this.handleChange}
														/>&nbsp;
														Enable map features (villages, strongholds, etc.)
													</Label>
												</FormGroup>
											</Col>
										</FormGroup>
										
									</Col>

								</Row>
							</CardBlock>
							<CardFooter>
								<button type="button" className="btn btn-success" onClick={() => this.create()} disabled={this.props.creating}>
									Create&nbsp;
									{this.props.creating ?
										<i className="fa fa-spinner fa-pulse"></i>
									: null}
								</button>
							</CardFooter>
						</Card>
					</Col>

					<Col xs={12}>
						<Table striped={true}>
							<thead>
								<tr>
									<th>Name</th>
									<th>UUID</th>
									<th>Dimension</th>
									<th>Difficulty</th>
									<th>Game Mode</th>
									<th>Generator</th>
									<th>Weather</th>
									<th>Time</th>
									<th>Seed</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{_.map(worlds, world =>
									<tr key={world.uuid}>
										<td>{world.name}</td>
										<td>{world.uuid}</td>
										<td>
											{world.dimensionType ? world.dimensionType.name : "-"}
										</td>
										<td>
											{world.difficulty ? world.difficulty.name : "-"}
										</td>
										<td>
											{world.gameMode ? world.gameMode.name : "-"}
										</td>
										<td>
											{world.generatorType ? world.generatorType.name : "-"}
										</td>
										<td>
											{world.weather ? world.weather.name : "-"}
										</td>
										<td>
											{world.time ? world.time : "-"}
										</td>
										<td>
											{world.seed}
										</td>
										<td>
											{world ?
												<span className={"badge badge-" + (world.isLoaded ? "success" : "warning")}>
													{world.isLoaded ? "Loaded" : "Unloaded"}
												</span>
											: null}
										</td>
										<td>
											<Button
												type="button" color="info" disabled={world.updating}
												onClick={() => this.showGameRules(world)}
											>
												Game Rules
											</Button>
											<Button
												type="button" color={world.isLoaded ? "warning" : "success"}
												onClick={() => this.toggleLoad(world)} disabled={world.updating}
											>
												{world.isLoaded ? "Unload " : "Load "}
											</Button>
											{!world.isLoaded ?
												<Button
													type="button" color="danger" disabled={world.updating}
													onClick={() => this.delete(world)}
												>
													Delete
												</Button>
											: null}
											&nbsp;
											{world.updating ?
												<i className="fa fa-spinner fa-pulse"></i>
											: null}
										</td>
									</tr>
								)}
							</tbody>
						</Table>
						{ maxPage > 1 ?
							<Pagination>
								{ page > 4 ?
									<PaginationItem>
										<PaginationLink onClick={e => this.changePage(e, 0)} href="#">
											1
										</PaginationLink>
									</PaginationItem>
								: null }
								{ page > 5 ?
									<PaginationItem>
										<PaginationLink onClick={e => this.changePage(e, page - 5)} href="#">
											...
										</PaginationLink>
									</PaginationItem>
								: null }
								{ _.map(_.range(Math.max(0, page - 4), Math.min(maxPage, page + 5)), p => (
									<PaginationItem key={p} active={p === page}>
										<PaginationLink onClick={e => this.changePage(e, p)} href="#">
											{p + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								{ page < maxPage - 6 ?
									<PaginationItem>
										<PaginationLink onClick={e => this.changePage(e, page + 5)} href="#">
											...
										</PaginationLink>
									</PaginationItem>
								: null }
								{ page < maxPage - 5 ?
									<PaginationItem>
										<PaginationLink onClick={e => this.changePage(e, maxPage - 1)} href="#">
											{maxPage}
										</PaginationLink>
									</PaginationItem>
								: null }
							</Pagination>
						: null }
					</Col>

					<Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-lg ' + this.props.className}>
						{this.state.rules ?
							<div>
								<ModalHeader toggle={this.toggleModal}>Game Rules</ModalHeader>
								<ModalBody>
									<Row>
										<Col md={6}>
											<Table>
												<thead>
													<tr>
														<th>Name</th>
														<th>Value</th>
													</tr>
												</thead>
												<tbody>
													{_.map(_.slice(this.state.rules, 0, this.state.rules.length / 2), rule =>
														<tr key={rule.name}>
															<td>{rule.name}</td>
															<td>
																{rule.value === "true" || rule.value === "false" ?
																	<Label className="switch switch-3d switch-primary">
																		<Input
																			type="checkbox"
																			className="switch-input"
																			defaultChecked={rule.value === "true"}
																			onChange={() => this.toggleRule(rule.name)}
																		/>
																		<span className="switch-label"></span>
																		<span className="switch-handle"></span>
																	</Label>
																: rule.value}
															</td>
														</tr>
													)}
												</tbody>
											</Table>
										</Col>
										<Col md={6}>
											<Table>
												<thead>
													<tr>
														<th>Name</th>
														<th>Value</th>
													</tr>
												</thead>
												<tbody>
													{_.map(_.slice(this.state.rules, this.state.rules.length / 2), rule =>
														<tr key={rule.name}>
															<td>{rule.name}</td>
															<td>
																{rule.value === "true" || rule.value === "false" ?
																	<Label className="switch switch-3d switch-primary">
																		<Input
																			type="checkbox"
																			className="switch-input"
																			defaultChecked={rule.value === "true"}
																			onChange={() => this.toggleRule(rule.name)}
																		/>
																		<span className="switch-label"></span>
																		<span className="switch-handle"></span>
																	</Label>
																: rule.value}
															</td>
														</tr>
													)}
												</tbody>
											</Table>
										</Col>
									</Row>
								</ModalBody>
								<ModalFooter>
									<Button color="primary" onClick={this.saveGameRules}>Save</Button>&nbsp;
									<Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
								</ModalFooter>
							</div>
						: null}
					</Modal>

				</Row>
			</div>
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
		requestUpdateWorld: (uuid, data, op) => dispatch(requestUpdateWorld(uuid, data, op)),
		requestCreateWorld: data => dispatch(requestCreateWorld(data)),
		requestDeleteWorld: uuid => dispatch(requestDeleteWorld(uuid)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);
