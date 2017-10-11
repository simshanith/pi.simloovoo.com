import React from 'react';

import Nav from './nav.jsx'

export default class Splash extends React.Component {
  render() {
    return (
      <main>
        <h1>Hello World</h1>
        <h2>a small static site on Raspberry Pi</h2>
        <p>Welcome to <a href="/">pi.simloovoo.com</a>! As a technology meta-project, this website describes its self and composition.</p>
        <Nav />
      </main>
    );
  }
}
