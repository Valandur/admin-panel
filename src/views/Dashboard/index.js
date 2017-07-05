import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardHeader, CardBlock } from "reactstrap"
import { Line } from "react-chartjs-2";
import _ from "lodash"

import { requestInfo, requestTpsInfo, requestPlayerInfo } from "../../actions/dashboard"

const line = {
	datasets: [
		{
			label: 'Average TPS',
			fill: false,
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "tps",
		},
		{
			label: 'Online players',
			fill: false,
			backgroundColor: 'rgb(54, 162, 235)',
			borderColor: 'rgb(54, 162, 235)',
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "players",
		}
	]
};

const options = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},
	scales: {
		xAxes: [{
			id: "time",
			type: "time",
			time: {
				displayFormats: {
						second: "HH:mm:ss",
						minute: "HH:mm",
						hour: "HH:mm",
						day: "DD.MM.YYYY",
				},
				tooltipFormat: "DD.MM.YYYY HH:mm:ss"
			}
		}],
		yAxes: [{
			type: "linear",
			id: "tps",
			ticks: {
				beginAtZero: true,
				max: 20,
				min: 0,
			},
			scaleLabel: {
				display: true,
				labelString: "TPS",
			},
		},{
			type: "linear",
			id: "players",
			gridLines: {
				drawOnChartArea: false,
			},
			ticks: {
				beginAtZero: true,
				min: 0,
			},
			scaleLabel: {
				display: true,
				labelString: "Players",
			},
			position: "right",
		}]
	},
};

class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.requestData = this.requestData.bind(this);
	}

	requestData() {
		this.props.requestInfo();
		this.props.requestTpsInfo();
		this.props.requestPlayerInfo();
	}

	componentDidMount() {
		this.requestData();
		
		this.interval = setInterval(this.requestData, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		if (!this.props.data)
			return null;

		line.datasets[0].data = _.map(this.props.tps, tps => ({
			x: new Date(tps.timestamp * 1000),
			y: tps.value,
		}))
		line.datasets[1].data = _.map(this.props.players, pls => ({
			x: new Date(pls.timestamp * 1000),
			y: pls.value,
		}))

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
				<Row>

					<Col xs={12}>
						<Card>
							<CardHeader>
								Online players & Average TPS
							</CardHeader>
							<CardBlock>
								<div className="chart-wrapper">
									<Line data={line} options={options} height={400} />
								</div>
							</CardBlock>
						</Card>
					</Col>

				</Row>
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.dashboard

	return {
		data: state.data,
		tps: state.tps,
		players: state.players,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestInfo: () => dispatch(requestInfo()),
		requestTpsInfo: () => dispatch(requestTpsInfo()),
		requestPlayerInfo: () => dispatch(requestPlayerInfo()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
