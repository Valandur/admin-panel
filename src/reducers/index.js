import { combineReducers } from "redux"

import api from "./api"
import dashboard from "./dashboard"
import world from "./world"
import entity from "./entity"
import player from "./player"
import plugin from "./plugin"
import tileEntity from "./tile-entity"
import settings from "./settings"

const app = combineReducers({
	api,
	dashboard,
	world,
	entity,
	player,
	plugin,
	tileEntity,
	settings,
})

export default app
