import _ from "lodash"

import {
	CRATE_SET_FILTER, CRATES_RESPONSE,
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

		default:
			return state;
	}
}

export default husky
