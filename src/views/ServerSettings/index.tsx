import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Form, Icon, Message, Segment } from "semantic-ui-react"

import { AppAction } from "../../actions"
import { AppState, EServerProperty, PermissionTree } from "../../types"

import { requestSaveProperty } from "../../actions/settings"
import DataViewFunc from "../../components/DataView"
import { checkPermissions } from "../../components/Util"

const DataView = DataViewFunc("server/properties", "key")

interface OwnProps {
	perms?: PermissionTree
}

interface Props extends OwnProps, reactI18Next.InjectedTranslateProps {
	requestSaveProperty: (prop: EServerProperty) => AppAction
}

interface OwnState {}

class ServerSettings extends React.Component<Props, OwnState> {
	render() {
		const _t = this.props.t

		return (
			<div>
				<Segment basic>
					<Message info>
						<Message.Header>{_t("InfoTitle")}</Message.Header>
						<p>{_t("InfoText")}</p>
					</Message>
				</Segment>

				<DataView
					canEdit={(obj: EServerProperty) =>
						checkPermissions(this.props.perms, ["server", "properties", "modify", obj.key])
					}
					icon="cogs"
					title={_t("ServerSettings")}
					fields={{
						key: {
							label: _t("Key")
						},
						value: {
							label: _t("Value"),
							view: (obj: EServerProperty) => {
								if (obj.value === "true" || obj.value === "false") {
									return (
										<Icon
											color={obj.value === "true" ? "green" : "red"}
											name={obj.value === "true" ? "check" : "delete"}
										/>
									)
								}
								return obj.value
							},
							edit: (obj: EServerProperty, view) => {
								if (obj.value === "true" || obj.value === "false") {
									return (
										<Form.Radio
											toggle
											name="value"
											checked={view.state.value === "true"}
											onClick={() => {
												view.setState({
													value: view.state.value === "true" ? "false" : "true"
												})
											}}
										/>
									)
								}

								return (
									<Form.Input
										name="value"
										type="text"
										placeholder="Value"
										value={view.state.value}
										onChange={view.handleChange}
									/>
								)
							}
						}
					}}
					onSave={(data: EServerProperty, newData, view) => {
						this.props.requestSaveProperty({
							...data,
							value: newData.value
						})
						view.endEdit()
					}}
				/>
			</div>
		)
	}
}

const mapStateToProps = (state: AppState): OwnProps => {
	return {
		perms: state.api.permissions
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestSaveProperty: (prop: EServerProperty): AppAction => dispatch(requestSaveProperty(prop))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("ServerSettings")(ServerSettings)
)
