import _ from "lodash"

import { SET_FILTER, COMMANDS_RESPONSE, EXECUTE_REQUEST, EXECUTE_RESPONSE } from "../actions/command"

const commands = (state = { commands: [], filter: {}, executing: false }, action) => {
	switch(action.type) {
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
			window.toastr.success(action.result, "Execute Command: " + action.command)
			return _.assign({}, state, {
				excuting: false,
			});

		default:
			return state;
	}
}

export default commands
