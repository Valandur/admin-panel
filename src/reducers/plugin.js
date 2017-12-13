import _ from "lodash"

import { PLUGIN_CONFIG_RESPONSE, PLUGIN_CONFIG_SET } from "../actions/plugin"

const plugin = (state = {}, action) => {
	switch(action.type) {
		case PLUGIN_CONFIG_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				configs: action.configs,
			});

		case PLUGIN_CONFIG_SET:
			console.log(action);
			return _.assign({}, state, {
				configs: _.assign({}, state.configs, {
					[action.name]: action.conf,
				})
			});

		default:
			return state;
	}
}

export default plugin
