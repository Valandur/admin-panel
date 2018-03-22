import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Message, Segment } from "semantic-ui-react"

import { AppAction } from "../../actions"
import { AppState, EServerProperty } from "../../types"

import { requestSaveProperty } from "../../actions/settings"
import DataViewFunc from "../../components/DataView"

const DataView = DataViewFunc("server/properties", "key")

interface Props extends reactI18Next.InjectedTranslateProps {
	requestSaveProperty: (prop: EServerProperty) => AppAction,
}

interface OwnState {
}

class ServerSettings extends React.Component<Props, OwnState> {

	render() {
		const _t = this.props.t

		return (
			<div>
				<Segment basic>
					<Message negative>
						<Message.Header>{_t("WIPTitle")}</Message.Header>
						<p>{_t("WIPText")}</p>
					</Message>
				</Segment>

				<DataView
					canEdit
					icon="cogs"
					title={_t("ServerSettings")}
					fields={{
						key: {
							label: _t("Key"),
						},
						value: {
							label: _t("Value"),
							edit: true,
						}
					}}
					onSave={(data: EServerProperty, newData, view) => {
						this.props.requestSaveProperty({
							...data,
							value: newData.value,
						})
						view.setState({
							data: null,
						})
					}}
				/>
			</div>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestSaveProperty: (prop: EServerProperty): AppAction => dispatch(requestSaveProperty(prop)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("ServerSettings")(ServerSettings))
