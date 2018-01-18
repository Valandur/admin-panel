export const SERVLETS_REQUEST = "SERVLETS_REQUEST"
export const SERVLETS_RESPONSE = "SERVLETS_RESPONSE"
export function requestServlets() {
	return {
		type: SERVLETS_REQUEST,
	}
}

export const CHANGE_LANGUAGE = "CHANGE_LANG"
export function changeLanguage(lang) {
	return {
		type: CHANGE_LANGUAGE,
		lang: lang,
	}
}

export const CHANGE_SERVER = "CHANGE_SERVER"
export function changeServer(server) {
	return {
		type: CHANGE_SERVER,
		server: server,
	}
}

export const LOGIN_REQUEST = "LOGIN_REQUEST"
export const LOGIN_RESPONSE = "LOGIN_RESPONSE"
export function requestLogin(username, password) {
	return {
		type: LOGIN_REQUEST,
		username: username,
		password: password,
	}
}

export const LOGOUT_REQUEST = "LOGOUT_REQUEST"
export const LOGOUT_RESPONSE = "LOGOUT_RESPONSE"
export function requestLogout() {
	return {
		type: LOGOUT_REQUEST
	}
}

export const CHECK_USER_REQUEST = "CHECK_USER_REQUEST"
export const CHECK_USER_RESPONSE = "CHECK_USER_RESPONSE"
export function requestCheckUser() {
	return {
		type: CHECK_USER_REQUEST
	}
}

export const CATALOG_REQUEST = "CATALOG_REQUEST"
export const CATALOG_RESPONSE = "CATALOG_RESPONSE"
export function requestCatalog(clazz) {
	return {
		type: CATALOG_REQUEST,
		class: clazz,
	}
}
