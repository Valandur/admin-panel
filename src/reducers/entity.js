import _ from "lodash"

import { WORLDS_RESPONSE } from "../actions/world"
import { ENTITIES_RESPONSE, SET_FILTER, ENTITY_CREATE_REQUEST, ENTITY_CREATE_RESPONSE } from "../actions/entity"
import { ENTITY_DELETE_REQUEST, ENTITY_DELETE_RESPONSE } from "../actions/entity"

const entity = (state = { entities: [], worlds: [], filter: {}}, action) => {
	switch(action.type) {
		case ENTITIES_RESPONSE:
			return _.assign({}, state, {
				entities: _.sortBy(action.entities, "uuid"),
			})

		case WORLDS_RESPONSE:
			return _.assign({}, state, {
				worlds: _.sortBy(action.worlds, "name"),
			});

		case ENTITY_CREATE_REQUEST:
			return _.assign({}, state, {
				creating: true,
			})

		case ENTITY_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					creating: false,
				})
			}
			window.toastr.success("Created " + action.entity.type);
			return _.assign({}, state, {
				creating: false,
				entities: _.sortBy(_.concat(state.entities, action.entity), "uuid"),
			});

		case ENTITY_DELETE_REQUEST:
			return _.assign({}, state, {
				entities: _.map(state.entities, e => {
					if (e.uuid !== action.uuid) return e;
					return _.assign({}, e, { updating: true })
				})
			})

		case ENTITY_DELETE_RESPONSE:
			if (!action.ok)
				return state;

			window.toastr.success("Deleted " + action.entity.type);
			return _.assign({}, state, {
				entities: _.filter(state.entities, e => e.uuid !== action.entity.uuid)
			})

		case SET_FILTER:
			return _.assign({}, state, {
				filter: {
					[action.filter]: action.value,
				}
			});

		default:
			return state;
	}
}

export default entity
