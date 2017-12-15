import React, { Component } from "react"
import { connect } from "react-redux"
import moment from "moment"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("history/chat", "timestamp")


class Chat extends Component {

	render() {
		return <DataView
			title="Messages"
			icon="comments"
			filterTitle="Filter messages"
			fields={{
				timestamp: {
					label: "Timestamp",
					view: msg => moment.unix(msg.timestamp).calendar(),
				},
				sender: {
					label: "Sender",
					filter: true,
					view: msg => msg.sender.name,
				},
				message: "Message",
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
