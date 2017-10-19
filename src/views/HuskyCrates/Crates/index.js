import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Menu, Table, Grid, Label, Radio, Modal,
	Form, Button, Message, Icon, Input, Dropdown, Popup,
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../../../components/Util"
import FilterForm from "../../../components/FilterForm"
import CreateForm from "../../../components/CreateForm"
import ItemStack from "../../../components/ItemStack"

import { requestCatalog } from "../../../actions"
import {
	setCrateFilter,
	requestCrates,
	requestCreateCrate,
	requestChangeCrate,
	requestDeleteCrate,
} from "../../../actions/husky"

const ITEMS_PER_PAGE = 20
const crateTypes = [{
	value: "Spinner",
	text: "Spinner",
}, {
	value: "Roulette",
	text: "Roulette",
}, {
	value: "Instant",
	text: "Instant",
}, {
	value: "Simple",
	text: "Simple"
}]
const objectTypes = [{
	value: "Item",
	text: "Item",
}, {
	value: "Command",
	text: "Command",
}]
const ITEM_TYPES = "item.ItemType"

class Crates extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
			crate: null,
			modal: false,
		}

		this.handleChange = handleChange.bind(this)
		this.changePage = this.changePage.bind(this)
		this.create = this.create.bind(this)
		this.delete = this.delete.bind(this)
		this.edit = this.edit.bind(this)
		this.save = this.save.bind(this)
		this.toggleModal = this.toggleModal.bind(this);
		this.addReward = this.addReward.bind(this)
	}

	componentDidMount() {
		this.props.requestCrates()
		this.props.requestCatalog(ITEM_TYPES)

		this.interval = setInterval(this.props.requestCrates, 10000);
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

	edit(crate) {
		this.setState({
			crate: crate,
			name: crate ? crate.name : null,
			type: crate ? crate.type : null,
			isFree: crate ? crate.isFree : null,
			modal: true,
			newObjectType: "",
			newObjectCommand: "",
			newObjectItemType: "",
			newObjectItemAmount: "",
			rewards: crate ? _.clone(crate.rewards) : null,
		})
	}

	save() {
		const crate = this.state.crate;

		this.props.requestChangeCrate(crate, {
			name: this.state.name,
			type: this.state.type,
			isFree: this.state.isFree,
			rewards: this.state.rewards,
		})
		this.setState({
			crate: null,
		})
	}

	create(data) {
		this.props.requestCreateCrate({
			id: data.id,
			name: data.name,
		})
	}

	delete(crate) {
		this.props.requestDeleteCrate(crate);
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleRewardChange(reward, event) {
		const target = event.target;
		const name = target.name ? target.name : target.id;
		let value = target.type === "checkbox" ? target.checked : target.value;
		if (target.type === "number") {
			const floatVal = parseFloat(value);
			value = isNaN(floatVal) ? "" : floatVal;
		}
		reward[name] = value;

		this.setState({
			rewards: _.clone(this.state.rewards)
		})
	}

	addReward() {
		this.setState({
			rewards: _.concat(this.state.rewards, { name: "", chance: 0, objects: [] }),
		})
	}

	addRewardObject(reward) {
		this.setState({
			rewards: _.map(this.state.rewards, r => {
				if (r !== reward) return r;

				const newObject = {
					type: this.state.newObjectType,
				}

				if (newObject.type === "Command") {
					newObject.command = this.state.newObjectCommand;
				}
				if (newObject.type === "Item") {
					newObject.item = {
						type: {
							name: _.find(this.props.itemTypes, { id: this.state.newObjectItemType }).name,
							id: this.state.newObjectItemType,
						},
						quantity: this.state.newObjectItemAmount ? this.state.newObjectItemAmount : 1,
						data: {},
					}
				}

				return _.assign({}, reward, {
					objects: _.concat(reward.objects, newObject),
				})
			}),
			newObjectType: "",
			newObjectCommand: "",
			newObjectItemType: "",
			newObjectItemAmount: "",
		})
	}

	removeRewardObject(reward, index) {
		this.setState({
			rewards: _.map(this.state.rewards, r => {
				if (r !== reward) return r;
				return _.assign({}, reward, {
					objects: _.filter(reward.objects, (__, i) => i !== index),
				})
			}),
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

		let crates = _.filter(this.props.crates, crate => {
			if (!regValid) return true;
			return reg.test(crate.name)
		});
		
		const maxPage = Math.ceil(crates.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		crates = crates.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		return (
			<Segment basic>

				<Grid stackable doubling columns={2}>
					<Grid.Column>
						<CreateForm
							title="Create a crate"
							fields={{
								id: { label: "Id", required: true, },
								name: { label: "Name", required: true, }
							}}
							creating={this.props.creating}
							onCreate={this.create}
						/>
					</Grid.Column>

					<Grid.Column>
						<FilterForm
							title="Filter crates"
							filters={{
								"name": "Name",
							}}
							valid={regValid}
							values={this.props.filter}
							onFilterChange={this.props.setFilter}
						/>
					</Grid.Column>
				</Grid>

				<Header>
					<Icon fitted name="archive" /> Crates
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
							let tc = _.sumBy(crate.rewards, "chance");
							const fmt = chance => ((chance / tc) * 100).toFixed(3) + "%";

							return <Table.Row key={crate.id}>
								<Table.Cell collapsing>{crate.name}</Table.Cell>
								<Table.Cell collapsing>{crate.type}</Table.Cell>
								<Table.Cell collapsing>
									<Icon
										color={crate.isFree ? "green" : "red"}
										name={crate.isFree ? "check" : "remove"}
									/>
								</Table.Cell>
								<Table.Cell>
									<Table compact size="small">
										<Table.Body>
											{_.map(crate.rewards, (reward, i) =>
												<Table.Row key={i}>
													<Table.Cell collapsing>{fmt(reward.chance)}</Table.Cell>
													<Table.Cell collapsing>{reward.name}</Table.Cell>
													<Table.Cell collapsing>
														{reward.shouldAnnounce && <Icon name="bullhorn" />}
													</Table.Cell>
													<Table.Cell>
														{_.map(reward.objects, (obj, i) => {
															if (obj.type === "Command" && obj.command)
																return <Label key={i} color="blue">/{obj.command}</Label>
															if (obj.type === "Item" && obj.item)
																return <ItemStack key={i} item={obj.item} />
															return null;
														})}
													</Table.Cell>
												</Table.Row>
											)}
										</Table.Body>
									</Table>
								</Table.Cell>
								<Table.Cell collapsing>
									<Button
										color="blue"
										disabled={crate.updating}
										loading={crate.updating}
										onClick={() => this.edit(crate)}
									>
										<Icon name="edit" /> Edit
									</Button>
									<Button
										color="red"
										disabled={crate.updating}
										loading={crate.updating}
										onClick={() => this.delete(crate)}
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

				{this.state.crate ?
					this.renderModal()
				: null}

			</Segment>
		);
	}

	renderModal() {
		let totalChance = _.sum(_.map(this.state.rewards, r => r.chance ? r.chance : 0));
		const format = chance => ((chance / totalChance) * 100).toFixed(3) + "%";

		return <Modal open={this.state.modal} onClose={this.toggleModal}>
			<Modal.Header>
				Edit '{this.state.name}'
			</Modal.Header>
			<Modal.Content>
				<Form>
					<Header>
						<Icon fitted name="info" /> General
					</Header>

					<Form.Group widths="equal">

						<Form.Input
							required fluid
							type="text"
							name="name"
							label="Name"
							placeholder="Name"
							onChange={this.handleChange}
							value={this.state.name}
						/>

						<Form.Field
							required fluid selection
							control={Dropdown}
							name="type"
							label="Type"
							placeholder="Type"
							onChange={this.handleChange}
							options={crateTypes}
							value={this.state.type}
						/>

					</Form.Group>

					<Form.Field
						toggle required 
						control={Radio}
						checked={this.state.isFree} 
						label="Is Free"
						onClick={() => this.setState({ isFree: !this.state.isFree })}
					/>

					<Header>
						<Icon fitted name="trophy" /> Rewards
					</Header>

					<Table size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Chance</Table.HeaderCell>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Objects</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{_.map(this.state.rewards, (reward, i) =>
								<Table.Row key={i}>
									<Table.Cell>
										<Input
											fluid
											type="number"
											name="chance"
											placeholder="Chance"
											onChange={e => this.handleRewardChange(reward, e)}
											value={reward.chance}
											labelPosition="right"
											label={format(reward.chance)}
										/>
									</Table.Cell>
									<Table.Cell>
										<Input 
											type="text"
											name="name"
											placeholder="Name" 
											onChange={e => this.handleRewardChange(reward, e)}
											value={reward.name}
										/>
									</Table.Cell>
									<Table.Cell>
										{_.map(reward.objects, (obj, i) => {
											if (obj.type === "Command") {
												return [<Label
													key={i}
													color="blue"
													content={"/" + obj.command}
													onRemove={e => this.removeRewardObject(reward, i)}
												/>,<br />,<br />]
											}
											if (obj.type === "Item") {
												return [<ItemStack
													key={i}
													item={obj.item}
													onRemove={e => this.removeRewardObject(reward, i)}
												/>,<br />,<br />]
											}
											return null;
										})}
										<Popup
											on="click"
											position="top right"
											trigger={<Button color="green" icon="plus" size="small" />}
											content={<Form>
												<Form.Field
													selection search
													name="newObjectType"
													control={Dropdown}
													placeholder="Type"
													onChange={this.handleChange}
													value={this.state.newObjectType}
													options={objectTypes}
												/>
												{this.state.newObjectType === "Command" &&
													<Form.Input
														name="newObjectCommand"
														type="text"
														placeholder="Command"
														onChange={this.handleChange}
														value={this.state.newObjectCommand}
														action={{
															color: "green",
															content: "Add",
															onClick: e => this.addRewardObject(reward),
														}}
													/>
												}
												{this.state.newObjectType === "Item" &&
													[<Form.Field
														selection search
														key="type"
														name="newObjectItemType"
														control={Dropdown}
														placeholder="Type"
														onChange={this.handleChange}
														value={this.state.newObjectItemType}
														options={_.map(this.props.itemTypes, type => 
															({ value: type.id, text: type.name + " (" + type.id + ")" })
														)}
													/>,
													<Form.Input
														key="amount"
														name="newObjectItemAmount"
														type="number"
														placeholder="Amount"
														onChange={this.handleChange}
														value={this.state.newObjectItemAmount}
														action={{
															color: "green",
															content: "Add",
															onClick: e => this.addRewardObject(reward),
														}}
													/>]
												}
											</Form>}
										/>
									</Table.Cell>
								</Table.Row>
							)}
							<Table.Row>
								<Table.Cell colSpan="4" textAlign="center">
									<Button
										color="green"
										icon="plus" 
										content="Add"
										onClick={this.addReward}
									/>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</Form>
			</Modal.Content>
			<Modal.Actions>
				<Button color="blue" onClick={this.save}>Save</Button>&nbsp;
				<Button onClick={this.toggleModal}>Cancel</Button>
			</Modal.Actions>
		</Modal>
	}
}

const mapStateToProps = (_state) => {
	const state = _state.husky;

	return {
		creating: state.crateCreating,
		filter: state.crateFilter,
		crates: state.crates,
		itemTypes: _state.api.types[ITEM_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCatalog: type => dispatch(requestCatalog(type)),
		requestCrates: () => dispatch(requestCrates(true)),
		setFilter: (filter, value) => dispatch(setCrateFilter(filter, value)),
		requestCreateCrate: (crate) => dispatch(requestCreateCrate(crate)),
		requestChangeCrate: (crate, data) => dispatch(requestChangeCrate(crate, data)),
		requestDeleteCrate: (crate) => dispatch(requestDeleteCrate(crate)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Crates);
