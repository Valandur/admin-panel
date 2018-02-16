import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import * as moment from "moment"

import { AppState, ChatMessage } from "../../types"
import { AppAction } from "../../actions"

import DataViewFunc from "../../components/DataView"
const DataView = DataViewFunc("history/chat", "timestamp")

interface Props extends reactI18Next.InjectedTranslateProps {

}

class Chat extends React.Component<Props, {}> {

	render() {
		const _t = this.props.t

		return (
			<DataView
				title={_t("Messages")}
				icon="comments"
				filterTitle={_t("FilterMessages")}
				fields={{
					timestamp: {
						label: _t("Timestamp"),
						view: (msg: ChatMessage) => moment.unix(msg.timestamp).calendar(),
					},
					sender: {
						label: _t("Sender"),
						filter: true,
						view: (msg: ChatMessage) => msg.sender.name,
					},
					message: _t("Message"),
				}}
			/>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Chat")(Chat))
