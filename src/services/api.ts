import * as request from "superagent"
import { Dispatch, Action, MiddlewareAPI } from "redux"
import { AppState, Error, ExtendedMiddleware } from "../types"

import { requestServlets, AppAction, TypeKeys, requestLogout, respondServlets,
	respondLogin, respondCheckUser, respondCatalog } from "../actions"
import { TypeKeys as CommandTypeKeys, respondExecute } from "../actions/command"
import { TypeKeys as DashboardTypeKeys, respondInfo, respondStats } from "../actions/dashboard"
import { TypeKeys as DataViewTypeKeys, respondList, respondDetails,
	respondCreate, respondChange, respondDelete } from "../actions/dataview"
import { TypeKeys as PlayerTypeKeys, respondKickPlayer, respondBanPlayer } from "../actions/player"
import { TypeKeys as PluginTypeKeys, respondPluginConfig, respondPluginConfigSave } from "../actions/plugin"
import { TypeKeys as SettingTypeKeys, respondSaveProperty } from "../actions/settings"
import { showNotification } from "../actions/notification"

const call = (state: AppState, dispatch: Dispatch<Action>) => (method: string) => (
	path: string,
	callback: (body: any | null, error?: Error) => void,
	data?: object | null,
	handleErrors: boolean = true) => {

	const url = state.api.server.apiUrl + "/api/v5/" + path +
		(path.indexOf("?") >= 0 ? "&" : "?") + (state.api.key ? "key=" + state.api.key : "")
	const req = request(method, url)
		.timeout({ response: 3000, deadline: 30000 })

	if (data) {
		req.send(data)
	}

	req.end((err: request.ResponseError, res: request.Response) => {
		if (!res) {
			if (handleErrors) {
				dispatch(showNotification("error", "API Error", err.text))
			} else {
				callback(null, { status: err.status, error: err.text })
			}
			return
		}

		if (res.status === 200 || res.status === 201) {
			callback(res.body)
			return
		}

		if (handleErrors) {
			dispatch(showNotification("error", "API Error", res.text))
			return
		}

		callback(null, { status: res.status, error: res.body ? res.body.error : res.text })
	})
}

const api: ExtendedMiddleware<AppState> = ({ getState, dispatch }: MiddlewareAPI<AppState>) =>
		(next: Dispatch<Action>) => (action: AppAction): any => {
	next(action)

	const state = getState()
	const callTemp = call(state, dispatch)

	const get = callTemp("GET")
	const post = callTemp("POST")
	const put = callTemp("PUT")
	const del = callTemp("DELETE")

	switch (action.type) {
		case TypeKeys.SERVLETS_REQUEST:
			get("servlet", (data, err) => {
				if (err) {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "Servlet error", err.error))
					}
				}

				return next(respondServlets(!err, data ? data.servlets : {}))
			}, null, false)
			break

		case TypeKeys.CHECK_USER_REQUEST:
			get("user", (data, err) => {
				if (err) {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "User error", err.error))
					}
				}

				next(respondCheckUser(!err, data))
			}, null, false)
			break

		case TypeKeys.LOGIN_REQUEST:
			post("user", (data, err) => {
				// Request a list of servlets we have access to if we are logged in
				if (!err) {
					next(requestServlets())
				}

				// Tell our reducers that login was successful (or not)
				return next(respondLogin(data, err))
			}, {
				username: action.username,
				password: action.password,
			}, false)
			break

		case TypeKeys.CATALOG_REQUEST:
			if (state.api.types[action.class]) {
				break
			}

			get("registry/org.spongepowered.api." + action.class, data => {
				next(respondCatalog(action.class, data))
			})
			break

		case DashboardTypeKeys.INFO_REQUEST:
			get("info", data => {
				next(respondInfo(data))
			})
			break

		case DashboardTypeKeys.STATS_REQUEST:
			get("info/stats", data => {
				next(respondStats(data.tps, data.players, data.cpu, data.memory, data.disk))
			})
			break

		case PlayerTypeKeys.KICK_REQUEST:
			post("player/" + action.player.uuid + "/method", (data, err) => {
				if (err) {
					next(respondKickPlayer(false, action.player))
					return
				}

				next(respondKickPlayer(true, action.player))
			}, {
				"method": "kick",
				"parameters": [{
					"type": "TEXT",
					"value": "Bye",
				}],
			}, false)
			break

		case PlayerTypeKeys.BAN_REQUEST:
			post("cmd", (data, err) => {
				if (err) {
					next(respondBanPlayer(false, action.player, err.error))
					return
				}

				next(respondBanPlayer(true, action.player, data[0][0]))
			}, [{
				"command": "ban " + action.player.name,
			}], false)
			break

		case PluginTypeKeys.CONFIG_REQUEST:
			get("plugin/" + action.id + "/config", (data) => {
				next(respondPluginConfig(data))
			})
			break

		case PluginTypeKeys.CONFIG_SAVE_REQUEST:
			post("plugin/" + action.id + "/config", (data) => {
				next(respondPluginConfigSave(data))
			}, action.configs)
			break

		case SettingTypeKeys.SAVE_PROPERTY_REQUEST:
			post("info/properties", data => {
				next(respondSaveProperty(action.prop.key, data.properties))
			}, {
				properties: {
					[action.prop.key]: action.prop.value
				}
			})
			break

		case CommandTypeKeys.EXECUTE_REQUEST:
			post("cmd", (data, err) => {
				if (err) {
					next(respondExecute(false, action.command, [], err))
					return
				}

				next(respondExecute(true, action.command, data))
			}, [{
				command: action.command,
				waitLines: action.waitLines,
				waitTime: action.waitTime,
			}], false)
			break

		case DataViewTypeKeys.LIST_REQUEST:
			get(action.endpoint + (action.details ? "?details" : ""), (data, err) => {
				if (err) {
					next(respondList(action.endpoint, undefined, err))
					return
				}

				next(respondList(action.endpoint, data))
			}, null, false)
			break

		case DataViewTypeKeys.DETAILS_REQUEST:
			get(action.endpoint + "/" + action.id(action.data), (data, err) => {
				if (err) {
					next(respondDetails(action.endpoint, action.id, action.data, err))
				}

				next(respondDetails(action.endpoint, action.id, data))
			})
			break

		case DataViewTypeKeys.CREATE_REQUEST:
			post(action.endpoint, (data, err) => {
				if (err) {
					next(respondCreate(action.endpoint, action.id, undefined, err))
					return
				}

				next(respondCreate(action.endpoint, action.id, data))
			}, action.data, false)
			break

		case DataViewTypeKeys.CHANGE_REQUEST:
			put(action.endpoint + "/" + action.id(action.data), (data, err) => {
				if (err) {
					next(respondChange(action.endpoint, action.id, action.data, err))
					return
				}

				next(respondChange(action.endpoint, action.id, data))
			}, action.newData, false)
			break

		case DataViewTypeKeys.DELETE_REQUEST:
			del(action.endpoint + "/" + action.id(action.data), (data, err) => {
				if (err) {
					next(respondDelete(action.endpoint, action.id, action.data, err))
					return
				}

				next(respondDelete(action.endpoint, action.id, data))
			}, null, false)
			break

		default:
			break
	}
}

export default api
