import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { routerMiddleware, ConnectedRouter } from "react-router-redux"
import { createBrowserHistory } from "history"
import NotificationSystem from "react-notification-system"

// CSS
import "semantic-ui-css/semantic.min.css";
import "react-select/dist/react-select.css"
import "rc-slider/assets/index.css";

// Redux
import App from "./reducers"
import api from "./services/api"
import persist from "./services/persist"
import notification from "./services/notification"

// Containers
import Full from "./containers/Full/"
import Login from "./containers/Login"

// Actions
import { requestServlets, requestCheckUser } from "./actions"
import { saveNotifRef } from "./actions/notification"


const history = createBrowserHistory({
	basename: "/admin",
});

// Try and reconstruct state
let initialState = undefined;
if (window.localStorage) {
	const prevApi = window.localStorage.getItem("api");
	initialState = {
		api: prevApi ? JSON.parse(prevApi) : undefined,
	};
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
	App, 
	initialState, 
	composeEnhancers(applyMiddleware(api, persist, notification, routerMiddleware(history)))
);

// Check if the possibly saved state/key is still valid
if (store.getState().api.loggedIn) {
	store.dispatch(requestCheckUser());
}

store.dispatch(requestServlets());

class Main extends React.Component {
	render() {
		return <div>
			<Provider store={store}>
				<ConnectedRouter history={history} basename="/admin">
					<Switch>
						<Route path="/login" name="Login" component={Login} />
						<Route path="/" name="Home" render={props => {
							if (store.getState().api.loggedIn)
								return <Full {...props} />
							else
								return <Redirect to={{ pathname: "/login", state: { from: props.location }}} />
						}} />
					</Switch>
				</ConnectedRouter>
			</Provider>
			<NotificationSystem ref={ref => store.dispatch(saveNotifRef(ref))} />
		</div>
	}
}

ReactDOM.render(<Main />, document.getElementById("root"))
