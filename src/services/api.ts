import { Action, Dispatch, MiddlewareAPI } from "redux"
import * as request from "superagent"

import { AppAction, requestLogout, requestServlets, respondCatalog, respondCheckUser,
	respondLogin, respondServlets, TypeKeys } from "../actions"
import { respondExecute, TypeKeys as CommandTypeKeys } from "../actions/command"
import { respondInfo, respondStats, TypeKeys as DashboardTypeKeys } from "../actions/dashboard"
import { respondChange, respondCreate, respondDelete, respondDetails, respondList,
	TypeKeys as DataViewTypeKeys } from "../actions/dataview"
import { showNotification } from "../actions/notification"
import { respondCollections, respondSubjects, TypeKeys as PermissionTypeKeys } from "../actions/permission"
import { respondBanPlayer, respondKickPlayer, TypeKeys as PlayerTypeKeys } from "../actions/player"
import { respondPluginConfig, respondPluginConfigSave, TypeKeys as PluginTypeKeys } from "../actions/plugin"
import { respondSaveProperty, TypeKeys as SettingTypeKeys } from "../actions/settings"

import { ExecuteMethodParam } from "../fetch"
import { AppState, Error, ExtendedMiddleware } from "../types"

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

	const errorHandler = (err: Response) => dispatch(showNotification("error", "API Error", err.statusText))

	switch (action.type) {
		case TypeKeys.SERVLETS_REQUEST:
			state.api.apis.info.listServlets()
				.then(servlets => next(respondServlets(true, servlets)))
				.catch((err: Response) => {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "Servlet error", err.statusText))
					}
					next(respondServlets(false, {}))
				})
			break

		case TypeKeys.CHECK_USER_REQUEST:
			state.api.apis.user.getUserDetails()
				.then(perms => next(respondCheckUser(true, perms)))
				.catch((err: Response) => {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "User error", err.statusText))
					}
				})
			break

		case TypeKeys.LOGIN_REQUEST:
			state.api.apis.user.authUser({
				username: action.username,
				password: action.password,
			})
				.then(perms => next(respondLogin(perms)))
				.then(() => next(requestServlets()))
				.catch(err => next(respondLogin(undefined, err)))
			break

		case TypeKeys.CATALOG_REQUEST:
			if (state.api.types[action.class]) {
				break
			}

			state.api.apis.registry.getRegistry("org.spongepowered.api." + action.class)
				.then(types => next(respondCatalog(action.class, types)))
				.catch(errorHandler)
			break

		case DashboardTypeKeys.INFO_REQUEST:
			state.api.apis.info.getInfo()
				.then(info => next(respondInfo(info)))
				.catch(errorHandler)
			break

		case DashboardTypeKeys.STATS_REQUEST:
			state.api.apis.info.getStats()
				.then(stats => next(respondStats(stats)))
				.catch(errorHandler)
			break

		case PermissionTypeKeys.COLLECTIONS_LIST_REQUEST:
			state.api.apis.permission.listCollections()
				.then(collections => next(respondCollections(collections)))
				.catch(errorHandler)
			break

		case PermissionTypeKeys.SUBJECTS_LIST_REQUEST:
			state.api.apis.permission.listSubjects(action.collection.id)
				.then(subjects => next(respondSubjects(action.collection, subjects)))
				.catch(errorHandler)
			break

		case PlayerTypeKeys.KICK_REQUEST:
			state.api.apis.player.executeMethod(action.player.uuid, {
				"method": "kick",
				"parameters": [{
					"type": ExecuteMethodParam.TypeEnum.STRING,
					"value": "Bye",
				}],
			})
				.then(() => next(respondKickPlayer(true, action.player)))
				.catch(() => next(respondKickPlayer(false, action.player)))
			break

		case PlayerTypeKeys.BAN_REQUEST:
			state.api.apis.cmd.runCommands([{
				"command": "ban " + action.player.name,
			}])
				.then(results => next(respondBanPlayer(true, action.player, results[0])))
				.catch(err => next(respondBanPlayer(false, action.player, err)))
			break

		case PluginTypeKeys.CONFIG_REQUEST:
			state.api.apis.plugin.getPluginConfig(action.id)
				.then(configs => respondPluginConfig(configs))
				.catch(errorHandler)
			break

		case PluginTypeKeys.CONFIG_SAVE_REQUEST:
			state.api.apis.plugin.changePluginConfig(action.id, action.configs)
				.then(configs => next(respondPluginConfigSave(configs)))
				.catch(errorHandler)
			break

		case SettingTypeKeys.SAVE_PROPERTY_REQUEST:
			state.api.apis.server.modifyProperties({
				properties: {
					[action.prop.key]: action.prop.value
				}
			})
				.then(properties => next(respondSaveProperty(action.prop.key, action.prop.value)))
				.catch(errorHandler)
			break

		case CommandTypeKeys.EXECUTE_REQUEST:
			state.api.apis.cmd.runCommands([{
				command: action.command,
				waitLines: action.waitLines,
				waitTime: action.waitTime,
			}])
				.then(results => next(respondExecute(true, action.command, results)))
				.catch(err => next(respondExecute(false, action.command, [], err)))
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
