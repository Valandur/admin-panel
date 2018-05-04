import { routerReducer } from "react-router-redux"

import { AppAction, initAction } from "../actions"
import { AppState } from "../types"

import api from "./api"
import cmd from "./command"
import dashboard from "./dashboard"
import dataview from "./dataview"
import permission from "./permission"
import player from "./player"
import plugin from "./plugin"
import serverSettings from "./server-settings"

import preferences from "./preferences"

const initAcc = initAction()

const dataState = {
	creating: false,
	filter: {},
	list: []
}

const initialState: AppState = {
	api: api(undefined, initAcc),
	cmd: cmd(undefined, initAcc),
	dashboard: dashboard(undefined, initAcc),
	entity: dataState,
	permission: permission(undefined, initAcc),
	player: player(undefined, initAcc),
	plugin: plugin(undefined, initAcc),
	world: dataState,
	server_properties: serverSettings(undefined, initAcc),
	tileentity: dataState,

	preferences: preferences(undefined, initAcc),
	router: routerReducer({ location: null }, initAcc)
}

const app = (state: AppState = initialState, action: AppAction): AppState => {
	const data = dataview(state, action)

	return {
		...data,
		api: api(data.api, action),
		cmd: cmd(data.cmd, action),
		dashboard: dashboard(data.dashboard, action),
		entity: data.entity,
		permission: permission(data.permission, action),
		player: player(data.player, action),
		plugin: plugin(data.plugin, action),
		world: data.world,
		server_properties: serverSettings(data.server_properties, action),
		tileentity: data.tileentity,

		preferences: preferences(data.preferences, action),
		router: routerReducer(data.router, action)
	}
}

export default app
