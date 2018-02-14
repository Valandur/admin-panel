import React, { Component } from "react"
import { connect } from "react-redux"
import { Form, Button, Icon } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import { requestList } from "../../../actions/dataview"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("nucleus/jail", "name")


class Jails extends Component {

	componentDidMount() {
		this.props.requestWorlds()
	}

	render() {
		const _t = this.props.t

		return <DataView
			canDelete
			icon="wrench"
			title={_t("Jails")}
			filterTitle={_t("FilterJails")}
			createTitle={_t("CreateJail")}
			fields={{
				name: {
					label: _t("Name"),
					create: true,
					filter: true,
					required: true,
					wide: true,
				},
				world: {
					label: _t("World"),
					view: false,
					create: true,
					createName: "location.world",
					filter: true,
					filterName: "location.world.uuid",
					options: _.map(this.props.worlds, world => 
						({ value: world.uuid, text: world.name + " (" + world.dimensionType.name + ")" })
					),
					required: true,
				},
				position: {
					label: _t("Location"),
					isGroup: true,
					wide: true,
					view: (jail) =>
						<Button color="blue">
							<Icon name="globe" />
							{jail.location.world.name}&nbsp; &nbsp;
							{jail.location.position.x.toFixed(0)} |&nbsp;
							{jail.location.position.y.toFixed(0)} |&nbsp;
							{jail.location.position.z.toFixed(0)}
						</Button>,
					create: (view) =>
						<Form.Group inline>
							<label>Position</label>
							<Form.Input
								type="number"
								width={6}
								name="location.position.x"
								placeholder="X"
								value={view.state["location.position.x"]}
								onChange={view.handleChange}
							/>
							<Form.Input
								type="number"
								width={6}
								name="location.position.y"
								placeholder="Y"
								value={view.state["location.position.y"]}
								onChange={view.handleChange}
							/>
							<Form.Input
								type="number"
								width={6}
								name="location.position.z"
								placeholder="Z"
								value={view.state["location.position.z"]}
								onChange={view.handleChange}
							/>
						</Form.Group>,
				}
			}}
		/>
	}
}

const mapStateToProps = (_state) => {
	return {
		worlds: _state.world.list,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.Nucleus")(Jails)
);
