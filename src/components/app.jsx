import React from 'react';
import { Route } from 'react-router-dom';

import data from '../data';

import About from './about.jsx';
import Nav from './nav.jsx';
import Splash from './splash.jsx';
import './app.styl';

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Splash {...data.splash} />
				<Nav />
				<Route path="/about" exact render={()=>(
					<About {...data.about} />
				)} />
			</div>
		);
	}
}
