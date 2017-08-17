import { SAVE_NOTIF_REF, SHOW_NOTIFICATION } from "../actions/notification"
import { EXECUTE_RESPONSE } from "../actions/command"
import { ENTITY_CREATE_RESPONSE, ENTITY_DELETE_RESPONSE } from "../actions/entity"
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
			showNotif(action.level, action.title, action.message)
			break;

		case EXECUTE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Execute Command: " + action.command, action.result)
			break;

		case ENTITY_CREATE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Entity", "Created " + action.entity.type)
			break;

		case ENTITY_DELETE_RESPONSE:
			if (!action.ok) break;
			showNotif("success", "Entity", "Deleted " + action.entity.type);
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
