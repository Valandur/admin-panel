import _ from "lodash"

import {
	INFO_RESPONSE,
	STATS_RESPONSE,
} from "../actions/dashboard"

const dashboard = (state = { tps: [], players: [], cpu: [], memory: [], disk: []}, action) => {
	if (!action.ok)
		return state;

	switch(action.type) {
		case INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data,
			});

		case STATS_RESPONSE:
			return _.assign({}, state, {
				tps: action.tps,
				players: action.players,
				cpu: action.cpu,
				memory: action.memory,
				disk: action.disk,
			})

		default:
			return state;
	}
}

export default dashboard
