import * as React from 'react';
import { Table } from 'semantic-ui-react';

import { DataFieldRaw } from '../../types';

export interface Props<T> extends reactI18Next.InjectedTranslateProps {
	hasActions: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
	fields: DataFieldRaw<T>[];
}

export default class DataTableHeader<T> extends React.Component<Props<T>> {
	shouldComponentUpdate(nextProps: Props<T>, nextState: any) {
		return nextProps.fields !== this.props.fields;
	}

	render() {
		return (
			<Table.Header>
				<Table.Row>
					{Object.keys(this.props.fields).map(name => {
						const field = this.props.fields[name];
						return (
							<Table.HeaderCell key={name}>
								{field.label ? field.label : '<' + field.name + '>'}
							</Table.HeaderCell>
						);
					})}
					{this.props.hasActions ||
					this.props.canEdit ||
					this.props.canDelete ? (
						<Table.HeaderCell>{this.props.t('Actions')}</Table.HeaderCell>
					) : null}
				</Table.Row>
			</Table.Header>
		);
	}
}
