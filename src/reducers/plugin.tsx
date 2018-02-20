import * as _ from "lodash"

import { AppAction } from "../actions"
import { TypeKeys } from "../actions/plugin"

export interface PluginState {
	configs: {
		[x: string]: any
	}
}

const initialState: PluginState = {
	configs: {}
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.CONFIG_RESPONSE:
			return _.assign({}, state, {
				configs: _.assign({}, action.configs),
			})

		case TypeKeys.CONFIG_SET:
			return _.assign({}, state, {
				configs: _.assign({}, state.configs, {
					[action.name]: action.conf,
				})
			})

		default:
			return state
	}
}
