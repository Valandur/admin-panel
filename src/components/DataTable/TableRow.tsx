import * as React from "react"
import { Button, Dropdown, Form, Icon, Table } from "semantic-ui-react"

import { DataFieldRaw, DataTableRef } from "../../types"
import { get, HandleChangeFunc } from "../Util"

export interface Props<T> extends reactI18Next.InjectedTranslateProps {
	obj: T
	tableRef: DataTableRef
	canEdit?: (data: T) => boolean
	canDelete?: (data: T) => boolean
	editing: boolean
	fields: DataFieldRaw<T>[]
	onEdit: (data: T | null, view: DataTableRef) => void
	onSave?: (data: T, newData: any, view: DataTableRef) => void
	onDelete?: (data: T, view: DataTableRef) => void
	actions?: (data: T, view: DataTableRef) => JSX.Element
	handleChange: HandleChangeFunc
	newData: any
}

export default class TableRow<T> extends React.Component<Props<T>> {
	shouldComponentUpdate(nextProps: Props<T>, nextState: any) {
		return (
			nextProps.obj !== this.props.obj ||
			nextProps.editing !== this.props.editing ||
			nextProps.fields !== this.props.fields ||
			(this.props.editing && nextProps.newData !== this.props.newData)
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
					value={this.props.newData[col.name]}
					onChange={this.props.handleChange}
				/>
			)
		}

		return (
			<Form.Input
				name={col.name}
				type={col.type ? col.type : "text"}
				placeholder={col.label}
				value={this.props.newData[col.name]}
				onChange={this.props.handleChange}
			/>
		)
	}

	render() {
		const { actions, fields, obj, canEdit, canDelete, editing, tableRef } = this.props

		const _canEdit = typeof canEdit === "function" ? canEdit(obj) : canEdit
		const _canDelete = typeof canDelete === "function" ? canDelete(obj) : canEdit

		return (
			<Table.Row>
				{fields.map((field, j) => (
					<Table.Cell key={j} collapsing={!field.wide}>
						{field.edit && editing
							? typeof field.edit === "function"
								? field.edit(obj, tableRef)
								: this.renderEdit(obj, field)
							: typeof field.view === "function"
								? field.view(obj, tableRef)
								: get(obj, field.name)}
					</Table.Cell>
				))}
				{actions || _canEdit || _canDelete ? (
					<Table.Cell collapsing>
						{_canEdit && editing ? (
							[
								<Button
									key="save"
									color="green"
									disabled={(obj as any).updating}
									loading={(obj as any).updating}
									onClick={() => {
										if (this.props.onSave) {
											this.props.onSave(obj, this.props.newData, tableRef)
										}
									}}
								>
									<Icon name="save" /> {this.props.t("Save")}
								</Button>,
								<Button
									key="cancel"
									color="yellow"
									disabled={(obj as any).updating}
									loading={(obj as any).updating}
									onClick={() => this.props.onEdit(null, tableRef)}
								>
									<Icon name="cancel" /> {this.props.t("Cancel")}
								</Button>
							]
						) : _canEdit ? (
							<Button
								color="blue"
								disabled={(obj as any).updating}
								loading={(obj as any).updating}
								onClick={() => this.props.onEdit(obj, tableRef)}
							>
								<Icon name="edit" /> {this.props.t("Edit")}
							</Button>
						) : null}
						{_canDelete && (
							<Button
								color="red"
								disabled={(obj as any).updating}
								loading={(obj as any).updating}
								onClick={() => {
									if (this.props.onDelete) {
										this.props.onDelete(obj, tableRef)
									}
								}}
							>
								<Icon name="trash" /> {this.props.t("Remove")}
							</Button>
						)}
						{actions && actions(obj, tableRef)}
					</Table.Cell>
				) : null}
			</Table.Row>
		)
	}
}
