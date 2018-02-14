import * as React from "react"
import { Label, Progress, Button, ButtonProps } from "semantic-ui-react"
import * as _ from "lodash"

import { formatRange } from "../Util"
import { ItemPotionEffect, ItemStack } from "../../types"

const getAmplifier: (effect: ItemPotionEffect) => string = (effect: ItemPotionEffect) => getRoman(effect.amplifier + 1)
const getRoman: (num: number) => string = (num: number) => {
	if (num === 1) { return "I" }
	if (num === 2) { return "II" }
	if (num === 3) { return "III" }
	if (num === 4) { return "IV" }
	if (num === 5) { return "V" }
	return ""
}

const itemStackStyle = {
	display: "inline-block",
	verticalAlign: "top",
	margin: "0.1em",
	padding: "0.2em",
	border: "1px solid rgba(34,36,38,.1)",
	borderRadius: ".28571429rem",
}

export interface AppProps {
	item: ItemStack
	onRemove?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void
}

class ItemStackComp extends React.Component<AppProps> {
	render() {
		const item: ItemStack = this.props.item

		return (
			<div style={itemStackStyle}>
				<strong>{item.type.name}</strong>
				{this.props.onRemove &&
					<Button
						compact
						size="mini"
						icon="delete"
						floated="right"
						onClick={this.props.onRemove}
					/>
				}
				<div style={{ color: "gray", marginBottom: "0.5em" }}>{item.type.id}</div>
				{item.data &&
					<div>
						{item.data.durability && 
							(item.data.durability.unbreakable ?
								<Label size="tiny">Unbreakable</Label>
							:
								<Progress
									progress
									size="small"
									percent={formatRange(item.data.durability.durability, item.data.durability.useLimit)}
									style={{ margin: "0 0 .5em 0" }}
								/>)}
						{item.quantity > 1 &&
							<Label size="tiny" color="blue">
								x{item.quantity}
							</Label>}
						{item.data.enchantments && 
							<div>
								{_.map(item.data.enchantments, enchant =>
									<Label color="purple" size="tiny" key={enchant.id}>
										{enchant.name}
										<Label.Detail>{enchant.level}</Label.Detail>
									</Label>
								)}
							</div>}
						{item.data.spawn &&
							<Label size="tiny">
								{item.data.spawn.name}
							</Label>}
						{item.data.potionEffects &&
							_.map(item.data.potionEffects, effect =>
								<Label size="tiny" color="brown" key={effect.id}>
									{effect.name} {getAmplifier(effect)}
								</Label>
							)}
						{item.data.foodRestoration &&
							<Label
								size="tiny"
								color="green"
								icon="food"
								content={item.data.foodRestoration}
							/>}
						{item.data.burningFuel &&
							<Label
								size="tiny"
								color="red"
								icon="fire"
								content={item.data.burningFuel}
							/>}
					</div>}
			</div>
		)
	}
}

export default ItemStackComp
