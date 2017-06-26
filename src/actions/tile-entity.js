export const TILE_ENTITIES_REQUEST = "TILE_ENTITIES_REQUEST"
export const TILE_ENTITIES_RESPONSE = "TILE_ENTITIES_RESPONSE"
export function requestTileEntities(details = false) {
	return {
		type: TILE_ENTITIES_REQUEST,
		details: details,
	}
}

export const SET_FILTER = "TILE_ENTITY_SET_FILTER"
export function setFilter(filter, value) {
	return {
		type: SET_FILTER,
		filter: filter,
		value: value,
	}
}
