import { pick, omit } from 'lodash';
import Helmet from 'react-helmet';
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import data from '../data';

import About from './about.jsx';
import Nav from './nav.jsx';
import Splash from './splash.jsx';
import Tech from './tech.jsx';

const publicPath = 'http://pi.simloovoo.com'

export class DataRoute extends React.Component {
	static routerProps = [
		'computedMatch',
		'location',
		'exact',
		'path',
		'sensitive',
		'strict',
	];

	static routerRenderProps = [
		'component',
		'render',
		'children'
	];

	render() {
		const props = {
			...pick(this.props, DataRoute.routerProps),
			render: (routeProps) => {
				const ignoredProps = [
					...DataRoute.routerProps,
					...DataRoute.routerRenderProps,
				];

				const componentProps = {
					...omit(this.props, ignoredProps),
					...routeProps,
				};

				const Component = this.props.component;
				return <Component {...componentProps} />
			},
		};

		return (
			<Route {...props} />
		);
	}
}

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Route render={({location}) => (
					<Helmet
					titleTemplate="%s · π ⨯ ˢⁱᵐˡᵒᵒᵛᵒᵒ"
					defaultTitle="π ⨯ ˢⁱᵐˡᵒᵒᵛᵒᵒ">
						<html lang="en" />
						<meta property="og:url" content={`${publicPath}${location.pathname}`} />
						<link rel="canonical" href={`${publicPath}${location.pathname}`} />
						<meta property="og:image" content={`${publicPath}${require('assets/images/splash.jpg')}`} />
						<meta property="og:type" content="website" />
						<meta property="og:title" content="π ⨯ ˢⁱᵐˡᵒᵒᵛᵒᵒ" />
						<meta property="og:description" content="💻 π ☙ diy metaverse" />
					</Helmet>
				)} />
				<DataRoute {...data.splash} path="/" component={Splash} />
				<Nav />
				<Switch>
					<Route path="/" exact render={() => null} />
					<DataRoute {...data.about} path="/about" exact component={About} />
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
