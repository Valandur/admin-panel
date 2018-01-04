import React, { Component } from 'react'
import { connect } from "react-redux"
import { Segment, Button, Modal, Label, Tab, Message } from "semantic-ui-react"
import JsonEditor from "@dr-kobros/react-jsoneditor"
import { translate } from "react-i18next"
import _ from "lodash"

import {
	requestPluginConfig,
	setPluginConfig,
	requestPluginConfigSave
} from "../../actions/plugin"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("plugin", "id", true)

class Plugins extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeTab: false,
			modal: false,
			plugin: {},
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.save = this.save.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	showDetails(plugin, view) {
		this.setState({
			modal: true,
			plugin: plugin,
		})
		this.props.requestPluginConfig(plugin.id);
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	handleChange(name, json) {
		this.props.setPluginConfig(name, json)
	}

	save() {
		const plugin = this.state.plugin;
		this.props.requestPluginConfigSave(plugin.id, plugin, this.props.configs);
		this.toggleModal();
	}

	render() {
		const _t = this.props.t

		return <div>
			<Segment basic>
				<Message warning>
					<Message.Header>{_t("WIPTitle")}</Message.Header>
					<p>{_t("WIPText")}</p>
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
				actions={(plugin, view) => <div>
					<Button
							color="blue"
							onClick={e => this.showDetails(plugin, view)}>
						{_t("Details")}
					</Button>
				</div>}
			/>

			{this.renderModal()}
		</div>
	}

	renderModal() {
		const _t = this.props.t

		return <Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen">
			<Modal.Header>
				{this.state.plugin.name}{" "}
				<Label color="primary">{this.state.plugin.version}</Label>
			</Modal.Header>
			<Modal.Content>
				<Tab panes={
					_.map(this.props.configs, (conf, name) => ({
						menuItem: name,
						render: () =>
							<JsonEditor
								key={name}
								value={conf}
								onChange={conf => this.handleChange(name, conf)}
								width="100%"
								height="calc(100vh - 20em)"
							/>
					}))
				} />
			</Modal.Content>
			<Modal.Actions>
				<Button primary content={_t("Save")} onClick={this.save} />
				<Button content={_t("Cancel")} onClick={this.toggleModal} />
			</Modal.Actions>
		</Modal>
	}
}

const mapStateToProps = (_state) => {
	return {
		configs: _state.plugin.configs,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestPluginConfig: (id) => dispatch(requestPluginConfig(id)),
		setPluginConfig: (id, conf) => dispatch(setPluginConfig(id, conf)),
		requestPluginConfigSave: (id, plugin, configs) => 
			dispatch(requestPluginConfigSave(id, plugin, configs)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Plugins")(Plugins));
