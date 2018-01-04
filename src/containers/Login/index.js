import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { Grid, Header, Form, Button, Segment } from "semantic-ui-react"
import { translate } from "react-i18next"

import { requestLogin } from "../../actions"

class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: "",
			password: ""
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		})
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
				style={{height: "100vh"}}
				verticalAlign="middle">
			<Grid.Column style={{ maxWidth: 450 }}>
				<Header as="h2" color="blue" textAlign="center">
					<span style={{color: "black"}}>Web-API</span> Admin Panel
				</Header>
				<Form size="large" loading={this.props.loggingIn}>
					<Segment>
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
		loggingIn: _state.api.loggingIn,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLoginClick: (username, password) => {
			dispatch(requestLogin(username, password))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Login")(Login));
