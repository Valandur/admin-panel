export const WORLDS_REQUEST = "WORLD_REQUEST"
export const WORLDS_RESPONSE = "WORLD_RESPONSE"
export function requestWorlds(details = false) {
	return {
		type: WORLDS_REQUEST,
		details: details,
	}
}

export const WORLD_UPDATE_REQUEST = "WORLD_UPDATE_REQUEST"
export const WORLD_UPDATE_RESPONSE = "WORLD_UPDATE_RESPONSE"
export function requestUpdateWorld(uuid, data, op) {
	return {
		type: WORLD_UPDATE_REQUEST,
		uuid: uuid,
		data: data,
		op: op,
	}
}

export const WORLD_CREATE_REQUEST = "WORLD_CREATE_REQUEST"
export const WORLD_CREATE_RESPONSE = "WORLD_CREATE_RESPONSE"
export function requestCreateWorld(data) {
	return {
		type: WORLD_CREATE_REQUEST,
		data: data,
	}
}

export const WORLD_DELETE_REQUEST = "WORLD_DELETE_REQUEST"
export const WORLD_DELETE_RESPONSE = "WORLD_DELETE_RESPONSE"
export function requestDeleteWorld(uuid) {
	return {
		type: WORLD_DELETE_REQUEST,
		uuid: uuid,
	}
}
