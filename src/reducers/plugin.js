import _ from "lodash"

import { PLUGINS_RESPONSE } from "../actions/plugin"

const plugin = (state = { plugins: []}, action) => {
	switch(action.type) {
		case PLUGINS_RESPONSE:
			return _.assign({}, state, {
				plugins: _.sortBy(action.plugins, "name"),
			});

		default:
			return state;
	}
}

export default plugin
