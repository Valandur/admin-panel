import { push } from "react-router-redux"
import { LOGIN_RESPONSE, LOGOUT_REQUEST, CHECK_USER_RESPONSE, CHANGE_LANGUAGE } from "../actions"

const persist = ({ dispatch, getState }) => next => action => {
	next(action)

	switch (action.type) {
		case LOGIN_RESPONSE:
		case CHANGE_LANGUAGE:
			if (window.localStorage) {
				window.localStorage.setItem("api", JSON.stringify(getState().api));
			}
			break;

		case LOGOUT_REQUEST:
			if (window.localStorage) {
				window.localStorage.removeItem("api");
			}
			dispatch(push("login"))
			break;

		case CHECK_USER_RESPONSE:
			if (!action.user) {
				dispatch(push("login"))
			}
			break;

		default:
			break;
	}
}

export default persist
