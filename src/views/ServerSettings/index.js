import React, { Component } from "react"
import { connect } from "react-redux"
import { Segment, Message } from "semantic-ui-react"
import { translate } from "react-i18next"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("info/properties", "key")

class ServerSettings extends Component {

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
		const _t = this.props.t
		
		return <div>
			<Segment basic>
				<Message negative>
					<Message.Header>{_t("WIPTitle")}</Message.Header>
					<p>{_t("WIPText")}</p>
				</Message>
			</Segment>

			<DataView
				canEdit
				icon="cogs"
				title={_t("ServerSettings")}
				fields={{
					key: {
						label: _t("Key"),
					},
					value: {
						label: _t("Value"),
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

export default connect(mapStateToProps, mapDispatchToProps)(translate("ServerSettings")(ServerSettings))
