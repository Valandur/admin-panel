import * as React from 'react';
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

interface Props extends reactI18Next.InjectedTranslateProps {
	item: VillagerShopsStockItem;
	itemTypes: CatalogType[];
	currencies: CatalogType[];
	onChange: (
		event: React.SyntheticEvent<HTMLElement>,
		data?: DropdownProps
	) => void;
	onRemove: () => void;
}

interface OwnState {}

class ShopItem extends React.Component<Props, OwnState> {
	shouldComponentUpdate(nextProps: Props, nextState: OwnState) {
		console.log(this.props);
		console.log(nextProps);
		return (
			!nextProps.item ||
			!this.props.item ||
			nextProps.item.id !== this.props.item.id ||
			nextProps.item.item.quantity !== this.props.item.item.quantity ||
			nextProps.item.item.type.id !== this.props.item.item.type.id ||
			nextProps.item.buyPrice !== this.props.item.buyPrice ||
			nextProps.item.sellPrice !== this.props.item.sellPrice ||
			nextProps.item.stock !== this.props.item.stock ||
			nextProps.item.maxStock !== this.props.item.maxStock ||
			nextProps.item.currency.id !== this.props.item.currency.id
		);
	}

	render() {
		const { item, t, onChange, onRemove } = this.props;

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
						onChange={(e: any, val: any) => onChange(e, val)}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="item.quantity"
						placeholder={t('Amount')}
						onChange={e => onChange(e)}
						value={item.item.quantity}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="buyPrice"
						placeholder={t('BuyPrice')}
						onChange={e => onChange(e)}
						value={item.buyPrice}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="sellPrice"
						placeholder={t('SellPrice')}
						onChange={e => onChange(e)}
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
						onChange={(e: any, val: any) => onChange(e, val)}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="stock"
						placeholder={t('Stock')}
						onChange={e => onChange(e)}
						value={item.stock}
					/>
				</Table.Cell>
				<Table.Cell>
					<Input
						fluid
						type="number"
						name="maxStock"
						placeholder={t('MaxStock')}
						onChange={e => onChange(e)}
						value={item.maxStock}
					/>
				</Table.Cell>
				<Table.Cell collapsing>
					<Button
						negative
						icon="delete"
						content={t('Delete')}
						onClick={e => onRemove()}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}

export default ShopItem;
