import React from 'react';

import data from '../data';
import Splash from './splash.jsx';
import './app.styl';

export default class App extends React.PureComponent {
  render() {
    return (
      <Splash {...data.splash} />
    );
  }
}
