import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { Sidebar, Menu, Icon, Progress } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import { requestServlets } from "../../actions"

import { checkPermissions } from "../../components/Util"

class SidebarMenu extends Component {

	constructor(props) {
		super(props)

		this.renderMenuItem = this.renderMenuItem.bind(this)
	}

	componentDidMount() {
		this.props.requestServlets();
	}

	render() {
		const _t = this.props.t
		const views = this.props.views

		return <Sidebar
				vertical
				as={Menu}
				animation="push"
				visible={this.props.show}>

			{this.props.cpu.length > 0 &&
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
				</Menu.Item>}

			{views.map(this.renderMenuItem)}
		</Sidebar>
	}

	renderMenuItem(view) {
		if (view.perms && !checkPermissions(this.props.perms, view.perms))
			return null;

		if (!view.views) {
			return <Menu.Item
					as={NavLink}
					key={view.path}
					to={view.path}>
				<Icon name={view.icon} /> {this.props.t(view.title)}
			</Menu.Item>
		}

		return <Menu.Item key={view.path}>
			<Menu.Header>{this.props.t(view.title)}</Menu.Header>
			<Menu.Menu>
				{view.views.map(this.renderMenuItem)}
			</Menu.Menu>
		</Menu.Item>
	}
}

const mapStateToProps = (state) => {
	return {
		cpu: state.dashboard.cpu,
		memory: state.dashboard.memory,
		disk: state.dashboard.disk,
		servlets: state.api.servlets,
		perms: state.api.permissions,

		// We include the pathname so this component updates when the path changes
		path: state.router.location.pathname,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestServlets: () => dispatch(requestServlets()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Menu")(SidebarMenu))
