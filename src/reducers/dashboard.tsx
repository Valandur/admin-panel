import * as _ from "lodash"

import { AppAction } from "../actions"
import { TypeKeys } from "../actions/dashboard"

import { ServerInfo, ServerStats } from "../fetch"

export interface DashboardState extends ServerStats {
	data?: ServerInfo
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
