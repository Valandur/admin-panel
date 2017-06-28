import { push } from "react-router-redux"
import { LOGIN_RESPONSE, LOGOUT_REQUEST, CHECK_USER_RESPONSE } from "../actions"

const persist = store => next => action => {
	next(action)

	switch (action.type) {
		case LOGIN_RESPONSE:
			if (window.localStorage) {
				window.localStorage.setItem("api", JSON.stringify(store.getState().api));
			}
			break;

		case LOGOUT_REQUEST:
			if (window.localStorage) {
				window.localStorage.removeItem("api");
			}
			next(push("/login"))
			break;

		case CHECK_USER_RESPONSE:
			if (!action.user) {
				next(push("/login"))
			}

		default:
			break;
	}
}

export default persist
