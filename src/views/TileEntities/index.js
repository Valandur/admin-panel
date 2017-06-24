import React, { Component } from 'react'
import { connect } from "react-redux"
import { Row, Col, Table, Button, Badge } from 'reactstrap'
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
import _ from 'lodash'

import { requestTileEntities } from "../../actions/tile-entity"

const ITEMS_PER_PAGE = 20

class TileEntities extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
		};

		this.changePage = this.changePage.bind(this);

		this.props.requestTileEntities();
	}

	componentDidMount() {
		this.interval = setInterval(this.props.requestTileEntities, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	render() {
		let tileEntities = _.filter(this.props.tileEntities, te => true);

		const page = this.state.page;
		const maxPage = Math.ceil(tileEntities.length / ITEMS_PER_PAGE);

		tileEntities = tileEntities.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<div className="animated fadeIn">
				<Row>

					<Col xs={12}>
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
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestTileEntities: () => dispatch(requestTileEntities(true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TileEntities);
