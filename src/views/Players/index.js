import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Table, Button, Progress, Badge } from 'reactstrap'
import { Modal, ModalHeader, ModalBody } from "reactstrap"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import _ from 'lodash'

import { requestPlayers, requestKickPlayer, requestBanPlayer } from "../../actions/player"

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

		this.props.requestPlayers();
	}

	componentDidMount() {
		this.interval = setInterval(this.props.requestPlayers, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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
		let players = _.filter(this.props.players, p => true);

		const page = this.state.page;
		const maxPage = Math.ceil(players.length / ITEMS_PER_PAGE);

		players = players.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<div className="animated fadeIn">
				<Row>

					<Col xs={12}>
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
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestPlayers: () => dispatch(requestPlayers(true)),
		requestKickPlayer: (uuid) => dispatch(requestKickPlayer(uuid)),
		requestBanPlayer: (name) => dispatch(requestBanPlayer(name)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
