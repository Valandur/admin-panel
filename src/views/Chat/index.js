import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardHeader, CardBlock } from "reactstrap"
import { Table, Label, FormGroup } from 'reactstrap'
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import Select from 'react-select'
import _ from 'lodash'
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

	filterChange(filter, newValue) {
		this.props.setFilter(filter, _.map(newValue, "value"));
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
			<div className="animated fadeIn">
				<Row>

					<Col xs={12} md={6} lg={4}>

						<Card>
							<CardHeader>
								<i className="fa fa-filter"></i>
								Filter messages
							</CardHeader>
							<CardBlock>
								<Row>

									<Col md={12}>

										<FormGroup row>
											<Label md={3} for="filterPlayer">Player</Label>
											<Col md={9}>
												<Select
													id="filterPlayer"
													multi={true}
													value={this.props.filter.player}
													onChange={val => this.filterChange("player", val)}
													options={_.map(this.props.players, player => 
														({ value: player.uuid, label: player.name })
													)}
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
								<i className="fa fa-comments"></i>
								Messages
							</CardHeader>
							<CardBlock>
								<Table striped={true}>
									<thead>
										<tr>
											<th>Timestamp</th>
											<th>Sender</th>
											<th>Message</th>
										</tr>
									</thead>
									<tbody>
										{_.map(messages, msg =>
											<tr key={msg.timestamp}>
												<td>{moment(msg.timestamp).timeAgo()}</td>
												<td>{msg.sender.name}</td>
												<td>{msg.message}</td>
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
