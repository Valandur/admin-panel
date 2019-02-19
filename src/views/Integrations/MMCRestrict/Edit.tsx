import * as React from 'react';
import { Radio } from 'semantic-ui-react';

import { DataTableRef } from '../../../types';

interface Props {
	view: DataTableRef;
	name: string;
}

export default class extends React.Component<Props> {
	public render() {
		const { view, name } = this.props;

		return (
			<Radio
				toggle
				name={name}
				checked={view.state[name]}
				onChange={this.onChange}
			/>
		);
	}

	private onChange = () => {
		const { view, name } = this.props;
		view.setState({ [name]: !view.state[name] });
	};
}
