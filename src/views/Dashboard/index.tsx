import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
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

interface Props extends StateProps, DispatchProps, WithTranslation {}

class Dashboard extends React.Component<Props, {}> {
	private interval: NodeJS.Timer;

	private lineInfo: any;
	private optionsInfo: any;

	private lineStats: any;
	private optionsStats: any;

	public constructor(props: Props) {
		super(props);

		const config = graphConfig(props.t);

		this.lineInfo = config.lineInfo;
		this.optionsInfo = config.optionsInfo;

		this.lineStats = config.lineStats;
		this.optionsStats = config.optionsStats;
	}

	public componentDidMount() {
		if (checkPermissions(this.props.perms, ['info', 'info'])) {
			this.props.requestInfo();
			this.interval = setInterval(this.props.requestInfo, 5000);
		}
	}

	public componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	public render() {
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

		return (
			<Segment basic>
				{this.renderWIPNote()}
				<Grid columns={4} stackable doubling>
					{this.renderData()}
					{this.renderInfo()}
					{this.renderStats()}
				</Grid>
			</Segment>
		);
	}

	private renderWIPNote() {
		if (this.props.hideNote) {
			return null;
		}

		return (
			<Message info onDismiss={this.props.hideWIPNotice}>
				<Message.Header>{this.props.t('WIPTitle')}</Message.Header>
				<p>
					<Trans i18nKey="WIPText">
						The Web-API AdminPanel is still a work in progress, and not all of
						it's functionality has been fully implemented yet. This means there
						may be bugs and other issues when using the AdminPanel!
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
		);
	}

	private renderData() {
		const { data, t } = this.props;

		if (!data) {
			return null;
		}

		const ratio = data.players / data.maxPlayers;
		const playerState: SemanticCOLORS =
			ratio > 0.95 ? 'red' : ratio > 0.8 ? 'yellow' : 'green';

		const tpsState: SemanticCOLORS =
			data.tps >= 19.5 ? 'green' : data.tps >= 15 ? 'yellow' : 'red';

		return (
			<>
				<Grid.Column>
					<Card color={playerState}>
						<Card.Content>
							<Card.Header>
								{data.players}/{data.maxPlayers}
							</Card.Header>
							<Card.Description>{t('PlayersOnline')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color={tpsState}>
						<Card.Content>
							<Card.Header>{data.tps}</Card.Header>
							<Card.Description>{t('CurrentTPS')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.address}</Card.Header>
							<Card.Description>{t('ServerAddress')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.onlineMode ? 'Yes' : 'No'}</Card.Header>
							<Card.Description>{t('OnlineMode')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.uptimeTicks}</Card.Header>
							<Card.Description>{t('UptimeTicks')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.game.version}</Card.Header>
							<Card.Description>{t('MinecraftVersion')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.api.version}</Card.Header>
							<Card.Description>{t('APIVersion')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>

				<Grid.Column>
					<Card color="blue">
						<Card.Content>
							<Card.Header>{data.implementation.version}</Card.Header>
							<Card.Description>{t('SpongeVersion')}</Card.Description>
						</Card.Content>
					</Card>
				</Grid.Column>
			</>
		);
	}

	private renderInfo() {
		if (!checkPermissions(this.props.perms, ['info', 'stats'])) {
			return null;
		}

		return (
			<Grid.Column width={8}>
				<Card style={{ width: '100%', height: '50vh' }}>
					<Card.Content>
						<Card.Header>{this.props.t('GraphTitleInfo')}</Card.Header>
					</Card.Content>
					<div style={{ width: '100%', height: '100%', padding: '1em' }}>
						<Line data={this.lineInfo} options={this.optionsInfo} />
					</div>
				</Card>
			</Grid.Column>
		);
	}

	private renderStats() {
		if (!checkPermissions(this.props.perms, ['info', 'stats'])) {
			return null;
		}

		return (
			<Grid.Column width={8}>
				<Card style={{ width: '100%', height: '50vh' }}>
					<Card.Content>
						<Card.Header>{this.props.t('GraphTitleStats')}</Card.Header>
					</Card.Content>
					<div style={{ width: '100%', height: '100%', padding: '1em' }}>
						<Line data={this.lineStats} options={this.optionsStats} />
					</div>
				</Card>
			</Grid.Column>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Dashboard')(Dashboard));
