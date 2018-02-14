import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "semantic-ui-react"
import { translate } from "react-i18next"
import moment from "moment"
import _ from "lodash"

import Autosuggest from "../../components/Autosuggest"
import { requestList } from "../../actions/dataview"
import { requestExecute } from "../../actions/command"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("history/cmd", "timestamp")


class Commands extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		this.getSuggestions = this.getSuggestions.bind(this);
	}

	getSuggestions(newValue) {
		const val = newValue.trim().toLowerCase();
		const parts = val.split(" ");

		if (parts.length > 2)
			return [];

		let cmds = this.props.commands.filter(cmd => {
			if (parts.length > 1)
				return cmd.name.toLowerCase() === parts[0]
			else
				return _.startsWith(cmd.name.toLowerCase(), parts[0])
		});

		if (cmds.length > 0 && cmds[0].name.toLowerCase() === parts[0]) {
			let subs = cmds[0].usage.replace(/(\[.*?])/g, "").split("|")
			subs = _.map(subs, sub => sub.toLowerCase().trim())
			subs = _.filter(subs, sub => sub !== "/" + cmds[0].name.toLowerCase() + " ?")

			if (parts.length > 1 && !_.isEmpty(parts[1])) {
				subs = subs.filter(sub =>
					_.startsWith(sub, parts[1])
				);
			}
			cmds = _.map(subs, sub => ({
				name: sub,
				base: cmds[0].name,
				isSub: true,
			}))
		}

		return _.map(cmds, cmd => {
			if (cmd.isSub) {
				return {
					value: cmd.base + " " + cmd.name + " ",
					content: <div style={{ padding: 10 }}>
						<b>{cmd.base}</b> <i style={{fontSize:"90%"}}>{cmd.name}</i>
					</div>
				}
			}

			return {
				value: cmd.name + " ",
				content: <div style={{ padding: 10 }}>
					<b>{cmd.name}</b> <i style={{fontSize:"90%"}}>{cmd.usage}</i><br />
					{cmd.description}<br />
				</div>
			}
		});
	}

	componentDidMount() {
		this.props.requestCommands();
	}

	render() {
		const _t = this.props.t
		
		return <DataView
			title={_t("Commands")}
			icon="terminal"
			createTitle={_t("ExecuteCommand")}
			createButton={_t("Execute")}
			filterTitle={_t("FilterCommands")}
			fields={{
				timestamp: {
					label: _t("Timestamp"),
					view: cmd => moment.unix(cmd.timestamp).calendar(),
				},
				source: {
					label: _t("Source"),
					filter: true,
					filterValue: cmd => cmd.cause.causes ? (cmd.cause.causes[0]) : 
					  (cmd.cause.source && cmd.cause.source.name ? 
							cmd.cause.source.name : cmd.cause.source),
					view: cmd => cmd.cause.causes ? (cmd.cause.causes[0]) : 
						(cmd.cause.source && cmd.cause.source.name ? 
							cmd.cause.source.name : cmd.cause.source),
				},
				command: {
					label: _t("Command"),
					filter: true,
					filterValue: cmd => cmd.command + " " + cmd.args,
					wide: true,
					view: cmd => cmd.command + " " + cmd.args,
				},
				create: {
					view: false,
					isGroup: true,
					create: (view) => 
						<div>
							<Form.Field
								control={Autosuggest}
								name="execCmd"
								placeholder={_t("ExecuteCommand")}
								getSuggestions={this.getSuggestions}
								onChange={view.handleChange}
							/>

							<Form.Group widths="equal">
								<Form.Input
									name="waitLines"
									placeholder={_t("WaitLinesDescr")}
									label={_t("WaitLines")}
									type="number"
									onChange={view.handleChange}
								/>

								<Form.Input
									name="waitTime"
									placeholder={_t("WaitTimeDescr")}
									label={_t("WaitTime")}
									type="number"
									onChange={view.handleChange}
								/>
							</Form.Group>
						</div>,
				},
			}}
			onCreate={(obj, view) => 
				this.props.requestExecute(obj.execCmd, obj.waitLines, obj.waitTime)
			}
		/>
	}
}

const mapStateToProps = (state) => {
	return {
		commands: state.cmd.list,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCommands: () => dispatch(requestList("cmd", true)),
		requestExecute: (cmd, waitLines, waitTime) => 
			dispatch(requestExecute(cmd, waitLines, waitTime)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Commands")(Commands));
