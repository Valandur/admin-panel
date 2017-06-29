import _ from "lodash"

import { CHAT_MESSAGES_RESPONSE } from "../actions/chat"

const chat = (state = { messages: [], filter: {}}, action) => {
	switch(action.type) {
		case CHAT_MESSAGES_RESPONSE:
			return _.assign({}, state, {
				messages: action.messages,
			})

		default:
			return state;
	}
}

export default chat
