import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Form, Grid, Table, Label,
	Button, Menu, Progress, Dropdown, Icon 
} from "semantic-ui-react"
import _ from "lodash"

import { requestCatalog } from "../../actions"
import { setFilter, requestEntities, requestCreateEntity, requestDeleteEntity } from "../../actions/entity"
import { requestWorlds } from "../../actions/world"

const ENT_TYPES = "entity.EntityType"
const ITEMS_PER_PAGE = 20

class Entities extends Component {

	constructor(props) {
		super(props);

		this.state = {
			entities: [],
			page: 0,
			posX: 0,
			posY: 0,
			posZ: 0
		};

		this.create = this.create.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.create = this.create.bind(this);
		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
	}

	componentDidMount() {
		this.props.requestEntities();
		this.props.requestWorlds();
		this.getCatalogValues();

		this.interval = setInterval(this.props.requestEntities, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	filterChange(event, data) {
		const name = data.name ? data.name : data.id;
		this.props.setFilter(name, data.value);
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

	getCatalogValues() {
		this.props.requestCatalog(ENT_TYPES);
	}

	create() {
		this.props.requestCreateEntity({
			world: this.state.world,
			type: this.state.type,
			position: {
				x: this.state.posX,
				y: this.state.posY,
				z: this.state.posZ
			}
		})
	}

	delete(entity) {
		this.props.requestDeleteEntity(entity.uuid);
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	render() {
		let entities = _.filter(this.props.entities, entity => {
			if (this.props.filter.type && this.props.filter.type.length) {
				if (!_.find(this.props.filter.type, t => t === entity.type)) {
					return false;
				}
			}
			if (this.props.filter.world && this.props.filter.world.length) {
				if (!_.find(this.props.filter.world, w => w === entity.location.world.uuid)) {
					return false;
				}
			}
			return true;
		});
		
		const maxPage = Math.ceil(entities.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		entities = entities.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid columns={2} stackable doubling>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="plus" fitted /> Spawn an entity
							</Header>

							<Form loading={this.props.creating}>

								<Form.Group widths="equal">
									<Form.Field id="type" label="Type" control={Dropdown} placeholder="Type"
										required fluid selection search onChange={this.handleChange}
										options={_.map(this.props.entTypes, ent => 
											({ value: ent.id, text: ent.name + " (" + ent.id + ")" })
										)}
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

								<Button color="green" onClick={this.create}>
									Create
								</Button>

							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="filter" fitted /> Filter entities
							</Header>

							<Form>
								<Form.Group widths="equal">
									<Form.Field name="type" label="Type" control={Dropdown} placeholder="Type"
										fluid selection search multiple onChange={this.filterChange}
										options={_.map(this.props.entTypes, ent => 
											({ value: ent.id, text: ent.name + " (" + ent.id + ")" })
										)}
									/>

									<Form.Field name="world" label="World" control={Dropdown} placeholder="World"
										fluid selection search multiple onChange={this.filterChange}
										options={_.map(this.props.worlds, w => 
											({ value: w.uuid, text: w.name + " (" + w.dimensionType.name + ")" })
										)}
									/>
								</Form.Group>
							</Form>
						</Segment>
					</Grid.Column>
				</Grid>

				<Header>
					<Icon name="paw" fitted /> Entities
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Type</Table.HeaderCell>
							<Table.HeaderCell>UUID</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Health</Table.HeaderCell>
							<Table.HeaderCell>Info</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(entities, entity =>
							<Table.Row key={entity.uuid}>
								<Table.Cell>{entity.type}</Table.Cell>
								<Table.Cell>{entity.uuid}</Table.Cell>
								<Table.Cell>
									{entity.location ?
										<Button color="blue">
											<Icon name="globe" />
											{entity.location.world.name}&nbsp; &nbsp;
											{entity.location.position.x.toFixed(0)} |&nbsp;
											{entity.location.position.y.toFixed(0)} |&nbsp;
											{entity.location.position.z.toFixed(0)}
										</Button>
									: null}
								</Table.Cell>
								<Table.Cell>
									{entity.health &&
										<Progress
											color="green"
											percent={(entity.health.current/entity.health.max)*100}
										/>}
								</Table.Cell>
								<Table.Cell>
									{entity.career &&
										<Label>
											Career
											<Label.Detail>{entity.career.name}</Label.Detail>
										</Label>}
									{entity.age &&
										<Label>
											Age
											<Label.Detail>{entity.age.age}</Label.Detail>
										</Label>}
									{entity.age &&
										<Label>
											Adult
											<Label.Detail>{entity.age.adult ? "Yes" : "No"}</Label.Detail>
										</Label>}
								</Table.Cell>
								<Table.Cell>
									<Button
										color="red" disabled={entity.updating}
										loading={entity.updating} onClick={() => this.delete(entity)}
									>
										Destroy
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
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.entity

	return {
		entities: state.entities,
		worlds: _state.world.worlds,
		entTypes: _state.api.types[ENT_TYPES],
		filter: state.filter,
		creating: state.creating,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestEntities: () => dispatch(requestEntities(true)),
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestCatalog: type => dispatch(requestCatalog(type)),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
		requestCreateEntity: (data) => dispatch(requestCreateEntity(data)),
		requestDeleteEntity: (uuid) => dispatch(requestDeleteEntity(uuid)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
