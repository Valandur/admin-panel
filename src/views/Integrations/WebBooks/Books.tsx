import * as copy from "copy-to-clipboard"
import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Input, List } from "semantic-ui-react"

import { AppAction } from "../../../actions"
import { WebBooksBook } from "../../../fetch"
import { AppState, DataViewRef } from "../../../types"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("web-books/book", "id")

interface Props extends reactI18Next.InjectedTranslateProps {
}

interface OwnState {
	lines: string[]
	newItem: ""
}

class Books extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props)

		this.renderEditContent = this.renderEditContent.bind(this)
	}

	addLine(view: DataViewRef<WebBooksBook>) {
		view.setState({
			lines: _.concat(view.state.lines, view.state.newItem),
			newItem: "",
		})
	}

	moveLineUp(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: _.map(view.state.lines, (line, i) =>
				i === index ? view.state.lines[index - 1] :
				(i === index - 1 ? view.state.lines[index] : line)),
		})
	}

	moveLineDown(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: _.map(view.state.lines, (line, i) =>
				i === index ? view.state.lines[index + 1] :
				(i === index + 1 ? view.state.lines[index] : line)),
		})
	}

	deleteLine(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: _.filter(view.state.lines, (line: string, i: number) => i !== index),
			newItem: "",
		})
	}

	copy(book: WebBooksBook) {
		copy(window.location.origin + "/api/webbooks/book/" + book.id + "/html")
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				canEdit
				canDelete
				icon="book"
				title={_t("WebBooks")}
				filterTitle={_t("FilterBooks")}
				createTitle={_t("CreateBook")}
				fields={{
					id: {
						label: _t("Id"),
						create: true,
						filter: true,
						required: true,
					},
					title: {
						label: _t("Title"),
						edit: true,
						create: true,
						required: true,
						wide: true,
					},
					lines: {
						view: false,
						edit: true,
					},
					content: {
						label: _t("Content"),
						wide: true,
						view: (book: WebBooksBook) => <div dangerouslySetInnerHTML={{ __html: book.html }} />,
						edit: this.renderEditContent,
					},
					link: {
						label: _t("Link"),
						wide: true,
						view: (book: WebBooksBook) =>
							<Input
								fluid
								onFocus={(e: React.SyntheticEvent<HTMLInputElement>) => (e.target as any).select()}
								action={{ color: "teal", icon: "linkify", onClick: () => this.copy(book) }}
								value={window.location.origin + "/api/webbooks/book/" + book.id + "/html"}
							/>,
					},
				}}
			/>
		)
	}

	renderEditContent(book: WebBooksBook, view: DataViewRef<WebBooksBook>) {
		const _t = this.props.t

		return (
			<div>
				<List size="large">
					{_.map(view.state.lines, (line, index) =>
						<List.Item key={index}>
							<Button
								compact
								icon="delete"
								color="red"
								size="mini"
								onClick={e => this.deleteLine(view, index)}
							/>
							{line}
							<Button
								compact
								icon="arrow down"
								color="blue"
								size="mini"
								floated="right"
								onClick={e => this.moveLineDown(view, index)}
								disabled={index >= view.state.lines.length - 1}
							/>
							<Button
								compact
								icon="arrow up"
								color="blue"
								size="mini"
								floated="right"
								onClick={e => this.moveLineUp(view, index)}
								disabled={index <= 0}
							/>
						</List.Item>
					)}
				</List>
				<Input
					name="newItem"
					placeholder={_t("NewLine")}
					onChange={view.handleChange}
					value={view.state.newItem ? view.state.newItem : ""}
					action={{ color: "green", icon: "plus", onClick: () => this.addLine(view) }}
				/>
			</div>
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
	translate("Integrations.WebBooks")(Books)
)
