import React, { Component } from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import moment from "moment"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("history/chat", "timestamp")


class Chat extends Component {

	render() {
		const _t = this.props.t

		return <DataView
			title={_t("Messages")}
			icon="comments"
			filterTitle={_t("FilterMessages")}
			fields={{
				timestamp: {
					label: _t("Timestamp"),
					view: msg => moment.unix(msg.timestamp).calendar(),
				},
				sender: {
					label: _t("Sender"),
					filter: true,
					view: msg => msg.sender.name,
				},
				message: _t("Message"),
			}}
		/>
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Chat")(Chat));
