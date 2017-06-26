import _ from "lodash"

import { SET_FILTER, TILE_ENTITIES_RESPONSE } from "../actions/tile-entity"

const tileEntity = (state = { tileEntities: [], worlds: [], filter: {}}, action) => {
	switch(action.type) {
		case TILE_ENTITIES_RESPONSE:
			return _.assign({}, state, {
				tileEntities: action.tileEntities,
			});

		case SET_FILTER:
			return _.assign({}, state, {
				filter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		default:
			return state;
	}
}

export default tileEntity
