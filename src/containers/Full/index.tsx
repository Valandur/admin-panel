import * as _ from 'lodash';
import * as Raven from 'raven-js';
import * as React from 'react';
import { translate } from 'react-i18next';
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

const Preferences = load(() => import('../../views/Preferences'));

const baseIssueUrl = 'https://github.com/Valandur/admin-panel/issues/new?';

export interface Props
	extends reactI18Next.InjectedTranslateProps,
		RouteComponentProps<any> {
	perms: PermissionTree;
	servlets: {
		[x: string]: string
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
	interval: NodeJS.Timer;

	constructor(props: Props) {
		super(props);

		this.state = {
			show: true,
			hasError: false
		};

		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.renderRoute = this.renderRoute.bind(this);
	}

	componentDidMount() {
		if (checkPermissions(this.props.perms, ['info', 'stats'])) {
			this.props.requestStats();
			this.interval = setInterval(() => this.props.requestStats(3), 10000);
		}
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		Raven.captureException(error, { extra: info });
		this.setState({
			hasError: true,
			error: error.toString(),
			stack: info.componentStack
		});
	}

	toggleSidebar() {
		this.setState({
			show: !this.state.show
		});
	}

	getIssueUrl() {
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

	render() {
		const _t = this.props.t;

		return (
			<div>
				<HeaderMenu
					toggleSidebar={this.toggleSidebar}
					showSidebar={this.state.show}
				/>

				<Sidebar.Pushable style={{ height: 'calc(100vh - 67px)' }}>
					<SidebarMenu show={this.state.show} views={views} />

					<Sidebar.Pusher
						style={{
							width: this.state.show ? 'calc(100% - 260px)' : '100%',
							transition: 'width 0.5s',
							height: '100%',
							overflowY: 'scroll',
							float: 'right'
						}}
					>
						{this.state.hasError ? (
							<Segment basic>
								<Message negative size="huge">
									<Message.Header>{_t('ErrorHeader')}</Message.Header>
									<p>{this.state.error}</p>
									<p>{this.state.stack}</p>
								</Message>
								<Message positive size="huge">
									<Message.Header>{_t('FixHeader')}</Message.Header>
									<p>{_t('FixText')}</p>
									<Button
										positive
										as="a"
										size="large"
										icon="github"
										content={_t('SubmitIssue')}
										href={this.getIssueUrl()}
										target="_blank"
										rel="noopener noreferrer"
									/>
								</Message>
							</Segment>
						) : (
							<Switch>
								{views.map(this.renderRoute)}

								<Route path="/preferences" component={Preferences} />
								<Redirect from="/" to="/dashboard" />
							</Switch>
						)}
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</div>
		);
	}

	renderRoute(view: ViewDefinition): JSX.Element | JSX.Element[] {
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

export default connect(mapStateToProps, mapDispatchToProps)(
	translate('Main')(Full)
);
