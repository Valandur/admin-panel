import * as _ from 'lodash';
import * as React from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Dropdown,
	DropdownProps,
	Form,
	Header,
	Icon,
	Modal,
	Table
} from 'semantic-ui-react';

import { AppAction, requestCatalog } from '../../../actions';
import DataViewFunc from '../../../components/DataView';
import {
	handleChange,
	HandleChangeFunc,
	renderCatalogTypeOptions
} from '../../../components/Util';
import {
	CatalogType,
	VillagerShopsShop,
	VillagerShopsStockItem
} from '../../../fetch';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../../types';

import ShopItem from './ShopItem';

const DataView = DataViewFunc('vshop/shop', 'uid');

interface Props extends reactI18Next.InjectedTranslateProps {
	entityTypes: CatalogType[];
	itemTypes: CatalogType[];
	currencies: CatalogType[];
	requestCatalog: (type: string) => AppAction;
}

interface OwnState {
	modal: boolean;
	shop?: VillagerShopsShop;
	name?: string;
	type?: string;
	items: VillagerShopsStockItem[];
}

class Shops extends React.Component<Props, OwnState> {
	handleChange: HandleChangeFunc;
	save: () => void;

	constructor(props: Props) {
		super(props);

		this.state = {
			modal: false,
			items: []
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleChange = handleChange.bind(this, null);
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Entity);
		this.props.requestCatalog(CatalogTypeKeys.Item);
		this.props.requestCatalog(CatalogTypeKeys.Currency);
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleEdit(shop: VillagerShopsShop, view: DataViewRef<VillagerShopsShop>) {
		this.save = () => {
			view.save(shop, {
				name: this.state.name,
				entityType: this.state.type,
				stockItems: this.state.items
			});
			this.setState({
				modal: false,
				shop: undefined
			});
		};

		this.setState({
			modal: true,
			shop,
			name: shop ? shop.name : undefined,
			type: shop ? shop.entityType.id : undefined,
			items: shop
				? shop.stockItems
					? shop.stockItems.map(({ link, ...i }) => ({ ...i }))
					: []
				: []
		});
	}

	handleItemChange(
		item: VillagerShopsStockItem,
		event: React.SyntheticEvent<HTMLElement>,
		data?: DropdownProps
	) {
		const cb = (name: string, value: string) => {
			const newItem = _.cloneDeep(item);
			_.set(newItem, name, value);

			this.setState({
				items: this.state.items.map(i => (i === item ? newItem : i))
			});
		};
		handleChange.call(this, cb, event, data);
	}

	addItem() {
		const newItem: VillagerShopsStockItem = {
			item: {
				type: {
					id: 'minecraft:dirt',
					name: 'Dirt'
				},
				quantity: 1
			},
			currency: {
				id: '',
				name: ''
			},
			buyPrice: 0,
			sellPrice: 0,
			stock: 0,
			maxStock: 0,
			hasStock: false,
			shopId: this.state.shop!.uid!
		};

		const items = this.state.items
			? this.state.items.concat(newItem)
			: [newItem];
		this.setState({
			items
		});
	}

	removeItem(item: VillagerShopsStockItem) {
		this.setState({
			items: this.state.items.filter(i => i !== item)
		});
	}

	render() {
		const _t = this.props.t;

		return (
			<>
				<DataView
					canEdit
					canDelete
					icon="shop"
					title={_t('Shops')}
					filterTitle={_t('FilterShops')}
					fields={{
						uid: _t('Id'),
						name: {
							label: _t('Name'),
							filter: true
						},
						entityType: {
							label: _t('Type'),
							view: (shop: VillagerShopsShop) => shop.entityType.name,
							filter: true,
							options: renderCatalogTypeOptions(this.props.entityTypes)
						}
					}}
					onEdit={this.handleEdit}
				/>
				{this.renderModal()}
			</>
		);
	}

	renderModal() {
		if (!this.state.modal || !this.state.shop) {
			return;
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
					<Trans i18nKey="ShopTitle">Edit '{this.state.shop.name}'</Trans>
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Header>
							<Icon fitted name="info" /> {_t('General')}
						</Header>

						<Form.Group widths="equal">
							<Form.Input
								required
								fluid
								type="text"
								name="name"
								label={_t('Name')}
								placeholder={_t('Name')}
								onChange={this.handleChange}
								value={this.state.name}
							/>

							<Form.Field
								required
								fluid
								selection
								search
								control={Dropdown}
								name="type"
								label={_t('Type')}
								placeholder={_t('Type')}
								onChange={this.handleChange}
								options={renderCatalogTypeOptions(this.props.entityTypes)}
								value={this.state.type}
							/>
						</Form.Group>

						<Header>
							<Icon fitted name="cube" /> {_t('Items')}
						</Header>

						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>{_t('Item')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('Amount')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('BuyPrice')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('SellPrice')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('Currency')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('Stock')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('MaxStock')}</Table.HeaderCell>
									<Table.HeaderCell>{_t('Actions')}</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.state.items.map((item, i) => (
									<ShopItem
										key={i}
										item={item}
										t={_t}
										itemTypes={this.props.itemTypes}
										currencies={this.props.currencies}
										onChange={(e, d) => this.handleItemChange(item, e, d)}
										onRemove={() => this.removeItem(item)}
									/>
								))}
								<Table.Row>
									<Table.Cell colSpan="8" textAlign="center">
										<Button
											positive
											icon="plus"
											content={_t('Add')}
											onClick={this.addItem}
										/>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button primary onClick={this.save}>
						{_t('Save')}
					</Button>
					&nbsp;
					<Button secondary onClick={this.toggleModal}>
						{_t('Cancel')}
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		entityTypes: state.api.types[CatalogTypeKeys.Entity],
		itemTypes: state.api.types[CatalogTypeKeys.Item],
		currencies: state.api.types[CatalogTypeKeys.Currency]
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string): AppAction => dispatch(requestCatalog(type))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(translate('Integrations.VShop')(Shops));
