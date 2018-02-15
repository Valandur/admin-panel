import * as request from "superagent"
import { Dispatch, Action, MiddlewareAPI, Middleware } from "redux"
import { AppState } from "../types"

import {
	SERVLETS_REQUEST, SERVLETS_RESPONSE,
	LOGIN_REQUEST, LOGIN_RESPONSE, requestLogout,
	CHECK_USER_REQUEST, CHECK_USER_RESPONSE,
	CATALOG_REQUEST, CATALOG_RESPONSE,
	requestServlets,
} from "../actions"

import {
	showNotification
} from "../actions/notification"

import {
	INFO_REQUEST, INFO_RESPONSE,
	STATS_REQUEST, STATS_RESPONSE,
} from "../actions/dashboard"

import {
	PLAYER_KICK_REQUEST, PLAYER_KICK_RESPONSE,
	PLAYER_BAN_REQUEST, PLAYER_BAN_RESPONSE,
} from "../actions/player"

import {
	PLUGIN_CONFIG_REQUEST, PLUGIN_CONFIG_RESPONSE,
	PLUGIN_CONFIG_SAVE_REQUEST, PLUGIN_CONFIG_SAVE_RESPONSE,
} from "../actions/plugin"

import {
	SAVE_PROPERTY_REQUEST, SAVE_PROPERTY_RESPONSE,
} from "../actions/settings"

import {
	EXECUTE_REQUEST, EXECUTE_RESPONSE,
} from "../actions/command"

import {
	DATA_LIST_REQUEST, DATA_LIST_RESPONSE,
	DATA_DETAILS_REQUEST, DATA_DETAILS_RESPONSE,
	DATA_CREATE_REQUEST, DATA_CREATE_RESPONSE,
	DATA_CHANGE_REQUEST, DATA_CHANGE_RESPONSE,
	DATA_DELETE_REQUEST, DATA_DELETE_RESPONSE,
} from "../actions/dataview"

interface Error {
	status: number
	error: string
}

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

export interface ExtendedMiddleware<StateType> extends Middleware {
	<S extends StateType>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S>
}

const api: ExtendedMiddleware<AppState> = ({ getState, dispatch }: MiddlewareAPI<AppState>) =>
		(next: Dispatch<void>) => <A extends Action>(action: A): A => {
	const res = next(action)

	const state = getState() as AppState
	// const callTmp = call.bind(null, state, dispatch)
	const callTemp = call(state, dispatch)

	const get = callTemp("GET")
	const post = callTemp("POST")
	const put = callTemp("PUT")
	const del = callTemp("DELETE")

	switch (action.type) {
		case SERVLETS_REQUEST:
			get("servlet", (data, err) => {
				if (err) {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "Servlet error", err.error))
					}
				}

				next({
					type: SERVLETS_RESPONSE,
					ok: !err,
					servlets: data ? data.servlets : null,
				})
			}, null, false)
			break

		case LOGIN_REQUEST:
			post("user", (data, err) => {
				// Request a list of servlets we have access to if we are logged in
				if (!err) {
					next(requestServlets())
				}

				// Tell our reducers that login was successfull (or not)
				next({
					type: LOGIN_RESPONSE,
					data: data,
					error: err,
				})
			}, {
				username: action.username,
				password: action.password,
			}, false)
			break

		case CHECK_USER_REQUEST:
			get("user", (data, err) => {
				if (err) {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout())
					} else {
						next(showNotification("error", "User error", err.error))
					}
				}

				next({
					type: CHECK_USER_RESPONSE,
					ok: !err,
					data: data,
				})
			}, null, false)
			break

		case INFO_REQUEST:
			get("info", data => {
				next({
					type: INFO_RESPONSE,
					data: data,
				})
			})
			break

		case STATS_REQUEST:
			get("info/stats", data => {
				next({
					type: STATS_RESPONSE,
					tps: data.tps,
					players: data.players,
					cpu: data.cpu,
					memory: data.memory,
					disk: data.disk,
				})
			})
			break

		case CATALOG_REQUEST:
			if (state.api.types[action.class]) {
				break
			}

			get("registry/org.spongepowered.api." + action.class, data => {
				next({
					type: CATALOG_RESPONSE,
					class: action.class,
					types: data,
				})
			})
			break

		case PLAYER_KICK_REQUEST:
			post("player/" + action.player.uuid + "/method", (data, err) => {
				if (err) {
					return next({
						type: PLAYER_KICK_RESPONSE,
						ok: false,
						player: action.player,
					})
				}

				next({
					type: PLAYER_KICK_RESPONSE,
					ok: true,
					player: action.player,
				})
			}, {
				"method": "kick",
				"parameters": [{
					"type": "TEXT",
					"value": "Bye",
				}],
			}, false)
			break

		case PLAYER_BAN_REQUEST:
			post("cmd", (data, err) => {
				if (err) {
					next({
						type: PLAYER_BAN_RESPONSE,
						ok: false,
						player: action.player,
						error: err,
					})
				}

				next({
					type: PLAYER_BAN_RESPONSE,
					ok: true,
					player: action.player,
					response: data[0][0],
				})
			}, [{
				"command": "ban " + action.player.name,
			}], false)
			break

		case PLUGIN_CONFIG_REQUEST:
			get("plugin/" + action.id + "/config", (data) => {
				next({
					type: PLUGIN_CONFIG_RESPONSE,
					configs: data,
				})
			})
			break

		case PLUGIN_CONFIG_SAVE_REQUEST:
			post("plugin/" + action.id + "/config", (data) => {
				next({
					type: PLUGIN_CONFIG_SAVE_RESPONSE,
					configs: data,
				})
			}, action.configs)
			break

		case SAVE_PROPERTY_REQUEST:
			post("info/properties", data => {
				next({
					type: SAVE_PROPERTY_RESPONSE,
					key: action.prop.key,
					properties: data.properties,
				})
			}, { properties: { [action.prop.key]: action.prop.value }})
			break

		case EXECUTE_REQUEST:
			post("cmd", (data, err) => {
				if (err) {
					next({
						type: EXECUTE_RESPONSE,
						command: action.command,
						ok: false,
						error: err,
					})
					return
				}

				next({
					type: EXECUTE_RESPONSE,
					command: action.command,
					ok: true,
					result: data,
				})
			}, [{
				command: action.command,
				waitLines: action.waitLines,
				waitTime: action.waitTime,
			}], false)
			break

		case DATA_LIST_REQUEST:
			get(action.endpoint + (action.details ? "?details" : ""), data => {
				next({
					type: DATA_LIST_RESPONSE,
					endpoint: action.endpoint,
					data: data,
				})
			})
			break

		case DATA_DETAILS_REQUEST:
			get(action.endpoint + "/" + action.id(action.data), data => {
				next({
					type: DATA_DETAILS_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					data: data,
				})
			})
			break

		case DATA_CREATE_REQUEST:
			post(action.endpoint, (data, err) => {
				if (err) {
					next({
						type: DATA_CREATE_RESPONSE,
						endpoint: action.endpoint,
						id: action.id,
						ok: false,
						error: err,
					})
					return
				}

				next({
					type: DATA_CREATE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: true,
					data: data,
				})
			}, action.data, false)
			break

		case DATA_CHANGE_REQUEST:
			put(action.endpoint + "/" + action.id(action.data), (data, err) => {
				if (err) {
					next({
						type: DATA_CHANGE_RESPONSE,
						endpoint: action.endpoint,
						id: action.id,
						ok: false,
						error: err,
					})
					return
				}

				next({
					type: DATA_CHANGE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: true,
					data: data,
				})
			}, action.newData, false)
			break

		case DATA_DELETE_REQUEST:
			del(action.endpoint + "/" + action.id(action.data), (data, err) => {
				if (err) {
					next({
						type: DATA_DELETE_RESPONSE,
						endpoint: action.endpoint,
						id: action.id,
						ok: false,
						error: err,
					})
					return
				}

				next({
					type: DATA_DELETE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: true,
					data: data,
				})
			}, null, false)
			break

		default:
			break
	}

	return res
}

export default api
