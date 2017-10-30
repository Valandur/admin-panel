import React, { Component } from 'react'
import { connect } from "react-redux"
import { Segment, Message } from "semantic-ui-react"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("info/properties", "key")

class Settings extends Component {

	handleEdit(prop) {
		this.props.editProperty(prop);
	}

	handleChange(event, prop) {
		this.props.setProperty(prop, event.target.value);
	}

	handleSave(prop) {
		this.props.requestSaveProperty(prop);
	}

	render() {
		return <div>
			<Segment basic>
				<Message negative>
					<Message.Header>This section of the admin panel is not yet completed</Message.Header>
					<p>Changing any of these settings has no effect on the server!</p>
				</Message>
			</Segment>

			<DataView
				canEdit
				title="Server Properties"
				icon="cogs"
				fields={{
					key: {
						label: "Key",
					},
					value: {
						label: "Value",
						edit: true,
					}
				}}
			/>
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
