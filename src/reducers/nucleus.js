import _ from "lodash"

import {
	KIT_SET_FILTER, KITS_RESPONSE,
	KIT_CREATE_REQUEST, KIT_CREATE_RESPONSE, 
	KIT_DELETE_REQUEST, KIT_DELETE_RESPONSE, 
	JAIL_SET_FILTER, JAILS_RESPONSE, 
	JAIL_CREATE_REQUEST, JAIL_CREATE_RESPONSE, 
	JAIL_DELETE_REQUEST, JAIL_DELETE_RESPONSE, 
} from "../actions/nucleus"

const nucleus = (state = { kits: [], jails: [], kitFilter: {}, jailFilter: {}}, action) => {
	switch(action.type) {
		case KITS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				kits: _.sortBy(action.kits, "name"),
			})

		case KIT_SET_FILTER:
			return _.assign({}, state, {
				kitFilter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case KIT_CREATE_REQUEST:
			return _.assign({}, state, {
				kitCreating: true,
			})

		case KIT_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					kitCreating: false,
				})
			}

			return _.assign({}, state, {
				kitCreating: false,
				kits: _.sortBy(_.concat(state.kits, action.kit), "name"),
			});

		case KIT_DELETE_REQUEST:
			return _.assign({}, state, {
				kits: _.map(state.kits, k => {
					if (k.name !== action.name) return k;
					return _.assign({}, k, { updating: true })
				})
			})

		case KIT_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					kits: _.map(state.kits, k => {
						if (k.name !== action.kit.name) return k;
						return _.assign({}, k, { updating: false })
					})
				})
			}

			return _.assign({}, state, {
				kits: _.filter(state.kits, k => k.name !== action.kit.name)
			})

		case JAILS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				jails: _.sortBy(action.jails, "name"),
			})

		case JAIL_SET_FILTER:
			return _.assign({}, state, {
				jailFilter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case JAIL_CREATE_REQUEST:
			return _.assign({}, state, {
				jailCreating: true,
			})

		case JAIL_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					jailCreating: false,
				})
			}

			return _.assign({}, state, {
				jailCreating: false,
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
					jails: _.map(state.jails, j => {
						if (j.name !== action.jail.name) return j;
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
