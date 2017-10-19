import React from "react"
import { Radio } from "semantic-ui-react"
import _ from "lodash"

import ItemStack from "../ItemStack"

const customizer = (objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

class Inventory extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			stacked: true
		}
	}

	render() {
		let items = _.sortBy(this.props.items, "type.name")
		if (!this.props.dontStack && this.state.stacked) {
			items = _.groupBy(items, "type.id")
			items = _.map(items, itemGroup => {
				let item = _.merge({}, _.first(itemGroup))
				_.each(_.tail(itemGroup), newItem => item = _.mergeWith(item, newItem, customizer))
				return _.merge(item, { quantity: _.sumBy(itemGroup, "quantity") });
			})
		}

		return <div>
			{this.props.stackOption && [
				<Radio
					toggle
					checked={this.state.stacked}
					onClick={() => this.setState({ stacked: !this.state.stacked })}
				/>,
				<br />
			]}
			{_.map(items, (item, i) =>
				<ItemStack key={i} item={item} />
			)}
		</div>
	}
}

export default Inventory
