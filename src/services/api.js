import request from "superagent"
import _ from "lodash"

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

const call = (state, dispatch, method, path, callback, data, handleErrors = true) => {
	const url = state.api.server.apiUrl + "/api/" + path + (path.indexOf("?") >= 0 ? "&" : "?") + 
		(state.api.key ? "key=" + state.api.key : "")
	const req = request(method, url)
		.timeout({ response: 3000, deadline: 10000 })

	if (data) req.send(data);
	req.end((err, res) => {
		if (!res) {
			if (handleErrors) {
				dispatch(showNotification("error", "API Error", err))
				return;
			} else {
				callback({ ok: false, error: err });
				return;
			}
		}

		if (res.statusCode === 200 || res.statusCode === 201) {
			callback(res.body);
			return;
		}

		if (handleErrors) {
			if (res.statusCode === 403) {
				dispatch(requestLogout());
				return;
			}

			dispatch(showNotification("error", "API Error", res.statusText))
		}

		callback({ ok: false, status: res.statusCode, error: res.statusText });
	})
}

const api = ({ getState, dispatch }) => next => action => {
	next(action)

	const state = getState()
	const callTmp = call.bind(this, state, dispatch)

	const get = callTmp.bind(this, "GET")
	const post = callTmp.bind(this, "POST")
	const put = callTmp.bind(this, "PUT")
	const del = callTmp.bind(this, "DELETE")

	switch (action.type) {
		case SERVLETS_REQUEST:
			get("servlet", data => {
				next({
					type: SERVLETS_RESPONSE,
					ok: data.ok,
					servlets: data.servlets,
				})
			})
			break;

		case LOGIN_REQUEST:
			post("user", data => {
				if (!data.ok) {
					if (data.statusCode === 403) {
						next(showNotification("error", "Login error", "Invalid username or password"))
					} else {
						next(showNotification("error", "Login error", data.error))
					}
				}

				// Request a list of servlets we have access to
				next(requestServlets())

				// Tell our reducers that login was successfull
				next({
					type: LOGIN_RESPONSE,
					ok: data.ok,
					key: data.key,
					user: data.user,
					error: data.error,
				})
			}, {
				username: action.username,
				password: action.password,
			}, false)
			break;

		case CHECK_USER_REQUEST:
			get("user", data => {
				next({
					type: CHECK_USER_RESPONSE,
					ok: data.ok,
					user: data.user,
				})
			})
			break;

		case INFO_REQUEST:
			get("info", data => {
				next({
					type: INFO_RESPONSE,
					ok: data.ok,
					data: data,
				})
			})
			break;

		case STATS_REQUEST:
			get("info/stats", data => {
				next({
					type: STATS_RESPONSE,
					ok: data.ok,
					tps: data.tps,
					players: data.players,
					cpu: data.cpu,
					memory: data.memory,
					disk: data.disk,
				})
			})
			break;

		case CATALOG_REQUEST:
			if (state.api.types[action.class])
				break;

			get("registry/org.spongepowered.api." + action.class, data => {
				next({
					type: CATALOG_RESPONSE,
					ok: data.ok,
					class: action.class,
					types: data.types,
				})
			})
			break;

		case PLAYER_KICK_REQUEST:
			post("player/" + action.uuid + "/method", (data) => {
				next({
					type: PLAYER_KICK_RESPONSE,
					ok: data.ok,
					player: data.player,
				})
			}, {
				"method": "kick",
				"params": [{
					"type": "text",
					"value": "Bye",
				}],
			});
			break;

		case PLAYER_BAN_REQUEST:
			post("cmd", (data) => {
				next({
					type: PLAYER_BAN_RESPONSE,
					data: data.ok,
					player: {
						name: action.name,
					},
				})
			}, {
				"command": "ban " + action.name,
			});
			break;

		case PLUGIN_CONFIG_REQUEST:
			get("plugin/" + action.id + "/config", (data) => {
				next({
					type: PLUGIN_CONFIG_RESPONSE,
					ok: data.ok,
					configs: data.configs,
				})
			})
			break;

		case PLUGIN_CONFIG_SAVE_REQUEST:
			post("plugin/" + action.id + "/config", (data) => {
				next({
					type: PLUGIN_CONFIG_SAVE_RESPONSE,
					ok: data.ok,
					configs: data.configs,
				})
			}, action.configs)
			break;

		case SAVE_PROPERTY_REQUEST:
			post("info/properties", data => {
				next({
					type: SAVE_PROPERTY_RESPONSE,
					ok: data.ok,
					key: action.prop.key,
					properties: data.properties,
				})
			}, { properties: { [action.prop.key]: action.prop.value }})
			break;

		case EXECUTE_REQUEST:
			post("cmd", data => {
				next({
					type: EXECUTE_RESPONSE,
					ok: data.ok,
					result: data.result,
					command: action.command,
				})
			}, {
				command: action.command,
				waitLines: action.waitLines,
				waitTime: action.waitTime,
			})
			break;
		
		case DATA_LIST_REQUEST:
			get(action.endpoint + (action.details ? "?details" : ""), data => {
				const obj = _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_LIST_RESPONSE,
					endpoint: action.endpoint,
					ok: data.ok,
					data: obj,
				})
			})
			break;

		case DATA_DETAILS_REQUEST:
			get(action.endpoint + "/" + action.id(action.data), data => {
				const obj = _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_DETAILS_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: data.ok,
					data: obj,
				})
			})
			break;

		case DATA_CREATE_REQUEST:
			post(action.endpoint, data => {
				const obj = _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_CREATE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: data.ok,
					data: obj,
				})
			}, action.data)
			break;

		case DATA_CHANGE_REQUEST:
			put(action.endpoint + "/" + action.id(action.data), data => {
				const obj =  _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_CHANGE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: data.ok,
					data: data.ok ? obj : action.data,
				})
			}, action.newData)
			break;

		case DATA_DELETE_REQUEST:
			del(action.endpoint + "/" + action.id(action.data), data => {
				const obj = _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_DELETE_RESPONSE,
					endpoint: action.endpoint,
					id: action.id,
					ok: data.ok,
					data: data.ok ? obj : action.data,
				})
			})
			break;

		default:
			break;
	}
}

export default api
