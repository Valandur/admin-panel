import _ from "lodash";

import { LOGIN_RESPONSE } from "../actions"
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

		case LOGIN_RESPONSE:
			if (action.error) {
				if (action.error.status === 401 || action.error.status === 403) {
					showNotif(
						"error", 
						"Login error", 
						"Invalid username or password")
				} else {
					showNotif(
						"error", 
						"Login error", 
						action.error.error)
				}
			}
			break;

		case EXECUTE_RESPONSE:
			if (!action.ok) {
				showNotif(
					"error", 
					"Could not run command: " + action.command, 
					action.error.error)
			} else {
				showNotif(
					"success", 
					"Execute Command: " + action.command, 
					action.result[0])
			}
			break;

		case DATA_CREATE_RESPONSE:
			if (!action.ok) {
				showNotif(
					"error", 
					_.upperFirst(action.endpoint), 
					action.error.error)
			} else {
				showNotif(
					"success", 
					_.upperFirst(action.endpoint), 
					"Created " + action.id(action.data))
			}
			break;

		case DATA_CHANGE_RESPONSE:
			if (!action.ok) {
					showNotif(
						"error", 
						_.upperFirst(action.endpoint), 
						action.error.error)
			} else {
				showNotif(
					"success", 
					_.upperFirst(action.endpoint), 
					"Changed " + action.id(action.data))
			}
			break;

		case DATA_DELETE_RESPONSE:
			if (!action.ok) {
					showNotif(
						"error", 
						_.upperFirst(action.endpoint), 
						action.error.error)
			} else {
				showNotif(
					"success", 
					_.upperFirst(action.endpoint), 
					"Deleted " + action.id(action.data))
			}
			break;
		
		case PLAYER_KICK_RESPONSE:
			showNotif(
				"success", 
				"Kick " + action.player.name, 
				"Player has been kicked from the server")
			break;

		case PLAYER_BAN_RESPONSE:
			showNotif(
				"success", 
				"Ban " + action.player.name, 
				action.response)
			break;

		default:
			break;
	}
}

export default persist
