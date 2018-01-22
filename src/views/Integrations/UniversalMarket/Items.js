import React, { Component } from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import moment from "moment"

import ItemStack from "../../../components/ItemStack"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("universalmarket/item", "id")


class Items extends Component {

	render() {
		const _t = this.props.t

		return <DataView
			icon="shopping cart"
			title={_t("Items")}
			filterTitle={_t("FilterItems")}
			fields={{
				item: {
					label: _t("Item"),
					filter: true,
					filterValue: mi => mi.item.type.name + " (" + mi.item.type.id + ")",
					view: (mi) =>
						<ItemStack
							item={mi.item}
						/>
				},
				price: _t("Price"),
				expires: {
					label: _t("Expires"),
					view: (mi) =>
						moment.unix(mi.expires).calendar()
				},
				"owner.name": _t("Seller"),
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

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.UniversalMarket")(Items)
);
