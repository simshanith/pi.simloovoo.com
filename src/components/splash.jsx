import React from 'react';

import Markdown from './markdown.jsx';
import imageCredit from 'assets/images/splash.LICENSE.md';
import styles from './splash.styl';

export default function Splash(props) {
  const { title, subtitle, body } = props;
  return (
    <main className={styles.main}>
      <h1>{title}</h1>
      <Markdown>{subtitle}</Markdown>
      <Markdown>{body}</Markdown>
      <Markdown className={styles.credit}>
        {`background photograph: _${imageCredit}_`}
      </Markdown>
    </main>
  );
}
