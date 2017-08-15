import React, { Component } from 'react'
import { connect } from "react-redux"
import { push } from "react-router-redux"
import { Segment, Table, Button, Header, Modal, Label, Tab, TextArea, Icon } from "semantic-ui-react"
import _ from 'lodash'

import { requestPlugins, requestPluginConfig } from "../../actions/plugin"

class Plugins extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeTab: false,
			modal: false,
		};

		this.toggleModal = this.toggleModal.bind(this);
	}

	componentWillMount() {
		this.props.requestPlugins();
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	showDetails(plugin) {
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
		return (
			<Segment basic>
				<Header>
					<Icon name="plug" fitted /> Installed Plugins
				</Header>
				<Table striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Id</Table.HeaderCell>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Version</Table.HeaderCell>
							<Table.HeaderCell>Config</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(this.props.plugins, plugin =>
							<Table.Row key={plugin.id}>
								<Table.Cell>{plugin.id}</Table.Cell>
								<Table.Cell>{plugin.name}</Table.Cell>
								<Table.Cell>{plugin.version}</Table.Cell>
								<Table.Cell>
									<Button color="blue" onClick={e => this.showDetails(plugin)}>
										<Icon name="edit" /> Edit
									</Button>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>

				{this.state.plugin &&
				<Modal open={this.state.modal} onClose={this.toggleModal}>
					<Modal.Header>
						{this.state.plugin.name}{" "}
						<Label color="primary">{this.state.plugin.version}</Label>
					</Modal.Header>
					<Modal.Content>
						<Tab panes={
							_.map(this.props.configs, (conf, name) => ({
								menuItem: name,
								render: () => <Tab.Pane>
									<TextArea autoHeight value={JSON.stringify(conf, null, 2)} style={{width:"100%"}}>
									</TextArea>
								</Tab.Pane>
							}))
						} />
					</Modal.Content>
				</Modal>
				}
			</Segment>
		)
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
		requestPlugins: () => dispatch(requestPlugins(true)),
		requestPluginConfig: (id) => dispatch(requestPluginConfig(id)),
		push: (url) => dispatch(push(url)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
