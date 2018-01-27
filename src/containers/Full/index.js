import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect } from "react-router-dom"
import { Button, Sidebar, Segment, Loader, Message } from "semantic-ui-react"
import { translate } from "react-i18next"
import Loadable from "react-loadable"
import Raven from "raven-js"

import { requestStats } from "../../actions/dashboard"

import SidebarMenu from "../../components/Menu/SidebarMenu"
import HeaderMenu from "../../components/Menu/HeaderMenu"

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

const baseIssueUrl = "https://github.com/Valandur/admin-panel/issues/new?"

class Full extends Component {

	constructor(props) {
		super(props)

		this.state = {
			show: true
		}

		this.toggleSidebar = this.toggleSidebar.bind(this)
	}
	
	componentDidMount() {
		this.props.requestStats();
		
		this.interval = setInterval(this.props.requestStats, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	componentDidCatch(error, info) {
		Raven.captureException(error, { extra: info });
		this.setState({ hasError: true, error: error.toString(), stack: info.componentStack });
	}

	toggleSidebar() {
		this.setState({
			show: !this.state.show
		})
	}

	getIssueUrl() {
		return baseIssueUrl + "labels=bug" + 
			"&title=" + encodeURIComponent("[Issue] " + this.state.error) + 
			"&body=" + encodeURIComponent("<Say a little about what happend>\n\n" + 
				this.state.error + "\n\nStacktrace:" + this.state.stack) + 
			"&assignee=Valandur"
	}

	render() {
		const _t = this.props.t

		return <div>
			<HeaderMenu
				toggleSidebar={this.toggleSidebar}
			/>

			<Sidebar.Pushable style={{ height: "calc(100vh - 67px)" }}>
				<SidebarMenu show={this.state.show} />

				<Sidebar.Pusher
						style={{
							width: this.state.show ? "calc(100% - 260px)" : "100%",
							transition: "width 0.5s",
							height: "100%",
							overflowY: "scroll",
							float: "right"
						}}>
					{this.state.hasError ?
						<Segment basic>
							<Message negative size="huge">
								<Message.Header>{_t("ErrorHeader")}</Message.Header>
								<p>{this.state.error}</p>
								<p>{this.state.stack}</p>
							</Message>
							<Message positive size="huge">
								<Message.Header>{_t("FixHeader")}</Message.Header>
								<p>{_t("FixText")}</p>
								<Button
									positive
									as="a"
									size="large"
									icon="github"
									content={_t("SubmitIssue")}
									href={this.getIssueUrl()}
									target="_blank"
									rel="noopener noreferrer"
								/>
							</Message>
						</Segment>
					:
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
							<Route path="/universalmarket" name="UniversalMarket" component={UniversalMarket} />
							<Route path="/webbooks" name="WebBooks" component={WebBooks} />
							
							<Redirect from="/" to="/dashboard" />
						</Switch>
					}
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestStats: () => dispatch(requestStats()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Main")(Full))
