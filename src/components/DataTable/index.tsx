import * as _ from 'lodash';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header, Icon, SemanticICONS, Table } from 'semantic-ui-react';

import i18n from '../../services/i18n';
import { DataFieldRaw, DataTableRef, IdFunction } from '../../types';
import { handleChange, HandleChangeFunc } from '../Util';

import Pagination from './Pagination';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const ITEMS_PER_PAGE = 20;

export type DataTableFields<T> = {
	[key: string]: DataFieldRaw<T>;
};

export interface Props<T> {
	title?: string;
	icon?: SemanticICONS;
	list: T[];
	canEdit?: (data: T) => boolean;
	canDelete?: (data: T) => boolean;
	fields: DataTableFields<T>;
	actions?: (data: T, view: DataTableRef) => JSX.Element | undefined;
	onEdit?: (data: T | undefined, view: DataTableRef) => void;
	onSave?: (data: T, newData: any, view: DataTableRef) => void;
	onDelete?: (data: T, view: DataTableRef) => void;
	idFunc: IdFunction<T>;
	isEditing: (data: T) => boolean;
}

interface AllProps<T> extends Props<T>, WithTranslation {}

interface OwnState {
	page: number;
	newData: any;
}

class DataTable<T> extends React.Component<AllProps<T>, OwnState> {
	private handleChange: HandleChangeFunc;

	public constructor(props: AllProps<T>) {
		super(props);

		this.state = {
			page: 0,
			newData: {}
		};

		this.changePage = this.changePage.bind(this);
		this.doHandleChange = this.doHandleChange.bind(this);
		this.handleChange = handleChange.bind(this, this.doHandleChange);
	}

	private doHandleChange(key: string, value: string) {
		this.setState({
			newData: {
				...this.state.newData,
				[key]: value
			}
		});
	}

	private changePage = (event: React.MouseEvent<HTMLElement>, page: number) => {
		event.preventDefault();

		this.setState({
			page: page
		});
	};

	private onEdit = (obj: T | undefined, view: DataTableRef): void => {
		const newData = {};
		if (obj) {
			Object.keys(this.props.fields).forEach(name => {
				if (!this.props.fields[name].edit) {
					return;
				}
				newData[name] = _.get(obj, name);
			});
		}

		this.setState({
			newData: newData
		});

		if (this.props.onEdit) {
			this.props.onEdit(obj, view);
		}
	};

	public shouldComponentUpdate(nextProps: Props<T>, nextState: OwnState) {
		return (
			nextProps.fields !== this.props.fields ||
			nextProps.list !== this.props.list ||
			nextState.page !== this.state.page ||
			nextState.newData !== this.state.newData
		);
	}

	public render() {
		const { list, canEdit, canDelete, actions } = this.props;
		const fields = Object.keys(this.props.fields)
			.map(f => this.props.fields[f])
			.filter(f => f.view);

		const maxPage = Math.ceil(list.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		const _t = this.props.t;
		const tReady = this.props.tReady;
		const editable = _.some(list, canEdit);
		const deletable = _.some(list, canDelete);

		return (
			<div style={{ marginTop: '2em' }}>
				{this.renderHeader()}

				<Table striped={true} stackable>
					<TableHeader
						fields={fields}
						hasActions={typeof actions !== typeof undefined}
						canEdit={editable}
						canDelete={deletable}
						i18n={i18n}
						t={_t}
						tReady={tReady}
					/>
					<Table.Body>{this.renderRows(fields, page)}</Table.Body>
				</Table>
				<Pagination page={page} maxPage={maxPage} changePage={this.changePage} />
			</div>
		);
	}

	private renderHeader() {
		const { icon, title } = this.props;

		if (!title) {
			return null;
		}

		return (
			<Header>
				<Icon fitted name={icon} /> {title}
			</Header>
		);
	}

	private renderRows(fields: DataFieldRaw<T>[], page: number) {
		const { list, canEdit, canDelete, actions, t, tReady } = this.props;

		const listPage = list.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		const thisRef: DataTableRef = {
			handleChange: this.handleChange,
			state: this.state.newData,
			setState: (changes: object) =>
				this.setState({
					newData: { ...this.state.newData, ...changes }
				})
		};

		const editable = _.some(list, canEdit);
		const deletable = _.some(list, canDelete);

		return listPage.map((obj, i) => (
			<TableRow
				key={this.props.idFunc(obj)}
				obj={obj}
				tableRef={thisRef}
				actionable={editable || deletable}
				canEdit={canEdit}
				canDelete={canDelete}
				editing={this.props.isEditing(obj)}
				fields={fields}
				onEdit={this.onEdit}
				onSave={this.props.onSave}
				onDelete={this.props.onDelete}
				actions={actions}
				newData={this.state.newData}
				handleChange={this.handleChange}
				i18n={i18n}
				t={t}
				tReady={tReady}
			/>
		));
	}
}

export default withTranslation('DataTable')(DataTable);
