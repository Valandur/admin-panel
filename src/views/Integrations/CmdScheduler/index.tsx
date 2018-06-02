import * as moment from 'moment';
import * as React from 'react';
import { translate } from 'react-i18next';
import { connect, Dispatch } from 'react-redux';
import { Label } from 'semantic-ui-react';

import { AppAction } from '../../../actions';
import DataViewFunc from '../../../components/DataView';
import { CommandTask } from '../../../fetch';
import { AppState } from '../../../types';
const DataView = DataViewFunc('cmd-scheduler', 'name');

interface Props extends reactI18Next.InjectedTranslateProps {}

interface OwnState {}

class Commands extends React.Component<Props, OwnState> {
	cronToLabels(units: { [x: string]: number[] }) {
		return <>{JSON.stringify(units)}</>;
	}

	render() {
		const { t } = this.props;

		return (
			<DataView
				icon="calendar"
				title={t('ScheduledCommands')}
				filterTitle={t('FilterCommands')}
				fields={{
					name: t('Name'),
					command: t('Command'),
					schedule: {
						label: t('Schedule'),
						view: (task: CommandTask) => {
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
								return this.cronToLabels(schedule.units);
							}
							return;
						}
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
	translate('Integrations.CmdScheduler')(Commands)
);
