import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Table, Button, Progress, Badge, FormGroup, Label } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, Card, CardHeader, CardBlock } from "reactstrap"
import { Pagination, PaginationItem, PaginationLink, Input } from "reactstrap"
import Select from "react-select"
import _ from 'lodash'

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

	filterChange(filter, newValue) {
		if (_.isArray(newValue))
			this.props.setFilter(filter, _.map(newValue, "value"));
		else
			this.props.setFilter(filter, newValue);
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
			<div className="animated fadeIn">
				<Row>

				<Col xs={12}>

						<Card>
							<CardHeader>
								<i className="fa fa-filter"></i>
								Filter players
							</CardHeader>
							<CardBlock>
								<Row>

									<Col xs={12} md={6}>

										<FormGroup row>
											<Label md={2} for="filterWorld">Name</Label>
											<Col md={10}>
												<Input
													type="text" value={this.props.filter.name}
													onChange={e => this.filterChange("name", e.target.value)}
												/>
											</Col>
										</FormGroup>

									</Col>

									<Col xs={12} md={6}>

										<FormGroup row>
											<Label md={2} for="filterWorld">World</Label>
											<Col md={10}>
												<Select
													id="filterWorld"
													multi={true}
													value={this.props.filter.world}
													onChange={val => this.filterChange("world", val)}
													options={_.map(this.props.worlds, world => 
														({ value: world.uuid, label: world.name + " (" + world.dimensionType.name + ")" })
													)}
												/>
											</Col>
										</FormGroup>

									</Col>

								</Row>
							</CardBlock>
						</Card>

					</Col>

					<Col xs={12}>
						<Card>
							<CardHeader>
								<i className="fa fa-users"></i>
								Players
							</CardHeader>
							<CardBlock>
								<Table striped={true}>
									<thead>
										<tr>
											<th>Name / UUID</th>
											<th>Location</th>
											<th>Health & Food</th>
											<th>GameMode</th>
											<th>Level</th>
											<th>Deaths</th>
											<th>Source</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{_.map(players, player =>
											<tr key={player.uuid}>
												<td>{player.name}<br />{player.uuid}</td>
												<td>
													{player.location ?
														<div>
															<Button type="button" color="link">
																<i className="fa fa-globe"></i>&nbsp;&nbsp;
																{player.location.world.name} &nbsp; &nbsp;
																{player.location.position.x.toFixed(0)} |&nbsp;
																{player.location.position.y.toFixed(0)} |&nbsp;
																{player.location.position.z.toFixed(0)}
															</Button>
														</div>
													: null}
												</td>
												<td>
													{player.health ?
														<div>
															<Progress
																className="my-1" color="success"
																value={(player.health.current/player.health.max)*100}
															/>
															<Progress
																className="my-1" color="info"
																value={(player.food.foodLevel/20)*100}
															/>
														</div>
													: null}
												</td>
												<td>
													{player.gameMode ?
														<div>
															{player.gameMode.name}
														</div>
													: null}
												</td>
												<td>
													{player.experience ?
														<div>
															{player.experience.level}
														</div>
													: null}
												</td>
												<td>
													{player.statistics ?
														<div>
															{player.statistics.deaths}
														</div>
													: null}
												</td>
												<td>
													{player.connection ?
														<div>
															{player.connection.address.substring(1)}
														</div>
													: null}
												</td>
												<td>
													<Button
														type="button" color="primary" disabled={player.updating}
														onClick={() => this.showInventory(player)}
													>
														Inventory
													</Button>{" "}
													<Button
														type="button" color="warning" disabled={player.updating}
														onClick={() => this.kick(player)}
													>
														Kick
													</Button>{" "}
													<Button
														type="button" color="danger" disabled={player.updating}
														onClick={() => this.ban(player)}
													>
														Ban
													</Button>
													&nbsp;
													{player.updating ?
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
							</CardBlock>
						</Card>
					</Col>

					<Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-lg ' + this.props.className}>
						{this.state.inventory ?
							<div>
								<ModalHeader toggle={this.toggleModal}>
									{this.state.player.name}'s Inventory
								</ModalHeader>
								<ModalBody>
									<Table>
										<thead>
											<tr>
												<th>Amount</th>
												<th>Item</th>
												<th>Data</th>
											</tr>
										</thead>
										<tbody>
											{_.map(this.state.inventory.items, (item, index) =>
												<tr key={index}>
													<td>{item.quantity}</td>
													<td>{item.name}</td>
													<td>
													{ _.isEmpty(item.data) ?
														null
													: item.data.potionEffects ? 
														_.map(item.data.potionEffects, effect =>
															[<Badge color="danger" pill key={effect.id}>
																{effect.name}
															</Badge>," "]
														)
													: item.data.spawn ?
														<Badge color="primary" pill>
															{item.data.spawn.name}
														</Badge>
													:
														JSON.stringify(item.data)
													}
													</td>
												</tr>
											)}
										</tbody>
									</Table>
								</ModalBody>
							</div>
						: null}
					</Modal>

				</Row>
			</div>
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
