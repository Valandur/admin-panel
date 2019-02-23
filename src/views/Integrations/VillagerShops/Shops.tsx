import * as _ from 'lodash';
import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
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
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
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
import i18n from '../../../services/i18n';
import { AppState, CatalogTypeKeys, DataViewRef } from '../../../types';

import ShopItem from './ShopItem';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('vshop/shop', 'uid');

interface Props extends WithTranslation {
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
	private handleChange: HandleChangeFunc;
	private save: () => void;

	public constructor(props: Props) {
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

	public componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Entity);
		this.props.requestCatalog(CatalogTypeKeys.Item);
		this.props.requestCatalog(CatalogTypeKeys.Currency);
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<VillagerShopsShop> = {
			uid: t('Id'),
			name: {
				label: t('Name'),
				filter: true
			},
			entityType: {
				label: t('Type'),
				view: (shop: VillagerShopsShop) => shop.entityType.name,
				filter: true,
				options: renderCatalogTypeOptions(this.props.entityTypes)
			}
		};

		return (
			<>
				<DataView
					canEdit
					canDelete
					icon="shop"
					title={t('Shops')}
					filterTitle={t('FilterShops')}
					fields={fields}
					onEdit={this.handleEdit}
				/>
				{this.renderModal()}
			</>
		);
	}

	private renderModal() {
		if (!this.state.modal || !this.state.shop) {
			return;
		}

		const { t } = this.props;

		const items = this.state.items.map((item, i) => (
			<ShopItem
				key={i}
				item={item}
				t={t}
				i18n={i18n}
				itemTypes={this.props.itemTypes}
				currencies={this.props.currencies}
				onChange={this.handleItemChange}
				onRemove={this.removeItem}
			/>
		));

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
							<Icon fitted name="info" /> {t('General')}
						</Header>

						<Form.Group widths="equal">
							<Form.Input
								required
								fluid
								type="text"
								name="name"
								label={t('Name')}
								placeholder={t('Name')}
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
								label={t('Type')}
								placeholder={t('Type')}
								onChange={this.handleChange}
								options={renderCatalogTypeOptions(this.props.entityTypes)}
								value={this.state.type}
							/>
						</Form.Group>

						<Header>
							<Icon fitted name="cube" /> {t('Items')}
						</Header>

						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>{t('Item')}</Table.HeaderCell>
									<Table.HeaderCell>{t('Amount')}</Table.HeaderCell>
									<Table.HeaderCell>{t('BuyPrice')}</Table.HeaderCell>
									<Table.HeaderCell>{t('SellPrice')}</Table.HeaderCell>
									<Table.HeaderCell>{t('Currency')}</Table.HeaderCell>
									<Table.HeaderCell>{t('Stock')}</Table.HeaderCell>
									<Table.HeaderCell>{t('MaxStock')}</Table.HeaderCell>
									<Table.HeaderCell>{t('Actions')}</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{items}
								<Table.Row>
									<Table.Cell colSpan="8" textAlign="center">
										<Button
											positive
											icon="plus"
											content={t('Add')}
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

	private toggleModal() {
		this.setState({
			modal: !this.state.modal
		});
	}

	private handleEdit(
		shop: VillagerShopsShop,
		view: DataViewRef<VillagerShopsShop>
	) {
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

	private handleItemChange = (
		item: VillagerShopsStockItem,
		event: React.SyntheticEvent<HTMLElement>,
		data?: DropdownProps
	) => {
		const cb = (name: string, value: string) => {
			const newItem = _.cloneDeep(item);
			_.set(newItem, name, value);

			this.setState({
				items: this.state.items.map(i => (i === item ? newItem : i))
			});
		};
		handleChange.call(this, cb, event, data);
	};

	private addItem() {
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

	private removeItem = (item: VillagerShopsStockItem) => {
		this.setState({
			items: this.state.items.filter(i => i !== item)
		});
	};
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
)(withTranslation('Integrations.VShop')(Shops));
