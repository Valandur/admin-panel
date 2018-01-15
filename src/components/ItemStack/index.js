import React, { Component } from "react"
import { Label, Progress, Button } from "semantic-ui-react"
import _ from "lodash"

import { formatRange } from "../Util"

const getAmplifier = effect => getRoman(effect.amplifier + 1)
const getRoman = number => {
	if (number === 1) return "I";
	if (number === 2) return "II";
	if (number === 3) return "III";
	if (number === 4) return "IV";
	if (number === 5) return "V";
	return "";
}

const itemStackStyle = {
	display: "inline-block",
	verticalAlign: "top",
	margin: "0.1em",
	padding: "0.2em",
	border: "1px solid rgba(34,36,38,.1)",
	borderRadius: ".28571429rem",
}

class ItemStack extends Component {
	render() {
		const { item } = this.props;

		return <div style={itemStackStyle}>
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
								color="gray"
								percent={formatRange(item.data.durability.durability, item.data.useLimit)}
								style={{ margin: "0 0 .5em 0" }}
							/>)}
					{item.quantity > 1 &&
						<Label size="tiny" color="blue">
							x{item.quantity}
						</Label>}
					{item.data.enchantments && 
						<div>
							{_.map(item.data.enchantments, enchant =>
								<Label color="purple" size="tiny" key={enchant.enchantment.id}>
									{enchant.enchantment.name}
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
	}
}

export default ItemStack
