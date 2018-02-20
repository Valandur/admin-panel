import * as _ from "lodash"
import { System } from "react-notification-system"
import { Action, Dispatch, MiddlewareAPI } from "redux"

import { AppAction, TypeKeys } from "../actions"
import { TypeKeys as CmdTypeKeys } from "../actions/command"
import { TypeKeys as DataTypeKeys } from "../actions/dataview"
import { TypeKeys as NotifTypeKeys } from "../actions/notification"
import { TypeKeys as PlayerTypeKeys } from "../actions/player"
import { AppState, ExtendedMiddleware } from "../types"

let notifRef: System

const showNotif = (level: "error" | "warning" | "info" | "success", title: string, message: string) =>
	notifRef.addNotification({
		level: level,
		title: title,
		message: message,
		position: "tr",
	})

const persist: ExtendedMiddleware<AppState> = ({ dispatch, getState }: MiddlewareAPI<AppState>) =>
		(next: Dispatch<Action>) => (action: AppAction): any => {
	next(action)

	switch (action.type) {
		case NotifTypeKeys.SAVE_NOTIF_REF:
			notifRef = action.ref
			break

		case NotifTypeKeys.SHOW_NOTIFICATION:
			let msg = action.message
			showNotif(action.level, action.title, msg)
			break

		case TypeKeys.LOGIN_RESPONSE:
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
			break

		case CmdTypeKeys.EXECUTE_RESPONSE:
			if (!action.ok) {
				showNotif(
					"error",
					"Could not run command: " + action.command,
					action.error ? action.error.error : "General error")
			} else {
				showNotif(
					"success",
					"Execute Command: " + action.command,
					action.result[0])
			}
			break

		case DataTypeKeys.CREATE_RESPONSE:
			if (action.err || !action.data) {
				showNotif(
					"error",
					_.upperFirst(action.endpoint),
					action.err ? action.err.error : "No response data")
			} else {
				showNotif(
					"success",
					_.upperFirst(action.endpoint),
					"Created " + action.id(action.data))
			}
			break

		case DataTypeKeys.CHANGE_RESPONSE:
			if (action.err) {
					showNotif(
						"error",
						_.upperFirst(action.endpoint),
						action.err.error)
			} else {
				showNotif(
					"success",
					_.upperFirst(action.endpoint),
					"Changed " + action.id(action.data))
			}
			break

		case DataTypeKeys.DELETE_RESPONSE:
			if (action.err) {
					showNotif(
						"error",
						_.upperFirst(action.endpoint),
						action.err.error)
			} else {
				showNotif(
					"success",
					_.upperFirst(action.endpoint),
					"Deleted " + action.id(action.data))
			}
			break

		case PlayerTypeKeys.KICK_RESPONSE:
			showNotif(
				"success",
				"Kick " + action.player.name,
				"Player has been kicked from the server")
			break

		case PlayerTypeKeys.BAN_RESPONSE:
			showNotif(
				"success",
				"Ban " + action.player.name,
				action.response)
			break

		default:
			break
	}
}

export default persist
