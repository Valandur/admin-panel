import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Icon, Radio } from "semantic-ui-react"

import { AppAction, CatalogRequestAction, requestCatalog } from "../../../actions"
import { renderCatalogTypeOptions } from "../../../components/Util"
import { CatalogType, MMCRestrictItem } from "../../../fetch"
import { AppState, CatalogTypeKeys, DataTableRef } from "../../../types"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("mmc-restrict/item", "item.id")

const getIcon = (ban: boolean) => (
	<Icon
		color={ban ? "red" : "green"}
		name={ban ? "ban" : "check"}
	/>
)

const getEdit = (ban: MMCRestrictItem, view: DataTableRef, name: string) => (
	<Radio
		toggle
		name={name}
		checked={view.state[name]}
		onChange={() => view.setState({ [name]: !view.state[name] })}
	/>
)

interface Props extends reactI18Next.InjectedTranslateProps {
	itemTypes: CatalogType[]
	requestCatalog: (type: string) => CatalogRequestAction
}

interface OwnState {
}

class Items extends React.Component<Props, OwnState> {

	componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Item)
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				canEdit
				canDelete
				icon="ban"
				title={_t("RestrictedItems")}
				createTitle={_t("CreateRestrictedItem")}
				fields={{
					"item.name": {
						create: true,
						createName: "item",
						label: _t("Item"),
						required: true,
						options: renderCatalogTypeOptions(this.props.itemTypes),
					},
					banReason: {
						label: _t("Reason"),
						create: true,
						edit: true,
					},
					usageBanned: {
						label: _t("Usage"),
						view: (ban: MMCRestrictItem) => getIcon(ban.usageBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "usageBanned"),
					},
					breakingBanned: {
						label: _t("Breaking"),
						view: (ban: MMCRestrictItem) => getIcon(ban.breakingBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "breakingBanned"),
					},
					placingBanned: {
						label: _t("Placing"),
						view: (ban: MMCRestrictItem) => getIcon(ban.placingBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "placingBanned"),
					},
					ownershipBanned: {
						label: _t("Ownership"),
						view: (ban: MMCRestrictItem) => getIcon(ban.ownershipBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "ownershipBanned"),
					},
					dropBanned: {
						label: _t("Drop"),
						view: (ban: MMCRestrictItem) => getIcon(ban.dropBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "dropBanned"),
					},
					worldBanned: {
						label: _t("World"),
						view: (ban: MMCRestrictItem) => getIcon(ban.worldBanned),
						edit: (ban: MMCRestrictItem, view) => getEdit(ban, view, "worldBanned"),
					},
				}}
			/>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		itemTypes: state.api.types[CatalogTypeKeys.Item],
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.MMCRestrict")(Items)
)
