import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Form, Icon } from "semantic-ui-react"

import { AppAction } from "../../../actions"
import { ListRequestAction, requestList } from "../../../actions/dataview"
import { renderWorldOptions } from "../../../components/Util"
import { NucleusNamedLocation, WorldFull } from "../../../fetch"
import { AppState } from "../../../types"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("nucleus/jail", "name")

interface Props extends reactI18Next.InjectedTranslateProps {
	worlds: WorldFull[]
	requestWorlds: () => ListRequestAction
}

interface OwnState {}

class Jails extends React.Component<Props, OwnState> {
	componentDidMount() {
		this.props.requestWorlds()
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
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
						wide: true
					},
					world: {
						label: _t("World"),
						view: false,
						create: true,
						createName: "location.world",
						filter: true,
						filterName: "location.world.uuid",
						options: renderWorldOptions(this.props.worlds),
						required: true
					},
					position: {
						label: _t("Location"),
						isGroup: true,
						wide: true,
						view: (jail: NucleusNamedLocation) => {
							if (!jail.location) {
								return <Button negative>Invalid location</Button>
							}

							return (
								<Button primary>
									<Icon name="globe" />
									{jail.location.world.name}&nbsp; &nbsp;
									{jail.location.position.x.toFixed(0)} |&nbsp;
									{jail.location.position.y.toFixed(0)} |&nbsp;
									{jail.location.position.z.toFixed(0)}
								</Button>
							)
						},
						create: view => (
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
							</Form.Group>
						)
					}
				}}
			/>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList("world", true))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.Nucleus")(Jails)
)
