import cx from 'classnames';
import { connect } from 'react-redux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import data from '../data';
import Markdown from './markdown.jsx';

export class Tech extends React.Component {
	render() {
		const props = this.props;
		const { match } = props;
		console.info('technology|technologies match', props);
		switch (match.params[0]) {
			case 'technology':
				console.info('technology match', data.technologies[match.params.tech]);
				return (
					<Markdown>
						{data.technologies[match.params.tech].description}
					</Markdown>
				);
				break;
			case 'technologies':
				console.info('technologies match');
				break;
			default:
				return null;
		}
		return null;
	}
}

function mapStateToProps(state, ownProps) {
	console.info(ownProps);
	return {
		...ownProps,
	};
}

function mapDispatchToProps(dispatch, getState) {
	return bindActionCreators({
	}, dispatch);
}

export const ConnectedTech = connect(mapStateToProps, mapDispatchToProps)(Tech);
export default ConnectedTech;

// export default withRouter(ConnectedTech);
