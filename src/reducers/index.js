import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
import _ from "lodash"

import api from "./api"
import dashboard from "./dashboard"
import chat from "./chat"
import command from "./command"
import world from "./world"
import entity from "./entity"
import player from "./player"
import plugin from "./plugin"
import settings from "./settings"
import dataview from "./dataview"

let app = combineReducers({
	api,
	dashboard,
	chat,
	command,
	world,
	entity,
	player,
	settings,
	dataview: (state = {}, action) =>
		_.merge({}, dataview(state, action), {
			plugin: plugin(state.plugin, action)
		}),
	router: routerReducer,
})

export default app
