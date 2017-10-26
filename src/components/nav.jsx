import cx from 'classnames';
import React from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';

import styles from './nav.styl';

export class StyledNavLink extends React.Component {
	render() {
		const props = {
			...this.props,
			className: cx(styles['nav__link'], this.props.className),
			activeClassName: cx(styles['nav__link--active'], this.props.activeClassName),
		};

		return (
			<NavLink {...props} />
		);
	}
}

export class Nav extends React.Component {
	render() {
		return (
			<nav className={styles.nav}>
				<StyledNavLink to="/" exact>Home</StyledNavLink>
				<StyledNavLink to="/about">About</StyledNavLink>
				{ /*
				<StyledNavLink to="/technologies">Tech</StyledNavLink>
				*/}
			</nav>
		);
  }
}

export default withRouter(Nav);
