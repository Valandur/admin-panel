import React, { Component } from "react"
import { Label } from "semantic-ui-react"

class ItemStack extends Component {
	render() {
		const { item } = this.props;

		let spawn;
		if (item.type.id === "minecraft:spawn_egg") {
			spawn = item.data.spawn.name
		}

		return <Label
			style={{margin:"0.1em"}}
			basic
			content={[
				item.type.name,
				item.quantity > 1 && <Label.Detail key={1}>x{item.quantity}</Label.Detail>,
				spawn && <Label.Detail key={2}>({spawn})</Label.Detail>,
			]}
			color={this.props.color}
			onRemove={this.props.onRemove}
		/>
	}
}

export default ItemStack
