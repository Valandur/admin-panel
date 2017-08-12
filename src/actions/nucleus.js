export const KITS_REQUEST = "NUCLEUS_KITS_REQUEST"
export const KITS_RESPONSE = "NUCLEUS_KITS_RESPONSE"
export function requestKits(details = false) {
	return {
		type: KITS_REQUEST,
		details: details,
	}
}

export const JAILS_REQUEST = "NUCLEUS_JAILS_REQUEST"
export const JAILS_RESPONSE = "NUCLEUS_JAILS_RESPONSE"
export function requestJails(details = false) {
	return {
		type: JAILS_REQUEST,
		details: details,
	}
}

export const SET_FILTER = "NUCLEUS_JAIL_SET_FILTER"
export function setFilter(filter, value) {
	return {
		type: SET_FILTER,
		filter: filter,
		value: value,
	}
}

export const JAIL_CREATE_REQUEST = "NUCLEUS_JAIL_CREATE_REQUEST"
export const JAIL_CREATE_RESPONSE = "NUCLEUS_JAIL_CREATE_RESPONSE"
export function requestCreateJail(data) {
	return {
		type: JAIL_CREATE_REQUEST,
		data: data,
	}
}

export const JAIL_DELETE_REQUEST = "NUCLEUS_JAIL_DELETE_REQUEST"
export const JAIL_DELETE_RESPONSE = "NUCLEUS_JAIL_DELETE_RESPONSE"
export function requestDeleteJail(name) {
	return {
		type: JAIL_DELETE_REQUEST,
		name: name,
	}
}
