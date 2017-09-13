import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid,
	Form, Button, Dropdown, Message, Icon 
} from "semantic-ui-react"
import _ from "lodash"

import { requestWorlds } from "../../../actions/world"
import {
	setJailFilter,
	requestJails,
	requestCreateJail,
	requestDeleteJail
} from "../../../actions/nucleus"

const ITEMS_PER_PAGE = 20

class Jails extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
			rotX: 0,
			rotY: 0,
			rotZ: 0,
		}

		this.create = this.create.bind(this)
		this.delete = this.delete.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.filterChange = this.filterChange.bind(this)
		this.changePage = this.changePage.bind(this)
	}

	componentDidMount() {
		this.props.requestJails()
		this.props.requestWorlds()

		this.interval = setInterval(this.props.requestJails, 10000);
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

	create() {
		this.props.requestCreateJail({
			name: this.state.name,
			world: this.state.world,
			position: {
				x: this.state.posX,
				y: this.state.posY,
				z: this.state.posZ,
			},
			rotation: {
				x: this.state.rotX,
				y: this.state.rotY,
				z: this.state.rotZ,
			},
		})
	}

	delete(jail) {
		this.props.requestDeleteJail(jail);
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

		let jails = _.filter(this.props.jails, jail => {
			if (!regValid) return true;
			return reg.test(jail.name)
		});
		
		const maxPage = Math.ceil(jails.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		jails = jails.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid columns={2} stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="plus" fitted /> Create a jail
							</Header>

							<Form loading={this.props.creating}>

								<Form.Group widths="equal">
									<Form.Input
										id="name" label="Name" placeholder="Name" 
										required onChange={this.handleChange}
									/>

									<Form.Field id="world" label="World" control={Dropdown} placeholder="World"
										required fluid selection search onChange={this.handleChange}
										options={_.map(this.props.worlds, world => 
											({ value: world.uuid, text: world.name + " (" + world.dimensionType.name + ")" })
										)}
									/>
								</Form.Group>

								<Form.Group inline>
									<label>Position</label>
									<Form.Input type="number" width={6} name="posX" placeholder="X" onChange={this.handleChange} />
									<Form.Input type="number" width={6} name="posY" placeholder="Y" onChange={this.handleChange} />
									<Form.Input type="number" width={6} name="posZ" placeholder="Z" onChange={this.handleChange} />
								</Form.Group>

								<Form.Group inline>
									<label>Rotation</label>
									<Form.Input type="number" width={6} name="rotX" placeholder="X" onChange={this.handleChange} />
									<Form.Input type="number" width={6} name="rotY" placeholder="Y" onChange={this.handleChange} />
									<Form.Input type="number" width={6} name="rotZ" placeholder="Z" onChange={this.handleChange} />
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
								<Icon name="filter" fitted /> Filter jails
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
					<Icon name="bars" rotated="clockwise" fitted /> Jails
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(jails, jail =>
							<Table.Row key={jail.name}>
								<Table.Cell>{jail.name}</Table.Cell>
								<Table.Cell>
									{jail.location ?
										<Button color="blue">
											<Icon name="globe" />
											{jail.location.world.name}&nbsp; &nbsp;
											{jail.location.position.x.toFixed(0)} |&nbsp;
											{jail.location.position.y.toFixed(0)} |&nbsp;
											{jail.location.position.z.toFixed(0)}
										</Button>
									: null}
								</Table.Cell>
								<Table.Cell>
									<Button
										color="red" disabled={jail.updating}
										loading={jail.updating} onClick={() => this.delete(jail)}
									>
										<Icon name="trash" /> Remove
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
		creating: state.jailCreating,
		filter: state.jailFilter,
		jails: state.jails,
		worlds: _state.world.worlds,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestJails: () => dispatch(requestJails(true)),
		setFilter: (filter, value) => dispatch(setJailFilter(filter, value)),
		requestCreateJail: (data) => dispatch(requestCreateJail(data)),
		requestDeleteJail: (jail) => dispatch(requestDeleteJail(jail)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Jails);
