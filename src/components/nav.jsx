import React from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';

import styles from './nav.styl';

export class Nav extends React.Component {
	render() {
		return (
			<nav className={styles.nav}>
				<NavLink to="/" exact>Home</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>
		);
  }
}

export default withRouter(Nav);
