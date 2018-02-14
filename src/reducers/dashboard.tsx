import * as _ from "lodash"
import { Action } from "redux"

import {
	INFO_RESPONSE,
	STATS_RESPONSE,
} from "../actions/dashboard"

const defaultState = {
	tps: [],
	players: [],
	cpu: [],
	memory: [],
	disk: [],
}

const dashboard = (state = defaultState, action: Action) => {
	switch (action.type) {
		case INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data,
			})

		case STATS_RESPONSE:
			return _.assign({}, state, {
				tps: action.tps,
				players: action.players,
				cpu: action.cpu,
				memory: action.memory,
				disk: action.disk,
			})

		default:
			return state
	}
}

export default dashboard
