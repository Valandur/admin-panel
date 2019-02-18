import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form } from 'semantic-ui-react';

import { AppAction } from '../../../actions';
import { ListRequestAction, requestList } from '../../../actions/dataview';
import DataViewFunc from '../../../components/DataView';
import Location from '../../../components/Location';
import { renderWorldOptions } from '../../../components/Util';
import { NucleusNamedLocation, World } from '../../../fetch';
import { AppState } from '../../../types';

const DataView = DataViewFunc('nucleus/jail', 'name');

interface Props extends WithTranslation {
	worlds: World[];
	requestWorlds: () => ListRequestAction;
}

interface OwnState {}

class Jails extends React.Component<Props, OwnState> {
	componentDidMount() {
		this.props.requestWorlds();
	}

	public render() {
		const _t = this.props.t;

		return (
			<DataView
				canDelete
				icon="wrench"
				title={_t('Jails')}
				filterTitle={_t('FilterJails')}
				createTitle={_t('CreateJail')}
				fields={{
					name: {
						label: _t('Name'),
						create: true,
						filter: true,
						required: true,
						wide: true
					},
					world: {
						label: _t('World'),
						view: false,
						create: true,
						createName: 'location.world',
						filter: true,
						filterName: 'location.world.uuid',
						options: renderWorldOptions(this.props.worlds),
						required: true
					},
					position: {
						label: _t('Location'),
						isGroup: true,
						wide: true,
						view: (jail: NucleusNamedLocation) => (
							<Location location={jail.location} />
						),
						create: view => (
							<Form.Group inline>
								<label>Position</label>
								<Form.Input
									type="number"
									width={6}
									name="location.position.x"
									placeholder="X"
									value={view.state['location.position.x']}
									onChange={view.handleChange}
								/>
								<Form.Input
									type="number"
									width={6}
									name="location.position.y"
									placeholder="Y"
									value={view.state['location.position.y']}
									onChange={view.handleChange}
								/>
								<Form.Input
									type="number"
									width={6}
									name="location.position.z"
									placeholder="Z"
									value={view.state['location.position.z']}
									onChange={view.handleChange}
								/>
							</Form.Group>
						)
					}
				}}
			/>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList('world', true))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Integrations.Nucleus')(Jails));
