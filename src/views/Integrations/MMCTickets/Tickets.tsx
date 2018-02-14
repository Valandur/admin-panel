import React, { Component } from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import moment from "moment"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("mmc-tickets/ticket", "id")


class Tickets extends Component {

	constructor(props) {
		super(props)

		const _t = props.t

		this.ticketStates = [{
			value: "Open",
			text: _t("Open"),
		}, {
			value: "Claimed",
			text: _t("Claimed"),
		}, {
			value: "Held",
			text: _t("Held"),
		}, {
			value: "Closed",
			text: _t("Closed"),
		}];
	}

	render() {
		const _t = this.props.t

		return <DataView
			canEdit
			icon="ticket"
			title={_t("Tickets")}
			filterTitle={_t("FilterTickets")}
			fields={{
				id: _t("Id"),
				timestamp: {
					label: _t("Timestamp"),
					view: (ticket) => moment.unix(ticket.timestamp).calendar(),
				},
				status: {
					label: _t("Status"),
					edit: true,
					options: this.ticketStates,
				},
				"sender.name": {
					label: _t("Sender"),
					filter: true,
				},
				"staff.name": {
					label: _t("Assigned"),
					filter: true,
				},
				message: {
					label: _t("Message"),
					filter: true,
					wide: true,
				},
				comment: {
					label: _t("Comment"),
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


export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.MMCTickets")(Tickets)
);
