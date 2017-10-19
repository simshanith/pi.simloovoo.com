import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const rootReducer = f => f;

export default function configureStore(initialState={}, history) {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [thunk, routerMiddleware(history)];
  let store;

  if (process.env.NODE_ENV !== "production") {
    middleware.push(createLogger());
  }
  
  store = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(...middleware),
  ));

  return store;
}
