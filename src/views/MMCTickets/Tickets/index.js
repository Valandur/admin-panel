import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid, Input,
	Form, Message, Icon, Button, Dropdown
} from "semantic-ui-react"
import moment from "moment"
import _ from "lodash"

import {
	setTicketFilter,
	requestTickets,
	requestChangeTicket
} from "../../../actions/mmctickets"

const ITEMS_PER_PAGE = 20
const ticketStates = [{
	value: "Open",
	text: "Open",
}, {
	value: "Claimed",
	text: "Claimed",
}, {
	value: "Held",
	text: "Held",
}, {
	value: "Closed",
	text: "Closed"
}];

class Tickets extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
			ticket: null,
		}

		this.edit = this.edit.bind(this)
		this.save = this.save.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.filterChange = this.filterChange.bind(this)
		this.changePage = this.changePage.bind(this)
	}

	componentDidMount() {
		this.props.requestTickets()

		this.interval = setInterval(this.props.requestTickets, 10000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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

	filterChange(event, data) {
		const name = data.name ? data.name : data.id;
		this.props.setFilter(name, data.value);
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	edit(ticket) {
		this.setState({
			ticket: ticket,
			status: ticket ? ticket.status : null,
			comment: ticket ? ticket.comment : null,
		})
	}

	save(ticket) {
		this.props.requestChange(ticket, {
			status: this.state.status,
			comment: this.state.comment,
		})
		this.edit(null)
	}

	render() {
		let reg = new RegExp();
		let regValid = false;

		try {
			if (this.props.filter.name && this.props.filter.name.length) {
				reg = new RegExp(this.props.filter.name, "i");
			}
			regValid = true;
		} catch (e) {}

		let tickets = _.filter(this.props.tickets, ticket => {
			if (!regValid) return true;
			return reg.test(ticket.id) || reg.test(ticket.message) || reg.test(ticket.comment)
		});
		
		const maxPage = Math.ceil(tickets.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		tickets = tickets.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="filter" fitted /> Filter tickets
							</Header>

							<Form>
								<Form.Input
									id="name"
									label="Name"
									placeholder="Ticket #, Message or Comment"
									onChange={this.filterChange}
									error={!regValid} />
								<Message
									error visible={!regValid}
									content="Search term must be a valid regex" />
							</Form>
						</Segment>
					</Grid.Column>
				</Grid>

				<Header>
					<Icon name="ticket" fitted /> Tickets
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>Timestamp</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Sender</Table.HeaderCell>
							<Table.HeaderCell>Assigned</Table.HeaderCell>
							<Table.HeaderCell>Message</Table.HeaderCell>
							<Table.HeaderCell>Comment</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(tickets, ticket => {
							return <Table.Row key={ticket.id}>
								<Table.Cell collapsing>{ticket.id}</Table.Cell>
								<Table.Cell collapsing>{moment.unix(ticket.timestamp).calendar()}</Table.Cell>
								<Table.Cell collapsing>
									{this.state.ticket && this.state.ticket.id === ticket.id ?
										<Dropdown id="status" label="Status" placeholder="Status"
											required fluid selection onChange={this.handleChange}
											options={ticketStates} value={this.state.status}
										/>
									:
										ticket.status
									}
								</Table.Cell>
								<Table.Cell collapsing>{ticket.sender.name}</Table.Cell>
								<Table.Cell collapsing>{ticket.staff.name}</Table.Cell>
								<Table.Cell collapsing>{ticket.message}</Table.Cell>
								<Table.Cell>
									{this.state.ticket && this.state.ticket.id === ticket.id ? 
										<Input type="text" id="comment" placeholder="Comment" required
											fluid onChange={this.handleChange} value={this.state.comment}
										/>
									:
										ticket.comment
									}
								</Table.Cell>
								<Table.Cell collapsing>
									{this.state.ticket && this.state.ticket.id === ticket.id ? 
										[<Button
											color="green" disabled={ticket.updating}
											loading={ticket.updating} onClick={() => this.save(ticket)}
										>
											<Icon name="save" /> Save
										</Button>,
										<Button
											color="yellow" disabled={ticket.updating}
											loading={ticket.updating} onClick={() => this.edit()}
										>
											<Icon name="cancel" /> Cancel
										</Button>]
									:
										<Button
											color="blue" disabled={ticket.updating}
											loading={ticket.updating} onClick={() => this.edit(ticket)}
										>
											<Icon name="edit" /> Edit
										</Button>
									}
								</Table.Cell>
							</Table.Row>
						})}
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
		);
	}
}

const mapStateToProps = (_state) => {
	const state = _state.mmctickets;

	return {
		creating: state.ticketCreating,
		filter: state.ticketFilter,
		tickets: state.tickets,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestTickets: () => dispatch(requestTickets(true)),
		requestChange: (ticket, data) => dispatch(requestChangeTicket(ticket, data)),
		setFilter: (filter, value) => dispatch(setTicketFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
