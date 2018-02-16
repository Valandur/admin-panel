import * as React from "react"
import { connect } from "react-redux"
import { Form } from "semantic-ui-react"
import { translate } from "react-i18next"
import * as moment from "moment"
import * as _ from "lodash"

import Autosuggest from "../../components/Autosuggest"
import { requestList, ListRequestAction } from "../../actions/dataview"
import { requestExecute, ExecuteRequestAction } from "../../actions/command"

import DataViewFunc from "../../components/DataView"
import { AppState, Command, CommandCall } from "../../types"
import { Dispatch } from "redux"
import { AppAction } from "../../actions"
const DataView = DataViewFunc("history/cmd", "timestamp")

interface Props extends reactI18Next.InjectedTranslateProps {
	commands: Command[]
	requestCommands: () => ListRequestAction
	requestExecute: (cmd: string, waitLines: number, waitTime: number) => ExecuteRequestAction
}

interface ExtendedCommand extends Command {
	base?: string
	isSub?: boolean
}

class Commands extends React.Component<Props, {}> {

	constructor(props: Props) {
		super(props)

		this.state = {}

		this.getSuggestions = this.getSuggestions.bind(this)
	}

	getSuggestions(newValue: string) {
		const val = newValue.trim().toLowerCase()
		const parts = val.split(" ")

		if (parts.length > 2) {
			return []
		}

		let cmds: ExtendedCommand[] = this.props.commands.filter(cmd => {
			if (parts.length > 1) {
				return cmd.name.toLowerCase() === parts[0]
			} else {
				return _.startsWith(cmd.name.toLowerCase(), parts[0])
			}
		})

		if (cmds.length > 0 && cmds[0].name.toLowerCase() === parts[0]) {
			let subs = cmds[0].usage.replace(/(\[.*?])/g, "").split("|")
			subs = _.map(subs, sub => sub.toLowerCase().trim())
			subs = _.filter(subs, sub => sub !== "/" + cmds[0].name.toLowerCase() + " ?")

			if (parts.length > 1 && !_.isEmpty(parts[1])) {
				subs = subs.filter(sub =>
					_.startsWith(sub, parts[1])
				)
			}
			cmds = _.map(subs, sub => ({
				name: sub,
				description: cmds[0].description,
				usage: cmds[0].usage,
				base: cmds[0].name,
				isSub: true,
			}))
		}

		return _.map(cmds, cmd => {
			if (cmd.isSub) {
				return {
					value: cmd.base + " " + cmd.name + " ",
					content: (
						<div style={{ padding: 10 }}>
							<b>{cmd.base}</b> <i style={{fontSize: "90%"}}>{cmd.name}</i>
						</div>
					)
				}
			}

			return {
				value: cmd.name + " ",
				content: (
					<div style={{ padding: 10 }}>
						<b>{cmd.name}</b> <i style={{fontSize: "90%"}}>{cmd.usage}</i><br />
						{cmd.description}<br />
					</div>
				)
			}
		})
	}

	componentDidMount() {
		this.props.requestCommands()
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				title={_t("Commands")}
				icon="terminal"
				createTitle={_t("ExecuteCommand")}
				createButton={_t("Execute")}
				filterTitle={_t("FilterCommands")}
				fields={{
					timestamp: {
						label: _t("Timestamp"),
						view: (cmd: CommandCall) => moment.unix(cmd.timestamp).calendar(),
					},
					source: {
						label: _t("Source"),
						filter: true,
						filterValue: (cmd: CommandCall) => cmd.cause.causes ? (cmd.cause.causes[0]) :
							(cmd.cause.source && cmd.cause.source.name ?
								cmd.cause.source.name : cmd.cause.source),
						view: (cmd: CommandCall) => cmd.cause.causes ? (cmd.cause.causes[0]) :
							(cmd.cause.source && cmd.cause.source.name ?
								cmd.cause.source.name : cmd.cause.source),
					},
					command: {
						label: _t("Command"),
						filter: true,
						filterValue: (cmd: CommandCall) => cmd.command + " " + cmd.args,
						wide: true,
						view: (cmd: CommandCall) => cmd.command + " " + cmd.args,
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
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		commands: state.cmd.list,
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCommands: () => dispatch(requestList("cmd", true)),
		requestExecute: (cmd: string, waitLines: number, waitTime: number) =>
			dispatch(requestExecute(cmd, waitLines, waitTime)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Commands")(Commands))
