import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Icon, Message, Segment } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { setPreference } from '../../actions/preferences';
import { requestSaveProperty } from '../../actions/server-settings';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import { checkPermissions } from '../../components/Util';
import {
	AppState,
	DataViewRef,
	EServerProperty,
	PermissionTree,
	PreferenceKey
} from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('server/properties', 'key');

interface OwnProps {
	perms?: PermissionTree;
	hideNote: boolean;
}

interface Props extends OwnProps, WithTranslation {
	requestSaveProperty: (prop: EServerProperty) => AppAction;
	doHideNote: () => AppAction;
}

interface OwnState {}

class ServerSettings extends React.Component<Props, OwnState> {
	public render() {
		const { t } = this.props;

		const fields: DataViewFields<EServerProperty> = {
			key: {
				label: t('Key')
			},
			value: {
				label: t('Value'),
				view: obj => {
					if (obj.value === 'true' || obj.value === 'false') {
						return (
							<Icon
								color={obj.value === 'true' ? 'green' : 'red'}
								name={obj.value === 'true' ? 'check' : 'delete'}
							/>
						);
					}
					return obj.value;
				},
				edit: (obj, view) => {
					if (obj.value === 'true' || obj.value === 'false') {
						const onChange = () => {
							view.setState({
								value: view.state.value === 'true' ? 'false' : 'true'
							});
						};
						return (
							<Form.Radio
								toggle
								name="value"
								checked={view.state.value === 'true'}
								onChange={onChange}
							/>
						);
					}

					return (
						<Form.Input
							name="value"
							type="text"
							placeholder="Value"
							value={view.state.value}
							onChange={view.handleChange}
						/>
					);
				}
			}
		};

		const note = !this.props.hideNote && (
			<Segment basic>
				<Message info onDismiss={this.props.doHideNote}>
					<Message.Header>{t('InfoTitle')}</Message.Header>
					<p>{t('InfoText')}</p>
				</Message>
			</Segment>
		);

		return (
			<>
				{note}

				<DataView
					canEdit={this.canEdit}
					icon="cogs"
					title={t('ServerSettings')}
					fields={fields}
					onSave={this.onSave}
				/>
			</>
		);
	}

	private canEdit = (obj: EServerProperty) => {
		return checkPermissions(this.props.perms, [
			'server',
			'properties',
			'modify',
			obj.key
		]);
	};

	private onSave = (
		data: EServerProperty,
		newData: any,
		view: DataViewRef<EServerProperty>
	) => {
		this.props.requestSaveProperty({
			...data,
			value: newData.value
		});
		view.endEdit();
	};
}

const mapStateToProps = (state: AppState): OwnProps => {
	return {
		perms: state.api.permissions,
		hideNote: state.preferences.hideServerSettingsNote
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestSaveProperty: (prop: EServerProperty): AppAction =>
			dispatch(requestSaveProperty(prop)),
		doHideNote: (): AppAction =>
			dispatch(setPreference(PreferenceKey.hideServerSettingsNote, true))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('ServerSettings')(ServerSettings));
