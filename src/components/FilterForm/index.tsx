import * as _ from "lodash"
import * as React from "react"
import { Accordion, Dropdown, Form, Icon, Message } from "semantic-ui-react"

import { DataFieldGroup, DataFieldRaw } from "../../types"
import { handleChange, HandleChangeFunc } from "../Util"

export interface Props<T> {
	title: string
	valid: boolean
	fields: {
		[x: string]: DataFieldRaw<T>
	}
	values: {
		[x: string]: string | string[]
	}
	onFilterChange: (key: string, value: string) => void
}

interface State {
	open: boolean
}

class FilterForm<T> extends React.Component<Props<T>, State> {
	handleChange: HandleChangeFunc

	constructor(props: Props<T>) {
		super(props)

		this.state = {
			open: false
		}

		this.handleChange = handleChange.bind(this, this.props.onFilterChange)
	}

	shouldComponentUpdate(nextProps: Props<T>, nextState: State) {
		return (
			nextProps.values !== this.props.values ||
			nextProps.fields !== this.props.fields ||
			nextProps.valid !== this.props.valid ||
			nextState.open !== this.state.open
		)
	}

	handleClick() {
		this.setState({
			open: !this.state.open
		})
	}

	render() {
		const { title, fields, values, valid } = this.props

		const fieldGroups: DataFieldGroup<T>[] = []
		Object.keys(fields).forEach(name => {
			const field = fields[name]
			const newField: DataFieldRaw<T> = {
				...field,
				name: field.filterName ? field.filterName : name
			}

			if (newField.isGroup) {
				fieldGroups.push({ only: newField })
			} else if (
				fieldGroups.length &&
				!fieldGroups[fieldGroups.length - 1].second
			) {
				fieldGroups[fieldGroups.length - 1].second = newField
			} else {
				fieldGroups.push({ first: newField })
			}
		})

		return (
			<Accordion styled fluid>
				<Accordion.Title
					active={this.state.open}
					onClick={() => this.handleClick()}
				>
					<Icon name="filter" fitted /> {title}
				</Accordion.Title>

				<Accordion.Content active={this.state.open}>
					<Form>
						{fieldGroups.map((fg, i) => {
							if (fg.only) {
								return this.renderField(
									fg.only,
									_.get(values, fg.only.name),
									!valid
								)
							}

							return (
								<Form.Group key={i} widths="equal">
									{fg.first &&
										this.renderField(
											fg.first,
											_.get(values, fg.first.name),
											!valid
										)}

									{fg.second &&
										this.renderField(
											fg.second,
											_.get(values, fg.second.name),
											!valid
										)}
								</Form.Group>
							)
						})}
						<Message
							error
							visible={!valid}
							content="Search term must be a valid regex"
						/>
					</Form>
				</Accordion.Content>
			</Accordion>
		)
	}

	renderField(
		field: DataFieldRaw<T>,
		value: string | string[],
		error: boolean
	) {
		if (typeof field.filter === "function") {
			return field.filter({
				state: this.props.values,
				setState: this.setState,
				handleChange: this.handleChange,
				value: value
			})
		}

		if (field.options) {
			if (!value) {
				value = []
			}

			return (
				<Form.Field
					fluid
					selection
					search
					multiple
					control={Dropdown}
					name={field.name}
					label={field.label}
					placeholder={field.label}
					options={field.options}
					value={value}
					error={error}
					onChange={this.handleChange}
				/>
			)
		}

		return (
			<Form.Input
				name={field.name}
				type={field.type ? field.type : "text"}
				label={field.label}
				placeholder={field.label}
				value={value}
				error={error}
				onChange={this.handleChange}
			/>
		)
	}
}

export default FilterForm
