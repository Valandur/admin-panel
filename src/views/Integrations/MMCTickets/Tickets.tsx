import * as moment from 'moment';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppAction } from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import { MMCTicketsTicket } from '../../../fetch';
import { AppState } from '../../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('mmc-tickets/ticket', 'id');

interface Props extends WithTranslation {}

interface OwnState {}

class Tickets extends React.Component<Props, OwnState> {
	private ticketStates: { value: string; text: string }[];

	public constructor(props: Props) {
		super(props);

		const { t } = this.props;

		this.ticketStates = [
			{
				value: MMCTicketsTicket.StatusEnum.Open.toString(),
				text: t('Open')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Claimed.toString(),
				text: t('Claimed')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Held.toString(),
				text: t('Held')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Closed.toString(),
				text: t('Closed')
			}
		];
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<MMCTicketsTicket> = {
			id: t('Id'),
			timestamp: {
				label: t('Timestamp'),
				view: ticket => moment.unix(ticket.timestamp).calendar()
			},
			status: {
				label: t('Status'),
				edit: true,
				options: this.ticketStates
			},
			'sender.name': {
				label: t('Sender'),
				filter: true
			},
			'staff.name': {
				label: t('Assigned'),
				filter: true
			},
			message: {
				label: t('Message'),
				filter: true,
				wide: true
			},
			comment: {
				label: t('Comment'),
				edit: true,
				filter: true,
				wide: true
			}
		};

		return (
			<DataView
				canEdit
				icon="ticket"
				title={t('Tickets')}
				filterTitle={t('FilterTickets')}
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
)(withTranslation('Integrations.MMCTickets')(Tickets));
