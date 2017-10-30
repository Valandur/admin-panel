import React, { Component } from "react"
import {
	Form, Dropdown, Header, Table, Menu, Icon, Button
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../Util"

const ITEMS_PER_PAGE = 20


class DataTable extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			newData: {},
		}

		this.changePage = this.changePage.bind(this)
		this.doHandleChange = this.doHandleChange.bind(this)
		this.handleChange = handleChange.bind(this, this.doHandleChange)
	}

	doHandleChange(key, value) {
		this.setState({
			newData: _.assign({}, this.state.newData, {
				[key]: value
			})
		})
	}

	changePage(event, page) {
		event.preventDefault();

		this.setState({
			page: page,
		})
	}

	onEdit(obj, view) {
		const newData = {};
		if (obj) {
			_.each(this.props.columns, (col, name) => {
				if (!col.edit) return;
				newData[name] = _.get(obj, name)
			})
		}

		this.setState({
			newData: newData,
		})

		this.props.onEdit(obj, view)
	}

	render() {
		const { icon, title, list, canEdit, canDelete, actions } = this.props
		const columns = _.filter(_.map(this.props.columns, (col, name) => {
			const newCol = {
				name: name,
				view: true,
			};
			if (typeof col === "string") {
				newCol.label = col;
			} else if (typeof col === "function") {
				newCol.view = col;
			} else {
				_.assign(newCol, col);
			}

			return newCol;
		}), "view");

		const maxPage = Math.ceil(list.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		const listPage = list.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		const thisRef = {
			handleChange: this.handleChange,
			state: this.state.newData,
			setState: (changes) => this.setState({
				newData: _.assign({}, this.state.newData, changes)
			}),
		}

		return <div style={{marginTop: "2em"}}>
			<Header>
				<Icon fitted name={icon} /> {title}
			</Header>

			<Table striped={true} stackable>
				<Table.Header>
					<Table.Row>
						{_.map(columns, (col, i) => 
							<Table.HeaderCell key={i}>
								{col.label ? col.label : "<" + col.name + ">"}
							</Table.HeaderCell>
						)}
						{actions || canEdit || canDelete ? 
							<Table.HeaderCell>Actions</Table.HeaderCell> 
						: null}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{_.map(listPage, (obj, i) => {
						const editing = this.props.isEditing(obj);

						return <Table.Row key={i}>
							{_.map(columns, (col, j) => 
								<Table.Cell key={j} collapsing={!col.wide}>
									{col.edit && editing ?
										(typeof col.edit === "function" ? 
											col.edit(obj, thisRef)
										:
											this.renderEdit(obj, col)
										)
									:
										(typeof col.view === "function" ?
											col.view(obj, thisRef)
										:
											_.get(obj, col.name)
										)
									}
								</Table.Cell>
							)}
							{actions || canEdit || canDelete ?
								<Table.Cell collapsing>
									{canEdit && editing ?
										[<Button
											key="save"
											color="green"
											disabled={obj.updating}
											loading={obj.updating}
											onClick={() => this.props.onSave(obj, this.state.newData, thisRef)}
										>
											<Icon name="save" /> Save
										</Button>,
										<Button
											key="cancel"
											color="yellow"
											disabled={obj.updating}
											loading={obj.updating}
											onClick={() => this.onEdit(null, thisRef)}
										>
											<Icon name="cancel" /> Cancel
										</Button>]
									: canEdit ?
										<Button
											color="blue"
											disabled={obj.updating}
											loading={obj.updating}
											onClick={() => this.onEdit(obj, thisRef)}
										>
											<Icon name="edit" /> Edit
										</Button>
									: null}
									{canDelete &&
										<Button
											color="red"
											disabled={obj.updating}
											loading={obj.updating}
											onClick={() => this.props.onDelete(obj, thisRef)}
										>
											<Icon name="trash" /> Remove
										</Button>
									}
									{actions && actions(obj, thisRef)}
								</Table.Cell>
							: null}
						</Table.Row>
					})}
				</Table.Body>
			</Table>
			{ maxPage > 1 ?
				<Menu pagination>
					{ page > 4 ?
						<Menu.Item onClick={e => this.changePage(e, 0)}>
							1
						</Menu.Item>
					: null }
					{ page > 5 ?
						<Menu.Item onClick={e => this.changePage(e, page - 5)}>
							...
						</Menu.Item>
					: null }
					{ _.map(_.range(Math.max(0, page - 4), Math.min(maxPage, page + 5)), p => (
						<Menu.Item key={p} onClick={e => this.changePage(e, p)} active={p === page}>
							{p + 1}
						</Menu.Item>
					))}
					{ page < maxPage - 6 ?
						<Menu.Item onClick={e => this.changePage(e, page + 5)}>
							...
						</Menu.Item>
					: null }
					{ page < maxPage - 5 ?
						<Menu.Item onClick={e => this.changePage(e, maxPage - 1)}>
							{maxPage}
						</Menu.Item>
					: null }
				</Menu>
			: null }
		</div>
	}

	renderEdit(obj, col) {
		if (col.options) {
			return <Form.Field
				fluid selection search
				control={Dropdown}
				name={col.name}
				placeholder={col.label}
				options={col.options}
				value={this.state.newData[col.name]}
				onChange={this.handleChange}
			/>
		}

		return <Form.Input
			name={col.name}
			type={col.type ? col.type : "text"}
			placeholder={col.label}
			value={this.state.newData[col.name]}
			onChange={this.handleChange}
		/>
	}
}

export default DataTable;
