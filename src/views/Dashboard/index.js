import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardBlock } from "reactstrap"

import { requestInfo } from "../../actions"

class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.props.requestInfo();
	}

	componentDidMount() {
		this.interval = setInterval(this.props.requestInfo, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		let playerState = "primary";
		if (this.props.data) {
			const ratio = this.props.data.players / this.props.data.maxPlayers;
			if (ratio > 0.95)
				playerState = "danger";
			else if (ratio > 0.8)
				playerState = "warning";
			else
				playerState = "success";
		}

		let tpsState = "primary";
		if (this.props.data) {
			if (this.props.data.tps >= 19.5)
				tpsState = "success";
			else if (this.props.data.tps >= 15)
				tpsState = "warning";
			else
				tpsState = "danger";
		}

		return (
			<div className="animated fadeIn">
				{ this.props.data ?
					<Row>

						<Col xs={6} lg={3}>
							<Card inverse={true} color={playerState}>
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.players}/{this.props.data.maxPlayers}</h4>
									<p>Online players</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color={tpsState}>
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.tps}</h4>
									<p>Current TPS</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="info">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.address}</h4>
									<p>Address</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="info">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.onlineMode ? "Yes" : "No"}</h4>
									<p>Online mode</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="primary">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.uptimeTicks}</h4>
									<p>Uptime ticks</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="primary">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.game.version}</h4>
									<p>Minecraft Version</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="primary">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.api.version}</h4>
									<p>API Version</p>
								</CardBlock>
							</Card>
						</Col>

						<Col xs={6} lg={3}>
							<Card inverse={true} color="primary">
								<CardBlock className="pb-0">
									<h4 className="mb-0">{this.props.data.implementation.version}</h4>
									<p>Implementation Version</p>
								</CardBlock>
							</Card>
						</Col>

					</Row>
				: null}
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.dashboard

	return {
		data: state.data
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestInfo: () => {
			dispatch(requestInfo())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
