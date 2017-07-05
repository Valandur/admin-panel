export const INFO_REQUEST = "INFO_REQUEST"
export const INFO_RESPONSE = "INFO_RESPONSE"
export function requestInfo() {
	return {
		type: INFO_REQUEST
	}
}

export const TPS_INFO_REQUEST = "TPS_INFO_REQUEST"
export const TPS_INFO_RESPONSE = "TPS_INFO_RESPONSE"
export function requestTpsInfo() {
	return {
		type: TPS_INFO_REQUEST
	}
}

export const PLAYER_INFO_REQUEST = "PLAYER_INFO_REQUEST"
export const PLAYER_INFO_RESPONSE = "PLAYER_INFO_RESPONSE"
export function requestPlayerInfo() {
	return {
		type: PLAYER_INFO_REQUEST
	}
}
