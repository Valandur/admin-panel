import * as _ from 'lodash';
import * as React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Form, Modal } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import DataViewFunc from '../../components/DataView';
import { PermissionsTree } from '../../components/PermissionsTree';
import { UserPermissionStruct } from '../../fetch';
import { AppState, DataViewRef } from '../../types';

const DataView = DataViewFunc('user', 'name');

interface Props extends reactI18Next.InjectedTranslateProps {}

interface State {
	modal: boolean;
	user?: UserPermissionStruct;
	view?: DataViewRef<UserPermissionStruct>;
	permissions?: any;
}

class Users extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			modal: false
		};
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	showDetails(
		user: UserPermissionStruct | undefined,
		view: DataViewRef<UserPermissionStruct>
	) {
		this.setState({
			modal: true,
			user,
			view,
			permissions: user ? _.merge({}, user.permissions) : undefined
		});
	}

	handleChange(key: string[], val: string | boolean) {
		const newPerms = _.merge({}, this.state.permissions);
		if (val === '__custom__') {
			_.set(newPerms, key, {});
		} else {
			_.set(newPerms, key, val);
		}
		this.setState({ permissions: newPerms });
	}

	handleDelete(key: string[]) {
		const newPerms = _.merge({}, this.state.permissions);
		_.unset(newPerms, key);
		this.setState({ permissions: newPerms });
	}

	savePermissions() {
		if (!this.state.view || !this.state.user) {
			return;
		}

		this.state.view.save(this.state.user, {
			permissions: this.state.permissions
		});
		this.toggleModal();
	}

	render() {
		const { t } = this.props;

		return (
			<>
				<DataView
					canEdit
					canDelete
					icon="users"
					createTitle={t('CreateUser')}
					filterTitle={t('FilterUsers')}
					title={t('Users')}
					fields={{
						name: {
							required: true,
							label: t('Name'),
							create: true,
							filter: true
						},
						password: {
							required: true,
							create: (view: DataViewRef<UserPermissionStruct>) => (
								<Form.Input
									label={t('Password')}
									type="password"
									name="password"
									placeholder="********"
									value={view.state.password}
									onChange={view.handleChange}
								/>
							),
							view: false
						},
						permissions: {
							label: t('Permissions'),
							view: (user: UserPermissionStruct) => (
								<PermissionsTree permissions={user.permissions} />
							)
						}
					}}
					onEdit={(
						user: UserPermissionStruct | undefined,
						view: DataViewRef<UserPermissionStruct>
					) => this.showDetails(user, view)}
					onCreate={(data: any, view: DataViewRef<UserPermissionStruct>) =>
						view.create({ username: data.name, password: data.password })
					}
				/>
				{this.renderModal()}
			</>
		);
	}

	renderModal() {
		const { t } = this.props;
		const { user, modal, permissions } = this.state;

		if (!user) {
			return undefined;
		}

		return (
			<Modal
				open={modal}
				onClose={() => this.toggleModal()}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>{user.name} </Modal.Header>
				<Modal.Content>
					<PermissionsTree
						canEdit
						permissions={permissions}
						onChange={(key, val) => this.handleChange(key, val)}
						onDelete={key => this.handleDelete(key)}
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button primary onClick={() => this.savePermissions()}>
						{t('Save')}
					</Button>&nbsp;
					<Button secondary onClick={() => this.toggleModal()}>
						{t('Cancel')}
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(translate('Users')(Users));
