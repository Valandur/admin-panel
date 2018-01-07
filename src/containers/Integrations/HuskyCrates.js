import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Crates from "../../views/Integrations/HuskyCrates/Crates"

class HuskyCrates extends Component {
	render() {
		return (
			<Switch>
				<Route path="/husky/crates" component={Crates} />
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

export default connect(mapStateToProps, mapDispatchToProps)(HuskyCrates)
