import * as React from "react"
import {
	Button,
	Dropdown,
	DropdownProps,
	Form,
	Input,
	Label,
	Popup,
	Table
} from "semantic-ui-react"

import ItemStack from "../../../components/ItemStack"
import { handleChange, HandleChangeFunc } from "../../../components/Util"
import {
	CatalogType,
	HuskyCratesCommandReward,
	HuskyCratesCrateReward,
	HuskyCratesCrateRewardObject,
	HuskyCratesItemReward
} from "../../../fetch"

import ItemTypeDropdown from "./ItemTypeDropdown"

interface Props extends reactI18Next.InjectedTranslateProps {
	reward: HuskyCratesCrateReward
	totalChance: number
	handleRewardChange: (
		reward: HuskyCratesCrateReward,
		e: React.SyntheticEvent<HTMLElement>,
		data?: DropdownProps
	) => void
	addRewardObject: (reward: HuskyCratesCrateReward, object: any) => void
	removeRewardObject: (reward: HuskyCratesCrateReward, index: number) => void
	removeReward: (reward: HuskyCratesCrateReward) => void
	objectTypes: { value: string; text: string }[]
	itemTypes: CatalogType[]
}

interface State {
	newObjectType: string
	newObjectCommand: string
	newObjectItemType: string
	newObjectItemAmount: string
}

class CrateReward extends React.Component<Props, State> {
	handleChange: HandleChangeFunc

	constructor(props: Props) {
		super(props)

		this.state = {
			newObjectType: "",
			newObjectCommand: "",
			newObjectItemType: "",
			newObjectItemAmount: ""
		}

		this.handleChange = handleChange.bind(this, null)
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return (
			nextProps.reward !== this.props.reward ||
			nextProps.totalChance !== this.props.totalChance ||
			nextState.newObjectType !== this.state.newObjectType ||
			nextState.newObjectCommand !== this.state.newObjectCommand ||
			nextState.newObjectItemType !== this.state.newObjectItemType ||
			nextState.newObjectItemAmount !== this.state.newObjectItemAmount
		)
	}

	format(chance: number) {
		return (chance / this.props.totalChance * 100).toFixed(3) + "%"
	}

	render() {
		const {
			reward,
			handleRewardChange,
			addRewardObject,
			removeRewardObject,
			removeReward,
			objectTypes
		} = this.props

		const _t = this.props.t

		return (
			<Table.Row>
				<Table.Cell width={3}>
					<Input
						fluid
						type="number"
						name="chance"
						placeholder={_t("Chance")}
						onChange={e => handleRewardChange(reward, e)}
						value={reward.chance}
						labelPosition="right"
						label={this.format(reward.chance)}
					/>
				</Table.Cell>
				<Table.Cell width={2}>
					<Input
						type="text"
						name="name"
						placeholder={_t("Name")}
						onChange={e => handleRewardChange(reward, e)}
						value={reward.name}
					/>
				</Table.Cell>
				<Table.Cell collapsing>
					<ItemTypeDropdown
						name={"displayItem.type.id"}
						value={reward.displayItem.type.id}
						placeholder={_t("ItemType")}
						itemTypes={this.props.itemTypes}
						onChange={(e, val) => handleRewardChange(reward, e, val)}
					/>
				</Table.Cell>
				<Table.Cell>
					{reward.objects.map((obj, i) => {
						if (obj.type === HuskyCratesCrateRewardObject.TypeEnum.COMMAND) {
							return [
								<Label
									key={i}
									color="blue"
									content={"/" + (obj as HuskyCratesCommandReward).command}
									onRemove={e => removeRewardObject(reward, i)}
								/>
							]
						}
						if (obj.type === HuskyCratesCrateRewardObject.TypeEnum.ITEM) {
							return [
								<ItemStack
									key={i}
									item={(obj as HuskyCratesItemReward).item}
									onRemove={e => removeRewardObject(reward, i)}
								/>
							]
						}
						return null
					})}
					<Popup
						on="click"
						position="top right"
						trigger={<Button color="green" icon="plus" size="small" />}
						content={
							<Form>
								<Form.Field
									selection
									search
									name="newObjectType"
									control={Dropdown}
									placeholder={_t("Type")}
									onChange={this.handleChange}
									value={this.state.newObjectType}
									options={objectTypes}
								/>
								{this.state.newObjectType === "COMMAND" && (
									<Form.Input
										name="newObjectCommand"
										type="text"
										placeholder="/say Hello world!"
										onChange={this.handleChange}
										value={this.state.newObjectCommand}
										action={{
											color: "green",
											content: _t("Add"),
											onClick: () =>
												addRewardObject(reward, {
													type: this.state.newObjectType,
													command: this.state.newObjectCommand.startsWith("/")
														? this.state.newObjectCommand.substring(1)
														: this.state.newObjectCommand
												})
										}}
									/>
								)}
								{this.state.newObjectType === "ITEM" && [
									<ItemTypeDropdown
										key="type"
										name={"newObjectItemType"}
										value={this.state.newObjectItemType}
										placeholder={_t("ItemType")}
										itemTypes={this.props.itemTypes}
										onChange={this.handleChange}
									/>,
									<Form.Input
										key="amount"
										name="newObjectItemAmount"
										type="number"
										placeholder={_t("Amount")}
										onChange={this.handleChange}
										value={this.state.newObjectItemAmount}
										action={{
											color: "green",
											content: _t("Add"),
											onClick: () =>
												addRewardObject(reward, {
													type: this.state.newObjectType,
													item: {
														type: {
															id: this.state.newObjectItemType,
															name: (this.props.itemTypes.find(
																t => t.id === this.state.newObjectItemType
															) as CatalogType).name
														},
														quantity: this.state.newObjectItemAmount,
														data: {}
													}
												})
										}}
									/>
								]}
							</Form>
						}
					/>
				</Table.Cell>
				<Table.Cell collapsing>
					<Button
						color="red"
						icon="delete"
						content={_t("Delete")}
						onClick={e => removeReward(reward)}
					/>
				</Table.Cell>
			</Table.Row>
		)
	}
}

export default CrateReward
