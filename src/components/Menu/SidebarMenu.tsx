import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Icon, Menu, Progress, Sidebar } from 'semantic-ui-react';

import {
	AppAction,
	requestServlets,
	ServletsRequestAction
} from '../../actions';
import { checkPermissions, checkServlets } from '../../components/Util';
import { ServerStatDouble } from '../../fetch';
import { AppState, PermissionTree, ViewDefinition } from '../../types';

export interface OwnProps {
	show: boolean;
	views: ViewDefinition[];
}

interface StateProps {
	cpu: ServerStatDouble[];
	disk: ServerStatDouble[];
	memory: ServerStatDouble[];
	servlets: {
		[x: string]: string;
	};
	perms: PermissionTree | undefined;
	showServerUsage: boolean;
}

interface DispatchProps {
	requestServlets: () => ServletsRequestAction;
}

interface Props
	extends OwnProps,
		StateProps,
		DispatchProps,
		RouteComponentProps,
		WithTranslation {}

class SidebarMenu extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);

		this.renderMenuItem = this.renderMenuItem.bind(this);
	}

	public componentDidMount() {
		this.props.requestServlets();
	}

	public render() {
		const views = this.props.views;

		return (
			<Sidebar
				vertical
				as={Menu}
				animation="push"
				visible={this.props.show}
				secondary
			>
				{this.renderServerUsage()}
				{views.map(this.renderMenuItem)}
			</Sidebar>
		);
	}

	private renderServerUsage() {
		if (!this.props.showServerUsage || this.props.cpu.length <= 0) {
			return null;
		}

		return (
			<Menu.Item name="load">
				<Progress
					percent={this.props.cpu[this.props.cpu.length - 1].value * 100}
					progress="percent"
					precision={1}
					label={this.props.t('CPU')}
					color="blue"
					size="small"
				/>
				<Progress
					percent={this.props.memory[this.props.memory.length - 1].value * 100}
					progress="percent"
					precision={1}
					label={this.props.t('Memory')}
					color="red"
					size="small"
				/>
				<Progress
					percent={this.props.disk[this.props.disk.length - 1].value * 100}
					progress="percent"
					precision={1}
					label={this.props.t('Disk')}
					color="green"
					size="small"
				/>
			</Menu.Item>
		);
	}

	private renderMenuItem(view: ViewDefinition): JSX.Element | null {
		if (view.perms && !checkPermissions(this.props.perms, view.perms)) {
			return null;
		}
		if (view.servlets && !checkServlets(this.props.servlets, view.servlets)) {
			return null;
		}

		if (!view.views) {
			return (
				<Menu.Item as={NavLink} key={view.path} to={view.path}>
					<Icon name={view.icon} /> {this.props.t(view.title)}
				</Menu.Item>
			);
		}

		return (
			<Menu.Item key={view.path}>
				<Menu.Header>{this.props.t(view.title)}</Menu.Header>
				<Menu.Menu>{view.views.map(this.renderMenuItem)}</Menu.Menu>
			</Menu.Item>
		);
	}
}

const mapStateToProps = (state: AppState): StateProps => {
	return {
		cpu: state.dashboard.cpu,
		memory: state.dashboard.memory,
		disk: state.dashboard.disk,
		servlets: state.api.servlets,
		perms: state.api.permissions,
		showServerUsage: state.preferences.showServerUsage
	};
};

const mapDispatchToProps = (
	dispatch: Dispatch<AppAction>,
	props: Props
): DispatchProps => {
	return {
		requestServlets: () => dispatch(requestServlets(props.history))
	};
};

export default withRouter(
	connect<StateProps, DispatchProps, OwnProps, AppState>(
		mapStateToProps,
		mapDispatchToProps
	)(withTranslation('Menu')(SidebarMenu))
);
