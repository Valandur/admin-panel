import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { ExecuteRequestAction, requestExecute } from '../../actions/command';
import { ListRequestAction, requestList } from '../../actions/dataview';
import {
	NotifLevel,
	showNotification,
	ShowNotificationAction
} from '../../actions/notification';
import Autosuggest from '../../components/Autosuggest';
import DataViewFunc, { DataViewFields } from '../../components/DataView';
import {
	checkPermissions,
	formatSource,
	sourceLabel
} from '../../components/Util';
import { Command, CommandCall } from '../../fetch';
import { AppState, PermissionTree } from '../../types';

// tslint:disable-next-line:variable-name
const DataView = DataViewFunc('history/cmd', 'timestamp');

interface Props extends WithTranslation {
	commands: Command[];
	perms: PermissionTree;
	requestCommands: () => ListRequestAction;
	requestExecute: (
		cmd: string,
		waitLines: number,
		waitTime: number
	) => ExecuteRequestAction;
	showNotification: (
		level: NotifLevel,
		title: string,
		message: string
	) => ShowNotificationAction;
}

interface ExtendedCommand extends Command {
	base?: string;
	isSub?: boolean;
}

class Commands extends React.Component<Props, {}> {
	public constructor(props: Props) {
		super(props);

		this.state = {};

		this.getSuggestions = this.getSuggestions.bind(this);
	}

	private getSuggestions(newValue: string) {
		const val = newValue.trim().toLowerCase();
		const parts = val.split(' ');
		const isExact = _.endsWith(newValue, ' ') || parts.length > 1;

		if (parts.length > 2) {
			return [];
		}

		let cmds: ExtendedCommand[] = this.props.commands.filter(cmd => {
			if (isExact) {
				return (
					cmd.name.toLowerCase() === parts[0] &&
					checkPermissions(this.props.perms, ['cmd', 'run', cmd.name])
				);
			} else {
				return (
					_.startsWith(cmd.name.toLowerCase(), parts[0]) &&
					checkPermissions(this.props.perms, ['cmd', 'run', cmd.name])
				);
			}
		});

		if (cmds.length > 0 && cmds[0].name.toLowerCase() === parts[0]) {
			let subs = cmds[0].usage.replace(/(\[.*?])/g, '').split('|');
			subs = subs.map(sub => sub.toLowerCase().trim());
			subs = subs.filter(
				sub => sub !== '/' + cmds[0].name.toLowerCase() + ' ?'
			);

			if (parts.length > 1 && !_.isEmpty(parts[1])) {
				subs = subs.filter(sub => _.startsWith(sub, parts[1]));
			}
			cmds = subs.map(sub => ({
				name: sub,
				description: cmds[0].description,
				aliases: cmds[0].aliases,
				usage: cmds[0].usage,
				help: cmds[0].help,
				base: cmds[0].name,
				link: cmds[0].link,
				isSub: true
			}));
		}

		return cmds.map(cmd => {
			if (cmd.isSub) {
				return {
					value: cmd.base + ' ' + cmd.name + ' ',
					content: (
						<div style={{ padding: 10 }}>
							<b>{cmd.base}</b> <i style={{ fontSize: '90%' }}>{cmd.name}</i>
						</div>
					)
				};
			}

			return {
				value: cmd.name + ' ',
				content: (
					<div style={{ padding: 10 }}>
						<b>{cmd.name}</b> <i style={{ fontSize: '90%' }}>{cmd.usage}</i>
						<br />
						{cmd.description}
						<br />
					</div>
				)
			};
		});
	}

	public componentDidMount() {
		this.props.requestCommands();
	}

	public render() {
		const { t } = this.props;
		const canExec = checkPermissions(this.props.perms, ['cmd', 'run']);
		const canViewHistory = checkPermissions(this.props.perms, [
			'history',
			'cmd'
		]);

		const fields: DataViewFields<any> = {
			timestamp: {
				label: t('Timestamp'),
				view: (cmd: CommandCall) => moment(cmd.timestamp).calendar()
			},
			source: {
				label: t('Source'),
				filter: true,
				filterValue: (cmd: any) => {
					if (cmd.cause.causes) {
						return formatSource(cmd.cause.causes[0]);
					} else {
						const c = cmd as any;
						return formatSource(c.cause.source);
					}
				},
				view: (cmd: any) => {
					if (cmd.cause.causes) {
						return sourceLabel(cmd.cause.causes[0]);
					} else {
						const c = cmd as any;
						return sourceLabel(c.cause.source);
					}
				}
			},
			command: {
				label: t('Command'),
				filter: true,
				filterValue: (cmd: CommandCall) => cmd.command + ' ' + cmd.args,
				wide: true,
				view: (cmd: CommandCall) => cmd.command + ' ' + cmd.args
			},
			create: {
				view: false,
				isGroup: true,
				create: view => (
					<>
						<Form.Field
							control={Autosuggest}
							name="execCmd"
							placeholder={t('ExecuteCommand')}
							getSuggestions={this.getSuggestions}
							onChange={view.handleChange}
						/>

						<Form.Group widths="equal">
							<Form.Input
								name="waitLines"
								placeholder={t('WaitLinesDescr')}
								label={t('WaitLines')}
								type="number"
								onChange={view.handleChange}
							/>

							<Form.Input
								name="waitTime"
								placeholder={t('WaitTimeDescr')}
								label={t('WaitTime')}
								type="number"
								onChange={view.handleChange}
							/>
						</Form.Group>
					</>
				)
			}
		};

		return (
			<DataView
				title={t('Commands')}
				icon="terminal"
				static={!canViewHistory}
				createTitle={canExec ? t('ExecuteCommand') : undefined}
				createButton={t('Execute')}
				checkCreatePerm={false}
				filterTitle={t('FilterCommands')}
				fields={fields}
				onCreate={this.onCreate}
			/>
		);
	}

	private onCreate = (obj: any) => {
		if (!obj.execCmd) {
			this.props.showNotification(
				'error',
				'Command',
				'You must enter a command'
			);
			return;
		}
		this.props.requestExecute(obj.execCmd.trim(), obj.waitLines, obj.waitTime);
	};
}

const mapStateToProps = (state: AppState) => {
	return {
		commands: state.cmd.list,
		perms: state.api.permissions
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCommands: () => dispatch(requestList('cmd', true)),
		requestExecute: (cmd: string, waitLines: number, waitTime: number) =>
			dispatch(requestExecute(cmd, waitLines, waitTime)),
		showNotification: (level: NotifLevel, title: string, message: string) =>
			dispatch(showNotification(level, title, message))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Commands')(Commands));
