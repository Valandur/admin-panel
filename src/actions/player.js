export const PLAYER_KICK_REQUEST = "PLAYER_KICK_REQUEST"
export const PLAYER_KICK_RESPONSE = "PLAYER_KICK_RESPONSE"
export function requestKickPlayer(player) {
	return {
		type: PLAYER_KICK_REQUEST,
		player: player,
	}
}

export const PLAYER_BAN_REQUEST = "PLAYER_BAN_REQUEST"
export const PLAYER_BAN_RESPONSE = "PLAYER_BAN_RESPONSE"
export function requestBanPlayer(player) {
	return {
		type: PLAYER_BAN_REQUEST,
		player: player,
	}
}
