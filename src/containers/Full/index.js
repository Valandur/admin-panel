import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect, NavLink } from "react-router-dom"
import { Sidebar, Menu, Image } from "semantic-ui-react"

import Dashboard from "../../views/Dashboard"
import Chat from "../../views/Chat"
import Commands from "../../views/Commands"
import Map from "../../views/Map"
import Worlds from "../../views/Worlds"
import Players from "../../views/Players"
import Entities from "../../views/Entities"
import TileEntities from "../../views/TileEntities"
import Operations from "../../views/Operations"
import Plugins from "../../views/Plugins"
import Settings from "../../views/Settings"

import { requestLogout } from "../../actions"

const logoutStyle = { position: "absolute", bottom: 0, width: "100%" }

class Full extends Component {
	render() {
		return (
			<Sidebar.Pushable style={{ height: "100vh" }}>
        <Sidebar as={Menu} visible={true} vertical secondary>
					<Menu.Item header as={NavLink} to="/">
						<Image size="small" centered src="/img/logo.png" />
					</Menu.Item>

					<Menu.Item name="dashboard" as={NavLink} to="/dashboard">
						<i className="icon-speedometer"></i> &nbsp; &nbsp; Dashboard
					</Menu.Item>

					<Menu.Item name="chat" as={NavLink} to="/chat">
						<i className="fa fa-comments"></i>&nbsp; &nbsp; Chat
					</Menu.Item>

					<Menu.Item name="commands" as={NavLink} to="/commands">
						<i className="fa fa-terminal"></i>&nbsp; &nbsp; Commands
					</Menu.Item>

					<Menu.Item name="map" as={NavLink} to="/map">
						<i className="fa fa-map"></i>&nbsp; &nbsp; Map
					</Menu.Item>

					<Menu.Item name="worlds" as={NavLink} to="/worlds">
						<i className="fa fa-globe"></i>&nbsp; &nbsp; Worlds
					</Menu.Item>

					<Menu.Item name="players" as={NavLink} to="/players">
						<i className="fa fa-users"></i>&nbsp; &nbsp; Players
					</Menu.Item>

					<Menu.Item name="entities" as={NavLink} to="/entities">
						<i className="fa fa-paw"></i>&nbsp; &nbsp; Entities
					</Menu.Item>

					<Menu.Item name="tile-entities" as={NavLink} to="/tile-entities">
						<i className="fa fa-puzzle-piece"></i>&nbsp; &nbsp; Tile Entities
					</Menu.Item>

					<Menu.Item name="operations" as={NavLink} to="/operations">
						<i className="fa fa-th-large"></i>&nbsp; &nbsp; Block Operations
					</Menu.Item>

					<Menu.Item name="plugins" as={NavLink} to="/plugins">
						<i className="fa fa-plug"></i>&nbsp; &nbsp; Plugins
					</Menu.Item>

					<Menu.Item name="settings" as={NavLink} to="/settings">
						<i className="fa fa-cog"></i>&nbsp; &nbsp; Server Settings
					</Menu.Item>
					
					<Menu.Item name="logout" onClick={this.props.requestLogout} style={logoutStyle}>
						<i className="fa fa-sign-out"></i>&nbsp; &nbsp; Logout
					</Menu.Item>
				</Sidebar>

				<Sidebar.Pusher style={{ width: "calc(100% - 260px)", height: "100vh", overflowY: "scroll" }}>
					<Switch>
						<Route path="/dashboard" name="Dashboard" component={Dashboard} />
						<Route path="/chat" name="Chat" component={Chat} />
						<Route path="/commands" name="Commands" component={Commands} />
						<Route path="/map" name="Map" component={Map} />
						<Route path="/worlds" name="Worlds" component={Worlds} />
						<Route path="/players" name="Players" component={Players} />
						<Route path="/entities" name="Entities" component={Entities} />
						<Route path="/tile-entities" name="Tile Entities" component={TileEntities} />
						<Route path="/operations" name="Block Operations" component={Operations} />
						<Route path="/plugins" name="Plugins" component={Plugins} />
						<Route path="/settings" name="Settings" component={Settings} />
						
						<Redirect from="/" to="/dashboard" />
					</Switch>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogout: () => {
			dispatch(requestLogout())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Full)
