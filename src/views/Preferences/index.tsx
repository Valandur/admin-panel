import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { setPreference } from '../../actions/preferences';
import {
	AppState,
	Lang,
	langArray,
	PreferenceKey,
	Theme,
	THEMES_ARRAY
} from '../../types';

interface Props extends WithTranslation {
	lang: Lang;
	theme: Theme;
	showServerUsage: boolean;
	hideWIPNote: boolean;
	hidePluginsNote: boolean;
	hideServerSettingsNote: boolean;
	setPref: (key: PreferenceKey, value: any) => AppAction;
}

class Settings extends React.Component<Props> {
	public render() {
		const { t } = this.props;

		return (
			<Segment basic>
				<Header>
					<Icon fitted name="setting" /> Preferences
				</Header>

				<Grid columns={2} stackable>
					<Grid.Column>
						<Segment>
							<Header>
								<Icon fitted name="theme" /> Theme
							</Header>
							<Form>
								<Form.Dropdown
									item
									selection
									placeholder={t('ChangeTheme')}
									options={THEMES_ARRAY}
									value={this.props.theme}
									onChange={this.changeThemePref}
								/>
							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon fitted name="flag" /> Language
							</Header>
							<Form>
								<Form.Dropdown
									item
									selection
									placeholder={t('ChangeLanguage')}
									options={langArray}
									value={this.props.lang}
									onChange={this.changeLangPref}
								/>
							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon fitted name="chat" /> Notices
							</Header>
							<Form>
								<Form.Radio
									toggle
									label="Hide WIP notice on dashboard"
									checked={this.props.hideWIPNote}
									onChange={this.changeWIPNoticePref}
								/>
								<Form.Radio
									toggle
									label="Hide notice on plugins page"
									checked={this.props.hidePluginsNote}
									onChange={this.changePluginsNotePref}
								/>
								<Form.Radio
									toggle
									label="Hide notice on server settings page"
									checked={this.props.hideServerSettingsNote}
									onChange={this.changeServerSettingsNotePref}
								/>
							</Form>
						</Segment>
					</Grid.Column>

					<Grid.Column>
						<Segment>
							<Header>
								<Icon fitted name="settings" /> Misc.
							</Header>
							<Form>
								<Form.Radio
									toggle
									label="Show server usage stats"
									checked={this.props.showServerUsage}
									onChange={this.changeShowServerUsagePref}
								/>
							</Form>
						</Segment>
					</Grid.Column>
				</Grid>
			</Segment>
		);
	}

	private changeThemePref = (e: any, data: any) => {
		this.props.setPref(PreferenceKey.theme, data.value);
	};

	private changeLangPref = (e: any, data: any) => {
		this.props.setPref(PreferenceKey.lang, data.value);
	};

	private changeWIPNoticePref = () => {
		this.props.setPref(PreferenceKey.hideWIPNote, !this.props.hideWIPNote);
	};

	private changePluginsNotePref = () => {
		this.props.setPref(
			PreferenceKey.hidePluginsNote,
			!this.props.hidePluginsNote
		);
	};

	private changeServerSettingsNotePref = () => {
		this.props.setPref(
			PreferenceKey.hideServerSettingsNote,
			!this.props.hideServerSettingsNote
		);
	};

	private changeShowServerUsagePref = () => {
		this.props.setPref(
			PreferenceKey.showServerUsage,
			!this.props.showServerUsage
		);
	};
}

const mapStateToProps = (state: AppState) => {
	return {
		lang: state.preferences.lang,
		theme: state.preferences.theme,
		showServerUsage: state.preferences.showServerUsage,
		hideWIPNote: state.preferences.hideWIPNote,
		hidePluginsNote: state.preferences.hidePluginsNote,
		hideServerSettingsNote: state.preferences.hideServerSettingsNote
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		setPref: (key: PreferenceKey, value: any): AppAction =>
			dispatch(setPreference(key, value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Preferences')(Settings));
