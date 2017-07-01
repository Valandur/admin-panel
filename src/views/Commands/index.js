import React, { Component } from 'react'
import { connect } from "react-redux"
import _ from 'lodash'
import {
	Row, Col, Table,
	Card, CardHeader, CardBlock,
	FormGroup, InputGroup, InputGroupButton, Label, Input, Button,
	Pagination, PaginationItem, PaginationLink,
} from "reactstrap"
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
			command: "",
			executeCommand: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
		this.execute = this.execute.bind(this);

		this.onGetSuggestions = this.onGetSuggestions.bind(this);
		this.getSuggestionValue = this.getSuggestionValue.bind(this);
		this.renderSuggestion = this.renderSuggestion.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	onGetSuggestions(value) {
		const val = value.trim().toLowerCase();
		const parts = val.split(" ");

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

		return cmds;
	}
	getSuggestionValue(suggestion) {
		if (suggestion.isSub) {
			return suggestion.base + " " + suggestion.name + " ";
		}
		return suggestion.name + " ";
	}
	renderSuggestion(suggestion) {
		if (suggestion.isSub) {
			return <div style={{ padding: 10 }}>
				<b>{suggestion.base}</b> <i style={{fontSize:"90%"}}>{suggestion.name}</i>
			</div>
		}
		return <div style={{ padding: 10 }}>
			<b>{suggestion.name}</b> <i style={{fontSize:"90%"}}>{suggestion.usage}</i><br />
			{suggestion.description}<br />
		</div>;
	}

	componentDidMount() {
		this.props.requestCommands();
		this.props.requestCommandHistory();

		this.interval = setInterval(this.props.requestCommandHistory, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	filterChange(filter, newValue) {
		this.props.setFilter(filter, newValue);
	}

	handleChange(event, newValue) {
		let value = null;
		let name = null;

		if (_.isObject(event)) {
			const target = event.target;
			value = target.type === 'checkbox' ? target.checked : target.value;
			name = target.name ? target.name : target.id;
		} else {
			if (!newValue)
				value = null;
			else if (_.isArray(newValue))
				value = _.map(newValue, "value");
			else
				value = newValue.value;
			name = event;
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
		console.log(this.state);
		this.props.requestExecute(this.state.executeCommand);
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
			<div className="animated fadeIn">
				<Row>

					<Col xs={12} md={6} lg={8}>

						<Card>
							<CardHeader>
								<i className="fa fa-terminal"></i>
								Execute a command
							</CardHeader>
							<CardBlock>
								<Row>

									<Col xs={12}>
										<InputGroup>
											<Autosuggest
												name="executeCommand"
												placeholder="Execute a command"
												suggestions={this.state.suggestions}
												onGetSuggestions={this.onGetSuggestions}
												getSuggestionValue={this.getSuggestionValue}
												renderSuggestion={this.renderSuggestion}
												onChange={this.handleChange}
												onKeyPress={this.handleKeyPress}
											/>
											<InputGroupButton>
												<Button
														type="button" color="primary" 
														onClick={() => this.execute()} disabled={this.props.executing}>
													Execute&nbsp;
													{this.props.executing ?
														<i className="fa fa-spinner fa-pulse"></i>
													: null}
												</Button>
											</InputGroupButton>
										</InputGroup>
									</Col>

								</Row>
							</CardBlock>
						</Card>

					</Col>

					<Col xs={12} md={6} lg={4}>

						<Card>
							<CardHeader>
								<i className="fa fa-filter"></i>
								Filter commands
							</CardHeader>
							<CardBlock>
								<Row>

									<Col md={12}>
										<FormGroup row>
											<Label md={3} for="command">Command</Label>
											<Col md={9}>
												<Input
													type="text" id="command" placeholder="Command"
													onChange={e => this.filterChange("command", e.target.value)}
												/>
											</Col>
										</FormGroup>
									</Col>

								</Row>
							</CardBlock>
						</Card>

					</Col>

					<Col xs={12}>
						<Card>
							<CardHeader>
								<i className="fa fa-list"></i>
								Command History
							</CardHeader>
							<CardBlock>
								<Table striped={true}>
									<thead>
										<tr>
											<th>Timestamp</th>
											<th>Command</th>
											<th>Source</th>
										</tr>
									</thead>
									<tbody>
										{_.map(history, cmd =>
											<tr key={cmd.timestamp}>
												<td>{cmd.timestamp}</td>
												<td>{cmd.command} {cmd.args}</td>
												<td>
													{cmd.cause.source.name ? cmd.cause.source.name : cmd.cause.source}
												</td>
											</tr>
										)}
									</tbody>
								</Table>
								{ maxPage > 1 ?
									<Pagination>
										{ page > 4 ?
											<PaginationItem>
												<PaginationLink onClick={e => this.changePage(e, 0)} href="#">
													1
												</PaginationLink>
											</PaginationItem>
										: null }
										{ page > 5 ?
											<PaginationItem>
												<PaginationLink onClick={e => this.changePage(e, page - 5)} href="#">
													...
												</PaginationLink>
											</PaginationItem>
										: null }
										{ _.map(_.range(Math.max(0, page - 4), Math.min(maxPage, page + 5)), p => (
											<PaginationItem key={p} active={p === page}>
												<PaginationLink onClick={e => this.changePage(e, p)} href="#">
													{p + 1}
												</PaginationLink>
											</PaginationItem>
										))}
										{ page < maxPage - 6 ?
											<PaginationItem>
												<PaginationLink onClick={e => this.changePage(e, page + 5)} href="#">
													...
												</PaginationLink>
											</PaginationItem>
										: null }
										{ page < maxPage - 5 ?
											<PaginationItem>
												<PaginationLink onClick={e => this.changePage(e, maxPage - 1)} href="#">
													{maxPage}
												</PaginationLink>
											</PaginationItem>
										: null }
									</Pagination>
								: null }
							</CardBlock>
						</Card>
					</Col>

				</Row>
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.command

	return {
		history: state.history,
		filter: state.filter,
		commands: state.commands,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCommands: () => dispatch(requestCommands()),
		requestCommandHistory: () => dispatch(requestCommandHistory()),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
		requestExecute: (command) => dispatch(requestExecute(command)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Commands);
