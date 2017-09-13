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
	ENTITIES_REQUEST, ENTITIES_RESPONSE,
	ENTITY_CREATE_REQUEST, ENTITY_CREATE_RESPONSE,
	ENTITY_DELETE_REQUEST, ENTITY_DELETE_RESPONSE,
} from "../actions/entity"

import {
	PLAYERS_REQUEST, PLAYERS_RESPONSE,
	PLAYER_KICK_REQUEST, PLAYER_KICK_RESPONSE,
	PLAYER_BAN_REQUEST, PLAYER_BAN_RESPONSE,
} from "../actions/player"

import {
	PLUGINS_REQUEST, PLUGINS_RESPONSE,
	PLUGIN_CONFIG_REQUEST, PLUGIN_CONFIG_RESPONSE,
} from "../actions/plugin"

import {
	TILE_ENTITIES_REQUEST, TILE_ENTITIES_RESPONSE,
} from "../actions/tile-entity"

import {
	OPERATION_REQUEST, OPERATION_RESPONSE,
	OPERATIONS_REQUEST, OPERATIONS_RESPONSE,
	OPERATION_CREATE_REQUEST, OPERATION_CREATE_RESPONSE,
	OPERATION_PAUSE_REQUEST, OPERATION_PAUSE_RESPONSE,
	OPERATION_STOP_REQUEST, OPERATION_STOP_RESPONSE,
} from "../actions/operations"

import {
	PROPERTIES_REQUEST, PROPERTIES_RESPONSE,
	SAVE_PROPERTY_REQUEST, SAVE_PROPERTY_RESPONSE,
} from "../actions/settings"

import {
	CHAT_HISTORY_REQUEST, CHAT_HISTORY_RESPONSE,
} from "../actions/chat"

import {
	COMMANDS_REQUEST, COMMANDS_RESPONSE,
	COMMAND_HISTORY_REQUEST, COMMAND_HISTORY_RESPONSE,
	EXECUTE_REQUEST, EXECUTE_RESPONSE,
} from "../actions/command"

import {
	KITS_REQUEST, KITS_RESPONSE, 
	KIT_CREATE_REQUEST, KIT_CREATE_RESPONSE,
	KIT_CHANGE_REQUEST, KIT_CHANGE_RESPONSE,
	KIT_DELETE_REQUEST, KIT_DELETE_RESPONSE,
	JAILS_REQUEST, JAILS_RESPONSE, 
	JAIL_CREATE_REQUEST, JAIL_CREATE_RESPONSE,
	JAIL_DELETE_REQUEST, JAIL_DELETE_RESPONSE,
} from "../actions/nucleus"

import {
	CRATES_REQUEST, CRATES_RESPONSE, 
} from "../actions/husky"

import {
	TICKETS_REQUEST, TICKETS_RESPONSE, 
} from "../actions/mmctickets"

import {
	BOOKS_REQUEST, BOOKS_RESPONSE,
	BOOK_CREATE_REQUEST, BOOK_CREATE_RESPONSE,
	BOOK_CHANGE_REQUEST, BOOK_CHANGE_RESPONSE,
	BOOK_DELETE_REQUEST, BOOK_DELETE_RESPONSE, 
} from "../actions/webbooks"

const apiUrl = "/api/"

const call = (method, key, dispatch, path, callback, data, handleErrors = true) => {
	const req = request(method, apiUrl + path + (path.indexOf("?") >= 0 ? "&" : "?") + (key ? "key=" + key : ""));
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

		case CHAT_HISTORY_REQUEST:
			get("history/chat", data => {
				next({
					type: CHAT_HISTORY_RESPONSE,
					ok: data.ok,
					messages: _.orderBy(data.messages, "timestamp", "desc"),
				})
			})
			break;

		case COMMANDS_REQUEST:
			get("cmd?details", data => {
				next({
					type: COMMANDS_RESPONSE,
					ok: data.ok,
					commands: _.orderBy(data.commands, "name", "asc"),
				})
			})
			break;

		case COMMAND_HISTORY_REQUEST:
			get("history/cmd", data => {
				next({
					type: COMMAND_HISTORY_RESPONSE,
					ok: data.ok,
					history: _.orderBy(data.calls, "timestamp", "desc"),
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

		case ENTITIES_REQUEST:
			get("entity" + (action.details ? "?details" : ""), data => {
				next({
					type: ENTITIES_RESPONSE,
					ok: data.ok,
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
					ok: data.ok,
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

		case PLUGIN_CONFIG_REQUEST:
			get("plugin/" + action.id + "/config", (data) => {
				next({
					type: PLUGIN_CONFIG_RESPONSE,
					ok: data.ok,
					configs: data.configs,
				})
			})
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


		case OPERATION_REQUEST:
			get("block/op/" + action.uuid, (data) => {
				next({
					type: OPERATION_RESPONSE,
					ok: data.ok,
					operation: data.operation,
				})
			});
			break;

		case OPERATIONS_REQUEST:
			get("block/op" + (action.details ? "?details" : ""), (data) => {
				next({
					type: OPERATIONS_RESPONSE,
					ok: data.ok,
					operations: data.operations,
				})
			});
			break;

		case OPERATION_CREATE_REQUEST:
			post("block/op", (data) => {
				next({
					type: OPERATION_CREATE_RESPONSE,
					ok: data.ok,
					operation: data.operation,
				})
			}, action.operation)
			break;

		case OPERATION_PAUSE_REQUEST:
			put("block/op/" + action.operation.uuid, (data) => {
				next({
					type: OPERATION_PAUSE_RESPONSE,
					ok: data.ok,
					operation: data.operation,
				})
			}, { pause: action.pause });
			break;

		case OPERATION_STOP_REQUEST:
			del("block/op/" + action.operation.uuid, (data) => {
				next({
					type: OPERATION_STOP_RESPONSE,
					ok: data.ok,
					operation: data.operation,
				})
			});
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

		case KITS_REQUEST:
			get("nucleus/kit?details", data => {
				next({
					type: KITS_RESPONSE,
					ok: data.ok,
					kits: data.kits,
				})
			})
			break;

		case KIT_CREATE_REQUEST:
			post("nucleus/kit", data => {
				next({
					type: KIT_CREATE_RESPONSE,
					ok: data.ok,
					kit: data.kit,
				})
			}, action.data)
			break;

		case KIT_CHANGE_REQUEST:
			put("nucleus/kit/" + action.kit.name, data => {
				next({
					type: KIT_CHANGE_RESPONSE,
					ok: data.ok,
					kit: data.ok ? data.kit : action.kit,
				})
			}, action.data)
			break;

		case KIT_DELETE_REQUEST:
			del("nucleus/kit/" + action.kit.name, data => {
				next({
					type: KIT_DELETE_RESPONSE,
					ok: data.ok,
					kit: data.ok ? data.kit : action.kit,
				})
			}, action.data)
			break;

		case JAILS_REQUEST:
			get("nucleus/jail?details", data => {
				next({
					type: JAILS_RESPONSE,
					ok: data.ok,
					jails: data.jails,
				})
			})
			break;

		case JAIL_CREATE_REQUEST:
			post("nucleus/jail", data => {
				next({
					type: JAIL_CREATE_RESPONSE,
					ok: data.ok,
					jail: data.jail,
				})
			}, action.data)
			break;

		case JAIL_DELETE_REQUEST:
			del("nucleus/jail/" + action.jail.name, data => {
				next({
					type: JAIL_DELETE_RESPONSE,
					ok: data.ok,
					jail: data.ok ? data.jail : action.jail,
				})
			}, action.data)
			break;

		case CRATES_REQUEST:
			get("husky/crate?details", data => {
				next({
					type: CRATES_RESPONSE,
					ok: data.ok,
					crates: data.crates,
				})
			})
			break;

		case TICKETS_REQUEST:
			get("mmctickets/ticket?details", data => {
				next({
					type: TICKETS_RESPONSE,
					ok: data.ok,
					tickets: data.tickets,
				})
			})
			break;

		case BOOKS_REQUEST:
			get("webbook?details", data => {
				next({
					type: BOOKS_RESPONSE,
					ok: data.ok,
					books: data.books,
				})
			})
			break;

		case BOOK_CREATE_REQUEST:
			post("webbook", data => {
				next({
					type: BOOK_CREATE_RESPONSE,
					ok: data.ok,
					book: data.book,
				})
			}, action.data)
			break;

		case BOOK_CHANGE_REQUEST:
			put("webbook/" + action.book.id, data => {
				next({
					type: BOOK_CHANGE_RESPONSE,
					ok: data.ok,
					book: data.ok ? data.book : action.book,
				})
			}, action.data)
			break;

		case BOOK_DELETE_REQUEST:
			del("webbook/" + action.book.id, data => {
				next({
					type: BOOK_DELETE_RESPONSE,
					ok: data.ok,
					book: data.ok ? data.book : action.book,
				})
			}, action.data)
			break;

		default:
			break;
	}
}

export default api
