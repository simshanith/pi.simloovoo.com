import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { routerReducer, routerMiddleware, routerActions } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

export default function configureStore(initialState={}, history, { prerender = false} = {}) {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [thunk, routerMiddleware(history)];
  let store;

  if (process.env.NODE_ENV !== "production" && !prerender) {
    middleware.push(createLogger());
  }
  

  store = createStore(combineReducers({
    //router: routerReducer,
    app: (f={}) => f
  }, {}), initialState, composeWithDevTools({
    actionCreators: {
      ...routerActions,
    },
  })(
    applyMiddleware(...middleware),
  ));

  return store;
}
