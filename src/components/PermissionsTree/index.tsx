import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, List, Popup } from 'semantic-ui-react';

import { KNOWN_PERMISSIONS } from '../../types';

const PERMISSION_OPTIONS = [
	{ icon: 'checkmark', text: 'Allow', value: true },
	{ icon: 'ban', text: 'Deny', value: false },
	{
		icon: 'caret down',
		text: 'Custom',
		value: '__custom__'
	}
];

export interface Props {
	permissions: any;
	sub?: boolean;
	canEdit?: boolean;
	onChange?: (key: string[], value: string | boolean) => void;
	onDelete?: (key: string[]) => void;
	knownPermissions?: any;
}

interface State {
	newName?: string;
	newValue?: string | boolean;
}

export class PermissionsTree extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {};
	}

	private handleChange(key: string[], value: string | boolean) {
		if (this.props.onChange) {
			this.props.onChange(key, value);
		}
	}
	private handleDelete(key: string[]) {
		if (this.props.onDelete) {
			this.props.onDelete(key);
		}
	}

	public render(): JSX.Element {
		const { permissions, sub } = this.props;
		// tslint:disable-next-line:variable-name
		const Elem = sub ? List.List : List;

		const perms = Object.keys(permissions)
			.sort((a, b) => a.localeCompare(b))
			.map(key => this.renderKey(key));

		return (
			<Elem>
				{perms}
				{this.renderEditor()}
			</Elem>
		);
	}

	private renderKey(key: string) {
		const { canEdit, permissions } = this.props;
		const subPerms = permissions[key];
		const isSimple = typeof subPerms === 'boolean';

		const knownPerms = this.props.knownPermissions
			? this.props.knownPermissions
			: KNOWN_PERMISSIONS;

		const onDelete = () => this.handleDelete([key]);
		const editButton = canEdit && (
			<Button negative size="mini" icon="delete" onClick={onDelete} />
		);

		const onSubTreeChange = (k: string[], v: string | boolean) =>
			this.handleChange([key, ...k], v);
		const onSubTreeDelete = (k: string[]) => this.handleDelete([key, ...k]);
		const subTree = !isSimple && (
			<PermissionsTree
				sub
				canEdit={this.props.canEdit}
				permissions={permissions[key]}
				onChange={onSubTreeChange}
				onDelete={onSubTreeDelete}
				knownPermissions={knownPerms[key] ? knownPerms[key] : {}}
			/>
		);

		return (
			<List.Item key={key}>
				{this.renderMain(key)}

				<List.Content>
					{key} {editButton}
					{subTree}
				</List.Content>
			</List.Item>
		);
	}

	private renderMain(key: string) {
		const { canEdit, permissions } = this.props;
		const subPerms = permissions[key];
		const isSimple = typeof subPerms === 'boolean';

		const iconName = isSimple
			? permissions[key]
				? 'checkmark'
				: 'ban'
			: 'caret down';
		const icon = (
			<List.Icon
				size={canEdit ? 'large' : undefined}
				color={isSimple ? (permissions[key] ? 'green' : 'red') : undefined}
				name={iconName}
			/>
		);

		if (!canEdit) {
			return icon;
		}

		const onGrant = () => this.handleChange([key], true);
		const onReject = () => this.handleChange([key], false);
		const onCustom = () => this.handleChange([key], '__custom__');
		const content = (
			<>
				<Button.Group>
					<Button icon="checkmark" color="green" onClick={onGrant} />
					<Button icon="ban" color="red" onClick={onReject} />
					<Button icon="caret down" onClick={onCustom} />
				</Button.Group>
			</>
		);

		return (
			<Popup
				hoverable
				trigger={icon}
				content={content}
				position="top right"
				on={['hover', 'click']}
			/>
		);
	}

	private renderEditor() {
		if (!this.props.canEdit) {
			return null;
		}

		return (
			<List.Item>
				<List.Content>
					<Popup
						on="click"
						trigger={<Button positive icon="add" size="mini" />}
						content={this.renderForm()}
					/>
				</List.Content>
			</List.Item>
		);
	}

	private renderForm() {
		const { newName, newValue } = this.state;

		const knownPerms = this.props.knownPermissions
			? this.props.knownPermissions
			: KNOWN_PERMISSIONS;
		const pathOptions = _.uniq(
			['*', '.', this.state.newName].concat(Object.keys(knownPerms))
		).map(k => ({ text: k, value: k }));

		const onPermissionsChange = (e: any, p: any) =>
			this.setState({ newValue: p.value });
		const onPathChange = (e: any, p: any) =>
			this.setState({ newName: p.value });
		const onSubmit = () => this.handleChange([newName as any], newValue as any);

		return (
			<Form>
				<Form.Select
					label="Permissions"
					options={PERMISSION_OPTIONS}
					onChange={onPermissionsChange}
				/>
				<Form.Select
					search
					allowAdditions
					label="Path"
					options={pathOptions}
					onChange={onPathChange}
				/>
				<Form.Button
					primary
					type="submit"
					disabled={!this.state.newName || !this.state.newValue}
					onClick={onSubmit}
				>
					Add
				</Form.Button>
			</Form>
		);
	}
}
