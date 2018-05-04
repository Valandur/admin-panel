import * as React from "react"
import { Dropdown, DropdownProps, Form } from "semantic-ui-react"

import { renderCatalogTypeOptions } from "../../../components/Util"
import { CatalogType } from "../../../fetch"

export interface Props {
	name: string
	value: string
	placeholder: string
	itemTypes: CatalogType[]
	onChange: (e: React.SyntheticEvent<HTMLElement>, data?: DropdownProps) => void
}

export default class ItemTypeDropdown extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props, nextState: any) {
		return (
			nextProps.value !== this.props.value ||
			nextProps.itemTypes !== this.props.itemTypes
		)
	}

	render() {
		return (
			<Form.Field
				selection
				search
				name={this.props.name}
				control={Dropdown}
				placeholder={this.props.placeholder}
				onChange={(e: React.SyntheticEvent<HTMLElement>, val: DropdownProps) =>
					this.props.onChange(e, val)
				}
				value={this.props.value}
				options={renderCatalogTypeOptions(this.props.itemTypes)}
			/>
		)
	}
}
