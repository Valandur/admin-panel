import * as React from 'react';
import { Trans, translate } from 'react-i18next';
import { connect, Dispatch } from 'react-redux';
import { Button, Label, Modal, Popup, Progress } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { ListRequestAction, requestList } from '../../actions/dataview';
import {
	BanPlayerRequestAction,
	KickPlayerRequestAction,
	requestBanPlayer,
	requestKickPlayer
} from '../../actions/player';
import InventoryComp from '../../components/Inventory';
import Location from '../../components/Location';
import { formatRange, renderWorldOptions } from '../../components/Util';
import { Inventory, Player, World } from '../../fetch';
import { AppState, DataViewRef } from '../../types';

import DataViewFunc from '../../components/DataView';
const DataView = DataViewFunc('player', 'uuid');

interface Props extends reactI18Next.InjectedTranslateProps {
	worlds: World[];
	requestKickPlayer: (player: Player) => KickPlayerRequestAction;
	requestBanPlayer: (player: Player) => BanPlayerRequestAction;
	requestWorlds: () => ListRequestAction;
}

interface OwnState {
	modal: boolean;
	player?: Player;
	inventory?: Inventory;
}

class Players extends React.Component<Props, OwnState> {
	constructor(props: Props) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showInventory = this.showInventory.bind(this);
	}

	componentDidMount() {
		this.props.requestWorlds();
	}

	kick(player: Player) {
		this.props.requestKickPlayer(player);
	}

	ban(player: Player) {
		this.props.requestBanPlayer(player);
	}

	showInventory(player: Player, view: DataViewRef<Player>) {
		view.details(player);

		this.setState({
			modal: true,
			player: player,
			inventory: player.inventory
		});
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	render() {
		const _t = this.props.t;

		return (
			<>
				<DataView
					icon="users"
					title={_t('Players')}
					filterTitle={_t('FilterPlayers')}
					fields={{
						name: {
							label: _t('NameUUID'),
							filter: true,
							view: (player: Player) => (
								<Popup
									flowing
									hoverable
									on={['hover', 'click']}
									trigger={<div>{player.name}</div>}
									content={player.uuid}
									position="right center"
								/>
							)
						},
						world: {
							label: _t('World'),
							view: false,
							filter: true,
							filterName: 'location.world.uuid',
							options: renderWorldOptions(this.props.worlds),
							required: true
						},
						location: {
							label: _t('Location'),
							view: (player: Player) => <Location location={player.location} />
						},
						health: {
							label: _t('HealthFood'),
							wide: true,
							view: (player: Player) => {
								if (!player.health || !player.food) {
									return;
								}

								return (
									<>
										<Progress
											progress
											color="red"
											style={{ marginBottom: '1em' }}
											percent={formatRange(
												player.health.current,
												player.health.max
											)}
										/>
										<Progress
											progress
											color="green"
											percent={formatRange(player.food.foodLevel, 20)}
										/>
									</>
								);
							}
						},
						info: {
							label: _t('Info'),
							wide: true,
							view: (player: Player) => (
								<Label.Group>
									<Label>
										{_t('IP')}
										<Label.Detail>{player.address}</Label.Detail>
									</Label>
									{player.gameMode && <Label>{player.gameMode.name}</Label>}
									{player.experience && (
										<Label>
											{_t('Level')}
											<Label.Detail>{player.experience.level}</Label.Detail>
										</Label>
									)}
								</Label.Group>
							)
						}
					}}
					actions={(player: Player, view: DataViewRef<Player>) => (
						<>
							<Button
								secondary
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.showInventory(player, view)}
							>
								{_t('Inventory')}
							</Button>{' '}
							<Button
								negative
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.kick(player)}
							>
								{_t('Kick')}
							</Button>{' '}
							<Button
								negative
								loading={(player as any).updating}
								disabled={(player as any).updating}
								onClick={() => this.ban(player)}
							>
								{_t('Ban')}
							</Button>
						</>
					)}
				/>

				{this.state.player && this.state.inventory ? (
					<Modal
						open={this.state.modal}
						onClose={this.toggleModal}
						size="fullscreen"
						className="scrolling"
					>
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
				) : null}
			</>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestKickPlayer: (player: Player) => dispatch(requestKickPlayer(player)),
		requestBanPlayer: (player: Player) => dispatch(requestBanPlayer(player)),
		requestWorlds: () => dispatch(requestList('world', true))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	translate('Players')(Players)
);
