import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { Grid, Form, Button, Segment, Dropdown, Image } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import { handleChange } from "../../components/Util"
import { requestLogin, changeServer, changeLanguage } from "../../actions"

class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: "",
			password: "",
		}

		this.handleChangeServer = this.handleChangeServer.bind(this)
		this.handleChange = handleChange.bind(this, this.handleChangeServer)
		this.handleLogin = this.handleLogin.bind(this)
	}

	handleChangeServer(key, value) {
		if (key === "server") {
			this.props.changeServer(_.find(this.props.servers, { apiUrl: value }))
		} else {
			this.setState({ [key]: value })
		}
	}

	handleLogin(event) {
		event.preventDefault();
		this.props.onLoginClick(this.state.username, this.state.password)
	}

	render() {
		if (this.props.ok) {
			return <Redirect to={{ pathname: "/", state: { from: this.props.location} }} />
		}

		const _t = this.props.t

		return <Grid
				textAlign="center"
				style={ {height: "100vh" }}
				verticalAlign="middle">
			<Grid.Column style={{ maxWidth: 450 }}>
				
				<Image size="medium" centered src="./img/logo.png" />

				<Form size="large" loading={this.props.loggingIn}>
					<Segment>
						{this.props.servers.length > 1 ?
							<Form.Field
								fluid selection
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
							},{
								text: "Deutsch",
								value: "de",
							},{
								"text": "русский",
								value: "ru",
							}]}
							value={this.props.lang}
							onChange={(e, data) => this.props.changeLanguage(data.value)}
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
	}
}

const mapStateToProps = (_state) => {
	return {
		ok: _state.api.loggedIn,
		lang: _state.api.lang,
		loggingIn: _state.api.loggingIn,
		server: _state.api.server,
		servers: _state.api.servers,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLoginClick: (username, password) => dispatch(requestLogin(username, password)),
		changeServer: (server) => dispatch(changeServer(server)),
		changeLanguage: (lang) => dispatch(changeLanguage(lang)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Login")(Login));
