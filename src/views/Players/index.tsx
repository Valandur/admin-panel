import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Icon, Label, Modal, Progress } from "semantic-ui-react"

import { AppAction } from "../../actions"
import { ListRequestAction, requestList } from "../../actions/dataview"
import { BanPlayerRequestAction, KickPlayerRequestAction, requestBanPlayer,
	requestKickPlayer } from "../../actions/player"
import InventoryComp from "../../components/Inventory"
import { formatRange, renderWorldOptions } from "../../components/Util"
import { Inventory, Player, PlayerFull, WorldFull } from "../../fetch"
import { AppState, DataViewRef } from "../../types"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("player", "uuid")

interface Props extends reactI18Next.InjectedTranslateProps {
	worlds: WorldFull[]
	requestKickPlayer: (player: PlayerFull) => KickPlayerRequestAction
	requestBanPlayer: (player: PlayerFull) => BanPlayerRequestAction
	requestWorlds: () => ListRequestAction
}

interface OwnState {
	modal: boolean
	player?: PlayerFull
	inventory?: Inventory
}

class Players extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false,
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.showInventory = this.showInventory.bind(this)
	}

	componentDidMount() {
		this.props.requestWorlds()
	}

	kick(player: PlayerFull) {
		this.props.requestKickPlayer(player)
	}

	ban(player: PlayerFull) {
		this.props.requestBanPlayer(player)
	}

	showInventory(player: PlayerFull, view: DataViewRef<PlayerFull>) {
		view.details(player)

		this.setState({
			modal: true,
			player: player,
			inventory: player.inventory,
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	render() {
		const _t = this.props.t

		return (
			<div>
				<DataView
					icon="users"
					title={_t("Players")}
					filterTitle={_t("FilterPlayers")}
					fields={{
						name: {
							label: _t("NameUUID"),
							filter: true,
							view: (player: PlayerFull) =>
								<div>
									{player.name}<br />
									{player.uuid}<br />
									{player.address}
								</div>,
						},
						world: {
							label: _t("World"),
							view: false,
							filter: true,
							filterName: "location.world.uuid",
							options: renderWorldOptions(this.props.worlds),
							required: true,
						},
						location: {
							label: _t("Location"),
							view: (player: PlayerFull) =>
								<Button color="blue">
									<Icon name="globe" />
									{player.location.world.name}&nbsp; &nbsp;
									{player.location.position.x.toFixed(0)} |&nbsp;
									{player.location.position.y.toFixed(0)} |&nbsp;
									{player.location.position.z.toFixed(0)}
								</Button>,
						},
						health: {
							label: _t("HealthFood"),
							wide: true,
							view: (player: PlayerFull) => {
								if (!player.health || ! player.food) {
									return
								}

								return (
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
								)
							}
						},
						info: {
							label: _t("Info"),
							wide: true,
							view: (player: PlayerFull) =>
								<div>
									{player.gameMode &&
										<Label>
											{player.gameMode.name}
										</Label>}
									{player.experience &&
										<Label>
											{_t("Level")}
											<Label.Detail>{player.experience.level}</Label.Detail>
										</Label>}
								</div>,
						}
					}}
					actions={(player: PlayerFull, view: DataViewRef<PlayerFull>) =>
						<div>
							<Button
								color="blue"
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.showInventory(player, view)}
							>
								{_t("Inventory")}
							</Button>{" "}
							<Button
								color="yellow"
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.kick(player)}
							>
								{_t("Kick")}
							</Button>{" "}
							<Button
								color="red"
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.ban(player)}
							>
								{_t("Ban")}
							</Button>
						</div>
					}
				/>

				{this.state.player && this.state.inventory ?
					<Modal open={this.state.modal} onClose={this.toggleModal}>
						<Modal.Header>
							<Trans i18nKey="InventoryTitle">
								{this.state.player.name}'s Inventory
							</Trans>
						</Modal.Header>
						<Modal.Content>
							<InventoryComp
								items={this.state.inventory.itemStacks}
								dontCollapse={true}
							/>
						</Modal.Content>
					</Modal>
				: null}
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list,
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestKickPlayer: (player: Player) => dispatch(requestKickPlayer(player)),
		requestBanPlayer: (player: Player) => dispatch(requestBanPlayer(player)),
		requestWorlds: () => dispatch(requestList("world", true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Players")(Players))
