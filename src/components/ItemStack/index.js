import React, { Component } from "react"
import { Label } from "semantic-ui-react"

class ItemStack extends Component {
	render() {
		const { item } = this.props;

		let spawn;
		if (item.id === "minecraft:spawn_egg") {
			spawn = item.data.spawn.name
		}

		return <Label style={{margin:"0.1em"}} basic {...this.props}>
			{item.name}
			{item.quantity > 1 ?
				<Label.Detail>x{item.quantity}</Label.Detail>
			: null}
			{spawn && <Label.Detail>({spawn})</Label.Detail>}
		</Label>
	}
}

export default ItemStack
