import _ from "lodash"

import {
	INFO_RESPONSE,
	TPS_INFO_RESPONSE,
	PLAYER_INFO_RESPONSE
} from "../actions/dashboard"

const dashboard = (state = { tps: [], players: []}, action) => {
	if (!action.ok)
		return state;

	switch(action.type) {
		case INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data,
			});

		case TPS_INFO_RESPONSE:
			return _.assign({}, state, {
				tps: action.tps,
			})

		case PLAYER_INFO_RESPONSE:			
			return _.assign({}, state, {
				players: action.players,
			})

		default:
			return state;
	}
}

export default dashboard
