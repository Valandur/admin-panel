export const DATA_LIST_REQUEST = "DATA_LIST_REQUEST"
export const DATA_LIST_RESPONSE = "DATA_LIST_RESPONSE"
export function requestList(endpoint, details = false) {
	return {
		type: DATA_LIST_REQUEST,
		endpoint: endpoint,
		details: details,
	}
}

export const DATA_DETAILS_REQUEST = "DATA_DETAILS_REQUEST"
export const DATA_DETAILS_RESPONSE = "DATA_DETAILS_RESPONSE"
export function requestDetails(endpoint, id, data) {
	return {
		type: DATA_DETAILS_REQUEST,
		endpoint: endpoint,
		id: id,
		data: data,
	}
}

export const DATA_CREATE_REQUEST = "DATA_CREATE_REQUEST"
export const DATA_CREATE_RESPONSE = "DATA_CREATE_RESPONSE"
export function requestCreate(endpoint, data) {
	return {
		type: DATA_CREATE_REQUEST,
		endpoint: endpoint,
		data: data,
	}
}

export const DATA_CHANGE_REQUEST = "DATA_CHANGE_REQUEST"
export const DATA_CHANGE_RESPONSE = "DATA_CHANGE_RESPONSE"
export function requestChange(endpoint, id, data, newData) {
	return {
		type: DATA_CHANGE_REQUEST,
		endpoint: endpoint,
		id: id,
		data: data,
		newData: newData,
	}
}

export const DATA_DELETE_REQUEST = "DATA_DELETE_REQUEST"
export const DATA_DELETE_RESPONSE = "DATA_DELETE_RESPONSE"
export function requestDelete(endpoint, id, data) {
	return {
		type: DATA_DELETE_REQUEST,
		endpoint: endpoint,
		id: id,
		data: data,
	}
}

export const DATA_SET_FILTER = "DATA_SET_FILTER"
export function setFilter(endpoint, filter, value) {
	return {
		type: DATA_SET_FILTER,
		endpoint: endpoint,
		filter: filter,
		value: value,
	}
}
