import React, { Component } from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import { Icon, Radio } from "semantic-ui-react"
import _ from "lodash"

import { requestCatalog } from "../../../actions"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("mmc-restrict/item", "item.id")

const ITEM_TYPES = "item.ItemType"
const getIcon = ban => <Icon
	color={ban ? "red" : "green"}
	name={ban ? "ban" : "check"}
/>
const getEdit = (ban, view, name) => <Radio
	toggle
	name={name}
	checked={view.state[name]}
	onChange={() => view.setState({ [name]: !view.state[name] })}
/>

class Items extends Component {

	componentDidMount() {
		this.props.requestCatalog(ITEM_TYPES)
	}

	render() {
		const _t = this.props.t

		return <DataView
			canEdit canDelete
			icon="ban"
			title={_t("RestrictedItems")}
			createTitle={_t("CreateRestrictedItem")}
			fields={{
				"item.name": {
					create: true,
					createName: "item",
					label: _t("Item"),
					required: true,
					options: _.map(this.props.itemTypes, type => 
						({ value: type.id, text: type.name + " (" + type.id + ")" })
					)
				},
				banReason: {
					label: _t("Reason"),
					create: true,
					edit: true,
				},
				usageBanned: {
					label: _t("Usage"),
					view: ban => getIcon(ban.usageBanned),
					edit: (ban, view) => getEdit(ban, view, "usageBanned"),
				},
				breakingBanned: {
					label: _t("Breaking"),
					view: ban => getIcon(ban.breakingBanned),
					edit: (ban, view) => getEdit(ban, view, "breakingBanned"),
				},
				placingBanned: {
					label: _t("Placing"),
					view: ban => getIcon(ban.placingBanned),
					edit: (ban, view) => getEdit(ban, view, "placingBanned"),
				},
				ownershipBanned: {
					label: _t("Ownership"),
					view: ban => getIcon(ban.ownershipBanned),
					edit: (ban, view) => getEdit(ban, view, "ownershipBanned"),
				},
				dropBanned: {
					label: _t("Drop"),
					view: ban => getIcon(ban.dropBanned),
					edit: (ban, view) => getEdit(ban, view, "dropBanned"),
				},
				worldBanned: {
					label: _t("World"),
					view: ban => getIcon(ban.worldBanned),
					edit: (ban, view) => getEdit(ban, view, "worldBanned"),
				},
			}}
		/>
	}
}

const mapStateToProps = (endpoint) => (_state) => {
	return {
		itemTypes: _state.api.types[ITEM_TYPES],
	}
}

const mapDispatchToProps = (endpoint) => (dispatch) => {
	return {
		requestCatalog: type => dispatch(requestCatalog(type)),
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.MMCRestrict")(Items)
);
