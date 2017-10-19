import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Header, Table, Label, Popup, Dropdown, 
	Grid, Form, Button, Menu, Message, Icon, Input
} from "semantic-ui-react"
import _ from "lodash"

import ItemStack from "../../../components/ItemStack"

import { requestCatalog } from "../../../actions"
import {
	setKitFilter,
	requestKits,
	requestCreateKit,
	requestChangeKit,
	requestDeleteKit
} from "../../../actions/nucleus"

const ITEMS_PER_PAGE = 20
const ITEM_TYPES = "item.ItemType"

class Kits extends Component {

	constructor(props) {
		super(props)

		this.state = {
			page: 0,
			modal: false,
			kit: null,
		}

		this.edit = this.edit.bind(this)
		this.save = this.save.bind(this)
		this.canCreate = this.canCreate.bind(this)
		this.create = this.create.bind(this)
		this.delete = this.delete.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.filterChange = this.filterChange.bind(this)
		this.changePage = this.changePage.bind(this)
	}

	componentDidMount() {
		this.props.requestKits()
		this.props.requestCatalog(ITEM_TYPES)

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

	canCreate() {
		return !_.isEmpty(this.state.name)
	}

	create() {
		this.props.requestCreateKit({
			name: this.state.name,
			cost: this.state.cost,
			cooldown: this.state.cooldown,
		})
	}

	delete(kit) {
		this.props.requestDeleteKit(kit);
	}

	addCmd(kit) {
		let cmd = this.state.newKitCmd
		if (_.startsWith(cmd, "/"))
			cmd = cmd.substring(1)

		this.props.requestChangeKit(kit, {
			commands: _.concat(kit.commands, cmd)
		})
	}

	removeCmd(kit, cmdIndex) {
		this.props.requestChangeKit(kit, {
			commands: _.filter(kit.commands, (__, i) => i !== cmdIndex)
		})
	}

	addStack(kit) {
		this.props.requestChangeKit(kit, {
			stacks: _.concat(kit.stacks, {
				type: {
					id: this.state.newItemType,
				},
				quantity: this.state.newItemAmount ? this.state.newItemAmount : 1
			})
		})
	}

	removeStack(kit, index) {
		this.props.requestChangeKit(kit, {
			stacks: _.filter(kit.stacks, (__, i) => i !== index)
		})
	}

	edit(kit) {
		this.setState({
			kit: kit,
			kitCost: kit.cost,
			kitCooldown: kit.cooldown,
		})
	}

	save(kit) {
		this.props.requestChangeKit(kit, {
			cost: this.state.kitCost,
			cooldown: this.state.kitCooldown,
		})
		this.setState({
			kit: null,
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
								<Icon name="plus" fitted /> Create a kit
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
										name="cooldown" placeholder="The cooldown in milliseconds"
										label="Cooldown (milliseconds)" type="number" onChange={this.handleChange}
									/>
								</Form.Group>

								<Button color="green" onClick={this.create} disabled={!this.canCreate()}>
									Create
								</Button>

							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon name="filter" fitted /> Filter kits
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
					<Icon name="wrench" fitted /> Kits
				</Header>

				<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Cost</Table.HeaderCell>
							<Table.HeaderCell>Cooldown</Table.HeaderCell>
							<Table.HeaderCell>Commands</Table.HeaderCell>
							<Table.HeaderCell>Stacks</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(kits, kit =>
							<Table.Row key={kit.name}>
								<Table.Cell>{kit.name}</Table.Cell>
								<Table.Cell>
									{this.state.kit && this.state.kit.name === kit.name ?
										<Input
											type="number"
											name="kitCost"
											placeholder="Cost"
											value={this.state.kitCost}
											onChange={this.handleChange}
										/>
									:
										kit.cost
									}
								</Table.Cell>
								<Table.Cell>
									{this.state.kit && this.state.kit.name === kit.name ?
										<Input
											type="number"
											name="kitCooldown"
											placeholder="Cooldown"
											value={this.state.kitCooldown}
											onChange={this.handleChange}
										/>
									:
										kit.cooldown
									}
								</Table.Cell>
								<Table.Cell>
									{_.map(kit.commands, (cmd, i) =>
										<Label
											key={i}
											color="blue"
											content={"/" + cmd}
											onRemove={e => this.removeCmd(kit, i)}
										/>
									)}
									<Popup
										trigger={<Button color="green" icon="plus" size="mini" />}
										content={
											<Input
												name="newKitCmd"
												action={{
													color: "green",
													content: "Add",
													onClick: e => this.addCmd(kit),
												}}
												placeholder="/say Hi"
												onChange={this.handleChange}
											/>
										}
										on="click" position="top right"
									/>
								</Table.Cell>
								<Table.Cell>
									{_.map(kit.stacks, (item, i) =>
										<ItemStack
											key={i}
											item={item}
											onRemove={e => this.removeStack(kit, i)}
										/>
									)}
									<Popup
										trigger={<Button color="green" icon="plus" size="mini" />}
										content={<Form>
											<Form.Field id="newItemType" control={Dropdown} placeholder="Type"
												required fluid selection search onChange={this.handleChange}
												options={_.map(this.props.itemTypes, type => 
													({ value: type.id, text: type.name + " (" + type.id + ")" })
												)}
											/>
											<Form.Input
												id="newItemAmount"
												type="number"
												placeholder="Amount"
												onChange={this.handleChange}
												action={{
													color: "green",
													content: "Add",
													onClick: e => this.addStack(kit),
												}}
											/>
										</Form>}
										on="click" position="top right"
									/>
								</Table.Cell>
								<Table.Cell>
									{this.state.kit && this.state.kit.name === kit.name ?
										<Button
											color="green" icon="save" content="Save" disabled={kit.updating}
											loading={kit.updating} onClick={() => this.save(kit)}
										/>
									:
										<Button
											color="blue" icon="edit" content="Edit" disabled={kit.updating}
											loading={kit.updating} onClick={() => this.edit(kit)}
										/>
									}
									{" "}
									<Button
										color="red" icon="trash" content="Remove" disabled={kit.updating}
										loading={kit.updating} onClick={() => this.delete(kit)}
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
	const state = _state.nucleus;

	return {
		creating: state.kitCreating,
		filter: state.kitFilter,
		kits: state.kits,
		itemTypes: _state.api.types[ITEM_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestKits: () => dispatch(requestKits(true)),
		setFilter: (filter, value) => dispatch(setKitFilter(filter, value)),
		requestCatalog: type => dispatch(requestCatalog(type)),
		requestCreateKit: (data) => dispatch(requestCreateKit(data)),
		requestChangeKit: (kit, data) => dispatch(requestChangeKit(kit, data)),
		requestDeleteKit: (kit) => dispatch(requestDeleteKit(kit)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Kits);
