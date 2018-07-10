import * as moment from 'moment';
import * as React from 'react';
import { Trans, translate } from 'react-i18next';
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
import {
	renderCatalogTypeOptions,
	renderWorldOptions
} from '../../components/Util';
import { BlockOperation, CatalogType, World } from '../../fetch';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../types';

import DataViewFunc from '../../components/DataView';
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

interface Props
	extends OwnProps,
		StateProps,
		reactI18Next.InjectedTranslateProps {}

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
	constructor(props: FullProps) {
		super(props);

		this.state = {
			modal: false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.showDetails = this.showDetails.bind(this);
	}

	componentDidMount() {
		this.props.requestWorlds();
		this.props.requestCatalog(CatalogTypeKeys.Block);
	}

	showDetails(operation: BlockOperation, view: DataViewRef<BlockOperation>) {
		view.details(operation);
		this.setState({
			modal: true,
			operation: operation
		});
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	getStatusColor(op: BlockOperation) {
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

	render() {
		const _t = this.props.t;

		return (
			<>
				<DataView
					icon="block layout"
					title={_t('BlockOperations')}
					createTitle={_t('StartOperation')}
					fields={{
						type: _t('Type'),
						uuid: _t('UUID'),
						create: {
							isGroup: true,
							view: false,
							create: (view: DataViewRef<BlockOperation>) => {
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
												label={_t('Type')}
												placeholder={_t('Type')}
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
												label={_t('World')}
												placeholder={_t('World')}
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
												label={_t('Block')}
												placeholder={_t('Block')}
												onChange={view.handleChange}
												value={view.state.block}
												options={renderCatalogTypeOptions(
													this.props.blockTypes
												)}
												disabled={view.state.type !== 'CHANGE'}
											/>
										</Form.Group>

										<Form.Group width={1} inline>
											<label>{_t('Min')}</label>
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
											<label>{_t('Max')}</label>
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
							label: _t('Status'),
							view: (op: BlockOperation) => {
								return (
									<Label color={this.getStatusColor(op)}>
										{_t(op.status.toString())}
									</Label>
								);
							}
						},
						progress: {
							label: _t('Progress'),
							wide: true,
							view: (op: BlockOperation) => {
								const time = moment()
									.add(op.estimatedSecondsRemaining, 's')
									.fromNow(true);

								return (
									<Progress
										progress
										color={this.getStatusColor(op)}
										active={op.status === BlockOperation.StatusEnum.RUNNING}
										percent={(op.progress * 100).toFixed(1)}
									>
										{op.status === BlockOperation.StatusEnum.RUNNING ||
										op.status === BlockOperation.StatusEnum.PAUSED
											? time + ' remaining'
											: _t('Done')}
									</Progress>
								);
							}
						}
					}}
					actions={(op: BlockOperation, view: DataViewRef<BlockOperation>) => (
						<>
							<Button primary onClick={e => this.showDetails(op, view)}>
								{_t('Details')}
							</Button>{' '}
							{op.status === BlockOperation.StatusEnum.RUNNING ||
							op.status === BlockOperation.StatusEnum.PAUSED ? (
								<Button
									secondary
									onClick={e =>
										view.save(op, {
											paused: op.status === BlockOperation.StatusEnum.RUNNING
										})
									}
								>
									<Icon
										name={
											op.status === BlockOperation.StatusEnum.RUNNING
												? 'pause'
												: 'play'
										}
									/>{' '}
									{op.status === BlockOperation.StatusEnum.RUNNING
										? _t('Pause')
										: _t('Resume')}
								</Button>
							) : null}{' '}
							{op.status === BlockOperation.StatusEnum.RUNNING ||
							op.status === BlockOperation.StatusEnum.PAUSED ? (
								<Button negative onClick={e => view.delete(op)}>
									<Icon name="stop" /> {_t('Stop')}
								</Button>
							) : null}
						</>
					)}
					onCreate={(obj: any, view: DataViewRef<BlockOperation>) =>
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
						})
					}
				/>
				{this.renderModal()}
			</>
		);
	}

	renderModal() {
		if (!this.state.operation) {
			return null;
		}

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>
					<Trans i18nKey="OperationTitle">
						Operation {this.state.operation.uuid}
					</Trans>
				</Modal.Header>
				<Modal.Content>
					<>
						<b>Status:</b> {this.state.operation.status}
					</>
					{this.state.operation.error && (
						<>
							<b>Error:</b> {this.state.operation.error}
						</>
					)}
					{(this.state.operation as any).blocks && (
						<>
							<b>Blocks:</b>
							<br />
							{JSON.stringify((this.state.operation as any).blocks)}
						</>
					)}
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
)(translate('BlockOperations')(BlockOperations));
