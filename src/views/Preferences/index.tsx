import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Form, Header, Icon, Segment } from "semantic-ui-react"

import { AppAction } from "../../actions"
import { changeLanguage, setPreference } from "../../actions/preferences"
import { AppState, Lang, langArray, PreferenceKey } from "../../types"

interface Props extends reactI18Next.InjectedTranslateProps {
	lang: Lang
	showServerUsage: boolean
	hideWIPNote: boolean
	hidePluginsNote: boolean
	hideServerSettingsNote: boolean
	changeLanguage: (lang: Lang) => AppAction
	setPref: (key: PreferenceKey, showUsage: boolean) => AppAction
}

class Settings extends React.Component<Props> {
	render() {
		const { t, setPref } = this.props

		return (
			<Segment basic>
				<Segment>
					<Header>
						<Icon fitted name="flag" /> Language
					</Header>
					<Form>
						<Form.Dropdown
							item
							selection
							placeholder={t("ChangeLanguage")}
							options={langArray}
							value={this.props.lang}
							onChange={(e, data) =>
								this.props.changeLanguage(data.value as Lang)
							}
						/>
					</Form>
				</Segment>

				<Segment>
					<Header>
						<Icon fitted name="chat" /> Notices.
					</Header>
					<Form>
						<Form.Radio
							toggle
							label="Hide WIP notice on dashboard"
							checked={this.props.hideWIPNote}
							onClick={() =>
								setPref(PreferenceKey.hideWIPNote, !this.props.hideWIPNote)
							}
						/>
						<Form.Radio
							toggle
							label="Hide notice on plugins page"
							checked={this.props.hidePluginsNote}
							onClick={() =>
								setPref(
									PreferenceKey.hidePluginsNote,
									!this.props.hidePluginsNote
								)
							}
						/>
						<Form.Radio
							toggle
							label="Hide notice on server settings page"
							checked={this.props.hideServerSettingsNote}
							onClick={() =>
								setPref(
									PreferenceKey.hideServerSettingsNote,
									!this.props.hideServerSettingsNote
								)
							}
						/>
					</Form>
				</Segment>

				<Segment>
					<Header>
						<Icon fitted name="settings" /> Misc.
					</Header>
					<Form>
						<Form.Radio
							toggle
							label="Show server usage stats"
							checked={this.props.showServerUsage}
							onClick={() =>
								setPref(
									PreferenceKey.showServerUsage,
									!this.props.showServerUsage
								)
							}
						/>
					</Form>
				</Segment>
			</Segment>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		lang: state.preferences.lang,
		showServerUsage: state.preferences.showServerUsage,
		hideWIPNote: state.preferences.hideWIPNote,
		hidePluginsNote: state.preferences.hidePluginsNote,
		hideServerSettingsNote: state.preferences.hideServerSettingsNote
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		changeLanguage: (lang: Lang): AppAction => dispatch(changeLanguage(lang)),
		setPref: (key: PreferenceKey, showUsage: boolean): AppAction =>
			dispatch(setPreference(key, showUsage))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Preferences")(Settings)
)
