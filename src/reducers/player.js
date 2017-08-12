import _ from "lodash"

import {
	SET_FILTER, PLAYERS_RESPONSE,
	PLAYER_KICK_REQUEST, PLAYER_KICK_RESPONSE,
	PLAYER_BAN_REQUEST, PLAYER_BAN_RESPONSE,
} from "../actions/player"

const player = (state = { players: [], filter: {}}, action) => {
	switch(action.type) {
		case PLAYERS_RESPONSE:
			if (!action.ok)
				return state;
			
			return _.assign({}, state, {
				players: _.sortBy(action.players, "name"),
			});

		case SET_FILTER:
			return _.assign({}, state, {
				filter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case PLAYER_KICK_REQUEST:
			return _.assign({}, state, {
				players: _.map(state.players, p => {
					if (p.uuid !== action.uuid) return p;
					return _.assign({}, p, { updating: true })
				})
			})

		case PLAYER_KICK_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					players: _.map(state.players, p => {
						if (p.uuid !== action.player.uuid) return p;
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				players: _.filter(state.players, p => p.uuid !== action.player.uuid)
			})

		case PLAYER_BAN_REQUEST:
			return _.assign({}, state, {
				players: _.map(state.players, p => {
					if (p.name !== action.name) return p;
					return _.assign({}, p, { updating: true })
				})
			})

		case PLAYER_BAN_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					players: _.map(state.players, p => {
						if (p.name !== action.player.name) return p;
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				players: _.filter(state.players, p => p.name !== action.player.name)
			})

		default:
			return state;
	}
}

export default player
