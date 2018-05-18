import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, List, Popup } from 'semantic-ui-react';

import { KnownPermissions } from '../../types';

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
	constructor(props: Props) {
		super(props);

		this.state = {};
	}

	handleChange(key: string[], value: string | boolean) {
		if (this.props.onChange) {
			this.props.onChange(key, value);
		}
	}
	handleDelete(key: string[]) {
		if (this.props.onDelete) {
			this.props.onDelete(key);
		}
	}

	render(): JSX.Element {
		const { canEdit, permissions, sub, knownPermissions } = this.props;
		const Elem = sub ? List.List : List;

		const knownPerms = knownPermissions ? knownPermissions : KnownPermissions;
		const pathOptions = _.uniq(
			['*', '.', this.state.newName].concat(Object.keys(knownPerms))
		).map(k => ({ text: k, value: k }));

		return (
			<Elem>
				{Object.keys(permissions)
					.sort((a, b) => a.localeCompare(b))
					.map(key => {
						const subPerms = permissions[key];
						const isSimple = typeof subPerms === 'boolean';

						const icon = (
							<List.Icon
								size={canEdit ? 'large' : undefined}
								color={
									isSimple ? (permissions[key] ? 'green' : 'red') : undefined
								}
								name={
									isSimple
										? permissions[key]
											? 'checkmark'
											: 'ban'
										: 'caret down'
								}
							/>
						);

						return (
							<List.Item key={key}>
								{!canEdit ? (
									icon
								) : (
									<Popup
										hoverable
										trigger={icon}
										content={
											<>
												<Button.Group>
													<Button
														icon="checkmark"
														color="green"
														onClick={() => this.handleChange([key], true)}
													/>
													<Button
														icon="ban"
														color="red"
														onClick={() => this.handleChange([key], false)}
													/>
													<Button
														icon="caret down"
														onClick={() =>
															this.handleChange([key], '__custom__')
														}
													/>
												</Button.Group>
											</>
										}
										position="top right"
										on={['hover', 'click']}
									/>
								)}

								<List.Content>
									{key}{' '}
									{canEdit && (
										<Button
											negative
											size="mini"
											icon="delete"
											onClick={() => this.handleDelete([key])}
										/>
									)}
									{!isSimple && (
										<PermissionsTree
											sub
											canEdit={this.props.canEdit}
											permissions={permissions[key]}
											onChange={(k, v) => this.handleChange([key, ...k], v)}
											onDelete={k => this.handleDelete([key, ...k])}
											knownPermissions={knownPerms[key] ? knownPerms[key] : {}}
										/>
									)}
								</List.Content>
							</List.Item>
						);
					})}
				{canEdit && (
					<List.Item>
						<List.Content>
							<Popup
								on="click"
								trigger={<Button positive icon="add" size="mini" />}
								content={
									<Form>
										<Form.Select
											label="Permissions"
											options={[
												{ icon: 'checkmark', text: 'Allow', value: true },
												{ icon: 'ban', text: 'Deny', value: false },
												{
													icon: 'caret down',
													text: 'Custom',
													value: '__custom__'
												}
											]}
											onChange={(e, p) =>
												this.setState({ newValue: p.value as any })
											}
										/>
										<Form.Select
											search
											allowAdditions
											label="Path"
											options={pathOptions}
											onChange={(e, p) =>
												this.setState({ newName: p.value as any })
											}
										/>
										<Form.Button
											primary
											type="submit"
											disabled={!this.state.newName || !this.state.newValue}
											onClick={() =>
												this.handleChange([this.state.newName as any], this
													.state.newValue as any)
											}
										>
											Add
										</Form.Button>
									</Form>
								}
							/>
						</List.Content>
					</List.Item>
				)}
			</Elem>
		);
	}
}
