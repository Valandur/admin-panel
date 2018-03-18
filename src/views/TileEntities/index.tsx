import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Icon, Label } from "semantic-ui-react"

import Inventory from "../../components/Inventory"

import { AppAction, CatalogRequestAction, requestCatalog } from "../../actions"
import { ListRequestAction, requestList } from "../../actions/dataview"
import { renderCatalogTypeOptions, renderWorldOptions } from "../../components/Util"
import { CatalogType, TileEntity, WorldFull } from "../../fetch"
import { AppState, CatalogTypeKeys } from "../../types"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("tile-entity", (te: TileEntity) =>
	te.location.world.uuid + "/" + te.location.position.x + "/" +
	te.location.position.y + "/" + te.location.position.z)

interface Props extends reactI18Next.InjectedTranslateProps {
	worlds: WorldFull[]
	teTypes: CatalogType[]
	requestWorlds: () => ListRequestAction
	requestCatalog: (type: string) => CatalogRequestAction
}

interface OwnState {
}

class TileEntities extends React.Component<Props, OwnState> {

	componentDidMount() {
		this.props.requestWorlds()
		this.props.requestCatalog(CatalogTypeKeys.TileEntity)
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				icon="puzzle"
				title={_t("TileEntities")}
				filterTitle={_t("FilterEntities")}
				fields={{
					"type.name": {
						label: _t("Type"),
						filter: true,
						filterName: "type.id",
						options: renderCatalogTypeOptions(this.props.teTypes),
					},
					world: {
						label: _t("World"),
						view: false,
						filter: true,
						filterName: "location.world.uuid",
						options: renderWorldOptions(this.props.worlds),
					},
					position: {
						label: _t("Position"),
						view: (te) =>
							<Button color="blue">
								<Icon name="globe" />
								{te.location.world.name}&nbsp; &nbsp;
								{te.location.position.x.toFixed(0)} |&nbsp;
								{te.location.position.y.toFixed(0)} |&nbsp;
								{te.location.position.z.toFixed(0)}
							</Button>,
					},
					info: {
						label: _t("Info"),
						wide: true,
						view: (te) =>
							<div>
								{te.mobSpawner &&
									<Label>
										{_t("MobSpawner")}
										<Label.Detail>
											{te.mobSpawner.nextEntityToSpawn.type.name}
										</Label.Detail>
									</Label>}
								{te.inventory &&
									<Inventory items={te.inventory.itemStacks} />}
							</div>,
					},
				}}
			/>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list,
		teTypes: state.api.types[CatalogTypeKeys.TileEntity],
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("TileEntities")(TileEntities))
