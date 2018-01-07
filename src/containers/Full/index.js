import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect, NavLink } from "react-router-dom"
import { Sidebar, Menu, Image, Icon, Dropdown } from "semantic-ui-react"
import { translate } from "react-i18next"

import Dashboard from "../../views/Dashboard"
import Chat from "../../views/Chat"
import Commands from "../../views/Commands"
import Map from "../../views/Map"
import Worlds from "../../views/Worlds"
import Players from "../../views/Players"
import Entities from "../../views/Entities"
import TileEntities from "../../views/TileEntities"
import BlockOperations from "../../views/BlockOperations"
import Plugins from "../../views/Plugins"
import ServerSettings from "../../views/ServerSettings"

import Nucleus from "../Integrations/Nucleus"
import HuskyCrates from "../Integrations/HuskyCrates"
import WebBooks from "../Integrations/WebBooks"
import MMCTickets from "../Integrations/MMCTickets"

import { requestServlets, requestLogout, changeLanguage } from "../../actions"

class Full extends Component {
	
	componentDidMount() {
		this.props.requestServlets();
	}

	render() {
		const _t = this.props.t

		return <Sidebar.Pushable style={{ minHeight: "100vh" }}>
			<Sidebar as={Menu} visible={true} vertical secondary style={{ width: "220px" }}>

				<Menu.Item name="logo" header as={NavLink} to="/">
					<Image size="small" centered src="./img/logo.png" />
				</Menu.Item>

				<Menu.Item name="settings">
					<Dropdown
						fluid selection
						placeholder="Change language"
						options={[{
							text: "English",
							value: "en",
						},{
							text: "Deutsch",
							value: "de",
						}]}
						value={this.props.lang}
						onChange={(e, data) => this.props.changeLanguage(data.value)}
					/>
				</Menu.Item>

				<Menu.Item name="dashboard" as={NavLink} to="/dashboard">
					<Icon name="dashboard" /> {_t("Dashboard")}
				</Menu.Item>

				<Menu.Item name="chat" as={NavLink} to="/chat">
					<Icon name="comments" /> {_t("Chat")}
				</Menu.Item>

				<Menu.Item name="commands" as={NavLink} to="/commands">
					<Icon name="terminal" /> {_t("Commands")}
				</Menu.Item>

				<Menu.Item name="map" as={NavLink} to="/map">
					<Icon name="map" /> {_t("Map")}
				</Menu.Item>

				<Menu.Item name="worlds" as={NavLink} to="/worlds">
					<Icon name="globe" /> {_t("Worlds")}
				</Menu.Item>

				<Menu.Item name="players" as={NavLink} to="/players">
					<Icon name="users" /> {_t("Players")}
				</Menu.Item>

				<Menu.Item name="entities" as={NavLink} to="/entities">
					<Icon name="paw" /> {_t("Entities")}
				</Menu.Item>

				<Menu.Item name="tile-entities" as={NavLink} to="/tile-entities">
					<Icon name="puzzle" /> {_t("TileEntities")}
				</Menu.Item>

				<Menu.Item name="block-operations" as={NavLink} to="/block-operations">
					<Icon className="fa-th-large" /> {_t("BlockOperations")}
				</Menu.Item>

				<Menu.Item name="plugins" as={NavLink} to="/plugins">
					<Icon name="plug" /> {_t("Plugins")}
				</Menu.Item>

				<Menu.Item name="server-settings" as={NavLink} to="/server-settings">
					<Icon name="cogs" /> {_t("ServerSettings")}
				</Menu.Item>

				{ this.props.servlets.husky &&
				<Menu.Item>
					<Menu.Header>{_t("HuskyCrates")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="husky-crates" as={NavLink} to="/husky/crates">
							<Icon name="archive" /> {_t("Crates")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				}

				{ this.props.servlets.mmctickets &&
				<Menu.Item>
					<Menu.Header>{_t("MMCTickets")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="mmc-tickets" as={NavLink} to="/mmctickets/tickets">
							<Icon name="ticket" /> {_t("Tickets")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				}

				{ this.props.servlets.nucleus &&
				<Menu.Item>
					<Menu.Header>{_t("Nucleus")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="nucleus-kits" as={NavLink} to="/nucleus/kits">
							<Icon name="wrench" /> {_t("Kits")}
						</Menu.Item>

						<Menu.Item name="nucleus-jails" as={NavLink} to="/nucleus/jails">
							<Icon name="bars" rotated="clockwise" /> {_t("Jails")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				}

				{ this.props.servlets.webbooks &&
				<Menu.Item>
					<Menu.Header>{_t("WebBooks")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="web-books" as={NavLink} to="/webbooks/books">
							<Icon name="book" /> {_t("Books")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				}

				<Menu.Item name="logout" onClick={this.props.requestLogout}>
					<Icon name="log out" /> {_t("Logout")}
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
					<Route path="/block-operations" name="Block Operations" component={BlockOperations} />
					<Route path="/plugins" name="Plugins" component={Plugins} />
					<Route path="/server-settings" name="Server Settings" component={ServerSettings} />

					<Route path="/husky" name="HuskyCrates" component={HuskyCrates} />
					<Route path="/mmctickets" name="MMCTickets" component={MMCTickets} />
					<Route path="/nucleus" name="Nucleus" component={Nucleus} />
					<Route path="/webbooks" name="WebBooks" component={WebBooks} />
					
					<Redirect from="/" to="/dashboard" />
				</Switch>
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	}
}

const mapStateToProps = (_state) => {
	return {
		servlets: _state.api.servlets,
		lang: _state.api.lang,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogout: () => dispatch(requestLogout()),
		requestServlets: () => dispatch(requestServlets()),
		changeLanguage: (lang) => dispatch(changeLanguage(lang)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Main")(Full))
