import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import 'react-select/dist/react-select.css'
import { Route, Switch, Redirect } from 'react-router-dom'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'

// Redux
import App from "./reducers"
import api from "./services/api"
import persist from "./services/persist"

// Containers
import Full from './containers/Full/'
import Login from "./containers/Login"
// Use our own connected router because the default one from 
// react-router-redux does not support the basename prop
import ConnectedRouter from "./components/ConnectedRouter"

// Actions
import { requestCheckUser } from "./actions"


const history = createBrowserHistory();

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
	composeEnhancers(applyMiddleware(api, persist, routerMiddleware(history)))
);

// Check if the possibly saved state/key is still valid
if (store.getState().api.loggedIn) {
	store.dispatch(requestCheckUser());
}

ReactDOM.render((
	<Provider store={store}>
		<ConnectedRouter history={history} basename="/admin">
			<Switch>
				<Route path="/login" name="Login" component={Login} />
				<Route path="/" name="Home" render={props => {
					if (store.getState().api.loggedIn)
						return <Full {...props} />
					else
						return <Redirect to={{ pathname: '/login', state: { from: props.location} }} />
				}} />
			</Switch>
		</ConnectedRouter>
	</Provider>
), document.getElementById('root'))
