import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import data from '../data';

import About from './about.jsx';
import Nav from './nav.jsx';
import Splash from './splash.jsx';
import Tech from './tech.jsx';
import './app.styl';

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Splash {...data.splash} />
				<Nav />
				<Switch>
					<Route path="/" exact render={() => null} />
					<Route path="/about" exact render={()=>(
						<About {...data.about} />
					)} />
					<Redirect from="/technology" exact to="/technologies/" />
					<Route path="/(technology|technologies)/:tech?" exact component={Tech} />
					<Route render={({ match, location }) => {
						return `No content suitable for ${location.pathname}`;
					}} />
				</Switch>
			</div>
		);
	}
}
