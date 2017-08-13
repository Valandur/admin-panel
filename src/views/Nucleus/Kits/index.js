import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Table, Accordion, List,
	Grid, Form, Button, Menu, Message
} from "semantic-ui-react"
import _ from "lodash"

import {
	setKitFilter,
	requestKits,
	requestCreateKit,
	requestDeleteKit
} from "../../../actions/nucleus"

const ITEMS_PER_PAGE = 20

class Kits extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
		}

		this.create = this.create.bind(this)
		this.delete = this.delete.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.filterChange = this.filterChange.bind(this)
		this.changePage = this.changePage.bind(this)
	}

	componentDidMount() {
		this.props.requestKits()

		this.interval = setInterval(this.props.requestKits, 10000)
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
		this.props.requestCreateKit({
			name: this.state.name,
			cost: this.state.cost,
			interval: this.state.interval,
		})
	}

	delete(kit) {
		this.props.requestDeleteKit(kit.name);
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

  	let kits = _.filter(this.props.kits, kit => {
  		if (!regValid) return true;
			return reg.test(kit.name);
		});
		
		const maxPage = Math.ceil(kits.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		kits = kits.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
    	<Segment basic>

    		<Grid columns={2} stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<i className="fa fa-plus"></i> Create a kit
							</Header>

							<Form loading={this.props.creating}>

								<Form.Group widths="equal">
									<Form.Input
										id="name" label="Name" placeholder="Name" 
										required onChange={this.handleChange}
									/>
								</Form.Group>

								<Form.Group widths="equal">
									<Form.Input
										name="cost" placeholder="The cost of this kit"
										label="Cost" type="number" onChange={this.handleChange}
									/>

									<Form.Input
										name="interval" placeholder="The interval in seconds"
										label="Interval (seconds)" type="number" onChange={this.handleChange}
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
								<i className="fa fa-filter"></i> Filter kits
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
    			<i className="fa fa-wrench"> Kits</i>
    		</Header>

    		<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Cost</Table.HeaderCell>
							<Table.HeaderCell>Interval</Table.HeaderCell>
							<Table.HeaderCell>Commands</Table.HeaderCell>
							<Table.HeaderCell>Stacks</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(kits, kit =>
							<Table.Row key={kit.name}>
								<Table.Cell>{kit.name}</Table.Cell>
								<Table.Cell>{kit.cost}</Table.Cell>
								<Table.Cell>{kit.interval}</Table.Cell>
								<Table.Cell>
									<Accordion panels={[{
										title: kit.commands.length + " command" + (kit.commands.length !== 1 ? "s" : ""),
										content: <List bulleted>
											{_.map(kit.commands, cmd => <List.Item>
												{cmd}
											</List.Item>)}
										</List>
									}]} />
								</Table.Cell>
								<Table.Cell>
									<Accordion panels={[{
										title: kit.stacks.length + " stack" + (kit.stacks.length !== 1 ? "s" : ""),
										content: <List bulleted>
											{_.map(kit.stacks, stack => <List.Item>
												{JSON.stringify(stack)}
											</List.Item>)}
										</List>
									}]} />
								</Table.Cell>
								<Table.Cell>
									<Button
										color="red" disabled={kit.updating}
										loading={kit.updating} onClick={() => this.delete(kit)}
									>
										<i className="fa fa-trash" /> Remove
									</Button>
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
	const state = _state.nucleus;

	return {
		creating: state.kitCreating,
		filter: state.kitFilter,
		kits: state.kits,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestKits: () => dispatch(requestKits(true)),
		setFilter: (filter, value) => dispatch(setKitFilter(filter, value)),
		requestCreateKit: (data) => dispatch(requestCreateKit(data)),
		requestDeleteKit: (name) => dispatch(requestDeleteKit(name)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Kits);
