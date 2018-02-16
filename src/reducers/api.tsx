import * as i18next from "i18next"
import * as _ from "lodash"

import { TypeKeys, AppAction } from "../actions"
import { Server, CatalogType, Lang } from "../types"
import { PermissionTree } from "../components/Util"

export interface ApiState {
	key?: string
	loggedIn: boolean
	loggingIn: boolean
	server: Server
	servers: Server[]
	servlets: {
		[x: string]: string
	}
	types: {
		[x: string]: CatalogType[]
	}
	lang: Lang
	permissions?: PermissionTree
}

let initialState: ApiState = {
	loggedIn: false,
	loggingIn: false,
	server: window.config.servers[0],
	servers: window.config.servers,
	servlets: {},
	types: {},
	lang: "en",
}
if (window.localStorage) {
	const str = window.localStorage.getItem("api")
	const prevApi: ApiState | undefined = str ? JSON.parse(str) : undefined
	if (prevApi && prevApi.loggedIn) {
		initialState = prevApi
	}
}

export default (state = initialState, action: AppAction) => {

	switch (action.type) {
		case TypeKeys.CHANGE_SERVER:
			return _.assign({}, state, {
				server: action.server
			})

		case TypeKeys.SERVLETS_RESPONSE:
			if (!action.ok) {
				return state
			}

			return _.assign({}, state, {
				servlets: action.servlets,
			})

		case TypeKeys.CHANGE_LANGUAGE:
			i18next.changeLanguage(action.lang)
			return _.assign({}, state, {
				lang: action.lang,
			})

		case TypeKeys.LOGIN_REQUEST:
			return _.assign({}, state, {
				loggingIn: true,
			})

		case TypeKeys.LOGIN_RESPONSE:
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

		case TypeKeys.LOGOUT_REQUEST:
			return _.assign({}, state, {
				loggedIn: false,
				key: null,
				permissions: null,
				rateLimit: null,
			})

		case TypeKeys.CHECK_USER_RESPONSE:
			if (!action.ok) {
				return state
			}

			return _.assign({}, state, {
				permissions: action.data.permissions,
				rateLimit: action.data.rateLimit,
			})

		case TypeKeys.CATALOG_RESPONSE:
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
