import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Items from "../../views/Integrations/UniversalMarket/Items"

class UniversalMarket extends Component {
	render() {
		return (
			<Switch>
				<Route path="/universalmarket/items" component={Items} />
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

export default connect(mapStateToProps, mapDispatchToProps)(UniversalMarket)
