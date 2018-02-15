import * as React from "react"
import { connect, Dispatch } from "react-redux"
import { Redirect } from "react-router-dom"
import { Grid, Form, Button, Segment, Dropdown, Image, DropdownProps } from "semantic-ui-react"
import { translate } from "react-i18next"
import { Action } from "redux"
import * as _ from "lodash"

import { handleChange, HandleChangeFunc } from "../../components/Util"
import { requestLogin, changeServer, changeLanguage,
	LoginRequestAction, ChangeServerAction, ChangeLanguageAction } from "../../actions"
import { Server, AppState } from "../../types"

export interface Props extends reactI18Next.InjectedTranslateProps {
	loggingIn: boolean
	server: Server
	servers: Server[]
	lang: string
	path: string
	ok: boolean

	changeServer: (server: Server) => ChangeServerAction
	onLoginClick: (username: string, password: string) => LoginRequestAction
	changeLanguage: (lang: string) => ChangeLanguageAction
}

interface OwnState {
	[key: string]: string

	username: string
	password: string
}

class Login extends React.Component<Props, OwnState> {

	handleChange: HandleChangeFunc

	constructor(props: Props) {
		super(props)

		this.state = {
			username: "",
			password: "",
		}

		this.handleChangeServer = this.handleChangeServer.bind(this)
		this.handleChange = handleChange.bind(this, this.handleChangeServer)
		this.handleLogin = this.handleLogin.bind(this)
	}

	handleChangeServer(key: string, value: string) {
		if (key === "server") {
			const server = _.find(this.props.servers, { apiUrl: value })
			if (server == null) {
				return
			}
			this.props.changeServer(server)
		} else {
			this.setState({ [key]: value })
		}
	}

	handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		this.props.onLoginClick(this.state.username, this.state.password)
	}

	render() {
		if (this.props.ok) {
			return <Redirect to={{ pathname: "/", state: { from: this.props.path }}} />
		}

		const _t = this.props.t

		return (
			<Grid
				textAlign="center"
				style={{ height: "100vh" }}
				verticalAlign="middle"
			>
				<Grid.Column style={{ maxWidth: 450 }}>

					<Image size="medium" centered src="./img/logo.png" />

					<Form size="large" loading={this.props.loggingIn}>
						<Segment>
							{this.props.servers.length > 1 ?
								<Form.Field
									fluid
									selection
									name="server"
									control={Dropdown}
									placeholder={_t("Server")}
									value={this.props.server.apiUrl}
									onChange={this.handleChange}
									options={_.map(this.props.servers, s => ({ value: s.apiUrl, text: s.name }))}
								/>
							: null}

							<Form.Field
								selection
								control={Dropdown}
								placeholder="Change language"
								options={[{
									text: "English",
									value: "en",
								}, {
									text: "Deutsch",
									value: "de",
								}, {
									"text": "русский",
									value: "ru",
								}]}
								value={this.props.lang}
								onChange={(e: Event, data: DropdownProps) => this.props.changeLanguage(data.value as string)}
							/>

							<Form.Input
								fluid
								name="username"
								icon="user"
								iconPosition="left"
								placeholder={_t("Username")}
								value={this.state.username}
								onChange={this.handleChange}
							/>

							<Form.Input
								fluid
								name="password"
								icon="lock"
								iconPosition="left"
								placeholder={_t("Password")}
								type="password"
								value={this.state.password}
								onChange={this.handleChange}
							/>

							<Button color="blue" fluid size="large" onClick={this.handleLogin}>
								{_t("Login")}
							</Button>
						</Segment>
					</Form>
				</Grid.Column>
			</Grid>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		ok: state.api.loggedIn,
		lang: state.api.lang,
		loggingIn: state.api.loggingIn,
		server: state.api.server,
		servers: state.api.servers,

		path: state.router.location ? state.router.location.pathname : "",
	}
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
	return {
		onLoginClick: (username: string, password: string) => dispatch(requestLogin(username, password)),
		changeServer: (server: Server) => dispatch(changeServer(server)),
		changeLanguage: (lang: string) => dispatch(changeLanguage(lang)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Login")(Login))
