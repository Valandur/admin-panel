import * as _ from "lodash"

import { TypeKeys } from "../actions/dashboard"
import { AppAction } from "../actions"
import { ServerStat, InfoData } from "../types"

export interface DashboardState {
	tps: ServerStat[]
	players: ServerStat[]
	cpu: ServerStat[]
	memory: ServerStat[]
	disk: ServerStat[]
	data?: InfoData
}

const defaultState: DashboardState = {
	tps: [],
	players: [],
	cpu: [],
	memory: [],
	disk: [],
}

export default (state = defaultState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data,
			})

		case TypeKeys.STATS_RESPONSE:
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
