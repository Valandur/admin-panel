import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"

import api from "./api"
import dashboard from "./dashboard"
import chat from "./chat"
import command from "./command"
import world from "./world"
import entity from "./entity"
import player from "./player"
import plugin from "./plugin"
import tileEntity from "./tile-entity"
import settings from "./settings"
import dataview from "./dataview"

const app = combineReducers({
	api,
	dashboard,
	chat,
	command,
	world,
	entity,
	player,
	plugin,
	tileEntity,
	settings,
	dataview,

	router: routerReducer,
})

export default app
