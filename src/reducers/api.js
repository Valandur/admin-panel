import _ from "lodash"

import {
	SERVLETS_RESPONSE,
	LOGIN_REQUEST, LOGIN_RESPONSE,
	CHECK_USER_RESPONSE, LOGOUT_REQUEST, CATALOG_RESPONSE
} from "../actions"

const api = (state = { servlets: {}, types: {}}, action) => {
	switch(action.type) {
		case SERVLETS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				servlets: action.servlets,
			})

		case LOGIN_REQUEST:
			return _.assign({}, state, {
				loggingIn: true,
			})

		case LOGIN_RESPONSE:
			return _.assign({}, state, {
				loggingIn: false,
				loggedIn: action.ok,
				key: action.ok ? action.key : null,
				user: action.ok ? action.user : null,
			})

		case LOGOUT_REQUEST:
			return _.assign({}, state, {
				loggedIn: false,
				key: null,
				user: null,
			})

		case CHECK_USER_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				user: action.user,
			})

		case CATALOG_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				types: {
					...state.types,
					[action.class]: action.types,
				},
			});

		default:
			return state;
	}
}

export default api
