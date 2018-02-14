import React, { Component } from "react"
import { connect } from "react-redux"
import { Button, Icon, Label } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import Inventory from "../../components/Inventory"

import { requestCatalog } from "../../actions"
import { requestList } from "../../actions/dataview"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("tile-entity", te => 
	te.location.world.uuid + "/" + te.location.position.x + "/" + 
	te.location.position.y + "/" + te.location.position.z)

const TE_TYPES = "block.tileentity.TileEntityType"


class TileEntities extends Component {

	componentDidMount() {
		this.props.requestWorlds();
		this.props.requestCatalog(TE_TYPES);
	}

	render() {
		const _t = this.props.t

		return <DataView
			icon="puzzle"
			title={_t("TileEntities")}
			filterTitle={_t("FilterEntities")}
			fields={{
				"type.name": {
					label: _t("Type"),
					filter: true,
					filterName: "type.id",
					options: _.map(this.props.teTypes, type => 
						({
							value: type.id,
							text: type.name + " (" + type.id + ")"
						})
					),
				},
				world: {
					label: _t("World"),
					view: false,
					filter: true,
					filterName: "location.world.uuid",
					options: _.map(this.props.worlds, world => 
						({
							value: world.uuid,
							text: world.name + " (" + world.dimensionType.name + ")"
						})
					),
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
								<Inventory items={te.inventory.items} />}
						</div>,
				},
			}}
		/>
	}
}

const mapStateToProps = (_state) => {
	return {
		worlds: _state.world.list,
		teTypes: _state.api.types[TE_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: type => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("TileEntities")(TileEntities));
