import React, { Component } from "react"
import {
	Table, Label, Form, Button, Input, Dropdown, Popup,
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../../../components/Util"
import ItemStack from "../../../components/ItemStack"


class CrateReward extends Component {

	constructor(props) {
		super(props)

		this.state = {
			newObjectType: "",
			newObjectCommand: "",
			newObjectItemType: "",
			newObjectItemAmount: "",
		}

		this.handleChange = handleChange.bind(this, null);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.reward !== this.props.reward ||
			nextState.newObjectType !== this.state.newObjectType ||
			nextState.newObjectCommand !== this.state.newObjectCommand ||
			nextState.newObjectItemType !== this.state.newObjectItemType ||
			nextState.newObjectItemAmount !== this.state.newObjectItemAmount;
	}

	render() {
		const { reward, format, handleRewardChange, addRewardObject, 
			removeRewardObject, removeReward, objectTypes } = this.props

		return <Table.Row>
			<Table.Cell width={2}>
				<Input
					fluid
					type="number"
					name="chance"
					placeholder="Chance"
					onChange={e => handleRewardChange(reward, e)}
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
					onChange={e => handleRewardChange(reward, e)}
					value={reward.name}
				/>
			</Table.Cell>
			<Table.Cell collapsing>
				<Form.Field
					selection search
					name="displayItem.type.id"
					control={Dropdown}
					placeholder="Item type"
					onChange={(e, val) => handleRewardChange(reward, e, val)}
					value={reward.displayItem.type.id}
					options={_.map(this.props.itemTypes, type => 
						({ value: type.id, text: type.name + " (" + type.id + ")" })
					)}
				/>
			</Table.Cell>
			<Table.Cell>
				{_.map(reward.objects, (obj, i) => {
					if (obj.type === "COMMAND") {
						return [<Label
							key={i}
							color="blue"
							content={"/" + obj.command}
							onRemove={e => removeRewardObject(reward, i)}
						/>]
					}
					if (obj.type === "ITEM") {
						return [<ItemStack
							key={i}
							item={obj.item}
							onRemove={e => removeRewardObject(reward, i)}
						/>]
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
						{this.state.newObjectType === "COMMAND" &&
							<Form.Input
								name="newObjectCommand"
								type="text"
								placeholder="/say Hello world!"
								onChange={this.handleChange}
								value={this.state.newObjectCommand}
								action={{
									color: "green",
									content: "Add",
									onClick: e => addRewardObject(reward, {
										type: this.state.newObjectType,
										command: _.startsWith(this.state.newObjectCommand, "/") ? 
											this.state.newObjectCommand.substring(1) : this.state.newObjectCommand,
									}),
								}}
							/>
						}
						{this.state.newObjectType === "ITEM" &&
							[<Form.Field
								selection search
								key="type"
								name="newObjectItemType"
								control={Dropdown}
								placeholder="Item type"
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
									onClick: e => addRewardObject(reward, {
										type: this.state.newObjectType,
										item: {
											type: {
												id: this.state.newObjectItemType,
												name: _.find(this.props.itemTypes, 
													{ id: this.state.newObjectItemType }).name,
											},
											quantity: this.state.newObjectItemAmount,
											data: {},
										}
									}),
								}}
							/>]
						}
					</Form>}
				/>
			</Table.Cell>
			<Table.Cell collapsing>
				<Button
					color="red"
					icon="delete" 
					content="Delete"
					onClick={e => removeReward(reward)}
				/>
			</Table.Cell>
		</Table.Row>
	}
}


export default CrateReward
