import _ from "lodash"

import { TILE_ENTITIES_RESPONSE } from "../actions/tile-entity"

const tileEntity = (state = { tileEntities: []}, action) => {
	switch(action.type) {
		case TILE_ENTITIES_RESPONSE:
			return _.assign({}, state, {
				tileEntities: action.tileEntities,
			});

		default:
			return state;
	}
}

export default tileEntity
