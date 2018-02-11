import _ from "lodash"

import {
	PLAYER_KICK_REQUEST, PLAYER_KICK_RESPONSE,
	PLAYER_BAN_REQUEST, PLAYER_BAN_RESPONSE,
} from "../actions/player"

const player = (state = {}, action) => {
	switch(action.type) {
		case PLAYER_KICK_REQUEST:
			return _.assign({}, state, {
				list: _.map(state.list, p => {
					if (p.uuid !== action.player.uuid) return p;
					return _.assign({}, p, { updating: true })
				})
			})

		case PLAYER_KICK_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					list: _.map(state.list, p => {
						if (p.uuid !== action.player.uuid) return p;
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				list: _.filter(state.list, p => p.uuid !== action.player.uuid)
			})

		case PLAYER_BAN_REQUEST:
			return _.assign({}, state, {
				list: _.map(state.list, p => {
					if (p.uuid !== action.player.uuid) return p;
					return _.assign({}, p, { updating: true })
				})
			})

		case PLAYER_BAN_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					list: _.map(state.list, p => {
						if (p.uuid !== action.player.uuid) return p;
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				list: _.filter(state.list, p => p.uuid !== action.player.uuid)
			})

		default:
			return state;
	}
}

export default player
