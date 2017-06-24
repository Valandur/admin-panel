import React, { Component } from 'react'
import { connect } from "react-redux"
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap'

import { requestLogout } from "../../actions"

class Header extends Component {

	constructor(props) {
		super(props);

		this.state = {
			dropdownOpen: false
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	sidebarToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-hidden');
	}

	sidebarMinimize(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-minimized');
	}

	mobileSidebarToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-mobile-show');
	}

	asideToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('aside-menu-hidden');
	}

	render() {
		return (
			<header className="app-header navbar">
				<button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
				{ // eslint-disable-next-line
				} <a className="navbar-brand" href="/"></a>
				<ul className="nav navbar-nav d-md-down-none">
					<li className="nav-item">
						<button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarMinimize}>&#9776;</button>
					</li>
				</ul>
				<ul className="nav navbar-nav ml-auto">
					<li className="nav-item" style={{ paddingRight: "1em" }}>
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
							<button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
								<span className="d-md-down-none">
									{this.props.user ? this.props.user.username : "User"}
								</span>
							</button>

							<DropdownMenu className="dropdown-menu-right">
								<DropdownItem onClick={this.props.requestLogout}><i className="fa fa-lock"></i> Logout</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</li>
				</ul>
			</header>
		)
	}
}

const mapStateToProps = (_state) => {
	return {
		user: _state.api.user,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogout: () => dispatch(requestLogout()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
