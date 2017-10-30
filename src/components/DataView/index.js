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

	create(data) {
		this.props.requestCreate(data)
	}

	details(data) {
		this.props.requestDetails(data)
	}

	edit(data) {
		this.setState({
			data: data,
		})
	}

	save(data, newData) {
		this.props.requestChange(data, newData)
		this.setState({
			data: null,
		})
	}

	delete(data) {
		this.props.requestDelete(data);
	}

	render() {
		const checks = [];
		let regsValid = false;

		const thisRef = {
			create: this.create,
			details: this.details,
			save: this.save,
			edit: this.edit,
			delete: this.delete,
		};

		const columns = _.mapValues(this.props.fields, (value, name) => {
			let newValue = null;

			if (typeof value === "function") {
				newValue = (obj, tableRef) => value(obj, _.assign({}, tableRef, thisRef))
			} else if (typeof value.view === "function") {
				newValue = _.assign({}, value, {
					view: (obj, tableRef) => value.view(obj, _.assign({}, tableRef, thisRef)),
				})
			}

			return newValue ? newValue : value;
		});
		const createFields = _.pickBy(this.props.fields, "create")
		const filterFields = _.pickBy(this.props.fields, "filter")

		try {
			_.each(this.props.filter, (value, name) => {
				if (_.isArray(value)) {
					if (value.length === 0) return;
					checks.push({
						name: name,
						run: (dataVal) => value.indexOf(dataVal) >= 0
					})
				} else {
					checks.push({
						name: name,
						run: (dataVal) => (new RegExp(value, "i")).test(dataVal)
					});
				}
			})
			regsValid = true;
		} catch (e) {}

		const list = _.filter(this.props.list, data => {
			if (!regsValid) return true;
			return _.every(checks, check => check.run(_.get(data, check.name)))
		});

		const cols = this.props.createTitle && this.props.filterTitle ? 2 : 1;

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

const mapStateToProps = (endpoint, objId) => (_state) => {
	const state = _.get(_state.dataview, endpoint.replace(/\//g, "."));

	return {
		creating: state ? state.creating : false,
		filter: state && state.filter ? state.filter : {},
		list: state ? state.list : [],
		types: _state.api.types,
	}
}

const mapDispatchToProps = (endpoint, objId, noDetails) => (dispatch) => {
	if (!objId) objId = "id";

	return {
		requestList: () => dispatch(requestList(endpoint, !noDetails)),
		requestDetails: (data) => dispatch(requestDetails(endpoint, objId, data)),
		requestCreate: (data) => dispatch(requestCreate(endpoint, data)),
		requestChange: (data, newData) => dispatch(requestChange(endpoint, objId, data, newData)),
		requestDelete: (data) => dispatch(requestDelete(endpoint, objId, data)),
		setFilter: (filter, value) => dispatch(setFilter(endpoint, filter, value)),
		equals: (o1, o2) => o1 != null && o2 != null && _.get(o1, objId) === _.get(o2, objId),
	}
}

export default (endpoint, objId, noDetails) => {
	return connect(
		mapStateToProps(endpoint, objId), 
		mapDispatchToProps(endpoint, objId, noDetails)
	)(DataView);
}
