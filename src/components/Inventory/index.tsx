import * as React from "react"
import { Accordion, Radio, Button } from "semantic-ui-react"
import { translate } from "react-i18next"
import * as _ from "lodash"

import ItemStackComp from "../ItemStack"
import { ItemStack } from "../../types"

const customizer: (objValue: ItemStack, srcValue: ItemStack) => ItemStack[] | undefined = 
	(objValue: ItemStack, srcValue: ItemStack) => {
		if (_.isArray(objValue)) {
			return objValue.concat(srcValue)
		}
		return undefined
	}

export interface AppProps extends reactI18Next.InjectedTranslateProps {
	items: ItemStack[]
	dontStack: boolean
	stackOption: boolean
	dontCollapse: boolean
}

interface AppState {
	shown: boolean
	stacked: boolean
}

class Inventory extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props)

		this.state = {
			shown: false,
			stacked: true
		}

		this.toggle = this.toggle.bind(this)
	}

	toggle() {
		this.setState({
			shown: !this.state.shown,
		})
	}

	render() {
		const _t = this.props.t

		if (this.props.items.length === 0) {
			return (
				<Button color="blue" disabled>
					{_t("EmptyInventory")}
				</Button>
			)
		}

		let items = _.sortBy(this.props.items, "type.name")
		if (!this.props.dontStack && this.state.stacked) {
			const itemGroups = _.groupBy(items, "type.id")
			items = _.map(itemGroups, itemGroup => {
				let item = _.merge({}, _.first(itemGroup))
				_.each(_.tail(itemGroup), newItem => item = _.mergeWith(item, newItem, customizer))
				return _.merge(item, { quantity: _.sumBy(itemGroup, "quantity") })
			})
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
				{_.map(items, (item, i) =>
					<ItemStackComp key={i} item={item} />
				)}
			</div>
		)

		if (this.props.dontCollapse) {
			return content
		}

		return (
			<Accordion>
				<Accordion.Title as={Button} primary active={this.state.shown} onClick={this.toggle}>
					{this.state.shown ? _t("HideInventory") : _t("ShowInventory")}
				</Accordion.Title>
				<Accordion.Content active={this.state.shown}>
					{content}
				</Accordion.Content>
			</Accordion>
		)
	}
}

export default translate("Inventory")(Inventory)
