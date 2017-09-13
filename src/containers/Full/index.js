import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect, NavLink } from "react-router-dom"
import { Sidebar, Menu, Image, Icon } from "semantic-ui-react"

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

import Nucleus from "../Nucleus"
import HuskyCrates from "../HuskyCrates"
import WebBooks from "../WebBooks"
import MMCTickets from "../MMCTickets"

import { requestLogout } from "../../actions"

class Full extends Component {
	render() {
		return (
			<Sidebar.Pushable style={{ minHeight: "100vh" }}>
				<Sidebar as={Menu} visible={true} vertical secondary style={{ width: "220px" }}>

					<Menu.Item header as={NavLink} to="/">
						<Image size="small" centered src="/img/logo.png" />
					</Menu.Item>

					<Menu.Item name="dashboard" as={NavLink} to="/dashboard">
						<Icon name="dashboard" /> Dashboard
					</Menu.Item>

					<Menu.Item name="chat" as={NavLink} to="/chat">
						<Icon name="comments" /> Chat
					</Menu.Item>

					<Menu.Item name="commands" as={NavLink} to="/commands">
						<Icon name="terminal" /> Commands
					</Menu.Item>

					<Menu.Item name="map" as={NavLink} to="/map">
						<Icon name="map" /> Map
					</Menu.Item>

					<Menu.Item name="worlds" as={NavLink} to="/worlds">
						<Icon name="globe" /> Worlds
					</Menu.Item>

					<Menu.Item name="players" as={NavLink} to="/players">
						<Icon name="users" /> Players
					</Menu.Item>

					<Menu.Item name="entities" as={NavLink} to="/entities">
						<Icon name="paw" /> Entities
					</Menu.Item>

					<Menu.Item name="tile-entities" as={NavLink} to="/tile-entities">
						<Icon name="puzzle" /> Tile Entities
					</Menu.Item>

					<Menu.Item name="operations" as={NavLink} to="/operations">
						<Icon className="fa-th-large" /> Block Ops
					</Menu.Item>

					<Menu.Item name="plugins" as={NavLink} to="/plugins">
						<Icon name="plug" /> Plugins
					</Menu.Item>

					<Menu.Item name="settings" as={NavLink} to="/settings">
						<Icon name="cogs" /> Server Settings
					</Menu.Item>

					{ this.props.servlets.husky &&
					<Menu.Item>
						<Menu.Header>Husky Crates</Menu.Header>

						<Menu.Menu>
							<Menu.Item name="husky-crates" as={NavLink} to="/husky/crates">
								<Icon name="archive" /> Crates
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					}

					{ this.props.servlets.mmctickets &&
					<Menu.Item>
						<Menu.Header>MMCTickets</Menu.Header>

						<Menu.Menu>
							<Menu.Item name="mmc-tickets" as={NavLink} to="/mmctickets/tickets">
								<Icon name="ticket" /> Tickets
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					}

					{ this.props.servlets.nucleus &&
					<Menu.Item>
						<Menu.Header>Nucleus</Menu.Header>

						<Menu.Menu>
							<Menu.Item name="nucleus-kits" as={NavLink} to="/nucleus/kits">
								<Icon name="wrench" /> Kits
							</Menu.Item>

							<Menu.Item name="nucleus-jails" as={NavLink} to="/nucleus/jails">
								<Icon name="bars" rotated="clockwise" /> Jails
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					}

					{ this.props.servlets.webbook &&
					<Menu.Item>
						<Menu.Header>Web Books</Menu.Header>

						<Menu.Menu>
							<Menu.Item name="web-books" as={NavLink} to="/webbooks/books">
								<Icon name="book" /> Books
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					}

					<Menu.Item name="logout" onClick={this.props.requestLogout}>
						<Icon name="log out" /> Logout
					</Menu.Item>
				</Sidebar>

				<Sidebar.Pusher style={{ width: "calc(100% - 220px)", height: "100vh", overflowY: "scroll" }}>
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

						<Route path="/husky" name="HuskyCrates" component={HuskyCrates} />
						<Route path="/mmctickets" name="MMCTickets" component={MMCTickets} />
						<Route path="/nucleus" name="Nucleus" component={Nucleus} />
						<Route path="/webbooks" name="WebBooks" component={WebBooks} />
						
						<Redirect from="/" to="/dashboard" />
					</Switch>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}
}

const mapStateToProps = (_state) => {
	return {
		servlets: _state.api.servlets,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogout: () => {
			dispatch(requestLogout())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Full)
