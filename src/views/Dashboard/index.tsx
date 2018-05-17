import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { Trans, translate } from 'react-i18next';
import { connect, Dispatch } from 'react-redux';
import {
	Card,
	Grid,
	Message,
	Segment,
	SemanticCOLORS
} from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { requestInfo } from '../../actions/dashboard';
import { setPreference } from '../../actions/preferences';
import { checkPermissions } from '../../components/Util';
import { ServerInfo, ServerStats } from '../../fetch';
import { AppState, PermissionTree, PreferenceKey } from '../../types';

import graphConfig from './chart';

interface StateProps extends ServerStats {
	data?: ServerInfo;
	perms?: PermissionTree;
	hideNote: boolean;
}

interface DispatchProps {
	requestInfo: () => AppAction;
	hideWIPNotice: () => AppAction;
}

interface Props
	extends StateProps,
		DispatchProps,
		reactI18Next.InjectedTranslateProps {}

class Dashboard extends React.Component<Props, {}> {
	interval: NodeJS.Timer;

	lineInfo: any;
	optionsInfo: any;

	lineStats: any;
	optionsStats: any;

	constructor(props: Props) {
		super(props);

		const config = graphConfig(props.t);

		this.lineInfo = config.lineInfo;
		this.optionsInfo = config.optionsInfo;

		this.lineStats = config.lineStats;
		this.optionsStats = config.optionsStats;
	}

	componentDidMount() {
		if (checkPermissions(this.props.perms, ['info', 'info'])) {
			this.props.requestInfo();
			this.interval = setInterval(this.props.requestInfo, 5000);
		}
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	render() {
		const _t = this.props.t;

		// Exit early if we have no data. No permissions?
		if (!this.props.data && !this.props.cpu && !this.props.players) {
			return (
				<Segment basic>
					<Message negative size="large" content={_t('NoData')} />
				</Segment>
			);
		}

		this.lineInfo.datasets[0].data = this.props.tps.map(p => ({
			x: new Date(p.timestamp * 1000),
			y: p.value
		}));
		this.lineInfo.datasets[1].data = this.props.players.map(p => ({
			x: new Date(p.timestamp * 1000),
			y: p.value
		}));

		this.lineStats.datasets[0].data = this.props.cpu.map(p => ({
			x: new Date(p.timestamp * 1000),
			y: p.value * 100
		}));
		this.lineStats.datasets[1].data = this.props.memory.map(p => ({
			x: new Date(p.timestamp * 1000),
			y: p.value * 100
		}));
		this.lineStats.datasets[2].data = this.props.disk.map(p => ({
			x: new Date(p.timestamp * 1000),
			y: p.value * 100
		}));

		let playerState: SemanticCOLORS = 'blue';
		if (this.props.data) {
			const ratio = this.props.data.players / this.props.data.maxPlayers;
			if (ratio > 0.95) {
				playerState = 'red';
			} else if (ratio > 0.8) {
				playerState = 'yellow';
			} else {
				playerState = 'green';
			}
		}

		let tpsState: SemanticCOLORS = 'blue';
		if (this.props.data) {
			if (this.props.data.tps >= 19.5) {
				tpsState = 'green';
			} else if (this.props.data.tps >= 15) {
				tpsState = 'yellow';
			} else {
				tpsState = 'red';
			}
		}

		return (
			<Segment basic>
				{!this.props.hideNote && (
					<Message info onDismiss={() => this.props.hideWIPNotice()}>
						<Message.Header>{_t('WIPTitle')}</Message.Header>
						<p>
							<Trans i18nKey="WIPText">
								The Web-API AdminPanel is still a work in progress, and not all
								of it's functionality has been fully implemented yet. This means
								there may be bugs and other issues when using the AdminPanel!
								<br />
								Please report any bugs you find
								<a
									href="https://github.com/Valandur/admin-panel/issues"
									target="_blank"
									rel="noopener noreferrer"
								>
									over on GitHub
								</a>
							</Trans>
						</p>
					</Message>
				)}

				<Grid columns={4} stackable doubling>
					{this.props.data && (
						<>
							<Grid.Column>
								<Card color={playerState}>
									<Card.Content>
										<Card.Header>
											{this.props.data.players}/{this.props.data.maxPlayers}
										</Card.Header>
										<Card.Description>{_t('PlayersOnline')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color={tpsState}>
									<Card.Content>
										<Card.Header>{this.props.data.tps}</Card.Header>
										<Card.Description>{_t('CurrentTPS')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>{this.props.data.address}</Card.Header>
										<Card.Description>{_t('ServerAddress')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>
											{this.props.data.onlineMode ? 'Yes' : 'No'}
										</Card.Header>
										<Card.Description>{_t('OnlineMode')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>{this.props.data.uptimeTicks}</Card.Header>
										<Card.Description>{_t('UptimeTicks')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>{this.props.data.game.version}</Card.Header>
										<Card.Description>
											{_t('MinecraftVersion')}
										</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>{this.props.data.api.version}</Card.Header>
										<Card.Description>{_t('APIVersion')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>

							<Grid.Column>
								<Card color="blue">
									<Card.Content>
										<Card.Header>
											{this.props.data.implementation.version}
										</Card.Header>
										<Card.Description>{_t('SpongeVersion')}</Card.Description>
									</Card.Content>
								</Card>
							</Grid.Column>
						</>
					)}

					{checkPermissions(this.props.perms, ['info', 'stats']) && (
						<Grid.Column width={8}>
							<Card style={{ width: '100%', height: '50vh' }}>
								<Card.Content>
									<Card.Header>{_t('GraphTitleInfo')}</Card.Header>
								</Card.Content>
								<div style={{ width: '100%', height: '100%', padding: '1em' }}>
									<Line data={this.lineInfo} options={this.optionsInfo} />
								</div>
							</Card>
						</Grid.Column>
					)}

					{checkPermissions(this.props.perms, ['info', 'stats']) && (
						<Grid.Column width={8}>
							<Card style={{ width: '100%', height: '50vh' }}>
								<Card.Content>
									<Card.Header>{_t('GraphTitleStats')}</Card.Header>
								</Card.Content>
								<div style={{ width: '100%', height: '100%', padding: '1em' }}>
									<Line data={this.lineStats} options={this.optionsStats} />
								</div>
							</Card>
						</Grid.Column>
					)}
				</Grid>
			</Segment>
		);
	}
}

const mapStateToProps = (_state: AppState): StateProps => {
	const state = _state.dashboard;

	return {
		tps: state.tps,
		players: state.players,
		cpu: state.cpu,
		memory: state.memory,
		disk: state.disk,
		data: state.data,

		hideNote: _state.preferences.hideWIPNote,
		perms: _state.api.permissions
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestInfo: (): AppAction => dispatch(requestInfo()),
		hideWIPNotice: (): AppAction =>
			dispatch(setPreference(PreferenceKey.hideWIPNote, true))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	translate('Dashboard')(Dashboard)
);
