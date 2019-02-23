import * as React from 'react';
import { Button, ButtonProps, Label, Progress } from 'semantic-ui-react';

import { Enchantment, ItemStack, PotionEffect } from '../../fetch';
import { formatRange } from '../Util';

const getRoman: (num: number) => string = (num: number) => {
	if (num === 1) {
		return 'I';
	}
	if (num === 2) {
		return 'II';
	}
	if (num === 3) {
		return 'III';
	}
	if (num === 4) {
		return 'IV';
	}
	if (num === 5) {
		return 'V';
	}
	return '';
};
const getAmplifier: (effect: PotionEffect) => string = (effect: PotionEffect) =>
	getRoman(effect.amplifier + 1);

const itemStackStyle = {
	display: 'inline-block',
	verticalAlign: 'top',
	margin: '0.1em',
	padding: '0.2em',
	border: '1px solid rgba(34,36,38,.1)',
	borderRadius: '.28571429rem'
};

export interface Props {
	item: ItemStack;
	onRemove?: (
		event: React.MouseEvent<HTMLButtonElement>,
		data: ButtonProps
	) => void;
}

export default class extends React.Component<Props> {
	public render() {
		const { item } = this.props;

		return (
			<div style={itemStackStyle}>
				<strong>{item.type.name}</strong>
				{this.renderRemoveButton()}
				<div style={{ color: 'gray', marginBottom: '0.5em' }}>
					{item.type.id}
				</div>
				<div>
					{this.renderDurability()}
					{this.renderQuantity()}
					{this.renderEnchantments()}
					{this.renderSpawn()}
					{this.renderPotionEffects()}
					{this.renderFoodRestoration()}
					{this.renderBurningFuel()}
				</div>
			</div>
		);
	}

	private renderRemoveButton() {
		if (!this.props.onRemove) {
			return null;
		}

		return (
			<Button
				compact
				negative
				size="mini"
				icon="delete"
				floated="right"
				onClick={this.props.onRemove}
			/>
		);
	}

	private renderDurability() {
		const { item } = this.props;

		if (!item.durability) {
			return null;
		}

		if (item.durability.unbreakable) {
			return <Label size="tiny">Unbreakable</Label>;
		}

		const percent = formatRange(
			item.durability.durability,
			item.useLimit ? item.useLimit : 0
		);

		return (
			<Progress
				progress
				size="small"
				percent={percent}
				style={{ margin: '0 0 .5em 0' }}
			/>
		);
	}

	private renderQuantity() {
		const { item } = this.props;

		if (item.quantity <= 1) {
			return null;
		}

		return (
			<Label size="tiny" color="blue">
				x{item.quantity}
			</Label>
		);
	}

	private renderEnchantments() {
		const { item } = this.props;
		if (!item.enchantments) {
			return null;
		}

		const renderEnchant = (enchant: Enchantment) => (
			<Label color="purple" size="tiny" key={enchant.id}>
				{enchant.name}
				<Label.Detail>{enchant.level}</Label.Detail>
			</Label>
		);

		return (
			<div>{item.enchantments.map(enchant => renderEnchant(enchant))}</div>
		);
	}

	private renderSpawn() {
		const { item } = this.props;
		if (!item.spawn) {
			return null;
		}

		return <Label size="tiny">{item.spawn.name}</Label>;
	}

	private renderPotionEffects() {
		const { item } = this.props;
		if (!item.potionEffects) {
			return null;
		}

		const renderEffect = (effect: PotionEffect) => (
			<Label size="tiny" color="brown" key={effect.type.id}>
				{effect.type.name} {getAmplifier(effect)}
			</Label>
		);

		return <div>{item.potionEffects.map(effect => renderEffect(effect))}</div>;
	}

	private renderFoodRestoration() {
		const { item } = this.props;
		if (!item.foodRestoration) {
			return null;
		}

		return (
			<Label
				size="tiny"
				color="green"
				icon="food"
				content={item.foodRestoration}
			/>
		);
	}

	private renderBurningFuel() {
		const { item } = this.props;
		if (!item.burningFuel) {
			return null;
		}

		return (
			<Label size="tiny" color="red" icon="fire" content={item.burningFuel} />
		);
	}
}
