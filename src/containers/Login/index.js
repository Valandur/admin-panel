import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { Grid, Header, Form, Button, Segment } from "semantic-ui-react"

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

		return (
			<Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            <span style={{color: "black"}}>Web-API</span> Admin Panel
          </Header>
          <Form size="large" loading={this.props.loggingIn}>
            <Segment>
              <Form.Input
              	fluid icon="user" iconPosition="left" placeholder="Username"
              	name="username" value={this.state.username} onChange={this.handleChange}
              />
              <Form.Input
              	fluid icon="lock" iconPosition="left" placeholder="Password" type="password"
              	name="password" value={this.state.password} onChange={this.handleChange}
              />

              <Button color="blue" fluid size="large" onClick={this.handleLogin}>
              	Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
		);
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
