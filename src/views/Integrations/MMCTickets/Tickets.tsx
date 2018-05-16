import * as moment from 'moment';
import * as React from 'react';
import { translate } from 'react-i18next';
import { connect, Dispatch } from 'react-redux';

import { AppAction } from '../../../actions';
import { MMCTicketsTicket } from '../../../fetch';
import { AppState } from '../../../types';

import DataViewFunc from '../../../components/DataView';
const DataView = DataViewFunc('mmc-tickets/ticket', 'id');

interface Props extends reactI18Next.InjectedTranslateProps {}

interface OwnState {}

class Tickets extends React.Component<Props, OwnState> {
	ticketStates: { value: string; text: string }[];

	constructor(props: Props) {
		super(props);

		const _t = props.t;

		this.ticketStates = [
			{
				value: MMCTicketsTicket.StatusEnum.Open.toString(),
				text: _t('Open')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Claimed.toString(),
				text: _t('Claimed')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Held.toString(),
				text: _t('Held')
			},
			{
				value: MMCTicketsTicket.StatusEnum.Closed.toString(),
				text: _t('Closed')
			}
		];
	}

	render() {
		const _t = this.props.t;

		return (
			<DataView
				canEdit
				icon="ticket"
				title={_t('Tickets')}
				filterTitle={_t('FilterTickets')}
				fields={{
					id: _t('Id'),
					timestamp: {
						label: _t('Timestamp'),
						view: (ticket: MMCTicketsTicket) =>
							moment.unix(ticket.timestamp).calendar()
					},
					status: {
						label: _t('Status'),
						edit: true,
						options: this.ticketStates
					},
					'sender.name': {
						label: _t('Sender'),
						filter: true
					},
					'staff.name': {
						label: _t('Assigned'),
						filter: true
					},
					message: {
						label: _t('Message'),
						filter: true,
						wide: true
					},
					comment: {
						label: _t('Comment'),
						edit: true,
						filter: true,
						wide: true
					}
				}}
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

export default connect(mapStateToProps, mapDispatchToProps)(
	translate('Integrations.MMCTickets')(Tickets)
);
