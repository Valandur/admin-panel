export const CHAT_MESSAGES_REQUEST = "CHAT_MESSAGES_REQUEST"
export const CHAT_MESSAGES_RESPONSE = "CHAT_MESSAGES_RESPONSE"
export function requestChatMessages() {
	return {
		type: CHAT_MESSAGES_REQUEST,
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
