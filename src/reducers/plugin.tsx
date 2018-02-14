import * as _ from "lodash"
import { Action } from "redux"

import { PLUGIN_CONFIG_RESPONSE, PLUGIN_CONFIG_SET } from "../actions/plugin"

const plugin = (state = {}, action: Action) => {
	switch (action.type) {
		case PLUGIN_CONFIG_RESPONSE:
			return _.assign({}, state, {
				configs: _.assign({}, action.configs),
			})

		case PLUGIN_CONFIG_SET:
			return _.assign({}, state, {
				configs: _.assign({}, state.configs, {
					[action.name]: action.conf,
				})
			})

		default:
			return state
	}
}

export default plugin
