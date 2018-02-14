import * as i18next from "i18next"
import { Action } from "redux"
import * as _ from "lodash"

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
	lang: "en",
}

const api = (state = defaultState, action: Action) => {
	switch(action.type) {
		case CHANGE_SERVER:
			return _.assign({}, state, {
				server: action.server
			})

		case SERVLETS_RESPONSE:
			if (!action.ok) {
				return state
			}

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
			if (action.error) {
				return _.assign({}, state, {
					loggingIn: false,
					loggedIn: false,
					key: null,
					permissions: null,
					rateLimit: null,
				})
			}
			return _.assign({}, state, {
				loggingIn: false,
				loggedIn: true,
				key: action.data.key,
				permissions: action.data.permissions,
				rateLimit: action.data.rateLimit,
			})

		case LOGOUT_REQUEST:
			return _.assign({}, state, {
				loggedIn: false,
				key: null,
				permissions: null,
				rateLimit: null,
			})

		case CHECK_USER_RESPONSE:
			if (!action.ok) {
				return state
			}

			return _.assign({}, state, {
				permissions: action.data.permissions,
				rateLimit: action.data.rateLimit,
			})

		case CATALOG_RESPONSE:
			return _.assign({}, state, {
				types: {
					...state.types,
					[action.class]: action.types,
				},
			})

		default:
			return state
	}
}

export default api
