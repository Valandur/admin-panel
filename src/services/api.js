import request from "superagent"
import _ from "lodash"

import {
	SERVLETS_REQUEST, SERVLETS_RESPONSE, 
	LOGIN_REQUEST, LOGIN_RESPONSE, requestLogout,
	CHECK_USER_REQUEST, CHECK_USER_RESPONSE,
	CATALOG_REQUEST, CATALOG_RESPONSE,
} from "../actions"

import {
	showNotification
} from "../actions/notification"

import {
	INFO_REQUEST, INFO_RESPONSE,
	TPS_INFO_REQUEST, TPS_INFO_RESPONSE,
	PLAYER_INFO_REQUEST, PLAYER_INFO_RESPONSE,
} from "../actions/dashboard"

import {
	WORLDS_REQUEST, WORLDS_RESPONSE,
	WORLD_CREATE_REQUEST, WORLD_CREATE_RESPONSE,
	WORLD_CHANGE_REQUEST, WORLD_CHANGE_RESPONSE,
	WORLD_DELETE_REQUEST, WORLD_DELETE_RESPONSE,
} from "../actions/world"

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

const apiUrl = "/api/"

const call = (method, key, dispatch, path, callback, data, handleErrors = true) => {
	const req = request(method, apiUrl + path + (path.indexOf("?") >= 0 ? "&" : "?") + 
		(key ? "key=" + key : ""));

	if (data) req.send(data);
	req.end((err, res) => {
		if (!res) {
			dispatch(showNotification("error", "API Error", err))
			return;
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

		callback({ ok: false, error: res.statusText });
	})
}

const api = ({ getState, dispatch }) => next => action => {
	next(action)

	const state = getState()
	const key = state.api.key
	const get = call.bind(this, "GET", key, dispatch)
	const post = call.bind(this, "POST", key, dispatch)
	const put = call.bind(this, "PUT", key, dispatch)
	const del = call.bind(this, "DELETE", key, dispatch)

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
					next(showNotification("error", "Login error", "Invalid username or password"))
				}

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

		case TPS_INFO_REQUEST:
			get("info/tps", data => {
				next({
					type: TPS_INFO_RESPONSE,
					ok: data.ok,
					tps: data.tps,
				})
			})
			break;

		case PLAYER_INFO_REQUEST:
			get("info/player", data => {
				next({
					type: PLAYER_INFO_RESPONSE,
					ok: data.ok,
					players: data.players,
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

		case WORLDS_REQUEST:
			get("world" + (action.details ? "?details" : ""), data => {
				next({
					type: WORLDS_RESPONSE,
					ok: data.ok,
					worlds: data.worlds,
				})
			})
			break;

		case WORLD_CHANGE_REQUEST:
			put("world/" + action.uuid, data => {
				next({
					type: WORLD_CHANGE_RESPONSE,
					ok: data.ok,
					world: data.world,
					op: action.op,
				})
			}, action.data)
			break;

		case WORLD_CREATE_REQUEST:
			post("world", data => {
				next({
					type: WORLD_CREATE_RESPONSE,
					ok: data.ok,
					world: data.world,
				})
			}, action.data)
			break;

		case WORLD_DELETE_REQUEST:
			del("world/" + action.uuid, data => {
				next({
					type: WORLD_DELETE_RESPONSE,
					ok: data.ok,
					world: data.world,
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
			get(action.endpoint + "/" + _.get(action.data, action.id), data => {
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
					ok: data.ok,
					data: obj,
				})
			}, action.data)
			break;

		case DATA_CHANGE_REQUEST:
			put(action.endpoint + "/" + _.get(action.data, action.id), data => {
				const obj =  _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_CHANGE_RESPONSE,
					endpoint: action.endpoint,
					ok: data.ok,
					id: action.id,
					data: data.ok ? obj : action.data,
				})
			}, action.newData)
			break;

		case DATA_DELETE_REQUEST:
			del(action.endpoint + "/" + _.get(action.data, action.id), data => {
				const obj = _.find(data, (__, key) => key !== "ok");

				next({
					type: DATA_DELETE_RESPONSE,
					endpoint: action.endpoint,
					ok: data.ok,
					id: action.id,
					data: data.ok ? obj : action.data,
				})
			})
			break;

		default:
			break;
	}
}

export default api
