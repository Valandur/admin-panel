import _ from "lodash"

import {
	DATA_SET_FILTER, DATA_LIST_RESPONSE,
	DATA_DETAILS_REQUEST, DATA_DETAILS_RESPONSE,
	DATA_CREATE_REQUEST, DATA_CREATE_RESPONSE,
	DATA_CHANGE_REQUEST, DATA_CHANGE_RESPONSE,
	DATA_DELETE_REQUEST, DATA_DELETE_RESPONSE,
} from "../actions/dataview"

const dataview = (state = {}, action) => {
	let path = null;
	if (action.endpoint) {
		path = action.endpoint.replace(/\//g, ".")
	}

	switch(action.type) {
		case DATA_LIST_RESPONSE:
			if (!action.ok)
				return state;
			
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: action.data,
				}
			})

		case DATA_DETAILS_REQUEST:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.map(state[path].list, obj => {
						if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
						return _.assign({}, obj, { updating: true })
					})
				}
			})

		case DATA_DETAILS_RESPONSE:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.map(state[path].list, obj => {
						if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
						return _.assign({}, obj, action.ok ? action.data : null, { updating: false })
					})
				}
			})

		case DATA_SET_FILTER:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					filter: {
						...state[path].filter,
						[action.filter]: action.value,
					},
				}
			});

		case DATA_CREATE_REQUEST:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					creating: true,
				},
			})

		case DATA_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					[path]: {
						...state[path],
						creating: false,
					}
				})
			}

			return _.assign({}, state, {
				[path]: {
					...state[path],
					creating: false,
					list: [...state[path].list, action.data],
				}
			});

		case DATA_CHANGE_REQUEST:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.map(state[path].list, obj => {
						if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
						return _.assign({}, obj, { updating: true })
					})
				}
			})

		case DATA_CHANGE_RESPONSE:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.map(state[path].list, obj => {
						if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
						return _.assign({}, obj, action.ok ? action.data : null, { updating: false })
					})
				}
			})

		case DATA_DELETE_REQUEST:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.map(state[path].list, obj => {
						if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
						return _.assign({}, obj, { updating: true })
					})
				}
			})

		case DATA_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					[path]: {
						...state[path],
						list: _.map(state[path].list, obj => {
							if (_.get(obj, action.id) !== _.get(action.data, action.id)) return obj;
							return _.assign({}, obj, { updating: false })
						})
					}
				})
			}

			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.filter(state[path].list, obj => 
						_.get(obj, action.id) !== _.get(action.data, action.id))
				}
			})

		default:
			return state;
	}
}

export default dataview
