import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Label, Message, Modal, Segment, Tab } from "semantic-ui-react"

import { AppAction } from "../../actions"
import { PluginConfigRequestAction, PluginConfigSaveRequestAction, requestPluginConfig, requestPluginConfigSave,
	setPluginConfig, SetPluginConfigAction } from "../../actions/plugin"
import { ReactJSONEditor } from "../../components/JsonEditor"
import { PluginContainer } from "../../fetch"
import { AppState, DataViewRef } from "../../types"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("plugin", "id", true)

interface Props extends reactI18Next.InjectedTranslateProps {
	configs: {
		[x: string]: any
	}
	requestPluginConfig: (id: string) => PluginConfigRequestAction
	setPluginConfig: (id: string, conf: any) => SetPluginConfigAction
	requestPluginConfigSave: (id: string, plugin: PluginContainer, configs: any) => PluginConfigSaveRequestAction
}

interface OwnState {
	activeTab?: number
	modal: boolean
	plugin?: PluginContainer
}

class Plugins extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false,
		}

		this.toggleModal = this.toggleModal.bind(this)
		this.save = this.save.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	showDetails(plugin: PluginContainer, view: DataViewRef<PluginContainer>) {
		this.setState({
			modal: true,
			plugin: plugin,
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
		this.props.setPluginConfig(name, json)
	}

	save() {
		const plugin = this.state.plugin
		if (!plugin) {
			return
		}
		this.props.requestPluginConfigSave(plugin.id, plugin, this.props.configs)
		this.toggleModal()
	}

	render() {
		const _t = this.props.t

		return (
			<div>
				<Segment basic>
					<Message warning>
						<Message.Header>{_t("WarnTitle")}</Message.Header>
						<p>{_t("WarnText")}</p>
					</Message>
				</Segment>
				<DataView
					icon="plug"
					title={_t("Plugins")}
					fields={{
						id: _t("Id"),
						name: _t("Name"),
						version: _t("Version"),
					}}
					actions={(plugin: PluginContainer, view) => <div>
						<Button
							color="blue"
							onClick={e => this.showDetails(plugin, view)}
						>
							{_t("Details")}
						</Button>
					</div>}
				/>

				{this.renderModal()}
			</div>
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
					<Tab
						panes={
							_.map(this.props.configs, (conf, name) => ({
								menuItem: name,
								render: () =>
									<ReactJSONEditor
										key={name}
										json={conf}
										onChange={newConf => this.handleChange(name, newConf)}
										width="100%"
										height="calc(100vh - 20em)"
									/>
							}))
						}
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button primary content={_t("Save")} onClick={this.save} />
					<Button content={_t("Cancel")} onClick={this.toggleModal} />
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		configs: state.plugin.configs,
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestPluginConfig: (id: string) => dispatch(requestPluginConfig(id)),
		setPluginConfig: (id: string, conf: any) => dispatch(setPluginConfig(id, conf)),
		requestPluginConfigSave: (id: string, plugin: PluginContainer, configs: any) =>
			dispatch(requestPluginConfigSave(id, plugin, configs)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Plugins")(Plugins))
