import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { Accordion, Button, Dropdown, Form, Icon } from "semantic-ui-react"

import { DataFieldGroup, DataFieldRaw, DataTableRef } from "../../types"
import { handleChange, HandleChangeFunc } from "../Util"

export interface Props<T> extends reactI18Next.InjectedTranslateProps {
	title: string
	creating: boolean
	onCreate: (data: any, view: DataTableRef) => void
	button?: string
	fields: {
		[x: string]: DataFieldRaw<T>
	}
}

interface OwnState {
	open: boolean
	newData: any
}

class CreateForm<T> extends React.Component<Props<T>, OwnState> {
	handleChange: HandleChangeFunc

	constructor(props: Props<T>) {
		super(props)

		this.state = {
			open: false,
			newData: {}
		}

		this.doHandleChange = this.doHandleChange.bind(this)
		this.handleChange = handleChange.bind(this, this.doHandleChange)
		this.create = this.create.bind(this)
	}

	doHandleChange(key: string, value: string) {
		this.setState({
			newData: {
				...this.state.newData,
				[key]: value
			}
		})
	}

	shouldComponentUpdate(nextProps: Props<T>, nextState: OwnState) {
		return (
			nextProps.creating !== this.props.creating ||
			nextProps.fields !== this.props.fields ||
			nextState.newData !== this.state.newData ||
			nextState.open !== this.state.open
		)
	}

	create() {
		const data = {}
		Object.keys(this.state.newData).forEach(key => {
			_.set(data, key, this.state.newData[key])
		})

		this.props.onCreate(data, {
			state: this.state.newData,
			setState: this.setState,
			handleChange: this.handleChange
		})
	}

	canCreate(): boolean {
		return Object.keys(this.props.fields).every(name => {
			const field = this.props.fields[name]
			const key = field.createName ? field.createName : name
			return (
				typeof field === "string" || !field.required || this.state.newData[key]
			)
		})
	}

	handleClick() {
		this.setState({
			open: !this.state.open
		})
	}

	render() {
		const { title, creating, fields } = this.props

		const _t = this.props.t

		const fieldGroups: DataFieldGroup<T>[] = []
		Object.keys(fields).forEach(name => {
			const field = fields[name]
			const newField: DataFieldRaw<T> = {
				...field,
				name: field.createName ? field.createName : name
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
					<Icon fitted name="plus" /> {title}
				</Accordion.Title>

				<Accordion.Content active={this.state.open}>
					<Form loading={creating}>
						{fieldGroups.map((fg, i) => {
							if (fg.only) {
								return <div key={i}>{this.renderField(fg.only)}</div>
							}

							return (
								<Form.Group key={i} widths="equal">
									{fg.first && this.renderField(fg.first)}

									{fg.second && this.renderField(fg.second)}
								</Form.Group>
							)
						})}

						<Button
							color="green"
							onClick={this.create}
							disabled={!this.canCreate()}
						>
							{this.props.button || _t("Create")}
						</Button>
					</Form>
				</Accordion.Content>
			</Accordion>
		)
	}

	renderField(field: DataFieldRaw<T>) {
		const state = this.state.newData

		if (typeof field.create === "function") {
			return field.create({
				state: state,
				setState: this.setState,
				handleChange: this.handleChange,
				value: state[field.name]
			})
		}

		if (field.options) {
			return (
				<Form.Field
					fluid={true}
					selection={true}
					search={true}
					required={field.required}
					control={Dropdown}
					name={field.name}
					label={field.label}
					placeholder={field.label}
					onChange={this.handleChange}
					value={state[field.name]}
					options={field.options}
				/>
			)
		}

		return (
			<Form.Input
				required={field.required}
				type={field.type ? field.type : "text"}
				name={field.name}
				label={field.label}
				placeholder={field.label}
				onChange={this.handleChange}
				value={state[field.name]}
			/>
		)
	}
}

export default translate("CreateForm")(CreateForm)
