import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { Button, Dropdown, Form, Header, Icon, Menu, SemanticICONS, Table } from "semantic-ui-react"

import { DataFieldRaw, DataTableRef } from "../../types"
import { handleChange, HandleChangeFunc } from "../Util"

const ITEMS_PER_PAGE = 20

export interface DataTableProps<T> extends reactI18Next.InjectedTranslateProps {
	title?: string
	icon?: SemanticICONS
	list: T[]
	canEdit?: boolean
	canDelete?: boolean
	fields: {
		[key: string]: DataFieldRaw<T>
	}
	actions?: (data: T, view: DataTableRef) => JSX.Element
	onEdit: (data: T | null, view: DataTableRef) => void
	onSave: (data: T, newData: any, view: DataTableRef) => void
	onDelete: (data: T, view: DataTableRef) => void
	idFunc: (data: T) => string
	isEditing: (data: T) => boolean
}

interface DataTableState {
	page: number
	newData: any
}

class DataTable<T> extends React.Component<DataTableProps<T>, DataTableState> {

	handleChange: HandleChangeFunc

	constructor(props:  DataTableProps<T>) {
		super(props)

		this.state = {
			page: 0,
			newData: {},
		}

		this.changePage = this.changePage.bind(this)
		this.doHandleChange = this.doHandleChange.bind(this)
		this.handleChange = handleChange.bind(this, this.doHandleChange)
	}

	doHandleChange(key: string, value: string) {
		this.setState({
			newData: _.assign({}, this.state.newData, {
				[key]: value
			})
		})
	}

	changePage(event: React.MouseEvent<HTMLElement>, page: number) {
		event.preventDefault()

		this.setState({
			page: page,
		})
	}

	onEdit(obj: T | null, view: DataTableRef) {
		const newData = {}
		if (obj) {
			_.each(this.props.fields, (field, name) => {
				if (!field.edit) {
					return
				}
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
		const fields = _.filter(this.props.fields, "view")

		const maxPage = Math.ceil(list.length / ITEMS_PER_PAGE)
		const page = Math.min(this.state.page, maxPage - 1)

		const listPage = list.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

		const thisRef: DataTableRef = {
			handleChange: this.handleChange,
			state: this.state.newData,
			setState: (changes: object) => this.setState({
				newData: _.assign({}, this.state.newData, changes)
			}),
		}

		const _t = this.props.t

		return (
			<div style={{marginTop: "2em"}}>
				{title &&
					<Header>
						<Icon fitted name={icon} /> {title}
					</Header>
				}

				<Table striped={true} stackable>
					<Table.Header>
						<Table.Row>
							{_.map(fields, (field, i) =>
								<Table.HeaderCell key={i}>
									{field.label ? field.label : "<" + field.name + ">"}
								</Table.HeaderCell>
							)}
							{actions || canEdit || canDelete ?
								<Table.HeaderCell>{_t("Actions")}</Table.HeaderCell>
							: null}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(listPage, (obj, i) => {
							const editing = this.props.isEditing(obj)

							return <Table.Row key={this.props.idFunc(obj)}>
								{_.map(fields, (field, j) =>
									<Table.Cell key={j} collapsing={!field.wide}>
										{field.edit && editing ?
											(typeof field.edit === "function" ?
												field.edit(obj, thisRef)
											:
												this.renderEdit(obj, field)
											)
										:
											(typeof field.view === "function" ?
												field.view(obj, thisRef)
											:
												_.get(obj, field.name)
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
												disabled={(obj as any).updating}
												loading={(obj as any).updating}
												onClick={() => this.props.onSave(obj, this.state.newData, thisRef)}
											>
												<Icon name="save" /> {_t("Save")}
											</Button>,
											<Button
												key="cancel"
												color="yellow"
												disabled={(obj as any).updating}
												loading={(obj as any).updating}
												onClick={() => this.onEdit(null, thisRef)}
											>
												<Icon name="cancel" /> {_t("Cancel")}
											</Button>]
										: canEdit ?
											<Button
												color="blue"
												disabled={(obj as any).updating}
												loading={(obj as any).updating}
												onClick={() => this.onEdit(obj, thisRef)}
											>
												<Icon name="edit" /> {_t("Edit")}
											</Button>
										: null}
										{canDelete &&
											<Button
												color="red"
												disabled={(obj as any).updating}
												loading={(obj as any).updating}
												onClick={() => this.props.onDelete(obj, thisRef)}
											>
												<Icon name="trash" /> {_t("Remove")}
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
		)
	}

	renderEdit(obj: T, col: DataFieldRaw<T>) {
		if (col.options) {
			return (
				<Form.Field
					fluid
					selection
					search
					control={Dropdown}
					name={col.name}
					placeholder={col.label}
					options={col.options}
					value={this.state.newData[col.name]}
					onChange={this.handleChange}
				/>
			)
		}

		return (
			<Form.Input
				name={col.name}
				type={col.type ? col.type : "text"}
				placeholder={col.label}
				value={this.state.newData[col.name]}
				onChange={this.handleChange}
			/>
		)
	}
}

export default translate("DataTable")(DataTable)
// export default DataTable
