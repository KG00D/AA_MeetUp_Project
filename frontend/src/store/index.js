import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import sessionReducer from "./session";
import groupsReducer from "./groups";
import eventsReducer from "./events";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    session: sessionReducer,
    groups: groupsReducer,
    events: eventsReducer
  });

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

export default function configureStore(preloadedState) {
    return createStore(rootReducer, preloadedState, enhancer);
}