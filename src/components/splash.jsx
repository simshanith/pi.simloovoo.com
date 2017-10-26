import { bindAll } from 'lodash';
import cx from 'classnames';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'proptypes';
import React from 'react';
import { bindActionCreators } from 'redux';

import Markdown from './markdown.jsx';
import assets from 'assets';
import styles from './splash.styl';

const imageCredit = assets.licenses['splash.jpg'];

export function createLinkHandler(handleClick) {
	return event => {
		if (event.ctrlKey || event.metaKey || event.altKey) {
			return;
		}

		const link = event.target.closest('a');
		if (link) {
			handleClick.call(this, event, link);
		}
	}
}

export class Splash extends React.Component {
	static propTypes = {
		match: PropTypes.shape({
			isExact: PropTypes.bool
		}),
		location: PropTypes.shape({
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
		push: PropTypes.func.isRequired,
		title: PropTypes.string,
		subtitle: PropTypes.string,
		body: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			mask: false,
		};

		bindAll(this, ['handleClick', 'handleLinkClick']);
		this.detectLinkClick = createLinkHandler(this.handleLinkClick);
	}

	handleLinkClick(event, link) {
		const {
			location,
			push,
		} = this.props;

		const maskedDomain = /^http:\/\/(π|xn--1xa)\.simloovoo\.com/;
		if (maskedDomain.test(link.href)) {
			event.preventDefault();
			const destination = link.href.replace(maskedDomain, '');
			if (location.pathname+location.search !== destination) {
				push(destination);
			}
		}
	}

	detectLinkClick(event) {
		// overridden in constructor to avoid function creation every invocation
		return createLinkHandler(this.handleLinkClick.bind(this))(event);
	}

	handleClick(event) {
		if (event.ctrlKey || event.metaKey || event.altKey) {
			return;
		}

		const {
			match,
			push
		} = this.props;

		if (match.isExact) {
			this.setState({
				mask: !this.state.mask
			});

			return this.detectLinkClick(event);
		} else {
			this.setState({
				mask: true
			});
			return push('/');
		}
	}

	render() {
		const {
			title,
			subtitle,
			body,
			match,
		} = this.props;

		const conditionalStyles = {
			[styles.active]: match.isExact,
			[styles.inactive]: !match.isExact,
			[styles.mask]: mask || !match.isExact,
		};

		const { mask } = this.state;

		return (
			<div className={cx(styles.wrapper, conditionalStyles)} onClick={this.handleClick}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
