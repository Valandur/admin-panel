import { push } from "react-router-redux"
import { MiddlewareAPI, Action } from "redux"
import { Dispatch } from "react-redux"

import { AppState, ExtendedMiddleware } from "../types"
import { ApiState } from "../reducers/api"
import { AppAction, TypeKeys } from "../actions"

const formatApi = (api: ApiState) => JSON.stringify(api)

const persist: ExtendedMiddleware<AppState> = ({ dispatch, getState }: MiddlewareAPI<AppState>) =>
		(next: Dispatch<Action>) => (action: AppAction): any => {
	next(action)

	switch (action.type) {
		case TypeKeys.LOGIN_RESPONSE:
		case TypeKeys.CHANGE_LANGUAGE:
		case TypeKeys.CHANGE_SERVER:
			if (window.localStorage) {
				window.localStorage.setItem("api", formatApi(getState().api))
			}
			break

		case TypeKeys.LOGOUT_REQUEST:
			if (window.localStorage) {
				window.localStorage.removeItem("api")
			}
			dispatch(push("/login"))
			break

		case TypeKeys.CHECK_USER_RESPONSE:
			if (!action.ok) {
				dispatch(push("/login"))
			}
			break

		default:
			break
	}
}

export default persist
