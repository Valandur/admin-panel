import * as moment from 'moment';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Label } from 'semantic-ui-react';

import { AppAction } from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import { CommandTask } from '../../../fetch';
import { AppState } from '../../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('cmd-scheduler', 'name');

interface Props extends WithTranslation {}

interface OwnState {}

class Commands extends React.Component<Props, OwnState> {
	public render() {
		const { t } = this.props;

		const fields: DataViewFields<CommandTask> = {
			name: t('Name'),
			command: t('Command'),
			schedule: {
				label: t('Schedule'),
				view: task => {
					if (!task.schedule) {
						return;
					}

					const schedule = task.schedule as any;

					if (schedule.type === 'CALENDAR') {
						return moment(schedule.date).calendar();
					} else if (schedule.type === 'CLASSIC') {
						const delay = schedule.delayInTicks
							? schedule.delay * 20
							: schedule.delay;
						const interval = schedule.intervalInTicks
							? schedule.interval * 20
							: schedule.interval;
						return (
							<>
								<Label
									content={moment.duration(delay).humanize()}
									detail={'Delay'}
								/>
								<Label
									content={moment.duration(interval).humanize()}
									detail={'Interval'}
								/>
							</>
						);
					} else if (schedule.type === 'CRON') {
						return <>{JSON.stringify(schedule.units)}</>;
					}
					return;
				}
			}
		};

		return (
			<DataView
				icon="calendar"
				title={t('ScheduledCommands')}
				filterTitle={t('FilterCommands')}
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
)(withTranslation('Integrations.CmdScheduler')(Commands));
