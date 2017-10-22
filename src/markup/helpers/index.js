import Helmet from 'react-helmet';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
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

export function createStore(location) {
  const history = createHistory({
    initialEntries: [location]
  });

  return configureStore({}, history);
}

function renderReactApp({ store, location, context = {} }) {
  return renderToString(
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
}

export function createApp({ filename, context }) {
  const location = getLocation(filename);
  const store = createStore(location);
  const html = renderReactApp({ store, location, context });
  const initialState = store.getState();
  const helmet = Helmet.renderStatic();
  return {
    initialState,
    helmet,
    html,
    location,
  };
}
