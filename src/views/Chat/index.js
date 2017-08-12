import React, { Component } from "react"
import { connect } from "react-redux"
import { Segment, Menu, Form, Dropdown, Table, Header } from "semantic-ui-react"
import _ from "lodash"
import moment from "moment"

import { requestPlayers } from "../../actions/player"
import { requestChatHistory, setFilter } from "../../actions/chat"

const ITEMS_PER_PAGE = 20

class Chat extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
		};

		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
	}

	componentDidMount() {
		this.props.requestPlayers();
		this.props.requestChatHistory();

		this.interval = setInterval(this.props.requestChatHistory, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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
		let messages = _.filter(this.props.messages, msg => {
			if (this.props.filter.player && this.props.filter.player.length) {
				if (!_.find(this.props.filter.player, p => p.uuid === msg.sender.uuid)) {
					return false;
				}
			}
			return true;
		});
		
		const maxPage = Math.ceil(messages.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		messages = messages.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Segment>
					<Header>
						<i className="fa fa-filter"></i> Filter messages
					</Header>

					<Form>
						<Form.Field id="player" label="Sender" control={Dropdown} placeholder="Player"
							fluid selection search onChange={this.filterChange}
							options={_.map(this.props.players, player => 
								({ value: player.uuid, text: player.name })
							)}
						/>
					</Form>
				</Segment>

				<Header>
					<i className="fa fa-comments"></i> Messages
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Timestamp</Table.HeaderCell>
							<Table.HeaderCell>Sender</Table.HeaderCell>
							<Table.HeaderCell>Message</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(messages, msg =>
							<Table.Row key={msg.timestamp}>
								<Table.Cell>{moment.unix(msg.timestamp).calendar()}</Table.Cell>
								<Table.Cell>{msg.sender.name}</Table.Cell>
								<Table.Cell>{msg.message}</Table.Cell>
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
	const state = _state.chat

	return {
		messages: state.messages,
		filter: state.filter,
		players: _state.player.players,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestChatHistory: () => dispatch(requestChatHistory()),
		requestPlayers: () => dispatch(requestPlayers(true)),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
