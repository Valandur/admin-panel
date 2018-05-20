import { AppAction } from '../actions';
import { TypeKeys } from '../actions/player';
import { Player } from '../fetch';

import { DataViewState } from './dataview';

const initialState: DataViewState<Player> = {
	creating: false,
	filter: {},
	list: [],
};

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.KICK_REQUEST:
			return {
				...state,
				list: state.list.map(p => {
					if (p.uuid !== action.player.uuid) {
						return p;
					}
					return { ...p, updating: true };
				})
			};

		case TypeKeys.KICK_RESPONSE:
			if (!action.ok) {
				return {
					...state,
					list: state.list.map(p => {
						if (p.uuid !== action.player.uuid) {
							return p;
						}
						return { ...p, updating: false };
					})
				};
			}
			return {
				...state,
				list: state.list.filter(p => p.uuid !== action.player.uuid)
			};

		case TypeKeys.BAN_REQUEST:
			return {
				...state,
				list: state.list.map(p => {
					if (p.uuid !== action.player.uuid) {
						return p;
					}
					return { ...p, updating: true };
				})
			};

		case TypeKeys.BAN_RESPONSE:
			if (!action.ok) {
				return {
					...state,
					list: state.list.map(p => {
						if (p.uuid !== action.player.uuid) {
							return p;
						}
						return { ...p, updating: false };
					})
				};
			}
			return {
				...state,
				list: state.list.filter(p => p.uuid !== action.player.uuid)
			};

		default:
			return state;
	}
};
