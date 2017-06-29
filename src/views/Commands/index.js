import React, { Component } from 'react'
import { connect } from "react-redux"
import _ from 'lodash'
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBlock,
	InputGroup,
	Table,
	Label,
	FormGroup,
	Input,
	Button,
	Pagination,
	PaginationItem,
	PaginationLink,
	InputGroupButton
} from "reactstrap"

import { requestCommands, setFilter, requestExecute } from "../../actions/command"

const ITEMS_PER_PAGE = 20

class Commands extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			command: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
		this.execute = this.execute.bind(this);
	}

	componentDidMount() {
		this.props.requestCommands();

		this.interval = setInterval(this.props.requestCommands, 5000);
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

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	execute() {
		this.props.requestExecute(this.state.command);
		this.setState({
			command: "",
		})
	}

	render() {
		const reg = new RegExp(this.props.filter.command, "i")

		let commands = _.filter(this.props.commands, cmd => {
			if (!_.isEmpty(this.props.filter.command)) {
				return reg.test(cmd.command + " " + cmd.args)
			}
			return true;
		});
		
		const maxPage = Math.ceil(commands.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		commands = commands.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

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

									<Col md={12}>
										<InputGroup>
											<Input
												type="text" id="command" placeholder="Command"
												onChange={this.handleChange} value={this.state.command}
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
								<i className="fa fa-paw"></i>
								Commands
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
										{_.map(commands, cmd =>
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
		commands: state.commands,
		filter: state.filter,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCommands: () => dispatch(requestCommands()),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
		requestExecute: (command) => dispatch(requestExecute(command)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Commands);
