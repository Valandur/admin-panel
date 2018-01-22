import React, { Component } from "react"
import { connect } from "react-redux"
import { Label, Popup, Button, Input, Form, Dropdown } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import ItemStack from "../../../components/ItemStack"
import { requestCatalog } from "../../../actions"

import { handleChange } from "../../../components/Util"
import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("nucleus/kit", "name")

const ITEM_TYPES = "item.ItemType"


class Kits extends Component {

	constructor(props) {
		super(props)

		this.state = {}

		this.renderCommands = this.renderCommands.bind(this)
		this.renderStacks = this.renderStacks.bind(this)
		this.handleChange = handleChange.bind(this, null)
	}

	componentDidMount() {
		this.props.requestCatalog(ITEM_TYPES)
	}

	addCmd(view, kit) {
		let cmd = this.state.newKitCmd
		if (_.startsWith(cmd, "/"))
			cmd = cmd.substring(1)

		view.save(kit, {
			commands: _.concat(kit.commands, cmd)
		})
	}

	removeCmd(view, kit, cmdIndex) {
		view.save(kit, {
			commands: _.filter(kit.commands, (__, i) => i !== cmdIndex)
		})
	}

	addStack(view, kit) {
		view.save(kit, {
			stacks: _.concat(kit.stacks, {
				type: {
					id: this.state.newItemType,
				},
				quantity: this.state.newItemAmount ? this.state.newItemAmount : 1
			})
		})
	}

	removeStack(view, kit, index) {
		view.save(kit, {
			stacks: _.filter(kit.stacks, (__, i) => i !== index)
		})
	}

	render() {
		const _t = this.props.t

		return <DataView
			canEdit canDelete
			icon="wrench"
			title={_t("Kits")}
			filterTitle={_t("FilterKits")}
			createTitle={_t("CreateKit")}
			fields={{
				name: {
					label: _t("Name"),
					create: true,
					filter: true,
					required: true,
				},
				cost: {
					label: _t("Cost"),
					type: "number",
					edit: true,
					create: true,
					required: true,
				},
				cooldown: {
					label: _t("Cooldown"),
					type: "number",
					edit: true,
					create: true,
					required: true,
				},
				commands: {
					label: _t("Commands"),
					wide: true,
					view: this.renderCommands,
				},
				stacks: {
					label: _t("Stacks"),
					wide: true,
					view: this.renderStacks,
				}
			}}
		/>
	}

	renderCommands(kit, view) {
		const _t = this.props.t

		return <div>
			{_.map(kit.commands, (cmd, i) =>
				<Label
					key={i}
					color="blue"
					content={"/" + cmd}
					onRemove={e => this.removeCmd(view, kit, i)}
				/>
			)}
			<Popup
				on="click"
				position="top right"
				trigger={<Button color="green" icon="plus" size="mini" />}
				content={
					<Input
						name="newKitCmd"
						action={{
							color: "green",
							content: _t("Add"),
							onClick: e => this.addCmd(view, kit),
						}}
						placeholder="/say Hi"
						value={this.newKitCmd}
						onChange={this.handleChange}
					/>
				}
			/>
		</div>
	}

	renderStacks(kit, view) {
		const _t = this.props.t

		return <div>
			{_.map(kit.stacks, (item, i) =>
				<ItemStack
					key={i}
					item={item}
					onRemove={e => this.removeStack(view, kit, i)}
				/>
			)}
			<Popup
				on="click"
				position="top right"
				trigger={<Button color="green" icon="plus" size="mini" />}
				content={<Form>
					<Form.Field
						required fluid selection search
						name="newItemType"
						control={Dropdown}
						placeholder={_t("Type")}
						onChange={this.handleChange}
						options={_.map(this.props.itemTypes, type => 
							({ value: type.id, text: type.name + " (" + type.id + ")" })
						)}
					/>
					<Form.Input
						name="newItemAmount"
						type="number"
						placeholder={_t("Amount")}
						onChange={this.handleChange}
						action={{
							color: "green",
							content: _t("Add"),
							onClick: e => this.addStack(view, kit),
						}}
					/>
				</Form>}
			/>
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {
		itemTypes: _state.api.types[ITEM_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCatalog: (type) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.Nucleus")(Kits)
);
