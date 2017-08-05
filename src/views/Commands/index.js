import React, { Component } from 'react'
import { connect } from "react-redux"
import _ from 'lodash'
import { Segment, Form, Grid, Table, Menu, Header, Button } from "semantic-ui-react"
import Autosuggest from "../../components/Autosuggest";

import {
	requestCommands,
	requestCommandHistory,
	setFilter,
	requestExecute
} from "../../actions/command"

const ITEMS_PER_PAGE = 20

class Commands extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
		};

		this.handleChange = this.handleChange.bind(this);
		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
		this.execute = this.execute.bind(this);

		this.getSuggestions = this.getSuggestions.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
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
		this.props.requestCommandHistory();

		this.interval = setInterval(this.props.requestCommandHistory, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	filterChange(event, data) {
		const name = data.name ? data.name : data.id;
		this.props.setFilter(name, data.value);
	}

	handleChange(event, data) {
		let value = null;
		let name = null;

		if (data) {
			name = data.name ? data.name : data.id;
			value = data.value;
		} else {
			const target = event.target;
			value = target.type === 'checkbox' ? target.checked : target.value;
			name = target.name ? target.name : target.id;
		}

		this.setState({
			[name]: value
		});
	}

	handleKeyPress(event) {
    if (event.key === "Enter") {
    	this.execute();
    }
  }

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	execute() {
		this.props.requestExecute(this.state.execCmd, this.state.waitLines, this.state.waitTime);
	}

	render() {
		const reg = new RegExp(this.props.filter.command, "i")

		let history = _.filter(this.props.history, cmd => {
			if (!_.isEmpty(this.props.filter.command)) {
				const src = cmd.cause.source.name ? cmd.cause.source.name : cmd.cause.source;
				return reg.test(cmd.command + " " + cmd.args + " " + src)
			}
			return true;
		});
		
		const maxPage = Math.ceil(history.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		history = history.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid columns={2} stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<i className="fa fa-terminal"></i> Execute a command
							</Header>

							<Form loading={this.props.executing}>
								<Form.Field
									control={Autosuggest} name="execCmd"
									placeholder="Execute a command" getSuggestions={this.getSuggestions}
									onChange={this.handleChange} onKeyPress={this.handleKeyPress}
								/>

								<Form.Group widths="equal">
									<Form.Input
										name="waitLines" placeholder="# of response lines to wait for"
										label="Wait lines" type="number" onChange={this.handleChange}
									/>

									<Form.Input
										name="waitTime" placeholder="Milliseconds to wait for a response"
										label="Wait time" type="number" onChange={this.handleChange}
									/>
								</Form.Group>

								<Button
										color="blue" onClick={this.execute}
										loading={this.props.executing} disabled={this.props.executing}>
									Execute
								</Button>
							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<i className="fa fa-filter"></i> Filter commands
							</Header>

							<Form>
								<Form.Input id="command" placeholder="Command" onChange={this.filterChange} />
							</Form>
						</Segment>
					</Grid.Column>
				</Grid>

				<Header>
					<i className="fa fa-list"></i> Command History
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Timestamp</Table.HeaderCell>
							<Table.HeaderCell>Command</Table.HeaderCell>
							<Table.HeaderCell>Source</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(history, cmd =>
							<Table.Row key={cmd.timestamp}>
								<Table.Cell>{cmd.timestamp}</Table.Cell>
								<Table.Cell>{cmd.command} {cmd.args}</Table.Cell>
								<Table.Cell>
									{cmd.cause.source.name ? cmd.cause.source.name : cmd.cause.source}
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
				{ maxPage > 1 ?
					<Menu pagination>
						{ page > 4 ?
							<Menu.Item onClick={e => this.changePage(e, 0)}>
								1
							</Menu.Item>
						: null }
						{ page > 5 ?
							<Menu.Item onClick={e => this.changePage(e, page - 5)}>
								...
							</Menu.Item>
						: null }
						{ _.map(_.range(Math.max(0, page - 4), Math.min(maxPage, page + 5)), p => (
							<Menu.Item key={p} onClick={e => this.changePage(e, p)} active={p === page}>
								{p + 1}
							</Menu.Item>
						))}
						{ page < maxPage - 6 ?
							<Menu.Item onClick={e => this.changePage(e, page + 5)}>
								...
							</Menu.Item>
						: null }
						{ page < maxPage - 5 ?
							<Menu.Item onClick={e => this.changePage(e, maxPage - 1)}>
								{maxPage}
							</Menu.Item>
						: null }
					</Menu>
				: null }

			</Segment>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.command

	return {
		history: state.history,
		filter: state.filter,
		commands: state.commands,
		executing: state.executing,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCommands: () => dispatch(requestCommands()),
		requestCommandHistory: () => dispatch(requestCommandHistory()),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
		requestExecute: (cmd, waitLines, waitTime) => dispatch(requestExecute(cmd, waitLines, waitTime)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Commands);
