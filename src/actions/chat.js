export const CHAT_HISTORY_REQUEST = "CHAT_HISTORY_REQUEST"
export const CHAT_HISTORY_RESPONSE = "CHAT_HISTORY_RESPONSE"
export function requestChatHistory() {
	return {
		type: CHAT_HISTORY_REQUEST,
	}
}

export const SET_FILTER = "CHAT_SET_FILTER"
export function setFilter(filter, value) {
	return {
		type: SET_FILTER,
		filter: filter,
		value: value,
	}
}
