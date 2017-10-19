import React, { Component } from "react"
import {
	Segment, Header, Form, Icon, Dropdown, Button
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../Util"


class CreateForm extends Component {

	constructor(props) {
		super(props);

		this.state = {}

		this.handleChange = handleChange.bind(this)
		this.create = this.create.bind(this)
	}

	create() {
		const data = {}
		_.each(this.props.fields, (field, name) => data[name] = this.state[name])
		
		this.props.onCreate(data)
	}

	canCreate() {
		return _.every(this.props.fields, (field, name) =>
			typeof field === "string" || !field.required || this.state[name]
		)
	}

	render() {
		const { title, creating, fields } = this.props;

		const fieldGroups = [];
		_.each(fields, (field, name) => {
			const newField = {
				name: name,
			};
			if (typeof field === "string") {
				newField.label = field;
			} else {
				_.assign(newField, field);
			}

			if (fieldGroups.length && !fieldGroups[fieldGroups.length - 1].second) {
				fieldGroups[fieldGroups.length - 1].second = newField;
			} else {
				fieldGroups.push({ first: newField })
			}
		})

		return <Segment>
			<Header>
				<Icon fitted name="plus"/> {title}
			</Header>

			<Form loading={creating}>

			{_.map(fieldGroups, (fieldGroup, i) =>
				<Form.Group key={i} widths="equal">
					{fieldGroup.first &&
						this.renderField(fieldGroup.first)
					}

					{fieldGroup.second &&
						this.renderField(fieldGroup.second)
					}
				</Form.Group>
			)}

				<Button color="green" onClick={this.create} disabled={!this.canCreate()}>
					Create
				</Button>

			</Form>
		</Segment>
	}

	renderField(field) {
		if (field.options) {
			return <Form.Field
				fluid selection search
				required={field.required}
				control={Dropdown}
				name={field.name}
				label={field.label}
				placeholder={field.label}
				onChange={this.handleChange}
				options={field.options}
			/>
		}

		return <Form.Input
			required={field.required}
			name={field.name}
			label={field.label}
			placeholder={field.label}
			onChange={this.handleChange}
		/>
	}
}

export default CreateForm;
