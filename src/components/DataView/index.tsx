import * as React from "react"
import { connect } from "react-redux"
import { Segment, Grid, SemanticICONS } from "semantic-ui-react"
import { Dispatch, Action, Store } from "redux"
import * as _ from "lodash"

import DataTable, { DataTableProps } from "../DataTable"
import FilterForm from "../FilterForm"
import CreateForm from "../CreateForm"
import { checkPermissions, PermissionTree } from "../Util"
import { IdFunction, DataViewRef, DataField, DataObject, DataFieldRaw, DataFieldViewFunc } from "../../types"

import {
	setFilter,
	requestList,
	requestDetails,
	requestCreate,
	requestChange,
	requestDelete,
} from "../../actions/dataview"

export interface AppProps<T extends DataObject> extends reactI18Next.InjectedTranslateProps {
	title: string
	icon: SemanticICONS
	canEdit: boolean
	canDelete: boolean
	createTitle?: string
	createButton?: string
	filterTitle?: string
	filterButton?: string
	static: boolean
	creating: boolean
	filter: {
		[x: string]: string | string[]
	}
	list: T[]
	fields: {
		[key: string]: DataField<T> | DataFieldViewFunc<T> | string
	}
	perm: string
	perms: PermissionTree
	actions: (data: T, view: DataViewRef<T>) => JSX.Element
	requestList: () => Dispatch<Action>
	requestCreate: (data: T) => Dispatch<Action>
	requestDetails: (data: T) => Dispatch<Action>
	requestSave: (data: T) => Dispatch<Action>
	requestChange: (data: T, newData: T | {}) => Dispatch<Action>
	requestDelete: (data: T) => Dispatch<Action>
	setFilter: (filter: string, value: string) => Dispatch<Action>
	onCreate: (data: T, view: DataViewRef<T>) => void
	onEdit: (data: T | null, view: DataViewRef<T>) => void
	onSave: (data: T, newData: T | {}, view: DataViewRef<T>) => void
	onDelete: (data: T, view: DataViewRef<T>) => void
	idFunc: (data: T) => string
	equals:  (o1: T | null, o2: T | null) => boolean
}

interface AppState<T> {
	page: 0
	data: T | null
}

class DataView<T extends DataObject> extends React.Component<AppProps<T>, AppState<T>> {

	interval: NodeJS.Timer

	constructor(props: AppProps<T>) {
		super(props)

		this.state = {
			page: 0,
			data: null,
		}

		this.details = this.details.bind(this)
		this.create = this.create.bind(this)
		this.edit = this.edit.bind(this)
		this.save = this.save.bind(this)
		this.delete = this.delete.bind(this)
	}

	createTable() { return DataTable as React.ComponentClass<DataTableProps<T>> }

	componentDidMount() {
		if (!this.props.static) {
			this.props.requestList()
			this.interval = setInterval(this.props.requestList, 10000)
		}
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval)
		}
	}

	shouldComponentUpdate(nextProps: AppProps<T>, nextState: AppState<T>) {
		return nextProps.creating !== this.props.creating ||
			nextProps.filter !== this.props.filter ||
			nextProps.list !== this.props.list ||
			nextState.data !== this.state.data
	}

	// Create a new data entry
	create(data: T) {
		this.props.requestCreate(data)
	}

	// Get the details for a data entry
	details(data: T) {
		this.props.requestDetails(data)
	}

	// Select a data entry for editing
	edit(data: T | null) {
		this.setState({
			data: data,
		})
	}

	// Save/Update an existing data entry
	save(data: T, newData: T | {}) {
		this.props.requestChange(data, newData)
		this.setState({
			data: null,
		})
	}

	// Delete a data entry
	delete(data: T) {
		this.props.requestDelete(data)
	}

	render() {
		const checks: ((val: object) => boolean)[] = []
		let regsValid = false

		// Reference that we pass to our various functions
		const thisRef: DataViewRef<T> = {
			create: this.create,
			details: this.details,
			save: this.save,
			edit: this.edit,
			delete: this.delete,
		}

		// Get all the fields of the table
		const fields: { [x: string]:  DataFieldRaw<T> } = _.mapValues(this.props.fields, (value, name) => {
			let val: DataFieldRaw<T> = {
				name: name,
				view: true
			}

			// If the column is a string use that as the label
			// If the column is a function, use that function to display the cell
			// else if the column provides a view function then use that to display the cell
			if (typeof value === "string") {
				val.label = value
			} else if (typeof value === "function") {
				val.view = (obj: T, tableRef: DataViewRef<T>) => value(obj, _.assign({}, tableRef, thisRef))
			} else if (typeof value === "object") {
				_.assign(val, value)
				if (typeof value.view === "function") {
					const func = value.view
					val.view = (obj: T, tableRef: DataViewRef<T>) => func(obj, _.assign({}, tableRef, thisRef))
				}
			}

			return val
		})

		// Get all the fields for the create form
		// Get all the fields for the filter form
		const createFields: { [x: string]: DataFieldRaw<T> } = {}
		const filterFields: { [x: string]: DataFieldRaw<T> } = {}
		_.each(fields, (f, key) => {
			if (f.create) { createFields[key] = f }
			if (f.filter) { filterFields[key] = f }
		})

		try {
			_.each(this.props.filter, (value, name) => {
				// Get the filter field according to the filterName if specified,
				// otherwise just the name
				const ff = _.find(filterFields, { filterName: name }) || filterFields[name]

				// If we have a filterValue function then use that as the value for the check
				let val = (dataVal: T) => _.get(dataVal, name)
				if (typeof ff.filterValue === "function") {
					val = ff.filterValue
				}

				// If it is an array then we need to check if the value is in the array
				// Otherwise just use a normal regex check
				if (_.isArray(value)) {
					if (value.length === 0) {
						return
					}

					checks.push((dataVal: T) => {
						const v = val(dataVal)
						return value.indexOf(v) >= 0
					})
				} else {
					checks.push((dataVal: T) => (new RegExp(value, "i")).test(val(dataVal)))
				}
			})
			regsValid = true
		} catch {
			regsValid = false
		}

		// Filter out the values according to the filters
		// If the regex isn't valid then we don't want to filter
		const list = _.filter(this.props.list, data => {
			return !regsValid || _.every(checks, check => check(data))
		})

		// Check how many columns we need for the create and filter form
		const cols = this.props.createTitle && this.props.filterTitle ? 2 : 1

		// Wrap the provided actions if we have any
		const origActions = this.props.actions
		let actions = origActions
		if (typeof origActions === "function") {
			actions = (obj, tableRef) => origActions(obj, _.assign({}, tableRef, thisRef))
		}

		const DT = this.createTable()

		return (
			<Segment basic>

				<Grid stackable doubling columns={cols}>
					{this.props.createTitle &&
						checkPermissions(this.props.perms, [ this.props.perm, "create" ]) &&

						<Grid.Column>
							<CreateForm
								title={this.props.createTitle}
								button={this.props.createButton}
								creating={this.props.creating}
								fields={createFields}
								onCreate={(obj: T, view: DataViewRef<T>) =>
									this.props.onCreate ?
										this.props.onCreate(obj, _.assign({}, thisRef, view))
									:
										this.create(obj)
								}
							/>
						</Grid.Column>
					}

					{this.props.filterTitle &&
						<Grid.Column>
							<FilterForm
								title={this.props.filterTitle}
								fields={filterFields}
								valid={regsValid}
								values={this.props.filter}
								onFilterChange={this.props.setFilter}
							/>
						</Grid.Column>
					}
				</Grid>

				<DT
					title={this.props.title}
					icon={this.props.icon}
					list={list}
					t={this.props.t}
					idFunc={this.props.idFunc}
					fields={fields}
					onEdit={(obj, view) =>
						this.props.onEdit ?
							this.props.onEdit(obj, _.assign({}, thisRef, view))
						:
							this.edit(obj)
					}
					onSave={(obj, newObj, view) =>
						this.props.onSave ?
							this.props.onSave(obj, newObj, _.assign({}, thisRef, view))
						:
							this.save(obj, newObj)
					}
					onDelete={(obj, view) =>
						this.props.onDelete ?
							this.props.onDelete(obj, _.assign({}, thisRef, view))
						:
							this.delete(obj)
					}
					canEdit={checkPermissions(this.props.perms, [ this.props.perm, "change" ])
						&& this.props.canEdit}
					canDelete={checkPermissions(this.props.perms, [ this.props.perm, "delete" ])
						&& this.props.canDelete}
					actions={actions}
					isEditing={obj => this.props.equals(obj, this.state.data)}
				/>
			</Segment>
		)
	}
}

const mapStateToProps = (endpoint: string, id: IdFunction) => (_state: Store<object>) => {
	const state: Store<object> = _.get(_state, endpoint.replace(/\//g, "."))

	return {
		creating: state ? state.creating : false,
		filter: state && state.filter ? state.filter : {},
		list: state ? state.list : [],
		types: _state.api.types,
		idFunc: id,
		perm: endpoint.split("/"),
		perms: _state.api.permissions,
	}
}

const mapDispatchToProps = (endpoint: string, id: IdFunction, noDetails: boolean) =>
	(dispatch: Dispatch<Action>) => {
		return {
			requestList: () => dispatch(requestList(endpoint, !noDetails)),
			requestDetails: (data: object) => dispatch(requestDetails(endpoint, id, data)),
			requestCreate: (data: object) => dispatch(requestCreate(endpoint, id, data)),
			requestChange: (data: object, newData: object) => dispatch(requestChange(endpoint, id, data, newData)),
			requestDelete: (data: object) => dispatch(requestDelete(endpoint, id, data)),
			setFilter: (filter: string, value: string) => dispatch(setFilter(endpoint, filter, value)),
			equals: (o1: object, o2: object) => o1 != null && o2 != null && id(o1) === id(o2),
		}
	}

export default (endpoint: string, objId: string | IdFunction, noDetails: boolean) => {
	if (!objId) {
		objId = "id"
	}
	const id = typeof objId === "function" ? objId : (data: object) => _.get(data, objId)

	return connect(
		mapStateToProps(endpoint, id),
		mapDispatchToProps(endpoint, id, noDetails)
	)(DataView)
}
