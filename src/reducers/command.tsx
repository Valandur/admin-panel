import * as _ from "lodash"
import { Action } from "redux"

import {
	EXECUTE_REQUEST, EXECUTE_RESPONSE
} from "../actions/command"

const commands = (state = { executing: false }, action: Action) => {
	switch (action.type) {
		case EXECUTE_REQUEST:
			return _.assign({}, state, {
				executing: true,
			})

		case EXECUTE_RESPONSE:
			return _.assign({}, state, {
				executing: false,
			})

		default:
			return state
	}
}

export default commands
