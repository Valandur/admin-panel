import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { Sidebar, Menu, Icon, Progress } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import { requestServlets } from "../../actions"

class SidebarMenu extends Component {

	componentDidMount() {
		this.props.requestServlets();
	}

	render() {
		const _t = this.props.t

		return <Sidebar
				vertical
				as={Menu}
				animation="push"
				visible={this.props.show}>

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
							<Icon name="archive" /> {_t("HuskyCratesCrates")}
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
							<Icon name="ticket" /> {_t("MMCTicketsTickets")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>}

			{ this.props.servlets.nucleus &&
				<Menu.Item>
					<Menu.Header>{_t("Nucleus")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="nucleus-jails" as={NavLink} to="/nucleus/jails">
							<Icon name="bars" rotated="clockwise" /> {_t("NucleusJails")}
						</Menu.Item>

						<Menu.Item name="nucleus-kits" as={NavLink} to="/nucleus/kits">
							<Icon name="wrench" /> {_t("NucleusKits")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>}

			{ this.props.servlets.universalmarket &&
			<Menu.Item>
				<Menu.Header>{_t("UniversalMarket")}</Menu.Header>

				<Menu.Menu>
					<Menu.Item name="um-items" as={NavLink} to="/universalmarket/items">
						<Icon name="shopping cart" /> {_t("UniversalMarketItems")}
					</Menu.Item>
				</Menu.Menu>
			</Menu.Item>}

			{ this.props.servlets.webbooks &&
				<Menu.Item>
					<Menu.Header>{_t("WebBooks")}</Menu.Header>

					<Menu.Menu>
						<Menu.Item name="web-books" as={NavLink} to="/webbooks/books">
							<Icon name="book" /> {_t("WebBooksBooks")}
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>}
		</Sidebar>
	}
}

const mapStateToProps = (state) => {
	return {
		cpu: state.dashboard.cpu,
		memory: state.dashboard.memory,
		disk: state.dashboard.disk,
		servlets: state.api.servlets,

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
