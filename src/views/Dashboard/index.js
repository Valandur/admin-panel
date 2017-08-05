import React, { Component } from 'react'
import { connect } from "react-redux"
import { Grid, Segment, Card } from "semantic-ui-react"
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

		let playerState = "blue";
		if (this.props.data) {
			const ratio = this.props.data.players / this.props.data.maxPlayers;
			if (ratio > 0.95)
				playerState = "red";
			else if (ratio > 0.8)
				playerState = "yellow";
			else
				playerState = "green";
		}

		let tpsState = "blue";
		if (this.props.data) {
			if (this.props.data.tps >= 19.5)
				tpsState = "green";
			else if (this.props.data.tps >= 15)
				tpsState = "yellow";
			else
				tpsState = "red";
		}

		return (
			<Segment basic>

				<Grid columns={4} stackable doubling>
      		
      		<Grid.Column>
						<Card color={playerState}>
							<Card.Content>
								<Card.Header>
									{this.props.data.players}/{this.props.data.maxPlayers}
								</Card.Header>
								<Card.Description>
									Online players
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color={tpsState}>
							<Card.Content>
								<Card.Header>
									{this.props.data.tps}
								</Card.Header>
								<Card.Description>
									Current TPS
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.address}
								</Card.Header>
								<Card.Description>
									Address
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.onlineMode ? "Yes" : "No"}
								</Card.Header>
								<Card.Description>
									Online mode
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.uptimeTicks}
								</Card.Header>
								<Card.Description>
									Uptime ticks
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.game.version}
								</Card.Header>
								<Card.Description>
									Minecraft Version
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.api.version}
								</Card.Header>
								<Card.Description>
									API Version
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

					<Grid.Column>
						<Card color="blue">
							<Card.Content>
								<Card.Header>
									{this.props.data.implementation.version}
								</Card.Header>
								<Card.Description>
									Implementation Version
								</Card.Description>
							</Card.Content>
						</Card>
					</Grid.Column>

				</Grid>

				<Card style={{ width: "100%", height: "50vh" }}>
					<Card.Content>
						<Card.Header>
							Online players & Average TPS
						</Card.Header>
					</Card.Content>
					<div style={{ width: "100%", height: "100%", padding: "1em" }}>
						<Line data={line} options={options} />
					</div>
				</Card>

			</Segment>
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
