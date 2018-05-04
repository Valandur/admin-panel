import * as _ from "lodash"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Grid, Segment } from "semantic-ui-react"

import { AppAction } from "../../actions"
import {
	requestChange,
	requestCreate,
	requestDelete,
	requestDetails,
	requestList,
	setFilter
} from "../../actions/dataview"
import { DataViewState } from "../../reducers/dataview"
import { AppState, DataFieldRaw, DataTableRef, DataViewRef, IdFunction } from "../../types"
import CreateForm from "../CreateForm"
import DataTable, { Props as DataTableProps } from "../DataTable"
import FilterForm from "../FilterForm"
import { checkPermissions } from "../Util"

import { DispatchProps, FullProps, OwnProps, OwnState, StateProps } from "./types"

class DataView<T> extends React.Component<FullProps<T>, OwnState<T>> {
	interval: NodeJS.Timer

	constructor(props: FullProps<T>) {
		super(props)

		this.state = {
			page: 0,
			data: null
		}

		this.details = this.details.bind(this)
		this.create = this.create.bind(this)
		this.edit = this.edit.bind(this)
		this.endEdit = this.endEdit.bind(this)
		this.save = this.save.bind(this)
		this.delete = this.delete.bind(this)
	}

	createTable() {
		return DataTable as React.ComponentClass<DataTableProps<T>>
	}

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

	shouldComponentUpdate(nextProps: FullProps<T>, nextState: OwnState<T>) {
		return (
			nextProps.creating !== this.props.creating ||
			nextProps.filter !== this.props.filter ||
			nextProps.fields !== this.props.fields ||
			nextProps.list !== this.props.list ||
			nextState.data !== this.state.data
		)
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
			data: data
		})
	}

	// Save/Update an existing data entry
	save(data: T, newData: any) {
		this.props.requestChange(data, newData)
		this.endEdit()
	}

	// End editing an entry
	endEdit() {
		this.setState({
			data: null
		})
	}

	// Delete a data entry
	delete(data: T) {
		this.props.requestDelete(data)
	}

	render() {
		const {
			filter,
			canEdit,
			canDelete,
			onCreate,
			onEdit,
			onDelete,
			onSave,
			perm,
			perms,
			title,
			createTitle,
			filterTitle
		} = this.props

		const checks: ((val: T) => boolean)[] = []
		let regsValid = false

		// Reference that we pass to our various functions
		const expandRef = (tableRef: DataTableRef): DataViewRef<T> => ({
			...tableRef,
			create: this.create,
			details: this.details,
			save: this.save,
			edit: this.edit,
			endEdit: this.endEdit,
			delete: this.delete
		})

		// Get all the fields of the table
		const fields: { [x: string]: DataFieldRaw<T> } = _.mapValues(
			this.props.fields,
			(value, name) => {
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
					val.view = (obj: T, tableRef: DataTableRef) => value(obj, expandRef(tableRef))
				} else if (typeof value === "object") {
					val = { ...val, ...value }
					if (typeof value.view === "function") {
						const func = value.view
						val.view = (obj: T, tableRef: DataTableRef) => func(obj, expandRef(tableRef))
					}
				}

				return val
			}
		)

		// Get all the fields for the create form
		// Get all the fields for the filter form
		const createFields: { [x: string]: DataFieldRaw<T> } = {}
		const filterFields: { [x: string]: DataFieldRaw<T> } = {}
		Object.keys(fields).forEach(f => {
			if (fields[f].create) {
				createFields[f] = fields[f]
			}
			if (fields[f].filter) {
				filterFields[f] = fields[f]
			}
		})

		try {
			Object.keys(filter).forEach(name => {
				const value = filter[name]

				// Get the filter field according to the filterName if specified,
				// otherwise just the name
				const ff =
					Object.keys(filterFields)
						.map(f => filterFields[f])
						.find(f => f.filterName === name) || filterFields[name]

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
					checks.push((dataVal: T) => new RegExp(value, "i").test(val(dataVal)))
				}
			})
			regsValid = true
		} catch {
			regsValid = false
		}

		// Filter out the values according to the filters
		// If the regex isn't valid then we don't want to filter
		const list = this.props.list.filter(data => {
			return !regsValid || checks.every(check => check(data))
		})

		// Check how many columns we need for the create and filter form
		const cols = createTitle && filterTitle ? 2 : 1

		// Wrap the provided actions if we have any
		const origActions = this.props.actions
		let actions = origActions
		if (typeof origActions === "function") {
			actions = (obj, tableRef) => origActions(obj, expandRef(tableRef))
		}

		const DT = this.createTable()

		return (
			<Segment basic>
				<Grid stackable doubling columns={cols}>
					{createTitle &&
						checkPermissions(perms, perm.concat("create")) && (
							<Grid.Column>
								<CreateForm
									title={createTitle}
									button={this.props.createButton}
									creating={this.props.creating}
									fields={createFields}
									onCreate={(obj: any, tableRef: DataTableRef) =>
										onCreate ? onCreate(obj, expandRef(tableRef)) : this.create(obj)
									}
								/>
							</Grid.Column>
						)}

					{filterTitle && (
						<Grid.Column>
							<FilterForm
								title={filterTitle}
								fields={filterFields}
								valid={regsValid}
								values={filter}
								onFilterChange={this.props.setFilter}
							/>
						</Grid.Column>
					)}
				</Grid>

				<DT
					title={title}
					icon={this.props.icon}
					list={list}
					t={this.props.t}
					idFunc={this.props.idFunc}
					fields={fields}
					onEdit={(obj, tableRef) => (onEdit ? onEdit(obj, expandRef(tableRef)) : this.edit(obj))}
					onSave={(obj, newObj, tableRef) =>
						onSave ? onSave(obj, newObj, expandRef(tableRef)) : this.save(obj, newObj)
					}
					onDelete={(obj, tableRef) =>
						onDelete ? onDelete(obj, expandRef(tableRef)) : this.delete(obj)
					}
					canEdit={(obj: T) =>
						(typeof canEdit === "function" ? canEdit(obj) : !!canEdit) &&
						checkPermissions(perms, perm.concat("modify"))
					}
					canDelete={(obj: T) =>
						(typeof canDelete === "function" ? canDelete(obj) : !!canDelete) &&
						checkPermissions(perms, perm.concat("delete"))
					}
					actions={actions}
					isEditing={obj => this.props.equals(obj, this.state.data)}
				/>
			</Segment>
		)
	}
}

function mapStateToProps<T>(endpoint: string, id: IdFunction<T>) {
	return (_state: AppState, ownProps: OwnProps<T>) => {
		const state: DataViewState<T> = _.get(_state, endpoint.replace(/\//g, "_").replace("-", ""))

		return {
			creating: state ? state.creating : false,
			filter: state && state.filter ? state.filter : {},
			list: state ? state.list : [],
			types: _state.api.types,
			idFunc: id,
			perm: endpoint.split("/"),
			perms: _state.api.permissions
		}
	}
}

function mapDispatchToProps<T>(endpoint: string, id: IdFunction<T>, noDetails: boolean) {
	return (dispatch: Dispatch<AppAction>) => {
		return {
			requestList: () => dispatch(requestList(endpoint, !noDetails)),
			requestDetails: (data: T) => dispatch(requestDetails(endpoint, id, data)),
			requestCreate: (data: T) => dispatch(requestCreate(endpoint, id, data)),
			requestChange: (data: T, newData: object) =>
				dispatch(requestChange(endpoint, id, data, newData)),
			requestDelete: (data: T) => dispatch(requestDelete(endpoint, id, data)),
			setFilter: (filter: string, value: string) => dispatch(setFilter(endpoint, filter, value)),
			equals: (o1: T, o2: T) => o1 != null && o2 != null && id(o1) === id(o2)
		}
	}
}

export default function createDataView<T>(
	endpoint: string,
	objId: string | IdFunction<T>,
	noDetails?: boolean
) {
	if (!objId) {
		objId = "id"
	}
	const id = typeof objId === "function" ? objId : (data: T) => _.get(data, objId as string)

	return connect<StateProps<T>, DispatchProps<T>, OwnProps<T>, AppState>(
		mapStateToProps<T>(endpoint, id),
		mapDispatchToProps<T>(endpoint, id, noDetails ? true : false)
	)(DataView)
}
