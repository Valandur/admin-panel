import _ from "lodash"

import {
	WORLDS_RESPONSE,
	WORLD_CHANGE_REQUEST, WORLD_CHANGE_RESPONSE,
	WORLD_CREATE_REQUEST, WORLD_CREATE_RESPONSE,
	WORLD_DELETE_REQUEST, WORLD_DELETE_RESPONSE, 
} from "../actions/world"

const world = (state = { worlds: []}, action) => {
	switch(action.type) {
		case WORLDS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				worlds: _.sortBy(action.worlds, "name"),
			})

		case WORLD_CHANGE_REQUEST:
			return _.assign({}, state, {
				worlds: _.map(state.worlds, w => {
					if (w.uuid !== action.uuid) return w;
					return _.assign({}, w, { updating: true })
				})
			})

		case WORLD_CHANGE_RESPONSE:
			return _.assign({}, state, {
				worlds: _.map(state.worlds, w => {
					if (w.uuid !== action.world.uuid) return w;
					return _.assign({}, w, action.ok ? action.world : null, { updating: false })
				})
			})

		case WORLD_CREATE_REQUEST:
			return _.assign({}, state, {
				creating: true,
			})

		case WORLD_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					creating: false,
				})
			}

			return _.assign({}, state, {
				creating: false,
				worlds: _.sortBy(_.concat(state.worlds, action.world), "name"),
			});

		case WORLD_DELETE_REQUEST:
			return _.assign({}, state, {
				worlds: _.map(state.worlds, w => {
					if (w.uuid !== action.uuid) return w;
					return _.assign({}, w, { updating: true })
				})
			})

		case WORLD_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					worlds: _.map(state.worlds, w => {
						if (w.uuid !== action.uuid) return w;
						return _.assign({}, w, { updating: false })
					})
				})
			}

			return _.assign({}, state, {
				worlds: _.filter(state.worlds, w => w.uuid !== action.world.uuid)
			})

		default:
			return state;
	}
}

export default world
