import * as _ from 'lodash';
import * as Raven from 'raven-js';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Action, Dispatch } from 'redux';
import { Button, Message, Segment, Sidebar } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { requestStats } from '../../actions/dashboard';
import HeaderMenu from '../../components/Menu/HeaderMenu';
import SidebarMenu from '../../components/Menu/SidebarMenu';
import { checkPermissions, checkServlets } from '../../components/Util';
import { AppState, PermissionTree, ViewDefinition } from '../../types';

import { load, views } from './Views';

// tslint:disable-next-line:variable-name
const Preferences = load(() => import('../../views/Preferences'));

const baseIssueUrl = 'https://github.com/Valandur/admin-panel/issues/new?';

export interface Props extends WithTranslation, RouteComponentProps<any> {
	perms: PermissionTree;
	servlets: {
		[x: string]: string;
	};
	requestStats: (limit?: number) => Action;
}

interface OwnState {
	show: boolean;
	hasError: boolean;
	error?: string;
	stack?: string;
}

class Full extends React.Component<Props, OwnState> {
	private interval: NodeJS.Timer;

	public constructor(props: Props) {
		super(props);

		this.state = {
			show: true,
			hasError: false
		};

		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.renderRoute = this.renderRoute.bind(this);
	}

	public componentDidMount() {
		if (checkPermissions(this.props.perms, ['info', 'stats'])) {
			this.props.requestStats();
			this.interval = setInterval(() => this.props.requestStats(3), 10000);
		}
	}

	public componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	public componentDidCatch(error: Error, info: React.ErrorInfo) {
		Raven.captureException(error, { extra: info });
		this.setState({
			hasError: true,
			error: error.toString(),
			stack: info.componentStack
		});
	}

	private toggleSidebar() {
		this.setState({
			show: !this.state.show
		});
	}

	private getIssueUrl() {
		return (
			baseIssueUrl +
			'labels=bug' +
			'&title=' +
			encodeURIComponent('[Issue] <Add a short description>') +
			'&body=' +
			encodeURIComponent(
				'<Say a little about what happened>\n\n' +
					this.state.error +
					'\n\nStacktrace:' +
					this.state.stack
			) +
			'&assignee=Valandur'
		);
	}

	public render() {
		const { hasError } = this.state;

		const sidebarStyle = {
			width: this.state.show ? 'calc(100% - 260px)' : '100%',
			transition: 'width 0.5s',
			height: '100%',
			overflowY: 'scroll',
			float: 'right'
		};

		return (
			<div>
				<HeaderMenu
					toggleSidebar={this.toggleSidebar}
					showSidebar={this.state.show}
				/>

				<Sidebar.Pushable style={{ height: 'calc(100vh - 67px)' }}>
					<SidebarMenu show={this.state.show} views={views} />

					<Sidebar.Pusher style={sidebarStyle}>
						{hasError ? this.renderError() : this.renderContent()}
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</div>
		);
	}

	private renderContent() {
		return (
			<Switch>
				{views.map(this.renderRoute)}

				<Route path="/preferences" component={Preferences} />
				<Redirect from="/" to="/dashboard" />
			</Switch>
		);
	}

	private renderError() {
		const { t } = this.props;

		return (
			<Segment basic>
				<Message negative size="huge">
					<Message.Header>{t('ErrorHeader')}</Message.Header>
					<p>{this.state.error}</p>
					<p>{this.state.stack}</p>
				</Message>
				<Message positive size="huge">
					<Message.Header>{t('FixHeader')}</Message.Header>
					<p>{t('FixText')}</p>
					<Button
						positive
						as="a"
						size="large"
						icon="github"
						content={t('SubmitIssue')}
						href={this.getIssueUrl()}
						target="_blank"
						rel="noopener noreferrer"
					/>
				</Message>
			</Segment>
		);
	}

	private renderRoute(view: ViewDefinition): JSX.Element | JSX.Element[] {
		if (view.perms && !checkPermissions(this.props.perms, view.perms)) {
			return <Redirect key={view.path} from={view.path} to="/dashboard" />;
		}
		if (view.servlets && !checkServlets(this.props.servlets, view.servlets)) {
			return <Redirect key={view.path} from={view.path} to="/dashboard" />;
		}
		if (view.component) {
			return (
				<Route key={view.path} path={view.path} component={view.component} />
			);
		}
		return _.flatMap(view.views, this.renderRoute);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		perms: state.api.permissions,
		servlets: state.api.servlets
	};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
	return {
		requestStats: (limit?: number): AppAction => dispatch(requestStats(limit))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Main')(Full));
