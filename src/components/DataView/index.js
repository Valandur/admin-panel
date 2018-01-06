import React, { Component } from "react"
import { connect } from "react-redux"
import {
	Segment, Grid,
} from "semantic-ui-react"
import _ from "lodash"

import DataTable from "../DataTable"
import FilterForm from "../FilterForm"
import CreateForm from "../CreateForm"

import {
	setFilter,
	requestList,
	requestDetails,
	requestCreate,
	requestChange,
	requestDelete,
} from "../../actions/dataview"


class DataView extends Component {

	constructor(props) {
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

	componentDidMount() {
		this.props.requestList()

		this.interval = setInterval(this.props.requestList, 10000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.creating !== this.props.creating ||
			nextProps.filter !== this.props.filter ||
			nextProps.list !== this.props.list ||
			nextState.data !== this.state.data;
	}

	// Create a new data entry
	create(data) {
		this.props.requestCreate(data)
	}

	// Get the details for a data entry
	details(data) {
		this.props.requestDetails(data)
	}

	// Select a data entry for editing
	edit(data) {
		this.setState({
			data: data,
		})
	}

	// Save/Update an existing data entry
	save(data, newData) {
		this.props.requestChange(data, newData)
		this.setState({
			data: null,
		})
	}

	// Delete a data entry
	delete(data) {
		this.props.requestDelete(data);
	}

	render() {
		const checks = [];
		let regsValid = false;

		// Reference that we pass to our various functions
		const thisRef = {
			create: this.create,
			details: this.details,
			save: this.save,
			edit: this.edit,
			delete: this.delete,
		};

		// Get all the columns of the table
		const columns = _.mapValues(this.props.fields, (value, name) => {
			let newValue = null;

			// If the column is a function, use that function to display the cell
			if (typeof value === "function") {
				newValue = (obj, tableRef) => value(obj, _.assign({}, tableRef, thisRef))
			} 
			// else if the column provides a view function then use that to display the cell
			else if (typeof value.view === "function") {
				newValue = _.assign({}, value, {
					view: (obj, tableRef) => value.view(obj, _.assign({}, tableRef, thisRef)),
				})
			}

			return newValue ? newValue : value;
		});
		// Get all the fields for the create form
		const createFields = _.pickBy(this.props.fields, "create")
		// Get all the fields for the filter form
		const filterFields = _.pickBy(this.props.fields, "filter")

		try {
			_.each(this.props.filter, (value, name) => {
				// Get the filter field according to the filterName if specified,
				// otherwise just the name
				const ff = _.find(filterFields, { filterName: name }) || filterFields[name];

				// If we have a filterValue function then use that as the value for the check
				let val = dataVal => _.get(dataVal, name)
				if (typeof ff.filterValue === "function") {
					val = ff.filterValue
				} 

				// If it is an array then we need to check if the value is in the array
				if (_.isArray(value)) {
					if (value.length === 0) return;
					checks.push(dataVal => {
						const v = val(dataVal);
						return value.indexOf(v) >= 0
					})
				}
				// Otherwise just use a normal regex check 
				else {
					checks.push(dataVal => (new RegExp(value, "i")).test(val(dataVal)))
				}
			})
			regsValid = true;
		} catch (e) {}

		// Filter out the values according to the filters
		// If the regex isn't valid then we don't want to filter
		const list = _.filter(this.props.list, data => {
			return !regsValid || _.every(checks, check => check(data))
		});

		// Check how many columns we need for the create and filter form
		const cols = this.props.createTitle && this.props.filterTitle ? 2 : 1;

		// Wrap the provided actions if we have any
		const origActions = this.props.actions
		let actions = origActions;
		if (typeof origActions === "function") {
			actions = (obj, tableRef) => origActions(obj, _.assign({}, tableRef, thisRef))
		}
		
		return (
			<Segment basic>

				<Grid stackable doubling columns={cols}>
					{this.props.createTitle && 
						<Grid.Column>
							<CreateForm
								title={this.props.createTitle}
								button={this.props.createButton}
								fields={createFields}
								creating={this.props.creating}
								onCreate={(obj, view) =>
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

				<DataTable
					title={this.props.title}
					icon={this.props.icon}
					list={list}
					idFunc={this.props.idFunc}
					columns={columns}
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
					canEdit={this.props.canEdit}
					canDelete={this.props.canDelete}
					actions={actions}
					isEditing={obj => this.props.equals(obj, this.state.data)}
				/>

			</Segment>
		);
	}
}

const mapStateToProps = (endpoint, id) => (_state) => {
	const state = _.get(_state, endpoint.replace(/\//g, "."));

	return {
		creating: state ? state.creating : false,
		filter: state && state.filter ? state.filter : {},
		list: state ? state.list : [],
		types: _state.api.types,
		idFunc: id,
	}
}

const mapDispatchToProps = (endpoint, id, noDetails) => (dispatch) => {
	return {
		requestList: () => dispatch(requestList(endpoint, !noDetails)),
		requestDetails: (data) => dispatch(requestDetails(endpoint, id, data)),
		requestCreate: (data) => dispatch(requestCreate(endpoint, data)),
		requestChange: (data, newData) => dispatch(requestChange(endpoint, id, data, newData)),
		requestDelete: (data) => dispatch(requestDelete(endpoint, id, data)),
		setFilter: (filter, value) => dispatch(setFilter(endpoint, filter, value)),
		equals: (o1, o2) => o1 != null && o2 != null && id(o1) === id(o2),
	}
}

export default (endpoint, objId, noDetails) => {
	if (!objId) objId = "id";
	const id = typeof objId === "function" ? objId : data => _.get(data, objId);

	return connect(
		mapStateToProps(endpoint, id), 
		mapDispatchToProps(endpoint, id, noDetails)
	)(DataView);
}
