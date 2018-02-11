import React, { Component } from "react"
import { connect } from "react-redux"
import { List, Input, Button } from "semantic-ui-react"
import { translate } from "react-i18next"
import copy from "copy-to-clipboard";
import _ from "lodash"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("web-books/book", "id")


class Books extends Component {

	constructor(props) {
		super(props)

		this.renderEditContent = this.renderEditContent.bind(this)
	}

	addLine(view) {
		view.setState({
			lines: _.concat(view.state.lines, view.state.newItem),
			newItem: "",
		})
	}

	moveLineUp(view, index) {
		view.setState({
			lines: _.map(view.state.lines, (line, i) =>
				i === index ? view.state.lines[index - 1] : 
				(i === index - 1 ? view.state.lines[index] : line)),
		})
	}

	moveLineDown(view, index) {
		view.setState({
			lines: _.map(view.state.lines, (line, i) =>
				i === index ? view.state.lines[index + 1] : 
				(i === index + 1 ? view.state.lines[index] : line)),
		})
	}

	deleteLine(view, index) {
		view.setState({
			lines: _.filter(view.state.lines, (line, i) => i !== index),
			newItem: "",
		})
	}

	copy(book) {
		copy(window.location.origin + "/api/webbooks/book/" + book.id + "/html")
	}

	render() {
		const _t = this.props.t

		return <DataView
			canEdit canDelete
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
					view: (book) => <div dangerouslySetInnerHTML={{ __html: book.html }} />,
					edit: this.renderEditContent,
				},
				link: {
					label: _t("Link"),
					wide: true,
					view: (book) =>
						<Input
							fluid
							onFocus={e => e.target.select()}
							action={{ color: "teal", icon: "linkify", onClick: e => this.copy(book) }}
							value={window.location.origin + "/api/webbooks/book/" + book.id + "/html"}
						/>,
				},
			}}
		/>
	}

	renderEditContent(book, view) {
		const _t = this.props.t

		return <div>
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
				action={{ color: "green", icon: "plus", onClick: e => this.addLine(view) }}
			/>
		</div>
	}
}

const mapStateToProps = (_state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.WebBooks")(Books)
);
