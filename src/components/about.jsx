import Helmet from 'react-helmet';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommitMessage from './commit-message.jsx';
import Markdown from './markdown.jsx';
import styles from './about.styl';

import credit from 'assets/images/arp299.md';

export default class About extends React.Component {
	render() {
		const { title, subtitle, body, location } = this.props;
		return (
				<div className={styles.main}>
					<Helmet>
						<title>About</title>
					</Helmet>
					<h1 className={styles.h1}>{title}</h1>
					<h2 className={styles.h2}>{subtitle}</h2>
					<Markdown>{body}</Markdown>
					<Markdown className={styles.credit}>
						{credit}
					</Markdown>
					<CommitMessage />
				</div>
		);
	}
}
