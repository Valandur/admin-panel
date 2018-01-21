import i18next from "i18next"
import _ from "lodash"

import {
	SERVLETS_RESPONSE,
	LOGIN_REQUEST, LOGIN_RESPONSE,
	CHECK_USER_RESPONSE, LOGOUT_REQUEST, CATALOG_RESPONSE,
	CHANGE_LANGUAGE, CHANGE_SERVER
} from "../actions"

const defaultState = {
	server: _.first(window.config.servers),
	servers: window.config.servers,
	servlets: {},
	types: {},
	lang: "en"
}

const api = (state = defaultState, action) => {
	switch(action.type) {
		case CHANGE_SERVER:
			return _.assign({}, state, {
				server: action.server
			})

		case SERVLETS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				servlets: action.servlets,
			})

		case CHANGE_LANGUAGE:
			i18next.changeLanguage(action.lang)
			return _.assign({}, state, {
				lang: action.lang,
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
