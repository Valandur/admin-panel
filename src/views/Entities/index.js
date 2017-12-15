import React, { Component } from "react"
import { connect } from "react-redux"
import { Form, Label, Button, Progress, Icon } from "semantic-ui-react"
import _ from "lodash"

import { formatRange } from "../../components/Util"
import { requestCatalog } from "../../actions"
import { requestList } from "../../actions/dataview"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("entity", "uuid")

const ENT_TYPES = "entity.EntityType"


class Entities extends Component {

	componentDidMount() {
		this.props.requestWorlds();
		this.props.requestCatalog(ENT_TYPES);
	}

	render() {
		return <DataView
			canDelete
			title="Entities"
			icon="paw"
			filterTitle="Filter entities"
			createTitle="Spawn an enttiy"
			fields={{
				"type.name": {
					label: "Type",
					create: true,
					filter: true,
					filterName: "type.id",
					view: entity => entity.type.name,
					options: _.map(this.props.entTypes, type => 
						({
							value: type.id,
							text: type.name + " (" + type.id + ")"
						})
					),
				},
				world: {
					label: "World",
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
					label: "Location",
					isGroup: true,
					view: (entity) =>
						<Button color="blue">
							<Icon name="globe" />
							{entity.location.world.name}&nbsp; &nbsp;
							{entity.location.position.x.toFixed(0)} |&nbsp;
							{entity.location.position.y.toFixed(0)} |&nbsp;
							{entity.location.position.z.toFixed(0)}
						</Button>,
					create: (view) =>
						<Form.Group inline>
							<label>Position</label>
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
					label: "Health",
					wide: true,
					view: (entity) => {
						if (!entity.health) return;
						return <Progress
							progress
							color="red"
							percent={formatRange(entity.health.current, entity.health.max)}
						/>
					}
				},
				info: {
					label: "Info",
					wide: true,
					view: (entity) =>
						<div>
							{entity.aiEnabled &&
								<Label>
									AI
								</Label>}
							{entity.age &&
								<Label>
									Age
									<Label.Detail>
										{entity.age.adult ? "Adult" : entity.age.age}
									</Label.Detail>
								</Label>}
							{entity.breedable &&
								<Label>
									Breedable
								</Label>}
							{entity.career &&
								<Label>
									Career
									<Label.Detail>{entity.career.name}</Label.Detail>
								</Label>}
							{entity.flying &&
								<Label>
									Flying
								</Label>}
							{entity.glowing &&
								<Label>
									Glowing
								</Label>}
							{entity.silent &&
								<Label>
									Silent
								</Label>}
							{entity.sneaking &&
								<Label>
									Sneaking
								</Label>}
							{entity.sprinting &&
								<Label>
									Sprinting
								</Label>}
						</div>,
				},
			}}
		/>
	}
}

const mapStateToProps = (_state) => {
	return {
		worlds: _state.world.list,
		entTypes: _state.api.types[ENT_TYPES],
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
		requestCatalog: type => dispatch(requestCatalog(type)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Entities);
