import React from 'react';

import Markdown from './markdown.jsx';
import styles from './about.styl';

import credit from 'assets/images/arp299.md';

export default class About extends React.Component {
	render() {
		const { title, subtitle, body } = this.props;
		return (
				<div className={styles.main}>
					<h1 className={styles.h1}>{title}</h1>
					<h2 className={styles.h2}>{subtitle}</h2>
					<Markdown>{body}</Markdown>
					<Markdown className={styles.credit}>
						{credit}
					</Markdown>
				</div>
		);
	}
}

