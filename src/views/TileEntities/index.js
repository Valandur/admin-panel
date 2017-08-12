import React, { Component } from "react"
import { connect } from "react-redux"
import { Segment, Table, Menu, Form, Dropdown, Button, Header, Label } from "semantic-ui-react"
import _ from "lodash"

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
			<Segment basic>

				<Segment>
					<Header>
						<i className="fa fa-filter"></i> Filter tile entities
					</Header>

					<Form>
						<Form.Group widths="equal">
							<Form.Field name="type" label="Type" control={Dropdown} placeholder="Type"
								fluid selection search multiple onChange={this.filterChange}
								options={_.map(teTypes, ent => 
									({ value: ent.id, text: ent.name + " (" + ent.mod + ")" })
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

				<Header>
					<i className="fa fa-puzzle-piece"></i> Tile Entities
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Type</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Inventory</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(tileEntities, te =>
							<Table.Row key={te.id}>
								<Table.Cell>{te.type}</Table.Cell>
								<Table.Cell>
									<Button color="blue">
										<i className="fa fa-globe"></i>&nbsp;&nbsp;
										{te.location.world.name} &nbsp; &nbsp;
										{te.location.position.x.toFixed(0)} |&nbsp;
										{te.location.position.y.toFixed(0)} |&nbsp;
										{te.location.position.z.toFixed(0)}
									</Button>
								</Table.Cell>
								<Table.Cell>
									{te.inventory ?
										<div>
											{_.map(te.inventory.items, item =>
												[<Label color="blue" pill>
													{ item.quantity > 1 ? item.quantity + "x " : "" } {item.name}
												</Label>," "]
											)}
										</div>
									: null}
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
