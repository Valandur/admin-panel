import _ from "lodash"

import {
	CRATE_SET_FILTER, CRATES_RESPONSE,
	CRATE_CREATE_REQUEST, CRATE_CREATE_RESPONSE,
	CRATE_CHANGE_REQUEST, CRATE_CHANGE_RESPONSE,
	CRATE_DELETE_REQUEST, CRATE_DELETE_RESPONSE
} from "../actions/husky"

const husky = (state = { crates: [], crateFilter: {}}, action) => {
	switch(action.type) {
		case CRATES_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				crates: _.sortBy(action.crates, "name"),
			})

		case CRATE_SET_FILTER:
			return _.assign({}, state, {
				crateFilter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case CRATE_CREATE_REQUEST:
			return _.assign({}, state, {
				crateCreating: true,
			})

		case CRATE_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					crateCreating: false,
				})
			}

			return _.assign({}, state, {
				crateCreating: false,
				crates: _.sortBy(_.concat(state.crates, action.crate), "name"),
			});

		case CRATE_CHANGE_REQUEST:
			return _.assign({}, state, {
				crates: _.map(state.crates, c => {
					if (c.id !== action.crate.id) return c;
					return _.assign({}, c, { updating: true })
				})
			})

		case CRATE_CHANGE_RESPONSE:
			return _.assign({}, state, {
				crates: _.map(state.crates, c => {
					if (c.id !== action.crate.id) return c;
					return _.assign({}, c, action.ok ? action.crate : null, { updating: false })
				})
			})

		case CRATE_DELETE_REQUEST:
			return _.assign({}, state, {
				crates: _.map(state.crates, c => {
					if (c.id !== action.crate.id) return c;
					return _.assign({}, c, { updating: true })
				})
			})

		case CRATE_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					crates: _.map(state.crates, c => {
						if (c.id !== action.crate.id) return c;
						return _.assign({}, c, { updating: false })
					})
				})
			}

			return _.assign({}, state, {
				crates: _.filter(state.crates, c => c.id !== action.crate.id)
			})

		default:
			return state;
	}
}

export default husky
