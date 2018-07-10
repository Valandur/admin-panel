import * as _ from 'lodash';
import * as React from 'react';
import { translate } from 'react-i18next';
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

export interface AppProps extends reactI18Next.InjectedTranslateProps {
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
	constructor(props: AppProps) {
		super(props);

		this.state = {
			shown: false,
			stacked: true
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			shown: !this.state.shown
		});
	}

	render() {
		const { t, inventory } = this.props;

		if (inventory.slots.length === 0) {
			return (
				<Button primary disabled>
					{t('EmptyInventory')}
				</Button>
			);
		}

		let items = _.sortBy(inventory.slots.map(s => s.stack), 'type.name');
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

		const content = (
			<div>
				{this.props.stackOption && [
					<Radio
						toggle
						key="radio"
						checked={this.state.stacked}
						onClick={() => this.setState({ stacked: !this.state.stacked })}
					/>,
					<br key="newline" />
				]}
				{items.map((item, i) => <ItemStackComp key={i} item={item} />)}
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
}

export default translate('Inventory')(InventoryComp);
