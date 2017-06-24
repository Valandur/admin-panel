export const ENTITIES_REQUEST = "ENTITY_REQUEST"
export const ENTITIES_RESPONSE = "ENTITY_RESPONSE"
export function requestEntities(details = false) {
	return {
		type: ENTITIES_REQUEST,
		details: details,
	}
}

export const SET_FILTER = "ENTITY_SET_FILTER"
export function setFilter(filter, value) {
	return {
		type: SET_FILTER,
		filter: filter,
		value: value,
	}
}

export const ENTITY_CREATE_REQUEST = "ENTITY_CREATE_REQUEST"
export const ENTITY_CREATE_RESPONSE = "ENTITY_CREATE_RESPONSE"
export function requestCreateEntity(data) {
	return {
		type: ENTITY_CREATE_REQUEST,
		data: data,
	}
}

export const ENTITY_DELETE_REQUEST = "ENTITY_DELETE_REQUEST"
export const ENTITY_DELETE_RESPONSE = "ENTITY_DELETE_RESPONSE"
export function requestDeleteEntity(uuid) {
	return {
		type: ENTITY_DELETE_REQUEST,
		uuid: uuid,
	}
}
