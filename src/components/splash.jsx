import cx from 'classnames';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import Markdown from './markdown.jsx';
import assets from 'assets';
import styles from './splash.styl';

const imageCredit = assets.licenses['splash.jpg'];

export class Splash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mask: false,
		};
	}

	render() {
		const { title, subtitle, body, push } = this.props;
		const { mask } = this.state;
		return (
			<Route path="/" render={({ match, location }) => {
				const conditionalStyles = {
					[styles.active]: match.isExact,
					[styles.inactive]: !match.isExact,
					[styles.mask]: mask || !match.isExact,
				};

				const maskedDomain = /^http:\/\/(π|xn--1xa)\.simloovoo\.com/;

				const onClick = (event) => {
					if (match.isExact) {
						this.setState({
							mask: !this.state.mask
						});

						const link = event.target.closest('a');
						if (link && maskedDomain.test(link.href)) {
							event.preventDefault();
							const destination = link.href.replace(maskedDomain, '');
							if (location.pathname+location.search !== destination) {
								push(destination);
							}
						}
						return;
					} else {
						this.setState({
							mask: true
						});
						return push('/');
					}
				}
				return (
					<div className={cx(styles.wrapper, conditionalStyles)} onClick={onClick}>
						<main className={cx(styles.main, conditionalStyles)}>
							<h1>{title}</h1>
							<div className={cx(styles.details, conditionalStyles)}>
								<Markdown>{subtitle}</Markdown>
								<Markdown>{body}</Markdown>
								<Markdown className={styles.credit}>
									{`background photograph: _${imageCredit}_`}
								</Markdown>
							</div>
						</main>
					</div>
				);
			}} />
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		...ownProps,
	};
}

function mapDispatchToProps(dispatch, getState) {
	return bindActionCreators({
		push,
	}, dispatch);
}

export const ConnectedSplash = connect(mapStateToProps, mapDispatchToProps)(Splash);

export default withRouter(ConnectedSplash);
