import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Card, CardHeader, CardBlock, CardFooter } from "reactstrap"
import { Table, Label, FormGroup, Progress, Input, Button } from 'reactstrap'
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import Select from 'react-select'
import _ from 'lodash'

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

		this.handleChange = this.handleChange.bind(this);
		this.create = this.create.bind(this);
		this.changePage = this.changePage.bind(this);
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

	filterChange(filter, newValue) {
		this.props.setFilter(filter, _.map(newValue, "value"));
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
		
		const page = this.state.page;
		const maxPage = Math.ceil(entities.length / ITEMS_PER_PAGE);

		entities = entities.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		const entTypes = _.map(this.props.entTypes, ent => {
			const index = ent.id.indexOf(":");
			return _.assign({}, ent, {
				mod: index !== -1 ? ent.id.substring(0, index) : "???"
			});
		});

		return (
			<div className="animated fadeIn">
				<Row>

					<Col xs={12} md={6} lg={4}>

						<Card>
							<CardHeader>
								Spawn an entity
							</CardHeader>
							<CardBlock>
								<Row>

									<Col md={12}>

										<FormGroup row>
											<Label md={3} for="type">Type</Label>
											<Col md={9}>
												<Select
													id="type"
													value={this.state.type}
													onChange={val => this.handleChange("type", val)}
													options={_.map(entTypes, ent => 
														({ value: ent.id, label: ent.name + " (" + ent.mod + ")" })
													)}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="world">World</Label>
											<Col md={9}>
												<Select
													id="world"
													value={this.state.world}
													onChange={val => this.handleChange("world", val)}
													options={_.map(this.props.worlds, world => 
														({ value: world.uuid, label: world.name + " (" + world.dimensionType.name + ")" })
													)}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3}>Position</Label>
											<Col md={3}>
												<Input
													type="text"
													name="posX"
													className="form-control"
													placeholder="X"
													onChange={this.handleChange}
												/>
											</Col>
											<Col md={3}>
												<Input
													type="text"
													name="posY"
													className="form-control"
													placeholder="Y"
													onChange={this.handleChange}
												/>
											</Col>
											<Col md={3}>
												<Input
													type="text"
													name="posZ"
													className="form-control"
													placeholder="Z"
													onChange={this.handleChange}
												/>
											</Col>
										</FormGroup>

									</Col>

								</Row>
							</CardBlock>
							<CardFooter>
								<Button type="button" color="success" onClick={() => this.create()} disabled={this.props.creating}>
									Create&nbsp;
									{this.props.creating ?
										<i className="fa fa-spinner fa-pulse"></i>
									: null}
								</Button>
							</CardFooter>
						</Card>

					</Col>

					<Col xs={12} md={6} lg={4}>

						<Card>
							<CardHeader>
								Filter entities
							</CardHeader>
							<CardBlock>
								<Row>

									<Col md={12}>

										<FormGroup row>
											<Label md={3} for="filterType">Type</Label>
											<Col md={9}>
												<Select
													id="filterType"
													multi={true}
													value={this.props.filter.type}
													onChange={val => this.filterChange("type", val)}
													options={_.map(entTypes, ent => 
														({ value: ent.id, label: ent.name + " (" + ent.mod + ")" })
													)}
												/>
											</Col>
										</FormGroup>

										<FormGroup row>
											<Label md={3} for="filterWorld">World</Label>
											<Col md={9}>
												<Select
													id="filterWorld"
													multi={true}
													value={this.props.filter.world}
													onChange={val => this.filterChange("world", val)}
													options={_.map(this.props.worlds, world => 
														({ value: world.uuid, label: world.name + " (" + world.dimensionType.name + ")" })
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
						<Table striped={true}>
							<thead>
								<tr>
									<th>Type</th>
									<th>UUID</th>
									<th>Location</th>
									<th>Health</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{_.map(entities, entity =>
									<tr key={entity.uuid}>
										<td>{entity.type}</td>
										<td>{entity.uuid}</td>
										<td>
											{entity.location ?
												<Button type="button" color="link">
													<i className="fa fa-globe"></i>&nbsp;&nbsp;
													{entity.location.world.name} &nbsp; &nbsp;
													{entity.location.position.x.toFixed(0)} |&nbsp;
													{entity.location.position.y.toFixed(0)} |&nbsp;
													{entity.location.position.z.toFixed(0)}
												</Button>
											: null}
										</td>
										<td>
											{entity.health ?
												<Progress
													className="my-1" color="success"
													value={(entity.health.current/entity.health.max)*100}
												/>
											: null}
										</td>
										<td>
											<Button
												type="button" color="danger" disabled={entity.updating}
												onClick={() => this.delete(entity)}
											>
												Destroy
											</Button>
											&nbsp;
											{entity.updating ?
												<i className="fa fa-spinner fa-pulse"></i>
											: null}
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
					</Col>

				</Row>
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.entity

	return {
		entities: state.entities,
		worlds: state.worlds,
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
