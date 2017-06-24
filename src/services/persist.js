import { LOGIN_RESPONSE, LOGOUT_REQUEST } from "../actions"

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
			break;

		default:
			break;
	}
}

export default persist
