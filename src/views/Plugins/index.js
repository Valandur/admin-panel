import React, { Component } from 'react'
import { connect } from "react-redux"
import {
	Segment, Button, Modal,
	Label, Tab, TextArea, Message
} from "semantic-ui-react"
import _ from 'lodash'

import { requestPluginConfig } from "../../actions/plugin"

import ConfigTree from "../../components/ConfigTree"
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

	render() {
		return <div>
			<Segment basic>
				<Message warning>
					<Message.Header>This section of the admin panel is not yet completed</Message.Header>
					<p>Changing the config files of plugins does not do anything yet!</p>
				</Message>
			</Segment>
			<DataView
				title="Installed Plugins"
				icon="plug"
				fields={{
					id: "Id",
					name: "Name",
					version: "Version",
				}}
				actions={(plugin, view) => <div>
					<Button
							color="blue"
							onClick={e => this.showDetails(plugin, view)}>
						Details
					</Button>
				</div>}
			/>

			{this.renderModal()}
		</div>
	}

	renderModal() {
		return <Modal open={this.state.modal} onClose={this.toggleModal}>
			<Modal.Header>
				{this.state.plugin.name}{" "}
				<Label color="primary">{this.state.plugin.version}</Label>
			</Modal.Header>
			<Modal.Content>
				<Tab panes={
					_.map(this.props.configs, (conf, name) => ({
						menuItem: name,
						render: () => <ConfigTree conf={conf} />
					}))
				} />
			</Modal.Content>
		</Modal>
	}
}

const mapStateToProps = (_state) => {
	const state = _state.plugin

	return {
		plugins: state.plugins,
		configs: state.configs,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestPluginConfig: (id) => dispatch(requestPluginConfig(id)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
