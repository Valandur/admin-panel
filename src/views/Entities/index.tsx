import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Form, Icon, Label, Progress } from "semantic-ui-react"

import { AppAction, CatalogRequestAction, requestCatalog } from "../../actions"
import { ListRequestAction, requestList } from "../../actions/dataview"
import { formatRange } from "../../components/Util"
import { CatalogType, Entity, WorldFull } from "../../fetch"
import { AppState } from "../../types"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("entity", "uuid")

const ENT_TYPES = "entity.EntityType"

interface Props extends reactI18Next.InjectedTranslateProps {
	worlds: WorldFull[],
	entTypes: CatalogType[],
	requestWorlds: () => ListRequestAction,
	requestCatalog: (type: string) => CatalogRequestAction,
}

class Entities extends React.Component<Props> {

	componentDidMount() {
		this.props.requestWorlds()
		this.props.requestCatalog(ENT_TYPES)
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				canDelete
				icon="paw"
				title={_t("Entities")}
				filterTitle={_t("FilterEntities")}
				createTitle={_t("SpawnEntity")}
				fields={{
					"type.name": {
						label: _t("Type"),
						create: true,
						createName: "type",
						filter: true,
						filterName: "type.id",
						view: (entity: Entity) => entity.type.name,
						options: _.map(this.props.entTypes, type =>
							({
								value: type.id,
								text: type.name + " (" + type.id + ")"
							})
						),
					},
					world: {
						label: _t("World"),
						view: false,
						create: true,
						filter: true,
						filterName: "location.world.uuid",
						options: _.map(this.props.worlds, world =>
							({
								value: world.uuid,
								text: world.name + " (" + world.dimensionType.name + ")"
							})
						),
						required: true,
					},
					position: {
						label: _t("Location"),
						isGroup: true,
						view: (entity: Entity) =>
							<Button color="blue">
								<Icon name="globe" />
								{entity.location.world.name}&nbsp; &nbsp;
								{entity.location.position.x.toFixed(0)} |&nbsp;
								{entity.location.position.y.toFixed(0)} |&nbsp;
								{entity.location.position.z.toFixed(0)}
							</Button>,
						create: (view) =>
							<Form.Group inline>
								<label>{_t("Position")}</label>
								<Form.Input
									type="number"
									width={6}
									name="position.x"
									placeholder="X"
									value={view.state["position.x"]}
									onChange={view.handleChange}
								/>
								<Form.Input
									type="number"
									width={6}
									name="position.y"
									placeholder="Y"
									value={view.state["position.y"]}
									onChange={view.handleChange}
								/>
								<Form.Input
									type="number"
									width={6}
									name="position.z"
									placeholder="Z"
									value={view.state["position.z"]}
									onChange={view.handleChange}
								/>
							</Form.Group>,
					},
					health: {
						label: _t("Health"),
						wide: true,
						view: (entity: Entity) => {
							if (!entity.health) {
								return
							}

							return <Progress
								progress
								color="red"
								percent={formatRange(entity.health.current, entity.health.max)}
							/>
						}
					},
					info: {
						label: _t("Info"),
						wide: true,
						view: (entity: Entity) =>
							<div>
								{entity.aiEnabled &&
									<Label>
										{_t("AI")}
									</Label>}
								{entity.age &&
									<Label>
										{_t("Age")}
										<Label.Detail>
											{entity.age.adult ? _t("Adult") : entity.age.age}
										</Label.Detail>
									</Label>}
								{entity.breedable &&
									<Label>
										{_t("Breedable")}
									</Label>}
								{entity.career &&
									<Label>
										{_t("Career")}
										<Label.Detail>{entity.career.name}</Label.Detail>
									</Label>}
								{entity.flying &&
									<Label>
										{_t("Flying")}
									</Label>}
								{entity.glowing &&
									<Label>
										{_t("Glowing")}
									</Label>}
								{entity.silent &&
									<Label>
										{_t("Silent")}
									</Label>}
								{entity.sneaking &&
									<Label>
										{_t("Sneaking")}
									</Label>}
								{entity.sprinting &&
									<Label>
										{_t("Sprinting")}
									</Label>}
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
		entTypes: state.api.types[ENT_TYPES],
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: (type: string) => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Entities")(Entities))
