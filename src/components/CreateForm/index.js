import React, { Component } from "react"
import {
	Segment, Header, Form, Icon, Dropdown, Button
} from "semantic-ui-react"
import _ from "lodash"

import { handleChange } from "../Util"


class CreateForm extends Component {

	constructor(props) {
		super(props);

		const newData = {};
		_.each(props.fields, (field, name) => newData[name] = "")
		this.state = {
			newData: newData,
		};

		this.doHandleChange = this.doHandleChange.bind(this)
		this.handleChange = handleChange.bind(this, this.doHandleChange)
		this.create = this.create.bind(this)
	}

	doHandleChange(key, value) {
		this.setState({
			newData: _.assign({}, this.state.newData, {
				[key]: value
			})
		})
	}

	create() {
		const data = {};
		_.each(this.state.newData, (value, name) => _.set(data, name, value))
		
		this.props.onCreate(data, {
			handleChange: this.handleChange,
			state: this.state.newData,
		})
	}

	canCreate() {
		return _.every(this.props.fields, (field, name) => {
			const key = field.createName ? field.createName : name;
			return typeof field === "string" || !field.required || this.state.newData[key]
		})
	}

	render() {
		const { title, creating, fields } = this.props;

		const fieldGroups = [];
		_.each(fields, (field, name) => {
			const newField = {
				name: field.createName ? field.createName : name,
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
				<Icon fitted name="plus"/> {title}
			</Header>

			<Form loading={creating}>
				{_.map(fieldGroups, (fg, i) => {
					if (fg.only) {
						return <div key={i}>
							{this.renderField(fg.only)}
						</div>
					}

					return <Form.Group key={i} widths="equal">
						{fg.first &&
							this.renderField(fg.first)
						}

						{fg.second &&
							this.renderField(fg.second)
						}
					</Form.Group>
				})}

				<Button color="green" onClick={this.create} disabled={!this.canCreate()}>
					{this.props.button || "Create"}
				</Button>
			</Form>
		</Segment>
	}

	renderField(field) {
		const state = this.state.newData;

		if (typeof field.create === "function") {
			return field.create({
				handleChange: this.handleChange,
				state: state,
				value: state[field.name],
			})
		}

		if (field.options) {
			return <Form.Field
				fluid selection search
				required={field.required}
				control={Dropdown}
				name={field.name}
				label={field.label}
				placeholder={field.label}
				onChange={this.handleChange}
				value={state[field.name]}
				options={field.options}
			/>
		}

		return <Form.Input
			required={field.required}
			type={field.type ? field.type : "text"}
			name={field.name}
			label={field.label}
			placeholder={field.label}
			onChange={this.handleChange}
			value={state[field.name]}
		/>
	}
}

export default CreateForm;
