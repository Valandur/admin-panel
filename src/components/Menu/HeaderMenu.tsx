import * as React from "react"
import { translate } from "react-i18next"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { Dispatch } from "redux"
import { Dropdown, Icon, Image, Menu, MenuItemProps } from "semantic-ui-react"

import { AppAction, changeServer, requestLogout } from "../../actions"
import { AppState, Lang, Server } from "../../types"
import { handleChange, HandleChangeFunc } from "../Util"

const apiLink = "/docs"
const spongeLink =
	"https://forums.spongepowered.org/t/" +
	"web-api-provides-an-admin-panel-and-api-for-your-minecraft-server/15709"
const docsLink = "https://github.com/Valandur/Web-API/blob/master/docs/INDEX.md"
const issuesLink = "https://github.com/Valandur/admin-panel/issues"
const imageUrl = require("../../assets/logo.png")

export interface Props extends reactI18Next.InjectedTranslateProps {
	lang: Lang
	server: Server
	servers: Server[]
	showSidebar: boolean
	changeServer: (server: Server) => AppAction
	requestLogout: () => AppAction
	toggleSidebar?: (
		event: React.MouseEvent<HTMLElement>,
		data: MenuItemProps
	) => void
}

class HeaderMenu extends React.Component<Props> {
	handleChange: HandleChangeFunc

	constructor(props: Props) {
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
				<Menu.Item
					as={NavLink}
					header
					style={{ minWidth: "259px" }}
					to="/dashboard"
				>
					<Image size="small" centered src={imageUrl} />
				</Menu.Item>

				<Menu.Item name="sidebar" onClick={this.props.toggleSidebar}>
					<Icon name="sidebar" size="large" />
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
					<Dropdown item icon="setting">
						<Dropdown.Menu>
							<Dropdown.Header content="Links" />
							<Dropdown.Item
								href={apiLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t("APILink")}
							</Dropdown.Item>
							<Dropdown.Item
								href={spongeLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t("SpongeLink")}
							</Dropdown.Item>
							<Dropdown.Item
								href={docsLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t("DocsLink")}
							</Dropdown.Item>
							<Dropdown.Item
								href={issuesLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="external" />
								{_t("IssuesLink")}
							</Dropdown.Item>

							<Dropdown.Header content="User" />
							<Dropdown.Item as={NavLink} to="/preferences">
								<Icon name="setting" /> {_t("Preferences")}
							</Dropdown.Item>
							<Dropdown.Item name="logout" onClick={this.props.requestLogout}>
								<Icon name="log out" /> {_t("Logout")}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Menu>
			</Menu>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		lang: state.preferences.lang,
		server: state.api.server,
		servers: state.api.servers
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestLogout: (): AppAction => dispatch(requestLogout()),
		changeServer: (server: Server): AppAction => dispatch(changeServer(server))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Menu")(HeaderMenu)
)
