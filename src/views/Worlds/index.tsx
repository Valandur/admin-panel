import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Form,
	Grid,
	Icon,
	Label,
	Modal,
	Radio,
	Table
} from 'semantic-ui-react';

import { AppAction, CatalogRequestAction, requestCatalog } from '../../actions';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import { renderCatalogTypeOptions } from '../../components/Util';
import { CatalogType, World } from '../../fetch';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('world', 'uuid');

interface Props extends WithTranslation {
	dimTypes: CatalogType[] | undefined;
	genTypes: CatalogType[] | undefined;
	diffTypes: CatalogType[] | undefined;
	gmTypes: CatalogType[] | undefined;
	requestCatalog: (type: string) => CatalogRequestAction;
}

interface OwnState {
	modal: boolean;
	rules: { name: string; value: string }[];
	rulesWorld?: World;
	rulesView?: DataViewRef<World>;
}

class Worlds extends React.Component<Props, OwnState> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			modal: false,
			rules: []
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.saveGameRules = this.saveGameRules.bind(this);
	}

	public componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Dimension);
		this.props.requestCatalog(CatalogTypeKeys.Generator);
		this.props.requestCatalog(CatalogTypeKeys.Difficulty);
		this.props.requestCatalog(CatalogTypeKeys.GameMode);
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<World> = {
			name: {
				label: t('Name'),
				create: true,
				required: true,
				view: (world: World) => (
					<>
						<b>{world.name}</b>
						<br />
						<p style={{ fontSize: '0.8em' }}>{world.uuid}</p>
					</>
				)
			},
			'dimensionType.name': {
				label: t('Dimension'),
				create: true,
				createName: 'dimension.id',
				required: true,
				options: renderCatalogTypeOptions(this.props.dimTypes)
			},
			'generatorType.name': {
				label: t('Generator'),
				create: true,
				createName: 'generator.id',
				view: false,
				required: true,
				options: renderCatalogTypeOptions(this.props.genTypes)
			},
			'difficulty.name': {
				label: t('Difficulty'),
				create: true,
				createName: 'difficulty.id',
				view: false,
				required: true,
				options: renderCatalogTypeOptions(this.props.diffTypes)
			},
			'gameMode.name': {
				label: t('GameMode'),
				create: true,
				createName: 'gameMode.id',
				view: false,
				required: true,
				options: renderCatalogTypeOptions(this.props.gmTypes)
			},
			create: {
				isGroup: true,
				view: false,
				create: view => (
					<Form.Group inline>
						<label>{t('Features')}:</label>
						<Form.Checkbox
							name="loadOnStartup"
							label={t('LoadOnStartup')}
							checked={view.state.loadOnStartup}
							onChange={view.handleChange}
						/>
						<Form.Checkbox
							name="keepSpawnLoaded"
							label={t('KeepSpawnLoaded')}
							checked={view.state.keepSpawnLoaded}
							onChange={view.handleChange}
						/>
						<Form.Checkbox
							name="allowCommands"
							label={t('CommandsAllowed')}
							checked={view.state.allowCommands}
							onChange={view.handleChange}
						/>
						<Form.Checkbox
							name="generateBonusChest"
							label={t('GenerateBonusChest')}
							checked={view.state.generateBonusChest}
							onChange={view.handleChange}
						/>
						<Form.Checkbox
							name="usesMapFeatures"
							label={t('EnableMapFeatures')}
							checked={view.state.usesMapFeatures}
							onChange={view.handleChange}
						/>
					</Form.Group>
				)
			},
			info: {
				label: t('Info'),
				view: (world: World) => {
					const timeOfDay = moment
						.unix(((world.time % 24000) / 1200) * 86400)
						.format('HH:mm');
					return (
						<>
							<div style={{ display: 'inline-block', marginRight: '1em' }}>
								<Icon name="signal" />
								{world.difficulty && world.difficulty.name}
								<br />
								<Icon name="gamepad" />
								{world.gameMode && world.gameMode.name}
								<br />
								<Icon name="cloud" />
								{world.weather && world.weather.name}
							</div>
							<div style={{ display: 'inline-block' }}>
								<Icon name="calendar" />
								Day {Math.floor(world.time / 24000)}
								<br />
								<Icon name="clock" />
								{timeOfDay}
								<br />
								<p style={{ fontSize: '0.8em' }}>
									<Icon name="leaf" />
									{world.seed}
								</p>
							</div>
						</>
					);
				}
			},
			status: {
				label: t('Status'),
				view: (world: World) => (
					<Label color={world.loaded ? 'green' : 'yellow'}>
						{world.loaded ? t('Loaded') : t('Unloaded')}
					</Label>
				)
			}
		};

		return (
			<>
				<DataView
					icon="globe"
					title={t('Worlds')}
					createTitle={t('CreateWorld')}
					fields={fields}
					actions={this.renderActions}
				/>

				{this.renderModal()}
			</>
		);
	}

	private renderActions = (world: World, view: DataViewRef<World>) => {
		const { t } = this.props;

		const showGameRules = () => this.showGameRules(world, view);
		const save = () => view.save(world, { loaded: !world.loaded });
		const del = () => view.delete(world);
		const delButton = !world.loaded && (
			<Button negative disabled={(world as any).updating} onClick={del}>
				{t('Delete')}
			</Button>
		);
		return (
			<>
				<Button
					primary
					disabled={(world as any).updating}
					onClick={showGameRules}
				>
					{t('GameRules')}
				</Button>{' '}
				<Button secondary onClick={save} disabled={(world as any).updating}>
					{world.loaded ? t('Unload') : t('Load')}&nbsp;
				</Button>{' '}
				{delButton}{' '}
				{(world as any).updating ? <Icon name="spinner" loading /> : null}
			</>
		);
	};

	private renderModal() {
		if (!this.state.rules || !this.state.rulesWorld) {
			return null;
		}

		const { t } = this.props;

		const firstRules = this.state.rules
			.slice(0, this.state.rules.length / 2)
			.map(rule => {
				const onChange = () => this.toggleRule(rule.name);
				const val =
					rule.value === 'true' || rule.value === 'false' ? (
						<Radio toggle checked={rule.value === 'true'} onChange={onChange} />
					) : (
						rule.value
					);
				return (
					<Table.Row key={rule.name}>
						<Table.Cell>{rule.name}</Table.Cell>
						<Table.Cell>{val}</Table.Cell>
					</Table.Row>
				);
			});

		const secondRules = this.state.rules
			.slice(this.state.rules.length / 2)
			.map(rule => {
				const onChange = () => this.toggleRule(rule.name);
				const val =
					rule.value === 'true' || rule.value === 'false' ? (
						<Radio toggle checked={rule.value === 'true'} onChange={onChange} />
					) : (
						rule.value
					);
				return (
					<Table.Row key={rule.name}>
						<Table.Cell>{rule.name}</Table.Cell>
						<Table.Cell>{val}</Table.Cell>
					</Table.Row>
				);
			});

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>
					<Trans i18nKey="GameRulesTitle">
						Game Rules for '{this.state.rulesWorld.name}'
					</Trans>
					&nbsp; ({this.state.rulesWorld.dimensionType.name})
				</Modal.Header>
				<Modal.Content>
					<Grid columns={2}>
						<Grid.Column>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>{t('Name')}</Table.HeaderCell>
										<Table.HeaderCell>{t('Value')}</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>{firstRules}</Table.Body>
							</Table>
						</Grid.Column>

						<Grid.Column>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>{t('Name')}</Table.HeaderCell>
										<Table.HeaderCell>{t('Value')}</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>{secondRules}</Table.Body>
							</Table>
						</Grid.Column>
					</Grid>
				</Modal.Content>
				<Modal.Actions>
					<Button primary onClick={this.saveGameRules}>
						{t('Save')}
					</Button>
					&nbsp;
					<Button secondary onClick={this.toggleModal}>
						{t('Cancel')}
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}

	private showGameRules(world: World, view: DataViewRef<World>) {
		this.setState({
			modal: true,
			rules: Object.keys(world.gameRules).map((key: string) => ({
				name: key,
				value: world.gameRules[key]
			})),
			rulesWorld: world,
			rulesView: view
		});
	}

	private toggleRule(name: string) {
		const rules = this.state.rules;
		const rule = rules.find(r => r.name === name);
		if (!rule) {
			return;
		}

		rule.value = rule.value === 'true' ? 'false' : 'true';

		this.setState({
			rules: rules
		});
	}

	private saveGameRules() {
		if (!this.state.rulesView || !this.state.rulesWorld) {
			return;
		}

		const rules = _.mapValues(_.keyBy(this.state.rules, 'name'), 'value');

		this.state.rulesView.save(this.state.rulesWorld, { gameRules: rules });
		this.toggleModal();
	}

	private toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		dimTypes: state.api.types[CatalogTypeKeys.Dimension],
		genTypes: state.api.types[CatalogTypeKeys.Generator],
		diffTypes: state.api.types[CatalogTypeKeys.Difficulty],
		gmTypes: state.api.types[CatalogTypeKeys.GameMode]
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
)(withTranslation('Worlds')(Worlds));
