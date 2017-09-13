import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid, 
	Form, Message, Icon
} from "semantic-ui-react"
import moment from "moment"
import _ from "lodash"

import {
	setTicketFilter,
	requestTickets,
} from "../../../actions/mmctickets"

const ITEMS_PER_PAGE = 20

class Tickets extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
		}

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
							<Table.HeaderCell>Message</Table.HeaderCell>
							<Table.HeaderCell>Assigned</Table.HeaderCell>
							<Table.HeaderCell>Comment</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(tickets, ticket => {
							return <Table.Row key={ticket.id}>
								<Table.Cell>{ticket.id}</Table.Cell>
								<Table.Cell>{moment.unix(ticket.timestamp).calendar()}</Table.Cell>
								<Table.Cell>{ticket.status}</Table.Cell>
								<Table.Cell>{ticket.sender.name}</Table.Cell>
								<Table.Cell>{ticket.message}</Table.Cell>
								<Table.Cell>{ticket.staff.name}</Table.Cell>
								<Table.Cell>{ticket.comment}</Table.Cell>
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
		setFilter: (filter, value) => dispatch(setTicketFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
