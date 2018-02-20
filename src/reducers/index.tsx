import * as _ from "lodash"
import { routerReducer } from "react-router-redux"

import api from "./api"
import cmd from "./command"
import dashboard from "./dashboard"
import dataview from "./dataview"
import player from "./player"
import plugin from "./plugin"
import settings from "./settings"

import { AppAction } from "../actions"
import { TypeKeys as DataViewTypeKeys } from "../actions/dataview"
import { AppState } from "../types"

const app = (state: AppState, action: AppAction) => {
	let data = state

	switch (action.type) {
		case DataViewTypeKeys.CHANGE_REQUEST:
		case DataViewTypeKeys.CHANGE_RESPONSE:
		case DataViewTypeKeys.CREATE_REQUEST:
		case DataViewTypeKeys.CREATE_RESPONSE:
		case DataViewTypeKeys.DELETE_REQUEST:
		case DataViewTypeKeys.DELETE_RESPONSE:
		case DataViewTypeKeys.DETAILS_REQUEST:
		case DataViewTypeKeys.DETAILS_RESPONSE:
		case DataViewTypeKeys.LIST_REQUEST:
		case DataViewTypeKeys.LIST_RESPONSE:
		case DataViewTypeKeys.SET_FILTER:
			data = dataview(state, action)
			break

		default:
	}

	return {
		...data,
		api: api(data.api, action),
		cmd: cmd(data.cmd, action),
		dashboard: dashboard(data.dashboard, action),
		entity: _.merge({}, data.entity),
		player: player(data.player, action),
		plugin: plugin(data.plugin, action),
		world: _.merge({}, data.world),
		settings: settings(data.settings, action),
		"tile-entity": _.merge({}, data["tile-entity"]),
		router: routerReducer(data.router, action),
	}
}

export default app
