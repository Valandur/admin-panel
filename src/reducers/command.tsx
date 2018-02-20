import * as _ from "lodash"

import { AppAction } from "../actions"
import { TypeKeys } from "../actions/command"
import { DataViewState } from "./dataview"

import { Command } from "../fetch"

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
			return _.assign({}, state, {
				executing: true,
			})

		case TypeKeys.EXECUTE_RESPONSE:
			return _.assign({}, state, {
				executing: false,
			})

		default:
			return state
	}
}
