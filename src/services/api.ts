import { Action, Dispatch, MiddlewareAPI } from 'redux';
import * as request from 'superagent';

import {
	AppAction,
	requestLogout,
	requestServlets,
	respondCatalog,
	respondCheckUser,
	respondLogin,
	respondServlets,
	TypeKeys
} from '../actions';
import {
	respondExecute,
	TypeKeys as CommandTypeKeys
} from '../actions/command';
import {
	respondInfo,
	respondStats,
	TypeKeys as DashboardTypeKeys
} from '../actions/dashboard';
import {
	respondChange,
	respondCreate,
	respondDelete,
	respondDetails,
	respondList,
	TypeKeys as DataViewTypeKeys
} from '../actions/dataview';
import { showNotification } from '../actions/notification';
import {
	respondCollections,
	respondSubjects,
	TypeKeys as PermissionTypeKeys
} from '../actions/permission';
import {
	respondBanPlayer,
	respondKickPlayer,
	TypeKeys as PlayerTypeKeys
} from '../actions/player';
import {
	respondPluginConfig,
	respondPluginConfigSave,
	respondPluginToggle,
	TypeKeys as PluginTypeKeys
} from '../actions/plugin';
import {
	respondSaveProperty,
	TypeKeys as SettingTypeKeys
} from '../actions/server-settings';

import { ExecuteMethodParam } from '../fetch';
import { AppState } from '../types';

const api = ({
	getState,
	dispatch
}: MiddlewareAPI<Dispatch<AppAction>, AppState>) => (
	next: Dispatch<Action>
) => (action: AppAction): any => {
	next(action);

	const state = getState();

	const makeUrl = (path: string) =>
		(window.location.protocol === 'https:' && state.api.server.apiUrlHttps
			? state.api.server.apiUrlHttps
			: state.api.server.apiUrl) +
		'/api/v5/' +
		path +
		(path.indexOf('?') >= 0 ? '&' : '?') +
		(state.api.key ? 'key=' + state.api.key : '');

	const errorHandler = (err: Response) =>
		dispatch(showNotification('error', 'API Error', err.statusText));

	switch (action.type) {
		case TypeKeys.SERVLETS_REQUEST:
			state.api.apis.info
				.listServlets()
				.then(servlets => next(respondServlets(true, servlets)))
				.catch((err: Response) => {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout());
					} else {
						next(showNotification('error', 'Servlet error', err.statusText));
					}
					next(respondServlets(false, {}));
				});
			break;

		case TypeKeys.CHECK_USER_REQUEST:
			state.api.apis.user
				.getMe()
				.then(perms => next(respondCheckUser(true, perms)))
				.catch((err: Response) => {
					if (err.status === 401 || err.status === 403) {
						next(requestLogout());
					} else {
						next(showNotification('error', 'User error', err.statusText));
					}
				});
			break;

		case TypeKeys.LOGIN_REQUEST:
			state.api.apis.user
				.login({
					username: action.username,
					password: action.password
				})
				.then(perms => next(respondLogin(perms)))
				.then(() => next(requestServlets()))
				.catch(err => next(respondLogin(undefined, err)));
			break;

		case TypeKeys.LOGOUT_REQUEST:
			state.api.apis.user.logout();
			break;

		case TypeKeys.CATALOG_REQUEST:
			if (state.api.types[action.class]) {
				break;
			}

			state.api.apis.registry
				.getRegistry('org.spongepowered.api.' + action.class)
				.then(types => next(respondCatalog(action.class, types)))
				.catch(errorHandler);
			break;

		case DashboardTypeKeys.INFO_REQUEST:
			state.api.apis.info
				.getInfo()
				.then(info => next(respondInfo(info)))
				.catch(errorHandler);
			break;

		case DashboardTypeKeys.STATS_REQUEST:
			state.api.apis.info
				.getStats(action.limit)
				.then(stats => next(respondStats(stats)))
				.catch(errorHandler);
			break;

		case PermissionTypeKeys.COLLECTIONS_LIST_REQUEST:
			state.api.apis.permission
				.listCollections(true)
				.then(collections => next(respondCollections(collections)))
				.catch(errorHandler);
			break;

		case PermissionTypeKeys.SUBJECTS_LIST_REQUEST:
			state.api.apis.permission
				.listSubjects(action.collection.id, true)
				.then(subjects => next(respondSubjects(action.collection, subjects)))
				.catch(errorHandler);
			break;

		case PlayerTypeKeys.KICK_REQUEST:
			state.api.apis.player
				.executeMethod(action.player.uuid, {
					method: 'kick',
					parameters: [
						{
							type: ExecuteMethodParam.TypeEnum.TEXT,
							value: 'Bye'
						}
					]
				})
				.then(() => next(respondKickPlayer(true, action.player)))
				.catch(() => next(respondKickPlayer(false, action.player)));
			break;

		case PlayerTypeKeys.BAN_REQUEST:
			state.api.apis.cmd
				.runCommands([
					{
						command: 'ban ' + action.player.name
					}
				])
				.then(results =>
					next(
						respondBanPlayer(
							true,
							action.player,
							results[0].response!.join('\n')
						)
					)
				)
				.catch(err => next(respondBanPlayer(false, action.player, err)));
			break;

		case PluginTypeKeys.CONFIG_REQUEST:
			state.api.apis.plugin
				.getPluginConfig(action.id)
				.then(configs => next(respondPluginConfig(configs)))
				.catch(errorHandler);
			break;

		case PluginTypeKeys.CONFIG_SAVE_REQUEST:
			state.api.apis.plugin
				.changePluginConfig(action.id, action.configs)
				.then(configs => next(respondPluginConfigSave(configs)))
				.catch(errorHandler);
			break;

		case PluginTypeKeys.TOGGLE_REQUEST:
			state.api.apis.plugin
				.togglePlugin(action.id)
				.then(plugin => next(respondPluginToggle(plugin)))
				.catch(errorHandler);
			break;

		case SettingTypeKeys.SAVE_PROPERTY_REQUEST:
			state.api.apis.server
				.modifyProperties({
					[action.prop.key]: action.prop.value
				})
				.then(properties => {
					const prop = properties.find(p => p.key === action.prop.key);
					if (prop) {
						next(respondSaveProperty(prop));
					}
				})
				.catch(errorHandler);
			break;

		case CommandTypeKeys.EXECUTE_REQUEST:
			state.api.apis.cmd
				.runCommands([
					{
						command: action.command,
						waitLines: action.waitLines,
						waitTime: action.waitTime
					}
				])
				.then(results => next(respondExecute(results[0])))
				.catch(err =>
					next(respondExecute({ ok: false, cmd: action.command, error: err }))
				);
			break;

		case DataViewTypeKeys.LIST_REQUEST:
			const params = toQueryParams(action.query);
			request
				.get(
					makeUrl(
						action.endpoint + '?' + (action.details ? 'details&' : '') + params
					)
				)
				.then(resp => next(respondList(action.endpoint, resp.body)))
				.catch(err => next(respondList(action.endpoint, undefined, err)));
			break;

		case DataViewTypeKeys.DETAILS_REQUEST:
			request
				.get(makeUrl(action.endpoint + '/' + action.id(action.data)))
				.then(resp =>
					next(respondDetails(action.endpoint, action.id, resp.body))
				)
				.catch(err =>
					next(respondDetails(action.endpoint, action.id, action.data, err))
				);
			break;

		case DataViewTypeKeys.CREATE_REQUEST:
			request
				.post(makeUrl(action.endpoint))
				.send(action.data)
				.then(resp =>
					next(respondCreate(action.endpoint, action.id, resp.body))
				)
				.catch(err =>
					next(respondCreate(action.endpoint, action.id, undefined, err))
				);
			break;

		case DataViewTypeKeys.CHANGE_REQUEST:
			request
				.put(makeUrl(action.endpoint + '/' + action.id(action.data)))
				.send(action.newData)
				.then(resp =>
					next(respondChange(action.endpoint, action.id, resp.body))
				)
				.catch(err =>
					next(respondChange(action.endpoint, action.id, action.data, err))
				);
			break;

		case DataViewTypeKeys.DELETE_REQUEST:
			request
				.delete(makeUrl(action.endpoint + '/' + action.id(action.data)))
				.then(resp =>
					next(respondDelete(action.endpoint, action.id, resp.body))
				)
				.catch(err =>
					next(respondDelete(action.endpoint, action.id, action.data, err))
				);
			break;

		default:
			break;
	}
};

function toQueryParams(query: { [x: string]: string }) {
	return Object.keys(query)
		.map(k => k + '=' + query[k])
		.join('&');
}

export default api;
