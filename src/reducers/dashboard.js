import _ from "lodash"

import { INFO_RESPONSE } from "../actions"

const dashboard = (state = {}, action) => {
	switch(action.type) {
		case INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data,
			});

		default:
			return state;
	}
}

export default dashboard
