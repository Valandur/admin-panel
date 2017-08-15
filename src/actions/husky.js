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
