export const TILE_ENTITIES_REQUEST = "TILE_ENTITIES_REQUEST"
export const TILE_ENTITIES_RESPONSE = "TILE_ENTITIES_RESPONSE"
export function requestTileEntities(details = false) {
	return {
		type: TILE_ENTITIES_REQUEST,
		details: details,
	}
}
