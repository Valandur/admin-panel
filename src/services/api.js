import request from "superagent"

import { LOGIN_REQUEST, LOGIN_RESPONSE, requestLogout, INFO_REQUEST, INFO_RESPONSE } from "../actions"
import { CHECK_USER_REQUEST, CHECK_USER_RESPONSE, CATALOG_REQUEST, CATALOG_RESPONSE } from "../actions"
import { WORLDS_REQUEST, WORLDS_RESPONSE, WORLD_CREATE_REQUEST, WORLD_CREATE_RESPONSE } from "../actions/world"
import { WORLD_UPDATE_REQUEST, WORLD_UPDATE_RESPONSE, WORLD_DELETE_REQUEST, WORLD_DELETE_RESPONSE } from "../actions/world"
import { ENTITIES_REQUEST, ENTITIES_RESPONSE, ENTITY_CREATE_REQUEST, ENTITY_CREATE_RESPONSE } from "../actions/entity"
import { ENTITY_DELETE_REQUEST, ENTITY_DELETE_RESPONSE } from "../actions/entity"
import { PLAYERS_REQUEST, PLAYERS_RESPONSE, PLAYER_KICK_REQUEST, PLAYER_KICK_RESPONSE } from "../actions/player"
import { PLAYER_BAN_REQUEST, PLAYER_BAN_RESPONSE } from "../actions/player"
import { PLUGINS_REQUEST, PLUGINS_RESPONSE } from "../actions/plugin"
import { TILE_ENTITIES_REQUEST, TILE_ENTITIES_RESPONSE } from "../actions/tile-entity"
import { PROPERTIES_REQUEST, PROPERTIES_RESPONSE, SAVE_PROPERTY_REQUEST, SAVE_PROPERTY_RESPONSE } from "../actions/settings"

const apiUrl = "/api/"

const call = (method, key, path, callback, data) => {
	const req = request(method, apiUrl + path + (path.indexOf("?") >= 0 ? "&" : "?") + (key ? "key=" + key : ""));
	if (data) req.send(data);
	req.end((err, res) => {
		if (err) return window.toastr.error(err);
		if (res.statusCode !== 200 && res.statusCode !== 201) return window.toastr.error(res.statusMessage);
		if (callback) callback(res.body);
	})
}

const api = store => next => action => {
	next(action)

	const key = store.getState().api.key
	const get = call.bind(this, "GET", key)
	const post = call.bind(this, "POST", key)
	const put = call.bind(this, "PUT", key)
	const del = call.bind(this, "DELETE", key)

	switch (action.type) {
		case LOGIN_REQUEST:
			post("user", data => {
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
			})
			break;

		case CHECK_USER_REQUEST:
			get("user", data => {
				if (data.ok) {
					next({
						type: CHECK_USER_RESPONSE,
						user: data.user,
					})
				} else {
					store.dispatch(requestLogout())
				}
			})
			break;

		case INFO_REQUEST:
			get("info", data => {
				next({
					type: INFO_RESPONSE,
					data: data,
				})
			})
			break;

		case CATALOG_REQUEST:
			const state = store.getState();
			if (!state.api.types[action.class]) {
				get("registry/org.spongepowered.api." + action.class, data => {
					next({
						type: CATALOG_RESPONSE,
						class: action.class,
						types: data.types,
					})
				})
			}
			break;

		case WORLDS_REQUEST:
			get("world" + (action.details ? "?details" : ""), data => {
				next({
					type: WORLDS_RESPONSE,
					worlds: data.worlds,
				})
			})
			break;

		case WORLD_UPDATE_REQUEST:
			put("world/" + action.uuid, data => {
				next({
					type: WORLD_UPDATE_RESPONSE,
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

		case ENTITIES_REQUEST:
			get("entity" + (action.details ? "?details" : ""), data => {
				next({
					type: ENTITIES_RESPONSE,
					entities: data.entities,
				})
			})
			break;

		case ENTITY_CREATE_REQUEST:
			post("entity", data => {
				next({
					type: ENTITY_CREATE_RESPONSE,
					ok: data.ok,
					entity: data.entity,
				})
			}, action.data);
			break;

		case ENTITY_DELETE_REQUEST:
			del("entity/" + action.uuid, data => {
				next({
					type: ENTITY_DELETE_RESPONSE,
					ok: data.ok,
					entity: data.entity,
				})
			})
			break;

		case PLAYERS_REQUEST:
			get("player" + (action.details ? "?details" : ""), data => {
				next({
					type: PLAYERS_RESPONSE,
					players: data.players,
				})
			})
			break;

		case PLAYER_KICK_REQUEST:
			post("player/" + action.uuid, (data) => {
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

		case PLUGINS_REQUEST:
			get("plugin" + (action.details ? "?details" : ""), (data) => {
				next({
					type: PLUGINS_RESPONSE,
					ok: data.ok,
					plugins: data.plugins,
				})
			});
			break;

		case TILE_ENTITIES_REQUEST:
			get("tile-entity" + (action.details ? "?details" : ""), (data) => {
				next({
					type: TILE_ENTITIES_RESPONSE,
					ok: data.ok,
					tileEntities: data.tileEntities,
				})
			});
			break;

		case PROPERTIES_REQUEST:
			get("info/properties", data => {
				next({
					type: PROPERTIES_RESPONSE,
					ok: data.ok,
					properties: data.properties,
				})
			})
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

		default:
			break;
	}
}

export default api
