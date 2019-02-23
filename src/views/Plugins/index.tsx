import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Form,
	Label,
	Loader,
	Message,
	Modal,
	Segment,
	Tab
} from 'semantic-ui-react';

import { AppAction } from '../../actions';
import {
	requestPluginConfig,
	requestPluginConfigSave,
	requestPluginToggle
} from '../../actions/plugin';
import { setPreference } from '../../actions/preferences';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import { JSON_EDITOR_MODE, ReactJSONEditor } from '../../components/JsonEditor';
import { checkPermissions } from '../../components/Util';
import { PluginContainer } from '../../fetch';
import {
	AppState,
	DataViewRef,
	PermissionTree,
	PreferenceKey
} from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('plugin', 'id', true);

const noDetailsIds = ['forge', 'minecraft', 'spongeapi', 'mcp'];
const noToggleIds = [
	'forge',
	'minecraft',
	'sponge',
	'spongeapi',
	'mcp',
	'webapi'
];
const typeOptions = [
	{
		value: PluginContainer.TypeEnum.Forge.toString(),
		text: 'Forge'
	},
	{
		value: PluginContainer.TypeEnum.Minecraft.toString(),
		text: 'Minecraft'
	},
	{
		value: PluginContainer.TypeEnum.Sponge.toString(),
		text: 'Sponge'
	},
	{
		value: PluginContainer.TypeEnum.Unknown.toString(),
		text: 'Unknown'
	}
];
const stateOptions = [
	{
		value: PluginContainer.StateEnum.Loaded.toString(),
		text: 'Loaded'
	},
	{
		value: PluginContainer.StateEnum.Unloaded.toString(),
		text: 'Unloaded'
	},
	{
		value: PluginContainer.StateEnum.WillBeLoaded.toString(),
		text: 'Will be loaded'
	},
	{
		value: PluginContainer.StateEnum.WillBeUnloaded.toString(),
		text: 'Will be unloaded'
	}
];

interface OwnProps {
	configs: {
		[x: string]: any;
	};
	hideNote: boolean;
	perms?: PermissionTree;
}

interface Props extends OwnProps, WithTranslation {
	requestPluginToggle: (id: string) => AppAction;
	requestPluginConfig: (id: string) => AppAction;
	requestPluginConfigSave: (
		id: string,
		plugin: PluginContainer,
		configs: any
	) => AppAction;
	doHideNote: () => AppAction;
}

interface OwnState {
	activeTab?: number;
	modal: boolean;
	plugin?: PluginContainer;
	configs?: {
		[x: string]: any;
	};
}

class Plugins extends React.Component<Props, OwnState> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.save = this.save.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	private toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	public componentWillReceiveProps(nextProps: Props) {
		if (nextProps.configs) {
			this.setState({
				configs: JSON.parse(JSON.stringify(nextProps.configs))
			});
		}
	}

	private showDetails(
		plugin: PluginContainer,
		view: DataViewRef<PluginContainer>
	) {
		this.setState({
			modal: true,
			plugin: plugin,
			configs: undefined
		});
		this.props.requestPluginConfig(plugin.id);
	}

	private handleChange(name: string, json: any) {
		this.setState({
			configs: {
				[name]: json
			}
		});
	}

	private save() {
		const plugin = this.state.plugin;
		if (!plugin) {
			return;
		}
		this.props.requestPluginConfigSave(plugin.id, plugin, this.state.configs);
		this.toggleModal();
	}

	private typeToColor(plugin: PluginContainer) {
		return plugin.type === PluginContainer.TypeEnum.Forge
			? 'red'
			: plugin.type === PluginContainer.TypeEnum.Minecraft
			? 'blue'
			: plugin.type === PluginContainer.TypeEnum.Sponge
			? 'yellow'
			: 'grey';
	}

	private stateToColor(plugin: PluginContainer) {
		return plugin.state === PluginContainer.StateEnum.Loaded
			? 'green'
			: plugin.state === PluginContainer.StateEnum.Unloaded
			? 'red'
			: 'yellow';
	}

	private togglePlugin(plugin: PluginContainer) {
		this.props.requestPluginToggle(plugin.id);
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<PluginContainer> = {
			id: t('Id'),
			name: t('Name'),
			version: t('Version'),
			type: {
				label: t('Type'),
				view: (p: PluginContainer) => (
					<Label color={this.typeToColor(p)}>{p.type.toString()}</Label>
				),
				options: typeOptions,
				filter: true
			},
			state: {
				label: t('State'),
				view: (plugin: PluginContainer) => (
					<Label color={this.stateToColor(plugin)}>
						{t(plugin.state.toString())}
					</Label>
				),
				options: stateOptions,
				filter: true
			},
			filter: {
				view: false,
				filter: view => (
					<Form.Input
						type="text"
						name="filter"
						label="Name"
						placeholder="Name"
						onChange={view.handleChange}
						value={view.value}
					/>
				),
				filterValue: (p: PluginContainer) => p.id + ' ' + p.name
			}
		};

		return (
			<>
				{this.renderNote()}

				<DataView
					icon="plug"
					title={t('Plugins')}
					filterTitle={t('Filter plugins')}
					fields={fields}
					actions={this.renderActions}
				/>

				{this.renderModal()}
			</>
		);
	}

	private renderNote() {
		if (this.props.hideNote) {
			return null;
		}

		return (
			<Segment basic>
				<Message warning onDismiss={this.props.doHideNote}>
					<Message.Header>{this.props.t('WarnTitle')}</Message.Header>
					<p>
						<Trans i18nKey="WarnText">
							Web-API automatically makes a backup of your configs before saving
							them, but caution is still advised when changing config values. To
							apply your new configs use <b>/sponge plugins reload</b>. Plugins
							are not required to implement the reload event, so this might not
							work for all plugins. Use a server restart if required.
						</Trans>
					</p>
				</Message>
			</Segment>
		);
	}

	private renderActions = (
		plugin: PluginContainer,
		view: DataViewRef<PluginContainer>
	) => {
		return (
			<>
				{this.renderConfigButton(plugin, view)}
				{this.renderToggleButton(plugin)}
			</>
		);
	};
	private renderConfigButton(
		plugin: PluginContainer,
		view: DataViewRef<PluginContainer>
	) {
		if (
			noDetailsIds.indexOf(plugin.id) !== -1 ||
			!checkPermissions(this.props.perms, [
				'plugin',
				'config',
				'modify',
				plugin.id
			])
		) {
			return null;
		}

		const onShowDetails = () => this.showDetails(plugin, view);
		return (
			<Button primary onClick={onShowDetails}>
				{this.props.t('Configs')}
			</Button>
		);
	}
	private renderToggleButton(plugin: PluginContainer) {
		if (
			noToggleIds.indexOf(plugin.id) !== -1 ||
			!checkPermissions(this.props.perms, [
				'plugin',
				'config',
				'toggle',
				plugin.id
			])
		) {
			return null;
		}

		const { t } = this.props;

		const stateText =
			plugin.state === PluginContainer.StateEnum.Loaded
				? t('Unload')
				: plugin.state === PluginContainer.StateEnum.Unloaded
				? t('Load')
				: t('Cancel');
		const onTogglePlugin = () => this.togglePlugin(plugin);
		return (
			<Button secondary onClick={onTogglePlugin}>
				{stateText}
			</Button>
		);
	}

	private renderModal() {
		if (!this.state.plugin) {
			return null;
		}

		const _t = this.props.t;

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>
					{this.state.plugin.name}{' '}
					<Label color="blue">{this.state.plugin.version}</Label>
				</Modal.Header>
				<Modal.Content>{this.renderModalTabs()}</Modal.Content>
				<Modal.Actions>
					<Button primary content={_t('Save')} onClick={this.save} />
					<Button content={_t('Cancel')} onClick={this.toggleModal} />
				</Modal.Actions>
			</Modal>
		);
	}

	private renderModalTabs() {
		if (!this.state.configs) {
			return <Loader />;
		}

		const panes = Object.keys(this.state.configs).map(name => {
			const onChange = (newConf: string) => this.handleChange(name, newConf);
			return {
				menuItem: name,
				render: () => (
					<ReactJSONEditor
						key={name}
						mode={JSON_EDITOR_MODE.tree}
						json={this.props.configs[name]}
						onChange={onChange}
						width="100%"
						height="calc(100vh - 20em)"
					/>
				)
			};
		});

		return <Tab panes={panes} />;
	}
}

const mapStateToProps = (state: AppState): OwnProps => {
	return {
		configs: state.plugin.configs,
		hideNote: state.preferences.hidePluginsNote,
		perms: state.api.permissions
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestPluginToggle: (id: string): AppAction =>
			dispatch(requestPluginToggle(id)),
		requestPluginConfig: (id: string): AppAction =>
			dispatch(requestPluginConfig(id)),
		requestPluginConfigSave: (
			id: string,
			plugin: PluginContainer,
			configs: any
		): AppAction => dispatch(requestPluginConfigSave(id, plugin, configs)),
		doHideNote: (): AppAction =>
			dispatch(setPreference(PreferenceKey.hidePluginsNote, true))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Plugins')(Plugins));
