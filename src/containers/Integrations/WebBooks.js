import React, { Component } from "react"
import { connect } from "react-redux"
import { Switch, Route } from "react-router-dom"

import Books from "../../views/Integrations/WebBooks/Books"

class WebBooks extends Component {
	render() {
		return (
			<Switch>
				<Route path="/webbooks/books" component={Books} />
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

export default connect(mapStateToProps, mapDispatchToProps)(WebBooks)
