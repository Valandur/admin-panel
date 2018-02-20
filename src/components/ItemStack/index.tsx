import * as _ from "lodash"
import * as React from "react"
import { Button, ButtonProps, Label, Progress } from "semantic-ui-react"

import { ItemStack, PotionEffect } from "../../fetch"
import { formatRange } from "../Util"

const getRoman: (num: number) => string = (num: number) => {
	if (num === 1) { return "I" }
	if (num === 2) { return "II" }
	if (num === 3) { return "III" }
	if (num === 4) { return "IV" }
	if (num === 5) { return "V" }
	return ""
}
const getAmplifier: (effect: PotionEffect) => string = (effect: PotionEffect) => getRoman(effect.amplifier + 1)

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
					<div>
						{item.durability &&
							(item.durability.unbreakable ?
								<Label size="tiny">Unbreakable</Label>
							:
								<Progress
									progress
									size="small"
									percent={formatRange(item.durability.durability, item.useLimit ? item.useLimit : 0)}
									style={{ margin: "0 0 .5em 0" }}
								/>)}
						{item.quantity > 1 &&
							<Label size="tiny" color="blue">
								x{item.quantity}
							</Label>}
						{item.enchantments &&
							<div>
								{_.map(item.enchantments, enchant =>
									<Label color="purple" size="tiny" key={enchant.id}>
										{enchant.name}
										<Label.Detail>{enchant.level}</Label.Detail>
									</Label>
								)}
							</div>}
						{item.spawn &&
							<Label size="tiny">
								{item.spawn.name}
							</Label>}
						{item.potionEffects &&
							_.map(item.potionEffects, effect =>
								<Label size="tiny" color="brown" key={effect.type.id}>
									{effect.type.name} {getAmplifier(effect)}
								</Label>
							)}
						{item.foodRestoration &&
							<Label
								size="tiny"
								color="green"
								icon="food"
								content={item.foodRestoration}
							/>}
						{item.burningFuel &&
							<Label
								size="tiny"
								color="red"
								icon="fire"
								content={item.burningFuel}
							/>}
					</div>
			</div>
		)
	}
}

export default ItemStackComp
