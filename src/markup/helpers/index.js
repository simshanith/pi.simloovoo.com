import dotenv from 'dotenv-safe';
import { mapKeys, pick } from 'lodash'
import Helmet from 'react-helmet';
import { HTML_TAG_MAP } from 'react-helmet/lib/HelmetConstants'
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

dotenv.config();

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

export function getAttributes(component) {
  return mapKeys(component, (val, key) => {
    return HTML_TAG_MAP[key] || key;
  });
}

export function getHtmlAttributes(helmet) {
  try {
    return getAttributes(helmet.htmlAttributes.toComponent());
  } catch (err) {
    console.error(err);
  }
}

export function getBodyAttributes(helmet) {
  try {
    return getAttributes(helmet.bodyAttributes.toComponent());
  } catch (err) {
    console.error(err);
  }
}

export function createApp({ filename, env }) {
  try {
    const location = getLocation(filename);
    const history = createHistory({
      initialEntries: [location]
    });
    const env = pick(env, [
      'COMMIT_MESSAGE',
    ]);
    const store = configureStore({
      app: {
        env,
      },
    }, history, { prerender: true });
    const html = renderReactApp({ store, history });
    const initialState = store.getState();
    const helmet = Helmet.renderStatic();

    return {
      initialState,
      helmet,
      html,
      location,
    };
  } catch (err) {
    console.error(err);
    return {
      html: `<pre style="white-space: pre-wrap;">${err.toString()}\n${err.stack}</pre>`
    }
  }
}
