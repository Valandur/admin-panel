import React, { Component } from "react"
import {
	Segment, Header, Form, Icon, Dropdown, Message
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../Util"


class FilterForm extends Component {

	constructor(props) {
		super(props);

		this.handleChange = handleChange.bind(this, this.props.onFilterChange)
	}

	render() {
		const { title, fields, values, valid } = this.props;

		const fieldGroups = [];
		_.each(fields, (field, name) => {
			const newField = {
				name: field.filterName ? field.filterName : name,
			};
			if (typeof field === "string") {
				newField.label = field;
			} else {
				_.assign(newField, field);
			}

			if (newField.isGroup) {
				fieldGroups.push({ only: newField, second: true })
			} else if (fieldGroups.length && !fieldGroups[fieldGroups.length - 1].second) {
				fieldGroups[fieldGroups.length - 1].second = newField;
			} else {
				fieldGroups.push({ first: newField })
			}
		})

		return <Segment>
			<Header>
				<Icon name="filter" fitted /> {title}
			</Header>

			<Form>
				{_.map(fieldGroups, (fg, i) => {
					if (fg.only) {
						return this.renderField(fg.only, _.get(values, fg.only.name), !valid)
					}

					return <Form.Group key={i} widths="equal">
						{fg.first &&
							this.renderField(fg.first, _.get(values, fg.first.name), !valid)
						}

						{fg.second &&
							this.renderField(fg.second, _.get(values, fg.second.name), !valid)
						}
					</Form.Group>
				})}
				<Message
					error
					visible={!valid}
					content="Search term must be a valid regex"
				/>
			</Form>
		</Segment>
	}

	renderField(field, value, error) {
		if (typeof field.filter === "function") {
			return field.filter({
				handleChange: this.handleChange,
				state: this.props.values,
				value: value,
			})
		}

		if (field.options) {
			if (!value) value = [];
			
			return <Form.Field
				fluid selection search multiple
				control={Dropdown}
				name={field.name}
				label={field.label}
				placeholder={field.label}
				options={field.options}
				value={value}
				error={error}
				onChange={this.handleChange}
			/>
		}

		return <Form.Input
			name={field.name}
			type={field.type ? field.type : "text"}
			label={field.label}
			placeholder={field.label}
			value={value}
			error={error}
			onChange={this.handleChange}
		/>
	}
}

export default FilterForm
