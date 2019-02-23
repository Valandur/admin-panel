import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Label, Modal, Popup, Progress } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { ListRequestAction, requestList } from '../../actions/dataview';
import {
	BanPlayerRequestAction,
	KickPlayerRequestAction,
	requestBanPlayer,
	requestKickPlayer
} from '../../actions/player';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import InventoryComp from '../../components/Inventory';
import Location from '../../components/Location';
import { formatRange, renderWorldOptions } from '../../components/Util';
import { Inventory, Player, World } from '../../fetch';
import { AppState, DataViewRef } from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('player', 'uuid');

interface Props extends WithTranslation {
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
	public constructor(props: Props) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showInventory = this.showInventory.bind(this);
	}

	public componentDidMount() {
		this.props.requestWorlds();
	}

	private kick(player: Player) {
		this.props.requestKickPlayer(player);
	}

	private ban(player: Player) {
		this.props.requestBanPlayer(player);
	}

	private showInventory(player: Player, view: DataViewRef<Player>) {
		view.details(player);

		this.setState({
			modal: true,
			player: player,
			inventory: player.inventory
		});
	}

	private toggleModal = () => {
		this.setState({
			modal: !this.state.modal
		});
	};

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<Player> = {
			name: {
				label: t('NameUUID'),
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
				label: t('World'),
				view: false,
				filter: true,
				filterName: 'location.world.uuid',
				options: renderWorldOptions(this.props.worlds),
				required: true
			},
			location: {
				label: t('Location'),
				view: (player: Player) => <Location location={player.location} />
			},
			health: {
				label: t('HealthFood'),
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
								percent={formatRange(player.health.current, player.health.max)}
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
				label: t('Info'),
				wide: true,
				view: (player: Player) => {
					const gm = player.gameMode && <Label>{player.gameMode.name}</Label>;
					const exp = player.experience && (
						<Label>
							{t('Level')}
							<Label.Detail>{player.experience.level}</Label.Detail>
						</Label>
					);

					return (
						<Label.Group>
							<Label>
								{t('IP')}
								<Label.Detail>{player.address}</Label.Detail>
							</Label>
							{gm}
							{exp}
						</Label.Group>
					);
				}
			}
		};

		return (
			<>
				<DataView
					icon="users"
					title={t('Players')}
					filterTitle={t('FilterPlayers')}
					fields={fields}
					actions={this.renderActions}
				/>

				{this.renderModal()}
			</>
		);
	}

	private renderActions = (player: Player, view: DataViewRef<Player>) => {
		const { t } = this.props;

		const onShowInv = () => this.showInventory(player, view);
		const onKick = () => this.kick(player);
		const onBan = () => this.ban(player);

		return (
			<>
				<Button
					secondary
					loading={(player as any).updating}
					disabled={(player as any).updating}
					onClick={onShowInv}
				>
					{t('Inventory')}
				</Button>{' '}
				<Button
					negative
					loading={(player as any).updating}
					disabled={(player as any).updating}
					onClick={onKick}
				>
					{t('Kick')}
				</Button>{' '}
				<Button
					negative
					loading={(player as any).updating}
					disabled={(player as any).updating}
					onClick={onBan}
				>
					{t('Ban')}
				</Button>
			</>
		);
	};

	private renderModal() {
		if (!this.state.player || !this.state.inventory) {
			return null;
		}

		return (
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
					<InventoryComp inventory={this.state.inventory} dontCollapse={true} />
				</Modal.Content>
			</Modal>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Players')(Players));
