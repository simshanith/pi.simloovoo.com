import { connect } from 'react-redux';
import cx from 'classnames';
import { push } from 'react-router-redux';
import React from 'react';
import { Route, withRouter } from 'react-router-dom';

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
		const { title, subtitle, body, dispatch } = this.props;
		const { mask } = this.state;

		return (
			<Route path="/" render={({ match }) => {
				const conditionalStyles = {
					[styles.active]: match.isExact,
					[styles.inactive]: !match.isExact,
					[styles.mask]: mask || !match.isExact,
				};

				const onClick = () => {
					if (match.isExact) {
						this.setState({
							mask: !this.state.mask
						});
						return;
					} else {
						this.setState({
							mask: true
						});
						return dispatch(push('/'));
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

export default withRouter(connect((state, ownProps) => {
	return {
		...ownProps
	};
}, (dispatch) => {
	return {
		dispatch
	};
})(Splash));
