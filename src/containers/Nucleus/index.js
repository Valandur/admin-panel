import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Kits from "../../views/Nucleus/Kits"
import Jails from "../../views/Nucleus/Jails"

class Nucleus extends Component {
	render() {
		return (
			<Switch>
				<Route path="/nucleus/kits" name="Kits" component={Kits} />
				<Route path="/nucleus/jails" name="Jails" component={Jails} />
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
