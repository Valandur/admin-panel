import { push } from 'react-router-redux';
import { Action, Dispatch, MiddlewareAPI } from 'redux';

import { AppAction, TypeKeys } from '../actions';
import { TypeKeys as PreferencesTypeKeys } from '../actions/preferences';
import { ApiState } from '../reducers/api';
import { PreferencesState } from '../reducers/preferences';
import { AppState } from '../types';

const formatApi = (api: ApiState): string => {
	const data = JSON.parse(JSON.stringify(api)) as ApiState;
	delete data.apis;
	return JSON.stringify(data);
};
const formatPrefs = (api: PreferencesState): string => {
	const data = JSON.parse(JSON.stringify(api)) as PreferencesState;
	return JSON.stringify(data);
};

const persist = ({
	dispatch,
	getState
}: MiddlewareAPI<Dispatch<Action>, AppState>) => (next: Dispatch<Action>) => (
	action: AppAction
): any => {
	next(action);

	switch (action.type) {
		case TypeKeys.LOGIN_RESPONSE:
		case TypeKeys.SERVLETS_RESPONSE:
		case TypeKeys.CHANGE_SERVER:
			if (window.localStorage) {
				window.localStorage.setItem('api', formatApi(getState().api));
			}
			break;

		case TypeKeys.LOGOUT_REQUEST:
			if (window.localStorage) {
				window.localStorage.removeItem('api');
			}
			dispatch(push('/login'));
			break;

		case TypeKeys.CHECK_USER_RESPONSE:
			if (!action.ok) {
				dispatch(push('/login'));
			}
			break;

		case PreferencesTypeKeys.SET_PREFERENCE:
			if (window.localStorage) {
				window.localStorage.setItem(
					'preferences',
					formatPrefs(getState().preferences)
				);
			}
			break;

		default:
			break;
	}
};

export default persist;
