import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Kits from "../../views/Integrations/Nucleus/Kits"
import Jails from "../../views/Integrations/Nucleus/Jails"

class Nucleus extends Component {
	render() {
		return (
			<Switch>
				<Route path="/nucleus/jails" component={Jails} />
				<Route path="/nucleus/kits" component={Kits} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Nucleus)
