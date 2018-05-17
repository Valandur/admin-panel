import * as _ from 'lodash';
import * as React from 'react';
import { translate } from 'react-i18next';
import { Header, Icon, SemanticICONS, Table } from 'semantic-ui-react';

import { DataFieldRaw, DataTableRef, IdFunction } from '../../types';
import { handleChange, HandleChangeFunc } from '../Util';

import Pagination from './Pagination';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const ITEMS_PER_PAGE = 20;

export interface Props<T> extends reactI18Next.InjectedTranslateProps {
	title?: string;
	icon?: SemanticICONS;
	list: T[];
	canEdit?: (data: T) => boolean;
	canDelete?: (data: T) => boolean;
	fields: {
		[key: string]: DataFieldRaw<T>;
	};
	actions?: (data: T, view: DataTableRef) => JSX.Element | undefined;
	onEdit?: (data: T | undefined, view: DataTableRef) => void;
	onSave?: (data: T, newData: any, view: DataTableRef) => void;
	onDelete?: (data: T, view: DataTableRef) => void;
	idFunc: IdFunction<T>;
	isEditing: (data: T) => boolean;
}

interface OwnState {
	page: number;
	newData: any;
}

class DataTable<T> extends React.Component<Props<T>, OwnState> {
	handleChange: HandleChangeFunc;

	constructor(props: Props<T>) {
		super(props);

		this.state = {
			page: 0,
			newData: {}
		};

		this.changePage = this.changePage.bind(this);
		this.doHandleChange = this.doHandleChange.bind(this);
		this.handleChange = handleChange.bind(this, this.doHandleChange);
	}

	doHandleChange(key: string, value: string) {
		this.setState({
			newData: {
				...this.state.newData,
				[key]: value
			}
		});
	}

	changePage(event: React.MouseEvent<HTMLElement>, page: number) {
		event.preventDefault();

		this.setState({
			page: page
		});
	}

	onEdit(obj: T | undefined, view: DataTableRef): void {
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
	}

	shouldComponentUpdate(nextProps: Props<T>, nextState: OwnState) {
		return (
			nextProps.fields !== this.props.fields ||
			nextProps.list !== this.props.list ||
			nextState.page !== this.state.page ||
			nextState.newData !== this.state.newData
		);
	}

	render() {
		const { icon, title, list, canEdit, canDelete, actions } = this.props;
		const fields = Object.keys(this.props.fields)
			.map(f => this.props.fields[f])
			.filter(f => f.view);

		const maxPage = Math.ceil(list.length / ITEMS_PER_PAGE);
		const page = Math.min(this.state.page, maxPage - 1);

		const listPage = list.slice(
			page * ITEMS_PER_PAGE,
			(page + 1) * ITEMS_PER_PAGE
		);

		const thisRef: DataTableRef = {
			handleChange: this.handleChange,
			state: this.state.newData,
			setState: (changes: object) =>
				this.setState({
					newData: { ...this.state.newData, ...changes }
				})
		};

		const _t = this.props.t;

		return (
			<div style={{ marginTop: '2em' }}>
				{title && (
					<Header>
						<Icon fitted name={icon} /> {title}
					</Header>
				)}

				<Table striped={true} stackable>
					<TableHeader
						fields={fields}
						hasActions={typeof actions !== 'undefined'}
						canEdit={!!canEdit}
						canDelete={!!canDelete}
						t={_t}
					/>
					<Table.Body>
						{listPage.map((obj, i) => (
							<TableRow
								key={this.props.idFunc(obj)}
								obj={obj}
								tableRef={thisRef}
								canEdit={canEdit}
								canDelete={canDelete}
								editing={this.props.isEditing(obj)}
								fields={fields}
								onEdit={(d: T, v) => this.onEdit(d, v)}
								onSave={this.props.onSave}
								onDelete={this.props.onDelete}
								actions={this.props.actions}
								newData={this.state.newData}
								handleChange={this.handleChange}
								t={_t}
							/>
						))}
					</Table.Body>
				</Table>
				<Pagination
					page={page}
					maxPage={maxPage}
					changePage={(e, p) => this.changePage(e, p)}
				/>
			</div>
		);
	}
}

export default translate('DataTable')(DataTable);
