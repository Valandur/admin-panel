import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
	Button,
	Dropdown,
	DropdownProps,
	Form,
	Grid,
	Image,
	Segment
} from 'semantic-ui-react';

import { AppAction, changeServer, requestLogin } from '../../actions';
import { setPreference } from '../../actions/preferences';
import { handleChange, HandleChangeFunc } from '../../components/Util';
import {
	AppState,
	Lang,
	langArray,
	PreferenceKey,
	Server,
	Theme,
	THEMES_ARRAY
} from '../../types';

const imageUrl = require('../../assets/logo.png');

interface StateProps {
	loggingIn: boolean;
	server?: Server;
	servers: Server[];
	lang: Lang;
	theme: Theme;
	ok: boolean;
}

interface Props extends StateProps, RouteComponentProps, WithTranslation {
	changeServer: (server: Server) => AppAction;
	onLoginClick: (username: string, password: string) => AppAction;
	setPref: (key: PreferenceKey, value: any) => AppAction;
}

interface OwnState {
	[key: string]: string;

	username: string;
	password: string;
}

class Login extends React.Component<Props, OwnState> {
	private handleChange: HandleChangeFunc;

	public constructor(props: Props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this.handleChangeServer = this.handleChangeServer.bind(this);
		this.handleChange = handleChange.bind(this, this.handleChangeServer);
		this.handleLogin = this.handleLogin.bind(this);
	}

	private handleChangeServer(key: string, value: string) {
		if (key === 'server') {
			const server = this.props.servers.find(s => s.apiUrl === value);
			if (server == null) {
				return;
			}
			this.props.changeServer(server);
		} else {
			this.setState({ [key]: value });
		}
	}

	private handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		this.props.onLoginClick(this.state.username, this.state.password);
	}

	public render() {
		const { t, ok } = this.props;

		if (ok) {
			return (
				<Redirect
					to={{ pathname: '/', state: { from: this.props.location.pathname } }}
				/>
			);
		}

		return (
			<Grid
				textAlign="center"
				style={{ height: '100vh' }}
				verticalAlign="middle"
			>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Image size="medium" centered src={imageUrl} />

					<Form size="large" loading={this.props.loggingIn}>
						<Segment>
							{this.renderServerSelect()}

							<Form.Field
								selection
								control={Dropdown}
								placeholder={t('ChangeTheme')}
								options={THEMES_ARRAY}
								value={this.props.theme}
								onChange={this.onChangeTheme}
							/>

							<Form.Field
								selection
								control={Dropdown}
								placeholder={t('ChangeLanguage')}
								options={langArray}
								value={this.props.lang}
								onChange={this.onChangeLanguage}
							/>

							<Form.Input
								fluid
								name="username"
								icon="user"
								iconPosition="left"
								placeholder={t('Username')}
								value={this.state.username}
								onChange={this.handleChange}
							/>

							<Form.Input
								fluid
								name="password"
								icon="lock"
								iconPosition="left"
								placeholder={t('Password')}
								type="password"
								value={this.state.password}
								onChange={this.handleChange}
							/>

							<Button fluid primary size="large" onClick={this.handleLogin}>
								{t('Login')}
							</Button>
						</Segment>
					</Form>
				</Grid.Column>
			</Grid>
		);
	}

	private renderServerSelect() {
		const { servers, server, t } = this.props;

		if (servers.length <= 1) {
			return null;
		}

		const options = servers.map(s => ({
			value: s.apiUrl,
			text: s.name
		}));

		return (
			<Form.Field
				fluid
				selection
				name="server"
				control={Dropdown}
				placeholder={t('Server')}
				value={server ? server.apiUrl : undefined}
				onChange={this.handleChange}
				options={options}
			/>
		);
	}

	private onChangeTheme = (e: Event, data: DropdownProps) => {
		this.props.setPref(PreferenceKey.theme, data.value);
	};

	private onChangeLanguage = (e: Event, data: DropdownProps) => {
		this.props.setPref(PreferenceKey.lang, data.value);
	};
}

const mapStateToProps = (state: AppState): StateProps => {
	return {
		ok: state.api.loggedIn,
		lang: state.preferences.lang,
		theme: state.preferences.theme,
		loggingIn: state.api.loggingIn,
		server: state.api.server,
		servers: state.api.servers
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>, props: Props) => {
	return {
		onLoginClick: (username: string, password: string): AppAction =>
			dispatch(requestLogin(props.history, username, password)),
		changeServer: (server: Server): AppAction => dispatch(changeServer(server)),
		setPref: (key: PreferenceKey, value: any): AppAction =>
			dispatch(setPreference(key, value))
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withTranslation('Login')(Login))
);
