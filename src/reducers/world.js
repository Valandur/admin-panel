import _ from "lodash"

import { WORLDS_RESPONSE, WORLD_UPDATE_REQUEST, WORLD_UPDATE_RESPONSE } from "../actions/world"
import { WORLD_CREATE_REQUEST, WORLD_CREATE_RESPONSE, WORLD_DELETE_REQUEST, WORLD_DELETE_RESPONSE } from "../actions/world"

const world = (state = { worlds: []}, action) => {
	switch(action.type) {
		case WORLDS_RESPONSE:
			return _.assign({}, state, {
				worlds: _.sortBy(action.worlds, "name"),
			})

		case WORLD_UPDATE_REQUEST:
			return _.assign({}, state, {
				worlds: _.map(state.worlds, w => {
					if (w.uuid !== action.uuid) return w;
					return _.assign({}, w, { updating: true })
				})
			})

		case WORLD_UPDATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					worlds: _.map(state.worlds, w => {
						if (w.uuid !== action.world.uuid) return w;
						return _.assign({}, w, { updating: false })
					})
				})
			}
			window.toastr.success((action.op ? action.op : "Updated") + " " + action.world.name);
			return _.assign({}, state, {
				worlds: _.map(state.worlds, w => {
					if (w.uuid !== action.world.uuid) return w;
					return _.assign({}, w, action.world, { updating: false })
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

			window.toastr.success("Created " + action.world.name);
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
			if (!action.ok)
				return state;

			window.toastr.success("Deleted " + action.world.name);
			return _.assign({}, state, {
				worlds: _.filter(state.worlds, w => w.uuid !== action.world.uuid)
			})

		default:
			return state;
	}
}

export default world
