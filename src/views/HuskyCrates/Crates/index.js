import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid, Label, 
	Form, Button, Message, Icon
} from "semantic-ui-react"
import _ from "lodash"

import ItemStack from "../../../components/ItemStack"

import {
	setCrateFilter,
	requestCrates,
} from "../../../actions/husky"

const ITEMS_PER_PAGE = 20

class Crates extends Component {

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
		this.props.requestCrates()

		this.interval = setInterval(this.props.requestCrates, 10000);
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

		let crates = _.filter(this.props.crates, jail => {
			if (!regValid) return true;
			return reg.test(jail.name)
		});
		
		const maxPage = Math.ceil(crates.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		crates = crates.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="filter" fitted /> Filter crates
							</Header>

							<Form>
								<Form.Input
									id="name"
									label="Name"
									placeholder="Name"
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
					<Icon name="archive" fitted /> Crates
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Type</Table.HeaderCell>
							<Table.HeaderCell>Free</Table.HeaderCell>
							<Table.HeaderCell>Rewards</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(crates, crate => {
							const totalChance = _.sumBy(crate.rewards, "chance");
							const format = chance => ((chance / totalChance) * 100).toFixed(2) + "%";

							return <Table.Row key={crate.id}>
								<Table.Cell>{crate.name}</Table.Cell>
								<Table.Cell>{crate.type}</Table.Cell>
								<Table.Cell>
									<Icon
										color={crate.isFree ? "green" : "red"}
										name={crate.isFree ? "check" : "remove"} />
								</Table.Cell>
								<Table.Cell>
									<Table compact size="small">
										<Table.Body>
											{_.map(crate.rewards, (reward, i) =>
												<Table.Row key={i}>
													<Table.Cell>{format(reward.chance)}</Table.Cell>
													<Table.Cell>{reward.name}</Table.Cell>
													<Table.Cell>
														{reward.shouldAnnounce && <Icon name="bullhorn" />}
													</Table.Cell>
													<Table.Cell>
														{_.map(reward.rewards, (item, i) => {
															if (typeof item === "string") {
																return <Label key={i} color="blue">/{item}</Label>
															}
															return <ItemStack key={i} item={item} />
														})}
													</Table.Cell>
												</Table.Row>
											)}
										</Table.Body>
									</Table>
								</Table.Cell>
								<Table.Cell>
									<Button
										color="blue" disabled={crate.updating}
										loading={crate.updating} onClick={() => this.edit(crate)}
									>
										<Icon name="edit" /> Edit
									</Button>
									<Button
										color="red" disabled={crate.updating}
										loading={crate.updating} onClick={() => this.delete(crate)}
									>
										<Icon name="trash" /> Remove
									</Button>
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
	const state = _state.husky;

	return {
		creating: state.crateCreating,
		filter: state.crateFilter,
		crates: state.crates,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCrates: () => dispatch(requestCrates(true)),
		setFilter: (filter, value) => dispatch(setCrateFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Crates);
