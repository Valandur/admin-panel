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
import operations from "./operations"
import settings from "./settings"

import husky from "./husky"
import mmctickets from "./mmctickets"
import nucleus from "./nucleus"
import webbooks from "./webbooks"

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
	operations,
	settings,
	
	husky,
	mmctickets,
	nucleus,
	webbooks,

	router: routerReducer,
})

export default app
