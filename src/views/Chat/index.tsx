import * as moment from "moment"
import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"

import { AppAction } from "../../actions"
import { ChatMessage, Message } from "../../fetch"
import { AppState } from "../../types"

import DataViewFunc from "../../components/DataView"
import { formatSource, sourceLabel } from "../../components/Util"

const DataView = DataViewFunc("history/message", "timestamp")

interface Props extends reactI18Next.InjectedTranslateProps {}

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
						view: (msg: ChatMessage) => moment(msg.timestamp).calendar()
					},
					sender: {
						label: _t("Cause"),
						filter: true,
						filterValue: (msg: ChatMessage) => formatSource(msg.sender),
						view: (msg: ChatMessage) => sourceLabel(msg.sender)
					},
					receivers: {
						label: _t("Receivers"),
						filter: true,
						filterValue: (msg: Message) =>
							msg.receivers.map(r => formatSource(r)).join(" "),
						view: (msg: Message) => (
							<>{msg.receivers.map(r => sourceLabel(r))}</>
						)
					},
					content: _t("Message")
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

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Chat")(Chat)
)
