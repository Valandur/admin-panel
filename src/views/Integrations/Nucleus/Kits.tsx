import * as _ from 'lodash';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Dropdown, Form, Input, Label, Popup } from 'semantic-ui-react';

import {
	AppAction,
	CatalogRequestAction,
	requestCatalog
} from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import ItemStack from '../../../components/ItemStack';
import {
	handleChange,
	HandleChangeFunc,
	renderCatalogTypeOptions
} from '../../../components/Util';
import { CatalogType, NucleusKit } from '../../../fetch';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('nucleus/kit', 'name');

interface Props extends WithTranslation {
	itemTypes: CatalogType[];
	requestCatalog: (type: string) => CatalogRequestAction;
}

interface OwnState {
	newKitCmd: string;
	newItemType: string;
	newItemAmount: number;
}

class Kits extends React.Component<Props, OwnState> {
	private handleChange: HandleChangeFunc;

	public constructor(props: Props) {
		super(props);

		this.state = {
			newKitCmd: '',
			newItemType: '',
			newItemAmount: 1
		};

		this.handleChange = handleChange.bind(this, null);
	}

	public componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Item);
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<NucleusKit> = {
			name: {
				label: t('Name'),
				create: true,
				filter: true,
				required: true
			},
			cost: {
				label: t('Cost'),
				type: 'number',
				edit: true,
				create: true,
				required: true
			},
			cooldown: {
				label: t('Cooldown'),
				type: 'number',
				edit: true,
				create: true,
				required: true
			},
			commands: {
				label: t('Commands'),
				wide: true,
				view: this.renderCommands
			},
			stacks: {
				label: t('Stacks'),
				wide: true,
				view: this.renderStacks
			}
		};

		return (
			<DataView
				canEdit
				canDelete
				icon="wrench"
				title={t('Kits')}
				filterTitle={t('FilterKits')}
				createTitle={t('CreateKit')}
				fields={fields}
			/>
		);
	}

	private renderCommands = (kit: NucleusKit, view: DataViewRef<NucleusKit>) => {
		const { t } = this.props;

		const cmds = kit.commands.map((cmd, i) => {
			const onRemove = () => this.removeCmd(view, kit, i);
			return (
				<Label key={i} color="blue" content={'/' + cmd} onRemove={onRemove} />
			);
		});

		const action = {
			color: 'green',
			content: t('Add'),
			onClick: () => this.addCmd(view, kit)
		};
		const content = (
			<Input
				name="newKitCmd"
				action={action}
				placeholder="/say Hi"
				value={this.state.newKitCmd}
				onChange={this.handleChange}
			/>
		);

		return (
			<>
				{cmds}
				<Popup
					on="click"
					position="top right"
					trigger={<Button positive icon="plus" size="mini" />}
					content={content}
				/>
			</>
		);
	};

	private renderStacks = (kit: NucleusKit, view: DataViewRef<NucleusKit>) => {
		const { t } = this.props;

		const kits = kit.stacks.map((item, i) => {
			const onRemove = () => this.removeStack(view, kit, i);
			return <ItemStack key={i} item={item} onRemove={onRemove} />;
		});

		const action = {
			color: 'green',
			content: t('Add'),
			onClick: () => this.addStack(view, kit)
		};
		const content = (
			<Form>
				<Form.Field
					required
					fluid
					selection
					search
					name="newItemType"
					control={Dropdown}
					placeholder={t('Type')}
					onChange={this.handleChange}
					options={renderCatalogTypeOptions(this.props.itemTypes)}
				/>
				<Form.Input
					name="newItemAmount"
					type="number"
					placeholder={t('Amount')}
					onChange={this.handleChange}
					action={action}
				/>
			</Form>
		);

		return (
			<>
				{kits}
				<Popup
					on="click"
					position="top right"
					trigger={<Button positive icon="plus" size="mini" />}
					content={content}
				/>
			</>
		);
	};

	private addCmd(view: DataViewRef<NucleusKit>, kit: NucleusKit) {
		let cmd = this.state.newKitCmd;
		if (_.startsWith(cmd, '/')) {
			cmd = cmd.substring(1);
		}

		view.save(kit, {
			commands: kit.commands.concat(cmd)
		});
	}

	private removeCmd(
		view: DataViewRef<NucleusKit>,
		kit: NucleusKit,
		cmdIndex: number
	) {
		view.save(kit, {
			commands: kit.commands.filter((__, i) => i !== cmdIndex)
		});
	}

	private addStack(view: DataViewRef<NucleusKit>, kit: NucleusKit) {
		view.save(kit, {
			stacks: kit.stacks.concat({
				type: {
					id: this.state.newItemType,
					name: ''
				},
				quantity: this.state.newItemAmount ? this.state.newItemAmount : 1
			})
		});
	}

	private removeStack(
		view: DataViewRef<NucleusKit>,
		kit: NucleusKit,
		index: number
	) {
		view.save(kit, {
			stacks: kit.stacks.filter((__, i) => i !== index)
		});
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		itemTypes: state.api.types[CatalogTypeKeys.Item]
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Integrations.Nucleus')(Kits));
