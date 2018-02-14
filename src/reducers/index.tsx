import { routerReducer } from "react-router-redux"
import { Action } from "redux"
import * as _ from "lodash"

import api from "./api"
import dashboard from "./dashboard"
import cmd from "./command"
import player from "./player"
import plugin from "./plugin"
import settings from "./settings"
import dataview from "./dataview"

const app = (state = {}, action: Action) => {
	const data = dataview(state, action)

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
