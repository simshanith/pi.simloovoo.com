import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';

import App from '../../components/app.jsx';

export function renderApp(options) {
  try {
    return renderToString(
      <App />
    );
  } catch (err) {
    console.error(err);
    return '';
  }
}
