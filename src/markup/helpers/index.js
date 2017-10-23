import Helmet from 'react-helmet';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';

import configureStore from '../../store';
import data from '../../data';
import pages from '../../../webpack/pages';
import App from '../../components/app.jsx';

function getLocation(filename='') {
  const page = filename.replace(/^\/?/, '/');
  return pages.hash.urls[page];
}

function renderReactApp({ store, history }) {
  return renderToString(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
}

export function createApp({ filename, context }) {
  const location = getLocation(filename);
  const history = createHistory({
    initialEntries: [location]
  });
  const store = configureStore({}, history, { prerender: true });
  const html = renderReactApp({ store, history });
  const initialState = store.getState();
  const helmet = Helmet.renderStatic();
  return {
    initialState,
    helmet,
    html,
    location,
  };
}
