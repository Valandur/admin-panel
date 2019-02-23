import * as moment from 'moment';
import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Dropdown,
	Form,
	Icon,
	Label,
	Modal,
	Progress
} from 'semantic-ui-react';

import { AppAction, CatalogRequestAction, requestCatalog } from '../../actions';
import { ListRequestAction, requestList } from '../../actions/dataview';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import {
	renderCatalogTypeOptions,
	renderWorldOptions
} from '../../components/Util';
import { BlockOperation, CatalogType, World } from '../../fetch';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('block/op', 'uuid', true);

interface OwnProps {}

interface StateProps {
	worlds: World[];
	blockTypes: CatalogType[];
	types: {
		text: string;
		value: BlockOperation.TypeEnum;
	}[];
}

interface Props extends OwnProps, StateProps, WithTranslation {}

interface DispatchProps {
	requestWorlds: () => ListRequestAction;
	requestCatalog: (type: string) => CatalogRequestAction;
}

interface FullProps extends Props, DispatchProps {}

interface OwnState {
	modal: boolean;
	operation?: BlockOperation;
}

class BlockOperations extends React.Component<FullProps, OwnState> {
	public constructor(props: FullProps) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showDetails = this.showDetails.bind(this);
	}

	public componentDidMount() {
		this.props.requestWorlds();
		this.props.requestCatalog(CatalogTypeKeys.Block);
	}

	private showDetails(
		operation: BlockOperation,
		view: DataViewRef<BlockOperation>
	) {
		view.details(operation);
		this.setState({
			modal: true,
			operation: operation
		});
	}

	private toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	private getStatusColor(op: BlockOperation) {
		return op.status === BlockOperation.StatusEnum.DONE
			? 'blue'
			: op.status === BlockOperation.StatusEnum.PAUSED
			? 'yellow'
			: op.status === BlockOperation.StatusEnum.ERRORED
			? 'red'
			: op.status === BlockOperation.StatusEnum.RUNNING
			? 'green'
			: 'grey';
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<BlockOperation> = {
			type: t('Type'),
			uuid: t('UUID'),
			create: {
				isGroup: true,
				view: false,
				create: view => {
					return (
						<>
							<Form.Group widths="equal">
								<Form.Field
									required
									fluid
									selection
									search
									name="type"
									control={Dropdown}
									label={t('Type')}
									placeholder={t('Type')}
									onChange={view.handleChange}
									value={view.state.type}
									options={this.props.types}
								/>
								<Form.Field
									required
									fluid
									selection
									search
									name="world"
									control={Dropdown}
									label={t('World')}
									placeholder={t('World')}
									onChange={view.handleChange}
									value={view.state.world}
									options={renderWorldOptions(this.props.worlds)}
								/>
								<Form.Field
									required
									fluid
									selection
									search
									name="block"
									control={Dropdown}
									label={t('Block')}
									placeholder={t('Block')}
									onChange={view.handleChange}
									value={view.state.block}
									options={renderCatalogTypeOptions(this.props.blockTypes)}
									disabled={view.state.type !== 'CHANGE'}
								/>
							</Form.Group>

							<Form.Group width={1} inline>
								<label>{t('Min')}</label>
								<Form.Input
									width={6}
									name="minX"
									placeholder="X"
									onChange={view.handleChange}
								/>
								<Form.Input
									width={6}
									name="minY"
									placeholder="Y"
									onChange={view.handleChange}
								/>
								<Form.Input
									width={6}
									name="minZ"
									placeholder="Z"
									onChange={view.handleChange}
								/>
							</Form.Group>

							<Form.Group width={1} inline>
								<label>{t('Max')}</label>
								<Form.Input
									width={6}
									name="maxX"
									placeholder="X"
									onChange={view.handleChange}
								/>
								<Form.Input
									width={6}
									name="maxY"
									placeholder="Y"
									onChange={view.handleChange}
								/>
								<Form.Input
									width={6}
									name="maxZ"
									placeholder="Z"
									onChange={view.handleChange}
								/>
							</Form.Group>
						</>
					);
				}
			},
			status: {
				label: t('Status'),
				view: op => {
					return (
						<Label color={this.getStatusColor(op)}>
							{t(op.status.toString())}
						</Label>
					);
				}
			},
			progress: {
				label: t('Progress'),
				wide: true,
				view: op => {
					const time = moment()
						.add(op.estimatedSecondsRemaining, 's')
						.fromNow(true);

					const content =
						op.status === BlockOperation.StatusEnum.RUNNING ||
						op.status === BlockOperation.StatusEnum.PAUSED
							? time + ' remaining'
							: t('Done');

					return (
						<Progress
							progress
							color={this.getStatusColor(op)}
							active={op.status === BlockOperation.StatusEnum.RUNNING}
							percent={(op.progress * 100).toFixed(1)}
						>
							{content}
						</Progress>
					);
				}
			}
		};

		return (
			<>
				<DataView
					icon="block layout"
					title={t('BlockOperations')}
					createTitle={t('StartOperation')}
					fields={fields}
					actions={this.renderActions}
					onCreate={this.onCreate}
				/>
				{this.renderModal()}
			</>
		);
	}

	private renderActions = (
		op: BlockOperation,
		view: DataViewRef<BlockOperation>
	) => {
		const { t } = this.props;

		const onDetails = () => this.showDetails(op, view);
		const onSave = () =>
			view.save(op, {
				paused: op.status === BlockOperation.StatusEnum.RUNNING
			});
		const onDelete = () => view.delete(op);

		const iconName =
			op.status === BlockOperation.StatusEnum.RUNNING ? 'pause' : 'play';
		const opText =
			op.status === BlockOperation.StatusEnum.RUNNING
				? t('Pause')
				: t('Resume');

		const togglePauseButton =
			op.status === BlockOperation.StatusEnum.RUNNING ||
			op.status === BlockOperation.StatusEnum.PAUSED ? (
				<Button secondary onClick={onSave}>
					<Icon name={iconName} /> {opText}
				</Button>
			) : null;

		const detailsButton =
			op.status === BlockOperation.StatusEnum.RUNNING ||
			op.status === BlockOperation.StatusEnum.PAUSED ? (
				<Button negative onClick={onDelete}>
					<Icon name="stop" /> {t('Stop')}
				</Button>
			) : null;

		return (
			<>
				<Button primary onClick={onDetails}>
					{t('Details')}
				</Button>{' '}
				{togglePauseButton} {detailsButton}
			</>
		);
	};

	private onCreate = (obj: any, view: DataViewRef<BlockOperation>) => {
		view.create({
			type: obj.type,
			world: obj.world,
			block: {
				type: obj.block
			},
			min: {
				x: parseFloat(obj.minX),
				y: parseFloat(obj.minY),
				z: parseFloat(obj.minZ)
			},
			max: {
				x: parseFloat(obj.maxX),
				y: parseFloat(obj.maxY),
				z: parseFloat(obj.maxZ)
			}
		});
	};

	private renderModal() {
		const { operation } = this.state;
		if (!operation) {
			return null;
		}

		const error = operation.error && (
			<>
				<b>Error:</b> {operation.error}
			</>
		);

		const blocks = (operation as any).blocks && (
			<>
				<b>Blocks:</b>
				<br />
				{JSON.stringify((operation as any).blocks)}
			</>
		);

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>
					<Trans i18nKey="OperationTitle">Operation {operation.uuid}</Trans>
				</Modal.Header>
				<Modal.Content>
					<>
						<b>Status:</b> {operation.status}
					</>
					{error}
					{blocks}
				</Modal.Content>
			</Modal>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		worlds: state.world.list,
		blockTypes: state.api.types[CatalogTypeKeys.Block],
		types: [
			{
				text: 'Get',
				value: BlockOperation.TypeEnum.GET
			},
			{
				text: 'Change',
				value: BlockOperation.TypeEnum.CHANGE
			}
		]
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestWorlds: () => dispatch(requestList('world', true)),
		requestCatalog: (type: string) => dispatch(requestCatalog(type))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('BlockOperations')(BlockOperations));
