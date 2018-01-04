import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Tickets from "../../views/Integrations/MMCTickets/Tickets"

class MMCTickets extends Component {
	render() {
		return (
			<Switch>
				<Route path="/mmctickets/tickets" component={Tickets} />
			</Switch>
		)
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MMCTickets)
