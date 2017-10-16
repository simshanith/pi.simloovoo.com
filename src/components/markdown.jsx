import React from 'react';
import marked from 'marked';

export default class Markdown extends React.PureComponent {
  render() {
    const content = marked(this.props.children);
    const props = {
      ...this.props,
      children: undefined,
      dangerouslySetInnerHTML: {
        __html: content,
      },
    };

    return (
      <div {...props}>
      </div>
    );
  }
}
