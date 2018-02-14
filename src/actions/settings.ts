export const EDIT_PROPERTY = "EDIT_PROPERTY"
export function editProperty(prop: string) {
	return {
		type: EDIT_PROPERTY,
		prop,
	}
}

export const SET_PROPERTY = "SET_PROPERTY"
export function setProperty(prop: string, value: string) {
	return {
		type: SET_PROPERTY,
		prop,
		value,
	}
}

export const SAVE_PROPERTY_REQUEST = "SAVE_PROPERTY_REQUEST"
export const SAVE_PROPERTY_RESPONSE = "SAVE_PROPERTY_RESPONSE"
export function requestSaveProperty(prop: string) {
	return {
		type: SAVE_PROPERTY_REQUEST,
		prop,
	}
}
