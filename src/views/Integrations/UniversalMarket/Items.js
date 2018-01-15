import React, { Component } from "react"
import { connect } from "react-redux"
import moment from "moment"

import ItemStack from "../../../components/ItemStack"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("universalmarket/item", "id")


class Items extends Component {

	render() {
		return <DataView
			title="Items"
			icon="shopping cart"
			filterTitle="Filter items"
			fields={{
				item: {
					label: "Item",
					filter: true,
					filterValue: mi => mi.item.type.name + " (" + mi.item.type.id + ")",
					view: (mi) =>
						<ItemStack
							item={mi.item}
						/>
				},
				price: "Price",
				expires: {
					label: "Expires",
					view: (mi) =>
						moment.unix(mi.expires).calendar()
				},
				"owner.name": "Seller",
			}}
		/>
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
