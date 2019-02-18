import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import { Table } from 'semantic-ui-react';

import { DataFieldRaw } from '../../types';

export interface Props<T> extends WithTranslation {
	hasActions: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
	fields: DataFieldRaw<T>[];
}

export default class DataTableHeader<T> extends React.Component<Props<T>> {
	public shouldComponentUpdate(nextProps: Props<T>, nextState: any) {
		return nextProps.fields !== this.props.fields;
	}

	public render() {
		return (
			<Table.Header>
				<Table.Row>
					{this.renderFields()}
					{this.renderActions()}
				</Table.Row>
			</Table.Header>
		);
	}

	private renderFields() {
		return Object.keys(this.props.fields).map(name => {
			const field = this.props.fields[name];
			return (
				<Table.HeaderCell key={name}>
					{field.label ? field.label : '<' + field.name + '>'}
				</Table.HeaderCell>
			);
		});
	}

	private renderActions() {
		if (
			!this.props.hasActions &&
			!this.props.canEdit &&
			!this.props.canDelete
		) {
			return null;
		}
		return <Table.HeaderCell>{this.props.t('Actions')}</Table.HeaderCell>;
	}
}
