export const INFO_REQUEST = "INFO_REQUEST"
export const INFO_RESPONSE = "INFO_RESPONSE"
export function requestInfo() {
	return {
		type: INFO_REQUEST
	}
}

export const STATS_REQUEST = "STATS_REQUEST"
export const STATS_RESPONSE = "STATS_RESPONSE"
export function requestStats() {
	return {
		type: STATS_REQUEST
	}
}
