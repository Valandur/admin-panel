import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Form, Menu, Table, 
	Dropdown, Modal, Header, Label, Progress, Button, 
} from "semantic-ui-react"
import _ from "lodash"

import { requestWorlds } from "../../actions/world"
import { setFilter, requestPlayers, requestKickPlayer, requestBanPlayer } from "../../actions/player"

const ITEMS_PER_PAGE = 20;

class Players extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			modal: false,
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showInventory = this.showInventory.bind(this);
		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
	}

	componentDidMount() {
		this.props.requestPlayers();
		this.props.requestWorlds();

		this.interval = setInterval(this.props.requestPlayers, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	filterChange(event, data) {
		const name = data.name ? data.name : data.id;
		this.props.setFilter(name, data.value);
	}

	kick(player) {
		this.props.requestKickPlayer(player.uuid);
	}

	ban(player) {
		this.props.requestBanPlayer(player.name);
	}

	showInventory(player) {
		this.setState({
			modal: true,
			player: player,
			inventory: player.inventory,
		});
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	render() {
		const reg = new RegExp(this.props.filter.name, "i")

		let players = _.filter(this.props.players, player => {
			if (!_.isEmpty(this.props.filter.name)) {
				if (!reg.test(player.name) && !reg.test(player.uuid)) {
					return false;
				}
			}
			return true;
		});

		const maxPage = Math.ceil(players.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		players = players.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Segment>
					<Header>
						<i className="fa fa-filter"></i> Filter players
					</Header>

					<Form>
						<Form.Group widths="equal">
							<Form.Input
								id="name" label="Name"
								value={this.props.filter.name} onChange={this.filterChange}
							/>

							<Form.Field name="world" label="World" control={Dropdown} placeholder="World"
								fluid selection search multiple onChange={this.filterChange}
								options={_.map(this.props.worlds, w => 
									({ value: w.uuid, text: w.name + " (" + w.dimensionType.name + ")" })
								)}
							/>
						</Form.Group>
					</Form>
				</Segment>

				<Header>
					<i className="fa fa-users"></i> Players
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name / UUID</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Health & Food</Table.HeaderCell>
							<Table.HeaderCell>GameMode</Table.HeaderCell>
							<Table.HeaderCell>Level</Table.HeaderCell>
							<Table.HeaderCell>Deaths</Table.HeaderCell>
							<Table.HeaderCell>Source</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(players, player =>
							<Table.Row key={player.uuid}>
								<Table.Cell>{player.name}<br />{player.uuid}</Table.Cell>
								<Table.Cell>
									{player.location ?
										<Button color="blue">
											<i className="fa fa-globe"></i>&nbsp;&nbsp;
											{player.location.world.name} &nbsp; &nbsp;
											{player.location.position.x.toFixed(0)} |&nbsp;
											{player.location.position.y.toFixed(0)} |&nbsp;
											{player.location.position.z.toFixed(0)}
										</Button>
									: null}
								</Table.Cell>
								<Table.Cell>
									{player.health ?
										<div>
											<Progress color="green" style={{marginBottom: "1em"}}
												percent={(player.health.current/player.health.max)*100}
											/>
											<Progress color="blue"
												percent={(player.food.foodLevel/20)*100}
											/>
										</div>
									: null}
								</Table.Cell>
								<Table.Cell>
									{player.gameMode ?
										<div>
											{player.gameMode.name}
										</div>
									: null}
								</Table.Cell>
								<Table.Cell>
									{player.experience ?
										<div>
											{player.experience.level}
										</div>
									: null}
								</Table.Cell>
								<Table.Cell>
									{player.statistics ?
										<div>
											{player.statistics.deaths}
										</div>
									: null}
								</Table.Cell>
								<Table.Cell>
									{player.connection ?
										<div>
											{player.connection.address.substring(1)}
										</div>
									: null}
								</Table.Cell>
								<Table.Cell>
									<Button
										color="blue" loading={player.updating} disabled={player.updating}
										onClick={() => this.showInventory(player)}
									>
										Inventory
									</Button>{" "}
									<Button
										color="yellow" loading={player.updating} disabled={player.updating}
										onClick={() => this.kick(player)}
									>
										Kick
									</Button>{" "}
									<Button
										color="red" loading={player.updating} disabled={player.updating}
										onClick={() => this.ban(player)}
									>
										Ban
									</Button>
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

				{this.state.inventory ?
					<Modal open={this.state.modal} onClose={this.toggleModal}>
						<Modal.Header>
							{this.state.player.name}'s Inventory
						</Modal.Header>
						<Modal.Content>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Amount</Table.HeaderCell>
										<Table.HeaderCell>Item</Table.HeaderCell>
										<Table.HeaderCell>Data</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{_.map(this.state.inventory.items, (item, index) =>
										<Table.Row key={index}>
											<Table.Cell>{item.quantity}</Table.Cell>
											<Table.Cell>{item.name}</Table.Cell>
											<Table.Cell>
											{ _.isEmpty(item.data) ?
												null
											: item.data.potionEffects ? 
												_.map(item.data.potionEffects, effect =>
													[<Label color="red" pill key={effect.id}>
														{effect.name}
													</Label>," "]
												)
											: item.data.spawn ?
												<Label color="blue" pill>
													{item.data.spawn.name}
												</Label>
											:
												JSON.stringify(item.data)
											}
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table>
						</Modal.Content>
					</Modal>
				: null}

			</Segment>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.player

	return {
		players: state.players,
		worlds: _state.world.worlds,
		filter: state.filter,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestPlayers: () => dispatch(requestPlayers(true)),
		requestKickPlayer: (uuid) => dispatch(requestKickPlayer(uuid)),
		requestBanPlayer: (name) => dispatch(requestBanPlayer(name)),
		requestWorlds: () => dispatch(requestWorlds(true)),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
