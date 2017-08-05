import _ from "lodash"

import {
	SET_FILTER,
	COMMANDS_RESPONSE,
	COMMAND_HISTORY_RESPONSE,
	EXECUTE_REQUEST,
	EXECUTE_RESPONSE
} from "../actions/command"

const commands = (state = { commands: [], history: [], filter: {}, executing: false }, action) => {
	switch(action.type) {
		case COMMAND_HISTORY_RESPONSE:
			return _.assign({}, state, {
				history: action.history,
			})

		case COMMANDS_RESPONSE:
			return _.assign({}, state, {
				commands: action.commands,
			})

		case SET_FILTER:
			return _.assign({}, state, {
				filter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

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
