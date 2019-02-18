import * as moment from 'moment';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppAction } from '../../actions';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import { formatSource, sourceLabel } from '../../components/Util';
import { ChatMessage } from '../../fetch';
import { AppState } from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('history/message', 'timestamp');

interface Props extends WithTranslation {}

class Chat extends React.Component<Props, {}> {
	public render() {
		const { t } = this.props;

		const fields: DataViewFields<ChatMessage> = {
			timestamp: {
				label: t('Timestamp'),
				view: msg => moment(msg.timestamp).calendar()
			},
			sender: {
				label: t('Cause'),
				filter: true,
				filterValue: msg => formatSource(msg.sender),
				view: msg => sourceLabel(msg.sender)
			},
			receivers: {
				label: t('Receivers'),
				filter: true,
				filterValue: msg => msg.receivers.map(r => formatSource(r)).join(' '),
				view: msg => <>{msg.receivers.map(r => sourceLabel(r))}</>
			},
			content: t('Message')
		};

		return (
			<DataView
				title={t('Messages')}
				icon="comments"
				filterTitle={t('FilterMessages')}
				fields={fields}
			/>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Chat')(Chat));
