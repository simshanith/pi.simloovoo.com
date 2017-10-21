import React from 'react';
import { hydrate } from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './components/app.jsx';
import configureStore from './store';


const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const history = createHistory();
const store = configureStore(initialState, history);

hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
