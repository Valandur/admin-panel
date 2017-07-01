import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	handleClick(e) {
		e.preventDefault();
		e.target.parentElement.classList.toggle('open');
	}

	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
	}

	// secondLevelActive(routeName) {
	//   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
	// }

	render() {
		return (
			<div className="sidebar">
				<nav className="sidebar-nav">
					<ul className="nav">
					
						<li className="nav-item">
							<NavLink to={'/dashboard'} className="nav-link" activeClassName="active">
								<i className="icon-speedometer"></i> Dashboard
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/chat'} className="nav-link" activeClassName="active">
								<i className="fa fa-comments"></i> Chat
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/commands'} className="nav-link" activeClassName="active">
								<i className="fa fa-terminal"></i> Commands
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/worlds'} className="nav-link" activeClassName="active">
								<i className="fa fa-globe"></i> Worlds
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/players'} className="nav-link" activeClassName="active">
								<i className="fa fa-users"></i> Players
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/entities'} className="nav-link" activeClassName="active">
								<i className="fa fa-paw"></i> Entities
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/tile-entities'} className="nav-link" activeClassName="active">
								<i className="fa fa-puzzle-piece"></i> Tile Entities
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/plugins'} className="nav-link" activeClassName="active">
								<i className="fa fa-plug"></i> Plugins
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink to={'/settings'} className="nav-link" activeClassName="active">
								<i className="fa fa-cog"></i> Server Settings
							</NavLink>
						</li>
						
					</ul>
				</nav>
			</div>
		)
	}
}

export default Sidebar;
