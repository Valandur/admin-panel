import _ from "lodash"

import { PLUGIN_CONFIG_RESPONSE } from "../actions/plugin"

const plugin = (state = { plugins: []}, action) => {
	if (!action.ok)
		return state;
	
	switch(action.type) {
		case PLUGIN_CONFIG_RESPONSE:
			return _.assign({}, state, {
				configs: action.configs,
			});

		default:
			return state;
	}
}

export default plugin
