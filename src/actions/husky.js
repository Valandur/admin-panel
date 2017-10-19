export const CRATES_REQUEST = "HUSKY_CRATES_REQUEST"
export const CRATES_RESPONSE = "HUSKY_CRATES_RESPONSE"
export function requestCrates(details = false) {
	return {
		type: CRATES_REQUEST,
		details: details,
	}
}

export const CRATE_SET_FILTER = "HUSKY_CRATE_SET_FILTER"
export function setCrateFilter(filter, value) {
	return {
		type: CRATE_SET_FILTER,
		filter: filter,
		value: value,
	}
}

export const CRATE_CREATE_REQUEST = "HUSKY_CRATE_CREATE_REQUEST"
export const CRATE_CREATE_RESPONSE = "HUSKY_CRATE_CREATE_RESPONSE"
export function requestCreateCrate(data) {
	return {
		type: CRATE_CREATE_REQUEST,
		data: data,
	}
}

export const CRATE_CHANGE_REQUEST = "HUSKY_CRATE_CHANGE_REQUEST"
export const CRATE_CHANGE_RESPONSE = "HUSKY_CRATE_CHANGE_RESPONSE"
export function requestChangeCrate(crate, data) {
	return {
		type: CRATE_CHANGE_REQUEST,
		crate: crate,
		data: data,
	}
}

export const CRATE_DELETE_REQUEST = "HUSKY_CRATE_DELETE_REQUEST"
export const CRATE_DELETE_RESPONSE = "HUSKY_CRATE_DELETE_RESPONSE"
export function requestDeleteCrate(crate) {
	return {
		type: CRATE_DELETE_REQUEST,
		crate: crate,
	}
}
