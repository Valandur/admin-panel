import { AppAction } from "../actions"
import { TypeKeys } from "../actions/command"
import { Command } from "../fetch"

import { DataViewState } from "./dataview"

export interface CommandState extends DataViewState<Command> {
	executing: boolean
}

const initialState: CommandState = {
	creating: false,
	executing: false,
	filter: {},
	list: [],
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.EXECUTE_REQUEST:
			return {
				...state,
				executing: true,
			}

		case TypeKeys.EXECUTE_RESPONSE:
			return {
				...state,
				executing: false,
			}

		default:
			return state
	}
}
