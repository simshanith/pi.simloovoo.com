import React from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';

import styles from './nav.styl';

export class Nav extends React.Component {
	render() {
		const classProps = {
			className: styles['nav__link'],
			activeClassName: styles['nav__link--active'],
		};
		return (
			<nav className={styles.nav}>
				<NavLink {...classProps} to="/" exact>Home</NavLink>
				<NavLink {...classProps} to="/about">About</NavLink>
				{ /*
				<NavLink {...classProps} to="/technologies">Tech</NavLink>
				*/}
			</nav>
		);
  }
}

export default withRouter(Nav);
