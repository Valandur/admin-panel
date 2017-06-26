import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Table, Button, Badge, FormGroup, Label } from 'reactstrap'
import { Card, CardHeader, CardBlock } from "reactstrap"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import Select from 'react-select'
import _ from 'lodash'

import { setFilter, requestTileEntities } from "../../actions/tile-entity"
import { requestCatalog } from "../../actions"
import { requestWorlds } from "../../actions/world"

const TE_TYPES = "block.tileentity.TileEntityType"
const ITEMS_PER_PAGE = 20

class TileEntities extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
		};

		this.changePage = this.changePage.bind(this);
		this.filterChange = this.filterChange.bind(this);
	}

	componentDidMount() {
		this.props.requestTileEntities();
		this.props.requestWorlds();
		this.getCatalogValues();

		this.interval = setInterval(this.props.requestTileEntities, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	getCatalogValues() {
		this.props.requestCatalog(TE_TYPES);
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
		let tileEntities = _.filter(this.props.tileEntities, te => {
			if (this.props.filter.type && this.props.filter.type.length) {
				if (!_.find(this.props.filter.type, t => t === te.type)) {
					return false;
				}
			}
			if (this.props.filter.world && this.props.filter.world.length) {
				if (!_.find(this.props.filter.world, w => w === te.location.world.uuid)) {
					return false;
				}
			}
			return true;
		});

		const page = this.state.page;
		const maxPage = Math.ceil(tileEntities.length / ITEMS_PER_PAGE);

		tileEntities = tileEntities.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		const teTypes = _.map(this.props.teTypes, te => {
			const index = te.id.indexOf(":");
			return _.assign({}, te, {
				mod: index !== -1 ? te.id.substring(0, index) : "???"
			});
		});

		return (
			<div className="animated fadeIn">
				<Row>

					<Col xs={12} md={6} lg={4}>

						<Card>
							<CardHeader>
								<i className="fa fa-filter"></i>
								Filter tile entities
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
													options={_.map(teTypes, ent => 
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
						<Card>
							<CardHeader>
								<i className="fa fa-puzzle-piece"></i>
								Tile Entities
							</CardHeader>
							<CardBlock>
								<Table striped={true}>
									<thead>
										<tr>
											<th>Type</th>
											<th>Location</th>
											<th>Inventory</th>
										</tr>
									</thead>
									<tbody>
										{_.map(tileEntities, te =>
											<tr key={te.id}>
												<td>{te.type}</td>
												<td>
													<div>
														<Button type="button" color="link">
															<i className="fa fa-globe"></i>&nbsp;&nbsp;
															{te.location.world.name} &nbsp; &nbsp;
															{te.location.position.x.toFixed(0)} |&nbsp;
															{te.location.position.y.toFixed(0)} |&nbsp;
															{te.location.position.z.toFixed(0)}
														</Button>
													</div>
												</td>
												<td>
													{te.inventory ?
														<div>
															{_.map(te.inventory.items, item =>
																[<Badge color="primary" pill>
																	{ item.quantity > 1 ? item.quantity + "x " : "" } {item.name}
																</Badge>," "]
															)}
														</div>
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
							</CardBlock>
						</Card>
					</Col>

				</Row>
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	const state = _state.tileEntity

	return {
		tileEntities: state.tileEntities,
		worlds: _state.world.worlds,
		teTypes: _state.api.types[TE_TYPES],
		filter: state.filter,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestTileEntities: () => dispatch(requestTileEntities(true)),
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestCatalog: type => dispatch(requestCatalog(type)),
		setFilter: (filter, value) => dispatch(setFilter(filter, value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TileEntities);
