import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route, Redirect } from "react-router-dom"
import { Button, Sidebar, Segment, Message } from "semantic-ui-react"
import { translate } from "react-i18next"
import Raven from "raven-js"

import { requestStats } from "../../actions/dashboard"

import SidebarMenu from "../../components/Menu/SidebarMenu"
import HeaderMenu from "../../components/Menu/HeaderMenu"
import { checkPermissions } from "../../components/Util"
import views from "./Views"

const baseIssueUrl = "https://github.com/Valandur/admin-panel/issues/new?"


class Full extends Component {

	constructor(props) {
		super(props)

		this.state = {
			show: true
		}

		this.toggleSidebar = this.toggleSidebar.bind(this)
		this.renderRoute = this.renderRoute.bind(this)
	}
	
	componentDidMount() {
		if (checkPermissions(this.props.perms, ["info", "stats"])) {
			this.props.requestStats();
			this.interval = setInterval(this.props.requestStats, 10000);
		}
	}

	componentWillUnmount() {
		if (this.interval) clearInterval(this.interval);
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
			"&title=" + encodeURIComponent("[Issue] <Add a short description>") + 
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
				<SidebarMenu show={this.state.show} views={views} />

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
							{views.map(this.renderRoute)}

							<Redirect from="/" to="/dashboard" />
						</Switch>
					}
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</div>
	}

	renderRoute(view) {
		if (view.perms && !checkPermissions(this.props.perms, view.perms)) {
			return <Redirect key={view.path} from={view.path} to="/dashboard" />
		}
		if (view.component) {
			return <Route key={view.path} path={view.path} component={view.component} />
		}
		return view.views.map(this.renderRoute)
	}
}

const mapStateToProps = (state) => {
	return {
		perms: state.api.permissions,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestStats: () => dispatch(requestStats()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Main")(Full))
