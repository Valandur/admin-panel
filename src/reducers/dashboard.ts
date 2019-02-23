import * as _ from 'lodash';

import { AppAction } from '../actions';
import { TypeKeys } from '../actions/dashboard';
import { ServerInfo, ServerStats } from '../fetch';

export interface DashboardState extends ServerStats {
	data?: ServerInfo;
}

const defaultState: DashboardState = {
	tps: [],
	players: [],
	cpu: [],
	memory: [],
	disk: []
};

export default (state = defaultState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.INFO_RESPONSE:
			return _.merge({}, state, {
				data: action.data
			});

		case TypeKeys.STATS_RESPONSE:
			return {
				...state,
				tps: state.tps.concat(action.tps),
				players: state.players.concat(action.players),
				cpu: state.cpu.concat(action.cpu),
				memory: state.memory.concat(action.memory),
				disk: state.disk.concat(action.disk)
			};

		default:
			return state;
	}
};
