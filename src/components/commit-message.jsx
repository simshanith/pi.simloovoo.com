import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Markdown from './markdown.jsx';
import styles from './commit-message.styl';

export class CommitMessage extends React.Component {
  render() {
    const { body } = this.props;
    return (
        <code className={styles.main}>
          {body}
        </code>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    body: state.app.env.COMMIT_MESSAGE || 'No commit message provided',
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch, getState) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommitMessage);
