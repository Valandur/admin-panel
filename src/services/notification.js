import _ from "lodash";

import { SAVE_NOTIF_REF, SHOW_NOTIFICATION } from "../actions/notification"
import { EXECUTE_RESPONSE } from "../actions/command"
import { DATA_CREATE_RESPONSE, DATA_CHANGE_RESPONSE, DATA_DELETE_RESPONSE } from "../actions/dataview"
import { PLAYER_KICK_RESPONSE, PLAYER_BAN_RESPONSE } from "../actions/player"

let notifRef = null;

const showNotif = (level, title, message) =>
	notifRef.addNotification({
		level: level,
		title: title,
		message: message,
		position: "br",
	})

const persist = ({ dispatch, getState }) => next => action => {
	next(action)

	switch (action.type) {
		case SAVE_NOTIF_REF:
			notifRef = action.ref;
			break;

		case SHOW_NOTIFICATION:
			let msg = action.message;
			if (_.isObject(msg)) msg = msg.message;
			showNotif(action.level, action.title, msg)
			break;

		case EXECUTE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Execute Command: " + action.command, action.result)
			break;

		case DATA_CREATE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", _.upperFirst(action.endpoint), "Created " + action.id(action.data))
			break;

		case DATA_CHANGE_RESPONSE:
			if (!action.ok) break;
			console.log(action);
			showNotif("success", _.upperFirst(action.endpoint), "Changed " + action.id(action.data))
			break;

		case DATA_DELETE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", _.upperFirst(action.endpoint), "Deleted " + action.id(action.data))
			break;
		
		case PLAYER_KICK_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Player", "Kicked " + action.player.name)
			break;

		case PLAYER_BAN_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Player", "Banned " + action.player.name)
			break;

		default:
			break;
	}
}

export default persist
