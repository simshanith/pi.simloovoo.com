import React from 'react';

import Markdown from './markdown.jsx';
import assets from 'assets';
import styles from './splash.styl';

const imageCredit = assets.licenses['splash.jpg'];

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
