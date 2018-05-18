import { AppAction } from '../actions';
import { DataViewAction, TypeKeys } from '../actions/dataview';
import { AppState, IdFunction } from '../types';

export interface DataViewState<T> {
	creating: boolean;
	filter: {
		[x: string]: string | string[]
	};
	list: T[];
}

const normalizePath = (path: string) => path.replace(/\//g, '_').replace(/-/g, '');

const isDataviewAction = (_action: AppAction): _action is DataViewAction<any> => {
	return (_action as DataViewAction<any>).endpoint !== undefined;
};

export default (state: AppState, action: AppAction) => {
	if (!isDataviewAction(action)) {
		return state;
	}

	const path = normalizePath(action.endpoint);

	const changeObjectStatus = (id: IdFunction<any>, data: any, updating: boolean) =>
		({
			...state,
			[path]: {
				...state[path],
				list: state[path].list.map((obj: any) => {
					if (id(obj) !== id(data)) {
						return obj;
					}
					return { ...obj, ...data, updating };
				})
			}
		});

	switch (action.type) {
		case TypeKeys.LIST_RESPONSE:
			if (action.err) {
				return state;
			}

			return {
				...state,
				[path]: {
					...state[path],
					list: action.list,
				}
			};

		case TypeKeys.CREATE_REQUEST:
			return {
				...state,
				[path]: {
					...state[path],
					creating: true,
				},
			};

		case TypeKeys.CREATE_RESPONSE:
			if (action.err) {
				return {
					...state,
					[path]: {
						...state[path],
						creating: false,
					}
				};
			}

			return {
				...state,
				[path]: {
					...state[path],
					creating: false,
					list: [...state[path].list, action.data],
				}
			};

		case TypeKeys.DETAILS_REQUEST:
			return changeObjectStatus(action.id, action.data, true);

		case TypeKeys.DETAILS_RESPONSE:
			return changeObjectStatus(action.id, action.data, false);

		case TypeKeys.CHANGE_REQUEST:
			return changeObjectStatus(action.id, action.data, true);

		case TypeKeys.CHANGE_RESPONSE:
			return changeObjectStatus(action.id, action.data, false);

		case TypeKeys.DELETE_REQUEST:
			return changeObjectStatus(action.id, action.data, true);

		case TypeKeys.DELETE_RESPONSE:
			if (action.err) {
				changeObjectStatus(action.id, action.data, false);
			}

			return {
				...state,
				[path]: {
					...state[path],
					list: state[path].list.filter((obj: any) => action.id(obj) !== action.id(action.data))
				}
			};

		case TypeKeys.SET_FILTER:
			return {
				...state,
				[path]: {
					...state[path],
					filter: {
						...state[path].filter,
						[action.filter]: action.value,
					},
				}
			};

		default:
			return state;
	}
};
