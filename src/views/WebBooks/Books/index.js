import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid,
	Form, Button, Message, Icon, List, Input
} from "semantic-ui-react"
import _ from "lodash"
import copy from "copy-to-clipboard";

import {
	requestBooks, setBookFilter,
	requestCreateBook, requestChangeBook, requestDeleteBook,
} from "../../../actions/webbooks"

const ITEMS_PER_PAGE = 20

class Books extends Component {

	constructor(props) {
		super(props)

		this.state = {
			book: null,
			title: "",
			newItem: "",
			lines: [],
			page: 0,
		}

		this.create = this.create.bind(this)
		this.delete = this.delete.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.filterChange = this.filterChange.bind(this)
		this.changePage = this.changePage.bind(this)
		this.addLine = this.addLine.bind(this)
	}

	componentDidMount() {
		this.props.requestBooks()

		this.interval = setInterval(this.props.requestBooks, 10000)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
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

	create() {
		this.props.requestCreate({
			id: this.state.id,
			title: this.state.newTitle,
		})
	}

	edit(book) {
		this.setState({
			book: book,
			title: book ? book.title : "",
			lines: book ? book.lines : [],
		})
	}

	delete(book) {
		this.props.requestDelete(book);
	}

	addLine() {
		this.setState({
			lines: _.concat(this.state.lines, this.state.newItem),
			newItem: "",
		})
	}

	moveLineUp(index) {
		this.setState({
			lines: _.map(this.state.lines, (line, i) =>
				i === index ? this.state.lines[index - 1] : 
				(i === index - 1 ? this.state.lines[index] : line)),
		})
	}

	moveLineDown(index) {
		this.setState({
			lines: _.map(this.state.lines, (line, i) =>
				i === index ? this.state.lines[index + 1] : 
				(i === index + 1 ? this.state.lines[index] : line)),
		})
	}

	deleteLine(index) {
		this.setState({
			lines: _.filter(this.state.lines, (line, i) => i !== index),
			newItem: "",
		})
	}

	save(book) {
		this.props.requestChange(book, {
			title: this.state.title,
			lines: this.state.lines,
		})
		this.edit(null);
	}

	copy(book) {
		copy(window.location.origin + "/api/webbooks/book/" + book.id + "/html")
	}

	render() {
		let reg = new RegExp();
		let regValid = false;

		try {
			if (this.props.filter.id && this.props.filter.id.length) {
				reg = new RegExp(this.props.filter.id, "i");
			}
			regValid = true;
		} catch (e) {}

		let books = _.filter(this.props.books, book => {
			if (!regValid) return true;
			return reg.test(book.id)
		});
		
		const maxPage = Math.ceil(books.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		books = books.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid columns={2} stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="plus" fitted /> Create a web book
							</Header>

							<Form loading={this.props.creating}>

								<Form.Group widths="equal">
									<Form.Input
										name="id" label="Id" placeholder="Id" 
										required onChange={this.handleChange}
									/>
								</Form.Group>

								<Form.Group widths="equal">
									<Form.Input
										id="newTitle" label="Title" placeholder="Title" required
										onChange={this.handleChange} value={this.state.newTitle}
									/>
								</Form.Group>

								<Button color="green" onClick={this.create}>
									Create
								</Button>

							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="filter" fitted /> Filter web books
							</Header>

							<Form>
								<Form.Input
									name="id"
									label="Id"
									placeholder="Id"
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
					<Icon name="book" fitted /> Web Books
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Id</Table.HeaderCell>
							<Table.HeaderCell>Title</Table.HeaderCell>
							<Table.HeaderCell>Content</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
							<Table.HeaderCell>Link</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(books, book =>
							<Table.Row key={book.id}>
								<Table.Cell>{book.id}</Table.Cell>
								<Table.Cell>
									{this.state.book && this.state.book.id === book.id ?
										<Input
											id="title" placeholder="Title"
											onChange={this.handleChange} value={this.state.title}
										/>
									:
										book.title
									}
								</Table.Cell>
								<Table.Cell>
									{this.state.book && this.state.book.id === book.id ?
										[<List size="large" key="list">
											{_.map(this.state.lines, (line, index) => 
												<List.Item key={index}>
													<Button
														icon="delete" color="red" size="mini" compact
														onClick={e => this.deleteLine(index)}
													/>
													{line}
													<Button
														icon="arrow down" color="blue" size="mini" compact
														floated="right" onClick={e => this.moveLineDown(index)}
														disabled={index >= this.state.lines.length - 1}
													/>
													<Button
														icon="arrow up" color="blue" size="mini" compact
														floated="right" onClick={e => this.moveLineUp(index)}
														disabled={index <= 0}
													/>
												</List.Item>
											)}
										</List>,
										<Input
											key="new" id="newItem" placeholder="New line"
											onChange={this.handleChange} value={this.state.newItem}
											action={{ color: "green", icon: "plus", onClick: this.addLine }}
										/>]
									:
										<div dangerouslySetInnerHTML={{ __html: book.html }} />
									}
								</Table.Cell>
								<Table.Cell>
									{this.state.book && this.state.book.id === book.id ?
										 [<Button
											key="save" color="green" disabled={book.updating}
											loading={book.updating} onClick={() => this.save(book)}
										>
											<Icon name="save" /> Save
										</Button>,
										<Button
											key="cancel" color="yellow" disabled={book.updating}
											loading={book.updating} onClick={() => this.edit(null)}
										>
											<Icon name="cancel" /> Cancel
										</Button>]
									:
										<Button
											color="blue" disabled={book.updating}
											loading={book.updating} onClick={() => this.edit(book)}
										>
											<Icon name="edit" /> Edit
										</Button>
									}
									<Button
										color="red" disabled={book.updating}
										loading={book.updating} onClick={() => this.delete(book)}
									>
										<Icon name="trash" /> Remove
									</Button>
								</Table.Cell>
								<Table.Cell>
									<Input
										fluid onFocus={e => e.target.select()}
										action={{ color: "teal", icon: "linkify", onClick: e => this.copy(book) }}
										value={window.location.origin + "/api/webbooks/book/" + book.id + "/html"}
									/>
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
		);
	}
}

const mapStateToProps = (_state) => {
	const state = _state.webbooks;

	return {
		creating: state.bookCreating,
		filter: state.bookFilter,
		books: state.books,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setFilter: (filter, value) => dispatch(setBookFilter(filter, value)),
		requestBooks: () => dispatch(requestBooks(true)),
		request: () => dispatch(requestBooks(true)),
		requestCreate: (data) => dispatch(requestCreateBook(data)),
		requestChange: (book, data) => dispatch(requestChangeBook(book, data)),
		requestDelete: (book) => dispatch(requestDeleteBook(book)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Books);
