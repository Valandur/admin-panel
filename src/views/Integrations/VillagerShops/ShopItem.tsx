import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import {
	Button,
	Dropdown,
	DropdownProps,
	Form,
	Input,
	Table
} from 'semantic-ui-react';

import { renderCatalogTypeOptions } from '../../../components/Util';
import { CatalogType, VillagerShopsStockItem } from '../../../fetch';

interface Props extends WithTranslation {
	item: VillagerShopsStockItem;
	itemTypes: CatalogType[];
	currencies: CatalogType[];
	onChange: (
		item: VillagerShopsStockItem,
		event: React.SyntheticEvent<HTMLElement>,
		data?: DropdownProps
	) => void;
	onRemove: (item: VillagerShopsStockItem) => void;
}

interface OwnState {}

class ShopItem extends React.Component<Props, OwnState> {
	public render() {
		const { item, t } = this.props;

		return (
			<Table.Row>
				<Table.Cell collapsing>
					<Form.Field
						selection
						search
						control={Dropdown}
						name="item.type.id"
						placeholder="Item"
						value={item.item.type.id}
						options={renderCatalogTypeOptions(this.props.itemTypes)}
						onChange={this.onChange}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="item.quantity"
						placeholder={t('Amount')}
						onChange={this.onChange}
						value={item.item.quantity}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="buyPrice"
						placeholder={t('BuyPrice')}
						onChange={this.onChange}
						value={item.buyPrice}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="sellPrice"
						placeholder={t('SellPrice')}
						onChange={this.onChange}
						value={item.sellPrice}
					/>
				</Table.Cell>
				<Table.Cell collapsing>
					<Form.Field
						selection
						search
						control={Dropdown}
						name="currency.id"
						placeholder="Currency"
						value={item.currency.id}
						options={renderCatalogTypeOptions(this.props.currencies)}
						onChange={this.onChange}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="stock"
						placeholder={t('Stock')}
						onChange={this.onChange}
						value={item.stock}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="maxStock"
						placeholder={t('MaxStock')}
						onChange={this.onChange}
						value={item.maxStock}
					/>
				</Table.Cell>
				<Table.Cell collapsing>
					<Button
						negative
						icon="delete"
						content={t('Delete')}
						onClick={this.onRemove}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}

	private onChange = (e: any, val: any) => {
		this.props.onChange(this.props.item, e, val);
	};

	private onRemove = () => {
		this.props.onRemove(this.props.item);
	};
}

export default ShopItem;
