import React, { Component } from "react"
import { connect } from "react-redux"
import { Icon, Label, Modal, Progress, Button } from "semantic-ui-react"
import _ from "lodash"

import Inventory from "../../components/Inventory"
import { formatRange } from "../../components/Util"

import { requestList } from "../../actions/dataview"
import { requestKickPlayer, requestBanPlayer } from "../../actions/player"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("player", "uuid")


class Players extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modal: false,
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showInventory = this.showInventory.bind(this);
	}

	componentDidMount() {
		this.props.requestWorlds();
	}

	kick(player) {
		this.props.requestKickPlayer(player.uuid);
	}

	ban(player) {
		this.props.requestBanPlayer(player.name);
	}

	showInventory(player, view) {
		view.details(player)

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

	render() {
		return <div>
			<DataView
				title="Players"
				filterTitle="Filter players"
				icon="users"
				fields={{
					name: {
						label: "Name & UUID",
						filter: true,
						view: player => 
							<div>
								{player.name}<br />
								{player.uuid}<br />
								{player.address}
							</div>,
					},
					world: {
						label: "World",
						view: false,
						filter: true,
						filterName: "location.world.uuid",
						options: _.map(this.props.worlds, world => 
							({
								value: world.uuid,
								text: world.name + " (" + world.dimensionType.name + ")"
							})
						),
						required: true,
					},
					location: {
						label: "Location",
						view: player =>
							<Button color="blue">
								<Icon name="globe" />
								{player.location.world.name}&nbsp; &nbsp;
								{player.location.position.x.toFixed(0)} |&nbsp;
								{player.location.position.y.toFixed(0)} |&nbsp;
								{player.location.position.z.toFixed(0)}
							</Button>,
					},
					health: {
						label: "Health & Food",
						wide: true,
						view: player => 
							<div>
								<Progress
									progress
									color="red"
									style={{marginBottom: "1em"}}
									percent={formatRange(player.health.current, player.health.max)}
								/>
								<Progress
									progress
									color="green"
									percent={formatRange(player.food.foodLevel, 20)}
								/>
							</div>
					},
					info: {
						label: "Info",
						wide: true,
						view: player =>
							<div>
								{player.gameMode &&
									<Label>
										{player.gameMode.name}
									</Label>}
								{player.experience &&
									<Label>
										Level
										<Label.Detail>{player.experience.level}</Label.Detail>
									</Label>}
							</div>,
					}
				}}
				actions={(player, view) =>
					<div>
						<Button
							color="blue" loading={player.updating} disabled={player.updating}
							onClick={() => this.showInventory(player, view)}
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
					</div>
				}
			/>

			{this.state.inventory ?
				<Modal open={this.state.modal} onClose={this.toggleModal}>
					<Modal.Header>
						{this.state.player.name}'s Inventory
					</Modal.Header>
					<Modal.Content>
						<Inventory
							items={this.state.inventory.items}
							dontCollapse={true}
						/>
					</Modal.Content>
				</Modal>
			: null}
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {
		worlds: _state.world.list,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestKickPlayer: (uuid) => dispatch(requestKickPlayer(uuid)),
		requestBanPlayer: (name) => dispatch(requestBanPlayer(name)),
		requestWorlds: () => dispatch(requestList("world", true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
