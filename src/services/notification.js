import _ from "lodash";

import { SAVE_NOTIF_REF, SHOW_NOTIFICATION } from "../actions/notification"
import { EXECUTE_RESPONSE } from "../actions/command"
import { DATA_CREATE_RESPONSE, DATA_CHANGE_RESPONSE, DATA_DELETE_RESPONSE } from "../actions/dataview"
import { PLAYER_KICK_RESPONSE, PLAYER_BAN_RESPONSE } from "../actions/player"
import { WORLD_CHANGE_RESPONSE, WORLD_CREATE_RESPONSE, WORLD_DELETE_RESPONSE } from "../actions/world"

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
			showNotif("success", _.upperFirst(action.endpoint), "Created " + _.get(action.data, action.id))
			break;

		case DATA_CHANGE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", _.upperFirst(action.endpoint), "Changed " + _.get(action.data, action.id))
			break;

		case DATA_DELETE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", _.upperFirst(action.endpoint), "Deleted " + _.get(action.data, action.id))
			break;
		
		case PLAYER_KICK_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Player", "Kicked " + action.player.name)
			break;

		case PLAYER_BAN_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Player", "Banned " + action.player.name)
			break;

		case WORLD_CHANGE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "World", (action.op ? action.op : "Updated") + " " + action.world.name)
			break;

		case WORLD_CREATE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "World", "Created " + action.world.name)
			break;

		case WORLD_DELETE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "World", "Deleted " + action.world.name)
			break;

		default:
			break;
	}
}

export default persist
