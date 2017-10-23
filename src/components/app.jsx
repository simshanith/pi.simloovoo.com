import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

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
				<Switch>
					<Route path="/" exact render={() => ''} />
					<Route path="/about" exact render={()=>(
						<About {...data.about} />
					)} />
					<Redirect from="/technology" exact to="/technologies/" />
					<Route path="/(technology|technologies)/:tech?" exact render={props=> {
						const { match } = props;
						console.info('technology|technologies match', props);
						switch (match.params[0]) {
							case 'technology':
								console.info('technology match', data.technologies[match.params.tech]);
								break;
							case 'technologies':
								console.info('technologies match', props);
								console.info()
								break;
						}
						return '';
					}} />
					<Route render={({ match, location }) => {
						return `No content suitable for ${location.pathname}`;
					}} />
				</Switch>
			</div>
		);
	}
}
