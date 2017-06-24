import React, { Component } from 'react'
import { connect } from "react-redux"
import { Redirect } from 'react-router-dom'

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
			return <Redirect to={{ pathname: '/', state: { from: this.props.location} }} />
		}

		return (
			<form onSubmit={this.handleLogin}>
				<div className="app flex-row align-items-center">
					<div className="container">
						<div className="row justify-content-center">

							<div className="col-md-6">
								<div className="card-group mb-0">
									<div className="card p-5">
										<div className="card-block">
											
												<h1>Login</h1>
												<p className="text-muted">Sign In to your account</p>
												<div className="input-group mb-3">
													<span className="input-group-addon"><i className="icon-user"></i></span>
													<input
														type="text"
														name="username"
														className="form-control"
														placeholder="Username"
														value={this.state.username}
														onChange={this.handleChange}
													/>
												</div>
												<div className="input-group mb-4">
													<span className="input-group-addon"><i className="icon-lock"></i></span>
													<input
														type="password"
														name="password"
														className="form-control"
														placeholder="Password"
														value={this.state.password}
														onChange={this.handleChange}
													/>
												</div>
												<div className="row">
													<div className="col-6">
														<button type="submit" className="btn btn-primary px-4">Login</button>
													</div>
												</div>
										
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</form>
		);
	}
}

const mapStateToProps = (_state) => {
	return {
		ok: _state.api.loggedIn,
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
