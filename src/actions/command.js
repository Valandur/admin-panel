export const COMMAND_HISTORY_REQUEST = "COMMAND_HISTORY_REQUEST"
export const COMMAND_HISTORY_RESPONSE = "COMMAND_HISTORY_RESPONSE"
export function requestCommandHistory() {
	return {
		type: COMMAND_HISTORY_REQUEST,
	}
}

export const COMMANDS_REQUEST = "COMMANDS_REQUEST"
export const COMMANDS_RESPONSE = "COMMANDS_RESPONSE"
export function requestCommands() {
	return {
		type: COMMANDS_REQUEST,
	}
}

export const SET_FILTER = "COMMAND_SET_FILTER"
export function setFilter(filter, value) {
	return {
		type: SET_FILTER,
		filter: filter,
		value: value,
	}
}

export const EXECUTE_REQUEST = "EXECUTE_REQUEST"
export const EXECUTE_RESPONSE = "EXECUTE_RESPONSE"
export function requestExecute(cmd, waitLines, waitTime) {
	return {
		type: EXECUTE_REQUEST,
		command: command,
		waitLines: waitLines,
		waitTime: waitTime,
	}
}
