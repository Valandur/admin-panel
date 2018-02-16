import * as _ from "lodash"

import { TypeKeys, DataViewAction } from "../actions/dataview"
import { AppState, DataObject, IdFunction } from "../types"

export interface DataViewState<T> {
	creating: boolean
	filter: {
		[x: string]: string | string[]
	}
	list: T[]
}

export default (state: AppState, action: DataViewAction<DataObject>) => {
	let path: string = ""
	if (_.has(action, "endpoint")) {
		path = action.endpoint.replace(/\//g, ".")
	}

	const changeObjectStatus = (id: IdFunction<DataObject>, data: DataObject, updating: boolean) =>
		_.assign({}, state, {
			[path]: {
				...state[path],
				list: _.map(state[path].list, obj => {
					if (id(obj) !== id(data)) {
						return obj
					}
					return _.assign({}, obj, data, { updating })
				})
			}
		})

	switch (action.type) {
		case TypeKeys.LIST_RESPONSE:
			if (action.err) {
				return state
			}

			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: action.list,
				}
			})

		case TypeKeys.CREATE_REQUEST:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					creating: true,
				},
			})

		case TypeKeys.CREATE_RESPONSE:
			if (action.err) {
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
			})

		case TypeKeys.DETAILS_REQUEST:
			return changeObjectStatus(action.id, action.data, true)

		case TypeKeys.DETAILS_RESPONSE:
			return changeObjectStatus(action.id, action.data, !action.err)

		case TypeKeys.CHANGE_REQUEST:
			return changeObjectStatus(action.id, action.data, true)

		case TypeKeys.CHANGE_RESPONSE:
			return changeObjectStatus(action.id, action.data, !action.err)

		case TypeKeys.DELETE_REQUEST:
			return changeObjectStatus(action.id, action.data, true)

		case TypeKeys.DELETE_RESPONSE:
			if (action.err) {
				changeObjectStatus(action.id, action.data, false)
			}

			return _.assign({}, state, {
				[path]: {
					...state[path],
					list: _.filter(state[path].list, obj =>
						action.id(obj) !== action.id(action.data))
				}
			})

		case TypeKeys.SET_FILTER:
			return _.assign({}, state, {
				[path]: {
					...state[path],
					filter: {
						...state[path].filter,
						[action.filter]: action.value,
					},
				}
			})

		default:
			return state
	}
}
