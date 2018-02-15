import { Server, UserPermissions, CatalogType } from "../types"
import { Action } from "redux"

export const SERVLETS_REQUEST = "SERVLETS_REQUEST"
export function requestServlets() {
	return {
		type: SERVLETS_REQUEST,
	}
}

export const SERVLETS_RESPONSE = "SERVLETS_RESPONSE"
export interface ServletsResponseAction extends Action {
	ok: boolean
	servlets: {
		[x: string]: string
	}
}

export const CHANGE_LANGUAGE = "CHANGE_LANG"
export interface ChangeLanguageAction extends Action {
	lang: string
}
export function changeLanguage(lang: string): ChangeLanguageAction {
	return {
		type: CHANGE_LANGUAGE,
		lang: lang,
	}
}

export const CHANGE_SERVER = "CHANGE_SERVER"
export interface ChangeServerAction extends Action {
	server: Server
}
export function changeServer(server: Server): ChangeServerAction {
	return {
		type: CHANGE_SERVER,
		server: server,
	}
}

export const LOGIN_REQUEST = "LOGIN_REQUEST"
export interface LoginRequestAction extends Action {
	username: string
	password: string
}
export function requestLogin(username: string, password: string): LoginRequestAction {
	return {
		type: LOGIN_REQUEST,
		username: username,
		password: password,
	}
}

export const LOGIN_RESPONSE = "LOGIN_RESPONSE"
export interface LoginResponseAction extends Action {
	data: UserPermissions
	error: string
}

export const LOGOUT_REQUEST = "LOGOUT_REQUEST"
export function requestLogout() {
	return {
		type: LOGOUT_REQUEST
	}
}

export const LOGOUT_RESPONSE = "LOGOUT_RESPONSE"

export const CHECK_USER_REQUEST = "CHECK_USER_REQUEST"
export function requestCheckUser() {
	return {
		type: CHECK_USER_REQUEST
	}
}

export const CHECK_USER_RESPONSE = "CHECK_USER_RESPONSE"
export interface CheckUserResponseAction extends Action {
	ok: boolean
	data: UserPermissions
}

export const CATALOG_REQUEST = "CATALOG_REQUEST"
export function requestCatalog(clazz: string) {
	return {
		type: CATALOG_REQUEST,
		class: clazz,
	}
}

export const CATALOG_RESPONSE = "CATALOG_RESPONSE"
export interface CatalogResponseAction extends Action {
	class: string
	types: CatalogType[]
}
