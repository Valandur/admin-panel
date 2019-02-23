import * as _ from 'lodash';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Accordion, Button, Radio } from 'semantic-ui-react';

import { Inventory, ItemStack } from '../../fetch';
import ItemStackComp from '../ItemStack';

const customizer: (
	objValue: ItemStack,
	srcValue: ItemStack
) => ItemStack[] | undefined = (objValue: ItemStack, srcValue: ItemStack) => {
	if (_.isArray(objValue)) {
		return objValue.concat(srcValue);
	}
	return undefined;
};

export interface AppProps extends WithTranslation {
	inventory: Inventory;
	dontStack?: boolean;
	stackOption?: boolean;
	dontCollapse?: boolean;
}

interface AppState {
	shown: boolean;
	stacked: boolean;
}

class InventoryComp extends React.Component<AppProps, AppState> {
	public constructor(props: AppProps) {
		super(props);

		this.state = {
			shown: false,
			stacked: true
		};

		this.toggle = this.toggle.bind(this);
	}

	private toggle() {
		this.setState({
			shown: !this.state.shown
		});
	}

	public render() {
		const { t, inventory } = this.props;

		if (inventory.slots.length === 0) {
			return (
				<Button primary disabled>
					{t('EmptyInventory')}
				</Button>
			);
		}

		const content = (
			<div>
				{this.renderStackToggle()}
				{this.renderItems()}
			</div>
		);

		if (this.props.dontCollapse) {
			return content;
		}

		return (
			<Accordion>
				<Accordion.Title
					as={Button}
					primary
					active={this.state.shown}
					onClick={this.toggle}
				>
					{this.state.shown ? t('HideInventory') : t('ShowInventory')}
				</Accordion.Title>
				<Accordion.Content active={this.state.shown}>
					{content}
				</Accordion.Content>
			</Accordion>
		);
	}

	private renderStackToggle() {
		return this.props.stackOption ? (
			<>
				<Radio
					toggle
					checked={this.state.stacked}
					onChange={this.toggleStacked}
				/>
				<br />
			</>
		) : null;
	}

	private renderItems() {
		let items = _.sortBy(
			this.props.inventory.slots.map(s => s.stack),
			'type.name'
		);

		if (!this.props.dontStack && this.state.stacked) {
			const itemGroups = _.groupBy(items, 'type.id');
			items = _.map(itemGroups, itemGroup => {
				let item = _.merge({}, _.first(itemGroup));
				_.tail(itemGroup).forEach(
					newItem => (item = _.mergeWith(item, newItem, customizer))
				);
				return _.merge(item, { quantity: _.sumBy(itemGroup, 'quantity') });
			});
		}

		return items.map((item, i) => <ItemStackComp key={i} item={item} />);
	}

	private toggleStacked = () => {
		this.setState({ stacked: !this.state.stacked });
	};
}

export default withTranslation('Inventory')(InventoryComp);
