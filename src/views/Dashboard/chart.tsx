export default _t => ({
	// Line for the info chart
	lineInfo: {
		datasets: [{
			label: _t("AverageTPS"),
			fill: false,
			backgroundColor: "rgb(219, 40, 40)",
			borderColor: "rgb(219, 40, 40)",
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "tps",
		}, {
			label: _t("OnlinePlayers"),
			fill: false,
			backgroundColor: "rgb(33, 133, 208)",
			borderColor: "rgb(33, 133, 208)",
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "players",
		}]
	},

	// Options for the info chart
	optionsInfo: {
		maintainAspectRatio: false,
		legend: {
			position: "bottom",
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
					labelString: _t("NumTPS"),
				},
			},{
				type: "linear",
				id: "players",
				gridLines: {
					drawOnChartArea: false,
				},
				ticks: {
					beginAtZero: true,
					stepSize: 1,
					min: 0,
				},
				scaleLabel: {
					display: true,
					labelString: _t("NumPlayers"),
				},
				position: "right",
			}]
		},
	},

	// Line for the stats chart
	lineStats: {
		datasets: [{
			label: _t("CPULoad"),
			fill: false,
			backgroundColor: "rgb(33, 133, 208)",
			borderColor: "rgb(33, 133, 208)",
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "load",
		}, {
			label: _t("MemoryLoad"),
			fill: false,
			backgroundColor: "rgb(219, 40, 40)",
			borderColor: "rgb(219, 40, 40)",
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "load",
		}, {
			label: _t("DiskUsage"),
			fill: false,
			backgroundColor: "rgb(33, 186, 69)",
			borderColor: "rgb(33, 186, 69)",
			pointRadius: 0,
			pointHitRadius: 10,
			xAxisID: "time",
			yAxisID: "load",
		}]
	},

	// Options for the stats chart
	optionsStats: {
		maintainAspectRatio: false,
		legend: {
			position: "bottom",
		},
		tooltips: {
			mode: "label",
			callbacks: {
				label: function(tooltipItem, data) {
					return " " + data.datasets[tooltipItem.datasetIndex].label + ": " + 
						tooltipItem.yLabel.toFixed(2) + "%";
				}
			}
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
				id: "load",
				ticks: {
					beginAtZero: true,
					max: 100,
					min: 0,
				},
				scaleLabel: {
					display: true,
					labelString: _t("Load"),
				},
			}]
		},
	},
})
