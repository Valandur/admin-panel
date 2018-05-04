import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import {
	Button,
	Label,
	Loader,
	Message,
	Modal,
	Segment,
	Tab
} from "semantic-ui-react"

import { AppAction } from "../../actions"
import {
	requestPluginConfig,
	requestPluginConfigSave
} from "../../actions/plugin"
import { JSON_EDITOR_MODE, ReactJSONEditor } from "../../components/JsonEditor"
import { PluginContainer } from "../../fetch"
import {
	AppState,
	DataViewRef,
	PermissionTree,
	PreferenceKey
} from "../../types"

import { setPreference } from "../../actions/preferences"
import { checkPermissions } from "../../components/Util"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("plugin", "id", true)

interface OwnProps {
	configs: {
		[x: string]: any
	}
	hideNote: boolean
	perms?: PermissionTree
}

interface Props extends OwnProps, reactI18Next.InjectedTranslateProps {
	requestPluginConfig: (id: string) => AppAction
	requestPluginConfigSave: (
		id: string,
		plugin: PluginContainer,
		configs: any
	) => AppAction
	doHideNote: () => AppAction
}

interface OwnState {
	activeTab?: number
	modal: boolean
	plugin?: PluginContainer
	configs?: {
		[x: string]: any
	}
}

class Plugins extends React.Component<Props, OwnState> {
	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.save = this.save.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.configs) {
			this.setState({
				configs: JSON.parse(JSON.stringify(nextProps.configs))
			})
		}
	}

	showDetails(plugin: PluginContainer, view: DataViewRef<PluginContainer>) {
		this.setState({
			modal: true,
			plugin: plugin,
			configs: undefined
		})
		this.props.requestPluginConfig(plugin.id)
	}

	toggle(tab: number) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			})
		}
	}

	handleChange(name: string, json: any) {
		this.setState({
			configs: {
				[name]: json
			}
		})
	}

	save() {
		const plugin = this.state.plugin
		if (!plugin) {
			return
		}
		this.props.requestPluginConfigSave(plugin.id, plugin, this.state.configs)
		this.toggleModal()
	}

	render() {
		const _t = this.props.t

		return (
			<>
				{!this.props.hideNote && (
					<Segment basic>
						<Message warning onDismiss={() => this.props.doHideNote()}>
							<Message.Header>{_t("WarnTitle")}</Message.Header>
							<p>
								<Trans i18nKey="WarnText">
									Web-API automatically makes a backup of your configs before
									saving them, but caution is still advised when changing config
									values. To apply your new configs use{" "}
									<b>/sponge plugins reload</b>. Plugins are not required to
									implement the reload event, so this might not work for all
									plugins. Use a server restart if required.
								</Trans>
							</p>
						</Message>
					</Segment>
				)}

				<DataView
					icon="plug"
					title={_t("Plugins")}
					fields={{
						id: _t("Id"),
						name: _t("Name"),
						version: _t("Version")
					}}
					actions={(plugin: PluginContainer, view) => (
						<>
							{checkPermissions(
								this.props.perms,
								["plugin", "config", "modify", plugin.id]
							) && (
								<Button
									color="blue"
									onClick={e => this.showDetails(plugin, view)}
								>
									{_t("Details")}
								</Button>
							)}
						</>
					)}
				/>

				{this.renderModal()}
			</>
		)
	}

	renderModal() {
		if (!this.state.plugin) {
			return
		}

		const _t = this.props.t

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
			>
				<Modal.Header>
					{this.state.plugin.name}{" "}
					<Label color="blue">{this.state.plugin.version}</Label>
				</Modal.Header>
				<Modal.Content>
					{this.state.configs ? (
						<Tab
							panes={Object.keys(this.state.configs).map(name => ({
								menuItem: name,
								render: () => (
									<ReactJSONEditor
										key={name}
										mode={JSON_EDITOR_MODE.tree}
										json={this.props.configs[name]}
										onChange={newConf => this.handleChange(name, newConf)}
										width="100%"
										height="calc(100vh - 20em)"
									/>
								)
							}))}
						/>
					) : (
						<Loader />
					)}
				</Modal.Content>
				<Modal.Actions>
					<Button primary content={_t("Save")} onClick={this.save} />
					<Button content={_t("Cancel")} onClick={this.toggleModal} />
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapStateToProps = (state: AppState): OwnProps => {
	return {
		configs: state.plugin.configs,
		hideNote: state.preferences.hidePluginsNote,
		perms: state.api.permissions
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestPluginConfig: (id: string): AppAction =>
			dispatch(requestPluginConfig(id)),
		requestPluginConfigSave: (
			id: string,
			plugin: PluginContainer,
			configs: any
		): AppAction => dispatch(requestPluginConfigSave(id, plugin, configs)),
		doHideNote: (): AppAction =>
			dispatch(setPreference(PreferenceKey.hidePluginsNote, true))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Plugins")(Plugins)
)
