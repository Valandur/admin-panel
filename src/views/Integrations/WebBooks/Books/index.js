import React, { Component } from "react"
import { connect } from "react-redux"
import { List, Input, Button } from "semantic-ui-react"
import _ from "lodash"
import copy from "copy-to-clipboard";

import DataViewFunc from "../../../../components/DataView"
const DataView = DataViewFunc("webbooks/book", "id")


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
		return <DataView
			canEdit canDelete
			title="Web Books"
			icon="book"
			filterTitle="Filter web books"
			createTitle="Create a web book"
			fields={{
				id: {
					label: "Id",
					create: true,
					filter: true,
					required: true,
				},
				title: {
					label: "Title",
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
					label: "Content",
					wide: true,
					view: (book) => <div dangerouslySetInnerHTML={{ __html: book.html }} />,
					edit: this.renderEditContent,
				},
				link: {
					label: "Link",
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
				placeholder="New line"
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

export default connect(mapStateToProps, mapDispatchToProps)(Books);
