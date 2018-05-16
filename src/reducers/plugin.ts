import { AppAction } from '../actions';
import { TypeKeys } from '../actions/plugin';
import { PluginContainer } from '../fetch';

import { DataViewState } from './dataview';

export interface PluginState extends DataViewState<PluginContainer> {
	configs: {
		[x: string]: any
	};
}

const initialState: PluginState = {
	creating: false,
	filter: {},
	list: [],
	configs: {}
};

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.TOGGLE_REQUEST:
			return {
				...state,
				list: state.list.map((obj: PluginContainer) => {
					if (obj.id !== action.id) {
						return obj;
					}
					return { ...obj, updating: true };
				})
			};

		case TypeKeys.TOGGLE_RESPONSE:
			return {
				...state,
				list: state.list.map((obj: PluginContainer) => {
					if (obj.id !== action.plugin.id) {
						return obj;
					}
					return { ...obj, ...action.plugin, updating: false };
				})
			};

		case TypeKeys.CONFIG_RESPONSE:
			return {
				...state,
				configs: { ...action.configs }
			};

		default:
			return state;
	}
};
