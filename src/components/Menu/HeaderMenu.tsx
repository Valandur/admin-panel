import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { NavLink, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Dropdown, Icon, Image, Menu, MenuItemProps } from 'semantic-ui-react';

import { AppAction, changeServer, requestLogout } from '../../actions';
import { AppState, Lang, Server } from '../../types';

const apiLink = '/docs';
const spongeLink =
	'https://forums.spongepowered.org/t/' +
	'web-api-provides-an-admin-panel-and-api-for-your-minecraft-server/15709';
const docsLink =
	'https://github.com/Valandur/Web-API/blob/master/docs/INDEX.md';
const issuesLink = 'https://github.com/Valandur/admin-panel/issues';
const imageUrl = require('../../assets/logo.png');

export interface OwnProps {
	showSidebar: boolean;
	toggleSidebar?: (
		event: React.MouseEvent<HTMLElement>,
		data: MenuItemProps
	) => void;
}

interface StateProps {
	lang: Lang;
	username: string | undefined;
	server: Server;
	servers: Server[];
}

interface DispatchProps {
	requestLogout: () => AppAction;
	changeServer: (server: Server) => AppAction;
}

interface Props
	extends OwnProps,
		StateProps,
		DispatchProps,
		RouteComponentProps,
		WithTranslation {}

class HeaderMenu extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render() {
		const _t = this.props.t;

		return (
			<Menu fluid stackable size="small" style={{ marginBottom: 0 }}>
				<Menu.Item
					as={NavLink}
					header
					style={{ minWidth: '259px' }}
					to="/dashboard"
				>
					<Image size="small" centered src={imageUrl} />
				</Menu.Item>

				<Menu.Item name="sidebar" onClick={this.props.toggleSidebar}>
					<Icon name="sidebar" size="large" />
				</Menu.Item>

				<Menu.Menu position="right">
					<Dropdown item text={this.props.username}>
						<Dropdown.Menu>
							<Dropdown.Header content="Links" />
							<Dropdown.Item
								href={apiLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t('APILink')}
							</Dropdown.Item>
							<Dropdown.Item
								href={spongeLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t('SpongeLink')}
							</Dropdown.Item>
							<Dropdown.Item
								href={docsLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t('DocsLink')}
							</Dropdown.Item>
							<Dropdown.Item
								href={issuesLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t('IssuesLink')}
							</Dropdown.Item>

							<Dropdown.Header content="User" />
							<Dropdown.Item as={NavLink} to="/preferences">
								<Icon name="setting" /> {_t('Preferences')}
							</Dropdown.Item>
							<Dropdown.Item name="logout" onClick={this.props.requestLogout}>
								<Icon name="log out" /> {_t('Logout')}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Menu>
			</Menu>
		);
	}
}

const mapStateToProps = (state: AppState): StateProps => {
	return {
		lang: state.preferences.lang,
		username: state.api.username,
		server: state.api.server,
		servers: state.api.servers
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>, props: Props) => {
	return {
		requestLogout: (): AppAction => dispatch(requestLogout(props.history)),
		changeServer: (server: Server): AppAction => dispatch(changeServer(server))
	};
};

export default withRouter(
	connect<StateProps, DispatchProps, OwnProps, AppState>(
		mapStateToProps,
		mapDispatchToProps
	)(withTranslation('Menu')(HeaderMenu))
);
