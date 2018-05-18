import { createBrowserHistory } from 'history';
import * as createRavenMiddleware from 'raven-for-redux';
import * as Raven from 'raven-js';
import 'rc-slider/assets/index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as NotificationSystem from 'react-notification-system';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { Message, Segment } from 'semantic-ui-react';

import { AppAction, requestCheckUser } from './actions';
import { saveNotifRef } from './actions/notification';
import Full from './containers/Full/';
import Login from './containers/Login';
import './locales/i18n';
import App from './reducers';
import api from './services/api';
import notification from './services/notification';
import persist from './services/persist';
import { AppState, Server } from './types';

const pkg = require('../package.json');

declare global {
	interface Config {
		basePath: string;
		servers: Server[];
	}

	interface Window {
		config: Config;
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
	}
}

// Sentry
if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'development') {
	Raven.config('https://61d75957355b4aa486ff8653dc64acd0@sentry.io/203544', {
		release: pkg.version
	}).install();
} else {
	console.log('Sentry disabled due to dev environment');
}

// Construct history with basename
const history = createBrowserHistory({
	basename: window.config.basePath
});

// Setup redux store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore<AppState, AppAction, {}, {}>(
	App,
	composeEnhancers(
		applyMiddleware(
			api,
			persist,
			notification,
			routerMiddleware(history),
			createRavenMiddleware(Raven, {})
		)
	)
);

// Check if the possibly saved state/key is still valid
const state = store.getState();
if (state && state.api.loggedIn) {
	store.dispatch(requestCheckUser());
}

class Main extends React.Component {
	render() {
		if (store.getState().api.servers.length === 0) {
			return (
				<Segment basic={true}>
					<Message negative={true}>
						<Message.Header>No servers found</Message.Header>
						<p>
							You have not configured any servers to connect to! Check your
							config.js file.
						</p>
					</Message>
				</Segment>
			);
		}

		return (
			<div>
				<Provider store={store}>
					<ConnectedRouter history={history} basename={window.config.basePath}>
						<Switch>
							<Route path="/login" component={Login} />
							<Route
								path="/"
								render={props => {
									if (store.getState().api.loggedIn) {
										return <Full {...props} />;
									} else {
										return (
											<Redirect
												to={{
													pathname: '/login',
													state: { from: props.location }
												}}
											/>
										);
									}
								}}
							/>
						</Switch>
					</ConnectedRouter>
				</Provider>
				<NotificationSystem
					ref={(ref: NotificationSystem.System) =>
						store.dispatch(saveNotifRef(ref))
					}
				/>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
