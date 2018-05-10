import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import {
	Button,
	Form,
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
	requestPluginConfigSave,
	requestPluginToggle
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

const noDetailsIds = ["forge", "minecraft", "spongeapi", "mcp"]
const noToggleIds = [
	"forge",
	"minecraft",
	"sponge",
	"spongeapi",
	"mcp",
	"webapi"
]
const typeOptions = [
	{
		value: PluginContainer.TypeEnum.Forge.toString(),
		text: "Forge"
	},
	{
		value: PluginContainer.TypeEnum.Minecraft.toString(),
		text: "Minecraft"
	},
	{
		value: PluginContainer.TypeEnum.Sponge.toString(),
		text: "Sponge"
	},
	{
		value: PluginContainer.TypeEnum.Unknown.toString(),
		text: "Unknown"
	}
]
const stateOptions = [
	{
		value: PluginContainer.StateEnum.Loaded.toString(),
		text: "Loaded"
	},
	{
		value: PluginContainer.StateEnum.Unloaded.toString(),
		text: "Unloaded"
	},
	{
		value: PluginContainer.StateEnum.WillBeLoaded.toString(),
		text: "Will be loaded"
	},
	{
		value: PluginContainer.StateEnum.WillBeUnloaded.toString(),
		text: "Will be unloaded"
	}
]

interface OwnProps {
	configs: {
		[x: string]: any
	}
	hideNote: boolean
	perms?: PermissionTree
}

interface Props extends OwnProps, reactI18Next.InjectedTranslateProps {
	requestPluginToggle: (id: string) => AppAction
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

	typeToColor(plugin: PluginContainer) {
		return plugin.type === PluginContainer.TypeEnum.Forge
			? "red"
			: plugin.type === PluginContainer.TypeEnum.Minecraft
				? "blue"
				: plugin.type === PluginContainer.TypeEnum.Sponge
					? "yellow"
					: "grey"
	}

	stateToColor(plugin: PluginContainer, invert: boolean = false) {
		return plugin.state === PluginContainer.StateEnum.Loaded
			? invert
				? "red"
				: "green"
			: plugin.state === PluginContainer.StateEnum.Unloaded
				? invert
					? "green"
					: "red"
				: "yellow"
	}

	togglePlugin(plugin: PluginContainer) {
		this.props.requestPluginToggle(plugin.id)
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
					filterTitle={_t("Filter plugins")}
					fields={{
						id: _t("Id"),
						name: _t("Name"),
						version: _t("Version"),
						type: {
							label: _t("Type"),
							view: (p: PluginContainer) => (
								<Label color={this.typeToColor(p)}>{p.type.toString()}</Label>
							),
							options: typeOptions,
							filter: true
						},
						state: {
							label: _t("State"),
							view: (plugin: PluginContainer) => (
								<Label color={this.stateToColor(plugin)}>
									{_t(plugin.state.toString())}
								</Label>
							),
							options: stateOptions,
							filter: true
						},
						filter: {
							view: false,
							filter: view => (
								<Form.Input
									type="text"
									name="filter"
									label="Name"
									placeholder="Name"
									onChange={view.handleChange}
									value={view.value}
								/>
							),
							filterValue: (p: PluginContainer) => p.id + " " + p.name
						}
					}}
					actions={(plugin: PluginContainer, view) => (
						<>
							{noDetailsIds.indexOf(plugin.id) === -1 &&
								checkPermissions(this.props.perms, [
									"plugin",
									"config",
									"modify",
									plugin.id
								]) && (
									<Button
										color="blue"
										onClick={e => this.showDetails(plugin, view)}
									>
										{_t("Configs")}
									</Button>
								)}
							{noToggleIds.indexOf(plugin.id) === -1 &&
								checkPermissions(this.props.perms, [
									"plugin",
									"config",
									"toggle",
									plugin.id
								]) && (
									<Button
										color={this.stateToColor(plugin, true)}
										onClick={() => this.togglePlugin(plugin)}
									>
										{plugin.state === PluginContainer.StateEnum.Loaded
											? _t("Unload")
											: plugin.state === PluginContainer.StateEnum.Unloaded
												? _t("Load")
												: _t("Cancel")}
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
			return null
		}

		const _t = this.props.t

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
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
		requestPluginToggle: (id: string): AppAction =>
			dispatch(requestPluginToggle(id)),
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
