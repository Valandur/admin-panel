import _ from "lodash"

import {
	EXECUTE_REQUEST, EXECUTE_RESPONSE
} from "../actions/command"

const commands = (state = { executing: false }, action) => {
	switch(action.type) {
		case EXECUTE_REQUEST:
			return _.assign({}, state, {
				executing: true,
			})

		case EXECUTE_RESPONSE:
			return _.assign({}, state, {
				executing: false,
			});

		default:
			return state;
	}
}

export default commands
