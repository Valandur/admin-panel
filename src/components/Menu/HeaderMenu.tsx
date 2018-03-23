import * as React from "react"
import { translate } from "react-i18next"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { Dispatch } from "redux"
import { Dropdown, Icon, Image, Menu, MenuItemProps } from "semantic-ui-react"

import {
	AppAction, changeLanguage, ChangeLanguageAction, changeServer, ChangeServerAction, LogoutRequestAction,
	requestLogout
} from "../../actions"
import { AppState, Lang, langArray, Server } from "../../types"
import { handleChange, HandleChangeFunc } from "../Util"

const apiLink = "/docs"
const spongeLink = "https://forums.spongepowered.org/t/" +
	"web-api-provides-an-admin-panel-and-api-for-your-minecraft-server/15709"
const docsLink = "https://github.com/Valandur/Web-API/blob/master/docs/INDEX.md"
const issuesLink = "https://github.com/Valandur/admin-panel/issues"
const imageUrl = require("../../assets/logo.png")

export interface AppProps extends reactI18Next.InjectedTranslateProps {
	lang: Lang
	server: Server
	servers: Server[]
	changeLanguage: (lang: string) => ChangeLanguageAction
	changeServer: (server: Server) => ChangeServerAction
	requestLogout: () => LogoutRequestAction
	toggleSidebar?: (event: React.MouseEvent<HTMLElement>, data: MenuItemProps) => void
}

class HeaderMenu extends React.Component<AppProps> {

	handleChange: HandleChangeFunc

	constructor(props: AppProps) {
		super(props)

		this.handleChangeServer = this.handleChangeServer.bind(this)
		this.handleChange = handleChange.bind(this, this.handleChangeServer)
	}

	handleChangeServer(key: string, value: string) {
		if (key === "server") {
			const server = this.props.servers.find(s => s.apiUrl === value)
			if (server == null) {
				return
			}
			this.props.changeServer(server)
		} else {
			this.setState({ [key]: value })
		}
	}

	render() {
		const _t = this.props.t

		return (
			<Menu fluid stackable size="small" style={{ marginBottom: 0 }}>
				<Menu.Item as={NavLink} header style={{ minWidth: "259px" }} to="/dashboard">
					<Image size="small" centered src={imageUrl} />
				</Menu.Item>

				<Menu.Item name="sidebar" onClick={this.props.toggleSidebar}>
					<Icon name="sidebar" size="large" />
				</Menu.Item>

				<Menu.Item>
					<Dropdown
						selection
						placeholder={_t("ChangeLanguage")}
						options={langArray}
						value={this.props.lang}
						onChange={(e, data) => { if (typeof data.value === "string") { this.props.changeLanguage(data.value) } }}
					/>
				</Menu.Item>

				{/*this.props.servers.length > 1 ?
					<Menu.Item>
						<Dropdown
							selection
							name="server"
							placeholder={_t("Server")}
							value={this.props.server ? this.props.server.apiUrl : undefined}
							onChange={this.handleChange}
							options={this.props.servers.map(s => ({ value: s.apiUrl, text: s.name }))}
						/>
					</Menu.Item>
				: null*/}

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
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		lang: state.api.lang,
		server: state.api.server,
		servers: state.api.servers,
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestLogout: () => dispatch(requestLogout()),
		changeLanguage: (lang: Lang) => dispatch(changeLanguage(lang)),
		changeServer: (server: Server) => dispatch(changeServer(server)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Menu")(HeaderMenu))
