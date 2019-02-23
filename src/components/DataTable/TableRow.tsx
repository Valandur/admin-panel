import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { Button, Dropdown, Form, Icon, Table } from 'semantic-ui-react';

import { DataFieldRaw, DataTableRef } from '../../types';
import { get, HandleChangeFunc } from '../Util';

export interface Props<T> extends WithTranslation {
	obj: T;
	tableRef: DataTableRef;
	actionable: boolean;
	canEdit?: (data: T) => boolean;
	canDelete?: (data: T) => boolean;
	editing: boolean;
	fields: DataFieldRaw<T>[];
	onEdit: (data: T | undefined, view: DataTableRef) => void;
	onSave?: (data: T, newData: any, view: DataTableRef) => void;
	onDelete?: (data: T, view: DataTableRef) => void;
	actions?: (data: T, view: DataTableRef) => JSX.Element | undefined;
	handleChange: HandleChangeFunc;
	newData: any;
}

export default class TableRow<T> extends React.Component<Props<T>> {
	public shouldComponentUpdate(nextProps: Props<T>, nextState: any) {
		return (
			nextProps.obj !== this.props.obj ||
			nextProps.editing !== this.props.editing ||
			nextProps.fields !== this.props.fields ||
			(this.props.editing && nextProps.newData !== this.props.newData)
		);
	}

	private onSave = () => {
		const { obj, tableRef } = this.props;

		if (this.props.onSave) {
			this.props.onSave(obj, this.props.newData, tableRef);
		}
	};

	private onEditEmpty = () => {
		this.props.onEdit(undefined, this.props.tableRef);
	};

	private onEdit = () => {
		this.props.onEdit(this.props.obj, this.props.tableRef);
	};

	private onDelete = () => {
		if (this.props.onDelete) {
			this.props.onDelete(this.props.obj, this.props.tableRef);
		}
	};

	public render() {
		return (
			<Table.Row>
				{this.renderFields()}
				{this.renderActions()}
			</Table.Row>
		);
	}

	private renderFields() {
		const { fields } = this.props;

		return fields.map((field, j) => (
			<Table.Cell key={j} collapsing={!field.wide}>
				{this.renderField(field)}
			</Table.Cell>
		));
	}

	private renderField(field: DataFieldRaw<T>) {
		const { obj, editing, tableRef } = this.props;

		return field.edit && editing
			? typeof field.edit === 'function'
				? field.edit(obj, tableRef)
				: this.renderEdit(obj, field)
			: typeof field.view === 'function'
			? field.view(obj, tableRef)
			: get(obj, field.name);
	}

	private renderEdit(obj: T, col: DataFieldRaw<T>) {
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
			);
		}

		return (
			<Form.Input
				name={col.name}
				type={col.type ? col.type : 'text'}
				placeholder={col.label}
				value={this.props.newData[col.name]}
				onChange={this.props.handleChange}
			/>
		);
	}

	private renderActions() {
		const {
			actions,
			obj,
			actionable,
			canEdit,
			canDelete,
			editing,
			tableRef
		} = this.props;

		const _canEdit = typeof canEdit === 'function' ? canEdit(obj) : canEdit;
		const _canDelete =
			typeof canDelete === 'function' ? canDelete(obj) : canEdit;

		if (!actions && !actionable) {
			return null;
		}

		let edit = null;
		if (_canEdit && editing) {
			edit = (
				<Table.Cell collapsing>
					<Button
						primary
						disabled={(obj as any).updating}
						loading={(obj as any).updating}
						onClick={this.onSave}
					>
						<Icon name="save" /> {this.props.t('Save')}
					</Button>
					<Button
						secondary
						disabled={(obj as any).updating}
						loading={(obj as any).updating}
						onClick={this.onEditEmpty}
					>
						<Icon name="cancel" /> {this.props.t('Cancel')}
					</Button>
				</Table.Cell>
			);
		} else if (_canEdit) {
			edit = (
				<Table.Cell collapsing>
					<Button
						primary
						disabled={(obj as any).updating}
						loading={(obj as any).updating}
						onClick={this.onEdit}
					>
						<Icon name="edit" /> {this.props.t('Edit')}
					</Button>
				</Table.Cell>
			);
		}

		let del = null;
		if (_canDelete) {
			del = (
				<Button
					negative
					disabled={(obj as any).updating}
					loading={(obj as any).updating}
					onClick={this.onDelete}
				>
					<Icon name="trash" /> {this.props.t('Remove')}
				</Button>
			);
		}

		return (
			<Table.Cell collapsing>
				{edit}
				{del}
				{actions ? actions(obj, tableRef) : null}
			</Table.Cell>
		);
	}
}
