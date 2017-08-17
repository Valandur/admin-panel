export const KITS_REQUEST = "NUCLEUS_KITS_REQUEST"
export const KITS_RESPONSE = "NUCLEUS_KITS_RESPONSE"
export function requestKits(details = false) {
	return {
		type: KITS_REQUEST,
		details: details,
	}
}

export const KIT_CREATE_REQUEST = "NUCLEUS_KIT_CREATE_REQUEST"
export const KIT_CREATE_RESPONSE = "NUCLEUS_KIT_CREATE_RESPONSE"
export function requestCreateKit(data) {
	return {
		type: KIT_CREATE_REQUEST,
		data: data,
	}
}

export const KIT_CHANGE_REQUEST = "NUCLEUS_KIT_CHANGE_REQUEST"
export const KIT_CHANGE_RESPONSE = "NUCLEUS_KIT_CHANGE_RESPONSE"
export function requestChangeKit(kit, data) {
	return {
		type: KIT_CHANGE_REQUEST,
		kit: kit,
		data: data,
	}
}

export const KIT_DELETE_REQUEST = "NUCLEUS_KIT_DELETE_REQUEST"
export const KIT_DELETE_RESPONSE = "NUCLEUS_KIT_DELETE_RESPONSE"
export function requestDeleteKit(kit) {
	return {
		type: KIT_DELETE_REQUEST,
		kit: kit,
	}
}

export const KIT_SET_FILTER = "NUCLEUS_KIT_SET_FILTER"
export function setKitFilter(filter, value) {
	return {
		type: KIT_SET_FILTER,
		filter: filter,
		value: value,
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

export const JAIL_SET_FILTER = "NUCLEUS_JAIL_SET_FILTER"
export function setJailFilter(filter, value) {
	return {
		type: JAIL_SET_FILTER,
		filter: filter,
		value: value,
	}
}
