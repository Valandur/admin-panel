import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect, NavLink } from "react-router-dom"
import { Sidebar, Menu, Image, Icon, Dropdown, Loader, Message, Progress } from "semantic-ui-react"
import { translate } from "react-i18next"
import Loadable from "react-loadable"
import _ from "lodash"

import { requestServlets, requestLogout, changeLanguage } from "../../actions"
import { requestStats, } from "../../actions/dashboard"

const Loading = (props) => {
	if (props.error) {
		return <Message negative>
			<Message.Header>Apologies, there was an error!</Message.Header>
		</Message>
	} else if (props.timedOut) {
		return <Loader size="big">This is taking a while...</Loader>;
	} else if (props.pastDelay) {
		return <Loader size="big">Loading...</Loader>
	} else {
		return null;
	}
}

const Dashboard = Loadable({ loader: () => import("../../views/Dashboard"), loading: Loading })
const Chat = Loadable({ loader: () => import("../../views/Chat"), loading: Loading })
const Commands = Loadable({ loader: () => import("../../views/Commands"), loading: Loading })
const Map = Loadable({ loader: () => import("../../views/Map"), loading: Loading })
const Worlds = Loadable({ loader: () => import("../../views/Worlds"), loading: Loading })
const Players = Loadable({ loader: () => import("../../views/Players"), loading: Loading })
const Entities = Loadable({ loader: () => import("../../views/Entities"), loading: Loading })
const TileEntities = Loadable({ loader: () => import("../../views/TileEntities"), loading: Loading })
const BlockOperations = Loadable({ loader: () => import("../../views/BlockOperations"), loading: Loading })
const Plugins = Loadable({ loader: () => import("../../views/Plugins"), loading: Loading })
const ServerSettings = Loadable({ loader: () => import("../../views/ServerSettings"), loading: Loading })

const Nucleus = Loadable({ loader: () => import("../Integrations/Nucleus"), loading: Loading })
const HuskyCrates = Loadable({ loader: () => import("../Integrations/HuskyCrates"), loading: Loading })
const WebBooks = Loadable({ loader: () => import("../Integrations/WebBooks"), loading: Loading })
const MMCRestrict = Loadable({ loader: () => import("../Integrations/MMCRestrict"), loading: Loading })
const MMCTickets = Loadable({ loader: () => import("../Integrations/MMCTickets"), loading: Loading })
const UniversalMarket = Loadable({ loader: () => import("../Integrations/UniversalMarket"), loading: Loading })

const apiLink = "/docs"
const spongeLink = "https://forums.spongepowered.org/t/web-api-v4-adminpanel-restful-web-server-now-with-screenshots/15717"
const docsLink = "https://github.com/Valandur/Web-API/blob/master/docs/INDEX.md"
const issuesLink = "https://github.com/Valandur/Web-API/issues"

class Full extends Component {

	constructor(props) {
		super(props)

		this.state = {
			show: true
		}

		this.toggleSidebar = this.toggleSidebar.bind(this)
	}
	
	componentDidMount() {
		this.props.requestServlets();
		this.props.requestStats();
		
		this.interval = setInterval(this.props.requestStats, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	toggleSidebar() {
		this.setState({
			show: !this.state.show
		})
	}

	render() {
		const _t = this.props.t

		return <div>
			<Menu fluid stackable size="small" style={{ marginBottom: 0 }}>
				<Menu.Item as="a" header style={{ minWidth: "259px" }}>
					<Image size="small" centered src="./img/logo.png" />
				</Menu.Item>

				<Menu.Item name="logout" onClick={this.toggleSidebar}>
					<Icon name="sidebar" size="large" />
				</Menu.Item>

				<Menu.Item>
					<Dropdown
						selection
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
				</Menu.Item>

				<Menu.Menu position="right">
					<Menu.Item>
						<a href={apiLink} target="_blank" rel="noopener noreferrer">
							<Icon name="external" />{_t("APILink")}
						</a>
					</Menu.Item>
					<Menu.Item>
						<a href={spongeLink} target="_blank" rel="noopener noreferrer">
							<Icon name="external" />{_t("SpongeLink")}
						</a>
					</Menu.Item>
					<Menu.Item>
						<a href={docsLink} target="_blank" rel="noopener noreferrer">
							<Icon name="external" />{_t("DocsLink")}
						</a>
					</Menu.Item>
					<Menu.Item>
						<a href={issuesLink} target="_blank" rel="noopener noreferrer">
							<Icon name="external" />{_t("IssuesLink")}
						</a>
					</Menu.Item>

					<Menu.Item name="logout" onClick={this.props.requestLogout}>
						<Icon name="log out" /> {_t("Logout")}
					</Menu.Item>
				</Menu.Menu>
			</Menu>

			<Sidebar.Pushable style={{ height: "calc(100vh - 67px)" }}>
				<Sidebar
						vertical
						as={Menu}
						animation="push"
						visible={this.state.show}>

					{this.props.cpu.length ?
						<Menu.Item name="load">
							<Progress
								percent={_.last(this.props.cpu).value * 100}
								progress="percent"
								precision={1}
								label={_t("CPU")}
								color="blue"
								size="small"
							/>
							<Progress
								percent={_.last(this.props.memory).value * 100}
								progress="percent"
								precision={1}
								label={_t("Memory")}
								color="red"
								size="small"
							/>
							<Progress
								percent={_.last(this.props.disk).value * 100}
								progress="percent"
								precision={1}
								label={_t("Disk")}
								color="green"
								size="small"
							/>
						</Menu.Item>
					: null}

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
						</Menu.Item>}

					{ this.props.servlets.mmcrestrict &&
						<Menu.Item>
							<Menu.Header>{_t("MMCRestrict")}</Menu.Header>

							<Menu.Menu>
								<Menu.Item name="mmc-restrict" as={NavLink} to="/mmcrestrict/items">
									<Icon name="ban" /> {_t("MMCRestrictRestrictedItems")}
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>}

					{ this.props.servlets.mmctickets &&
						<Menu.Item>
							<Menu.Header>{_t("MMCTickets")}</Menu.Header>

							<Menu.Menu>
								<Menu.Item name="mmc-tickets" as={NavLink} to="/mmctickets/tickets">
									<Icon name="ticket" /> {_t("Tickets")}
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>}

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
						</Menu.Item>}

					{ this.props.servlets.webbooks &&
						<Menu.Item>
							<Menu.Header>{_t("WebBooks")}</Menu.Header>

							<Menu.Menu>
								<Menu.Item name="web-books" as={NavLink} to="/webbooks/books">
									<Icon name="book" /> {_t("Books")}
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>}

					{ this.props.servlets.universalmarket &&
						<Menu.Item>
							<Menu.Header>{_t("UniversalMarket")}</Menu.Header>

							<Menu.Menu>
								<Menu.Item name="um-items" as={NavLink} to="/universalmarket/items">
									<Icon name="shopping cart" /> {_t("Items")}
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>}
				</Sidebar>

				<Sidebar.Pusher
						style={{
							width: this.state.show ? "calc(100% - 260px)" : "100%",
							transition: "width 0.5s",
							height: "100%",
							overflowY: "scroll",
							float: "right"
						}}>
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
						<Route path="/mmcrestrict" name="MMCRestrict" component={MMCRestrict} />
						<Route path="/mmctickets" name="MMCTickets" component={MMCTickets} />
						<Route path="/nucleus" name="Nucleus" component={Nucleus} />
						<Route path="/webbooks" name="WebBooks" component={WebBooks} />
						<Route path="/universalmarket" name="UniversalMarket" component={UniversalMarket} />
						
						<Redirect from="/" to="/dashboard" />
					</Switch>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {
		servlets: _state.api.servlets,
		lang: _state.api.lang,
		cpu: _state.dashboard.cpu,
		memory: _state.dashboard.memory,
		disk: _state.dashboard.disk,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogout: () => dispatch(requestLogout()),
		requestServlets: () => dispatch(requestServlets()),
		requestStats: () => dispatch(requestStats()),
		changeLanguage: (lang) => dispatch(changeLanguage(lang)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Main")(Full))
