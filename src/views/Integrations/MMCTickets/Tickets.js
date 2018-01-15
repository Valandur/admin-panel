import React, { Component } from "react"
import { connect } from "react-redux"
import moment from "moment"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("mmctickets/ticket", "id")

const ticketStates = [{
	value: "Open",
	text: "Open",
}, {
	value: "Claimed",
	text: "Claimed",
}, {
	value: "Held",
	text: "Held",
}, {
	value: "Closed",
	text: "Closed"
}];

class Tickets extends Component {

	render() {
		return <DataView
			canEdit
			title="Tickets"
			icon="ticket"
			filterTitle="Filter tickets"
			fields={{
				id: "Id",
				timestamp: {
					label: "Timestamp",
					view: (ticket) => moment.unix(ticket.timestamp).calendar(),
				},
				status: {
					label: "Status",
					edit: true,
					options: ticketStates,
				},
				"sender.name": {
					label: "Sender",
					filter: true,
				},
				"staff.name": {
					label: "Assigned",
					filter: true,
				},
				message: {
					label: "Message",
					filter: true,
					wide: true,
				},
				comment: {
					label: "Comment",
					edit: true,
					filter: true,
					wide: true,
				}
			}}
		/>
	}
}

const mapStateToProps = (endpoint) => (_state) => {
	return {}
}

const mapDispatchToProps = (endpoint) => (dispatch) => {
	return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
