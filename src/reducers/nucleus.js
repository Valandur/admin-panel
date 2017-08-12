import _ from "lodash"

import {
	SET_FILTER, KITS_RESPONSE, JAILS_RESPONSE, 
	JAIL_CREATE_REQUEST, JAIL_CREATE_RESPONSE, 
	JAIL_DELETE_REQUEST, JAIL_DELETE_RESPONSE, 
} from "../actions/nucleus"

const nucleus = (state = { kits: [], jails: [], filter: {}}, action) => {
	switch(action.type) {
		case SET_FILTER:
			return _.assign({}, state, {
				filter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case KITS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				kits: action.kits,
			})

		case JAILS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				jails: _.sortBy(action.jails, "name"),
			})

		case JAIL_CREATE_REQUEST:
			return _.assign({}, state, {
				creating: true,
			})

		case JAIL_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					creating: false,
				})
			}

			return _.assign({}, state, {
				creating: false,
				jails: _.sortBy(_.concat(state.jails, action.jail), "name"),
			});

		case JAIL_DELETE_REQUEST:
			return _.assign({}, state, {
				jails: _.map(state.jails, j => {
					if (j.name !== action.name) return j;
					return _.assign({}, j, { updating: true })
				})
			})

		case JAIL_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					jails: _.map(state.entities, j => {
						if (j.name !== action.name) return j;
						return _.assign({}, j, { updating: false })
					})
				})
			}

			return _.assign({}, state, {
				jails: _.filter(state.jails, j => j.name !== action.jail.name)
			})

		default:
			return state;
	}
}

export default nucleus
